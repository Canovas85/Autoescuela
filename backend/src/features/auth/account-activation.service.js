import crypto from "crypto";
import bcrypt from "bcryptjs";

const DEFAULT_TTL_HOURS = 24;

const createHttpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export class AccountActivationService {
  constructor(repository, emailService, options = {}) {
    this.repository = repository;
    this.emailService = emailService;
    this.ttlHours = Number(
      options.ttlHours || process.env.ACTIVATION_TTL_HOURS || DEFAULT_TTL_HOURS,
    );
    this.frontendBaseUrl =
      options.frontendBaseUrl ||
      process.env.FRONTEND_BASE_URL ||
      "http://localhost:5173";
  }

  validarPasswordNueva(password) {
    if (!password) {
      throw createHttpError("La nueva contraseña es obligatoria", 400);
    }

    if (password.length < 8) {
      throw createHttpError(
        "La contraseña debe tener al menos 8 caracteres",
        400,
      );
    }

    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneMinuscula = /[a-z]/.test(password);
    const tieneNumero = /\d/.test(password);

    if (!tieneMayuscula || !tieneMinuscula || !tieneNumero) {
      throw createHttpError(
        "La contraseña debe incluir mayúsculas, minúsculas y números",
        400,
      );
    }
  }

  createTokenPlain() {
    return crypto.randomBytes(32).toString("hex");
  }

  hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  getExpiryDate() {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.ttlHours);
    return expiresAt;
  }

  buildActivationUrl(token) {
    return `${this.frontendBaseUrl}/activar-cuenta?token=${encodeURIComponent(token)}`;
  }

  async issueActivationForUser({ usuarioId, createdById = null }) {
    const user = await this.repository.findUserByIdWithCredentials(usuarioId);

    if (!user) {
      throw createHttpError("Usuario no encontrado para activación", 404);
    }

    const token = this.createTokenPlain();
    const tokenHash = this.hashToken(token);
    const expiresAt = this.getExpiryDate();

    await this.repository.invalidatePendingActivationTokens(usuarioId);

    await this.repository.createActivationToken({
      usuarioId,
      tokenHash,
      expiresAt,
      createdById,
      resendCount: 0,
    });

    const activationUrl = this.buildActivationUrl(token);

    await this.emailService.sendActivationEmail({
      to: user.email,
      nombre: user.nombre,
      activationUrl,
      expiresAt,
    });

    return {
      usuarioId,
      email: user.email,
      expiresAt,
      activationUrl,
    };
  }

  async validateActivationToken(token) {
    if (!token) {
      throw createHttpError("Token de activación obligatorio", 400);
    }

    const tokenHash = this.hashToken(token);
    const activation =
      await this.repository.findActivationTokenByHash(tokenHash);

    if (!activation) {
      throw createHttpError("Token de activación inválido", 404);
    }

    if (activation.usedAt) {
      throw createHttpError("Token de activación ya utilizado", 409);
    }

    if (new Date(activation.expiresAt).getTime() < Date.now()) {
      throw createHttpError("Token de activación expirado", 410);
    }

    return {
      valid: true,
      usuarioId: activation.usuarioId,
      email: activation.usuario.email,
      expiresAt: activation.expiresAt,
    };
  }

  async activateWithToken({ token, newPassword, confirmPassword }) {
    if (!token) {
      throw createHttpError("Token de activación obligatorio", 400);
    }

    this.validarPasswordNueva(newPassword);

    if (newPassword !== confirmPassword) {
      throw createHttpError("La confirmación de contraseña no coincide", 400);
    }

    const tokenHash = this.hashToken(token);
    const activation =
      await this.repository.findActivationTokenByHash(tokenHash);

    if (!activation) {
      throw createHttpError("Token de activación inválido", 404);
    }

    if (activation.usedAt) {
      throw createHttpError("Token de activación ya utilizado", 409);
    }

    if (new Date(activation.expiresAt).getTime() < Date.now()) {
      throw createHttpError("Token de activación expirado", 410);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.repository.updatePasswordAndClearFirstLogin(
      activation.usuarioId,
      passwordHash,
    );

    await this.repository.markActivationTokenAsUsed(activation.id);
    await this.repository.invalidatePendingActivationTokens(
      activation.usuarioId,
      activation.id,
    );

    return {
      message: "Cuenta activada correctamente",
    };
  }

  async resendActivationForUser({ usuarioId, createdById = null }) {
    const user = await this.repository.findUserByIdWithCredentials(usuarioId);

    if (!user) {
      throw createHttpError("Usuario no encontrado", 404);
    }

    if (!user.requiereCambioPassword) {
      throw createHttpError("La cuenta ya está activada", 409);
    }

    return this.issueActivationForUser({ usuarioId, createdById });
  }
}
