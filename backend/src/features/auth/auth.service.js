import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const DEFAULT_PASSWORD_RECOVERY = "Password123";

const normalizarNombre = (value) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();

const normalizarDni = (value) =>
  String(value || "")
    .trim()
    .toUpperCase();

export class AuthService {
  constructor(
    repository,
    accountActivationService = null,
    emailService = null,
  ) {
    this.repository = repository;
    this.accountActivationService = accountActivationService;
    this.emailService = emailService;
  }

  validarPasswordNueva(password) {
    if (!password) {
      throw new Error("La nueva contraseña es obligatoria");
    }

    if (password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres");
    }

    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneMinuscula = /[a-z]/.test(password);
    const tieneNumero = /\d/.test(password);

    if (!tieneMayuscula || !tieneMinuscula || !tieneNumero) {
      throw new Error(
        "La contraseña debe incluir mayúsculas, minúsculas y números",
      );
    }
  }

  async login(email, password) {
    const user = await this.repository.findUserByEmail(email);

    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    if (user.rol === "ALUMNO" && user.alumno?.activo === false) {
      throw new Error("Usuario desactivado. Contacte con administración");
    }

    if (user.rol === "PROFESOR" && user.profesor?.activo === false) {
      throw new Error("Usuario desactivado. Contacte con administración");
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      throw new Error("Credenciales inválidas");
    }

    //console.log("GENERANDO JWT");

    // Verificar si JWT_SECRET está definido

    // console.log("JWT_SECRET LOGIN:", process.env.JWT_SECRET);

    const token = jwt.sign(
      {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        requiereCambioPassword: Boolean(user.requiereCambioPassword),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      },
    );

    return {
      token,
      requiereCambioPassword: Boolean(user.requiereCambioPassword),
    };
  }

  async changePasswordFirstLogin(userId, newPassword, confirmPassword) {
    if (!userId) {
      throw new Error("Usuario no autenticado");
    }

    const userStatus = await this.repository.findUserStatusById(userId);

    if (!userStatus) {
      throw new Error("Usuario no encontrado");
    }

    if (userStatus.rol === "ALUMNO" && userStatus.alumno?.activo === false) {
      throw new Error("Usuario desactivado. Contacte con administración");
    }

    if (
      userStatus.rol === "PROFESOR" &&
      userStatus.profesor?.activo === false
    ) {
      throw new Error("Usuario desactivado. Contacte con administración");
    }

    this.validarPasswordNueva(newPassword);

    if (newPassword !== confirmPassword) {
      throw new Error("La confirmación de contraseña no coincide");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.repository.updatePasswordAndClearFirstLogin(
      userId,
      passwordHash,
    );

    return {
      message: "Contraseña actualizada correctamente",
    };
  }

  async getProfile(userId) {
    if (!userId) {
      throw new Error("Usuario no autenticado");
    }

    const user = await this.repository.findUserById(userId);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return user;
  }

  async validateActivationToken(token) {
    if (!this.accountActivationService) {
      throw new Error("Servicio de activación no configurado");
    }

    return this.accountActivationService.validateActivationToken(token);
  }

  async activateAccountFirstAccess(token, newPassword, confirmPassword) {
    if (!this.accountActivationService) {
      throw new Error("Servicio de activación no configurado");
    }

    return this.accountActivationService.activateWithToken({
      token,
      newPassword,
      confirmPassword,
    });
  }

  async resendActivation(userId, adminUserId) {
    if (!this.accountActivationService) {
      throw new Error("Servicio de activación no configurado");
    }

    return this.accountActivationService.resendActivationForUser({
      usuarioId: userId,
      createdById: adminUserId,
    });
  }

  ensureActiveUser(user) {
    if (user.rol === "ALUMNO" && user.alumno?.activo === false) {
      throw new Error("Usuario desactivado. Contacte con administración");
    }

    if (user.rol === "PROFESOR" && user.profesor?.activo === false) {
      throw new Error("Usuario desactivado. Contacte con administración");
    }
  }

  async validatePasswordResetEmail(emailRaw) {
    const email = String(emailRaw || "").trim();

    if (!email) {
      throw new Error("Debes informar el correo electrónico");
    }

    const user = await this.repository.findUserByEmailInsensitive(email);

    if (!user) {
      throw new Error(
        "No existe ninguna cuenta asociada al correo electrónico indicado",
      );
    }

    this.ensureActiveUser(user);

    return {
      valid: true,
      email: user.email,
    };
  }

  async resetPasswordToDefault({ email, nombreCompleto, dni }) {
    const safeEmail = String(email || "").trim();
    const safeNombre = String(nombreCompleto || "").trim();
    const safeDni = normalizarDni(dni);

    if (!safeEmail) {
      throw new Error("Debes informar el correo electrónico");
    }

    if (!safeNombre) {
      throw new Error("Debes informar el nombre completo");
    }

    if (!/^\d{8}[A-Z]$/.test(safeDni)) {
      throw new Error("El DNI debe tener formato 12345678A");
    }

    const user = await this.repository.findUserByEmailAndDni(
      safeEmail,
      safeDni,
    );

    if (
      !user ||
      normalizarNombre(user.nombre) !== normalizarNombre(safeNombre)
    ) {
      throw new Error("Los datos de verificación no son correctos");
    }

    this.ensureActiveUser(user);

    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD_RECOVERY, 10);

    await this.repository.updatePasswordAndRequireFirstLogin(
      user.id,
      passwordHash,
    );

    if (this.emailService?.sendPasswordResetDefaultEmail) {
      await this.emailService.sendPasswordResetDefaultEmail({
        to: user.email,
        nombre: user.nombre,
        passwordDefault: DEFAULT_PASSWORD_RECOVERY,
      });
    }

    return {
      message:
        "Contraseña restablecida correctamente. Se ha enviado un correo con las instrucciones de acceso.",
    };
  }
}
