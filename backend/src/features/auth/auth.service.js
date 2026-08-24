import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  constructor(repository) {
    this.repository = repository;
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

    console.log("EMAIL RECIBIDO:", email);

    console.log("USER:", user);

    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    console.log("PASSWORD VALIDA:", validPassword);

    if (!validPassword) {
      throw new Error("Credenciales inválidas");
    }

    //console.log("GENERANDO JWT");

    // Verificar si JWT_SECRET está definido

    // console.log("JWT_SECRET LOGIN:", process.env.JWT_SECRET);

    const token = jwt.sign(
      {
        id: user.id,
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
}
