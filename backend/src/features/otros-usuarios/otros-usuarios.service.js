import bcrypt from "bcryptjs";

const ROLES_PERMITIDOS = ["ADMINISTRATIVO", "SOPORTE"];
const ROLES_SOPORTE_VISIBLES = [
  "ADMIN",
  "PROFESOR",
  "ALUMNO",
  "ADMINISTRATIVO",
];

const normalizarDni = (valor) => {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  const dni = String(valor).trim();

  if (!dni) {
    return null;
  }

  return /^\d{8}[A-Za-z]$/.test(dni) ? dni.toUpperCase() : null;
};

const normalizarTelefono = (valor) => {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  const telefono = String(valor).trim();

  if (!telefono) {
    return null;
  }

  return /^\d{9}$/.test(telefono) ? telefono : null;
};

export class OtrosUsuariosService {
  constructor(repository) {
    this.repository = repository;
  }

  normalizeActorRole(rol) {
    const normalized = String(rol || "")
      .trim()
      .toUpperCase();

    if (normalized === "GESTOR") {
      return "SOPORTE";
    }

    return normalized;
  }

  resolveAllowedRolesByActor(actorRoleRaw) {
    const actorRole = this.normalizeActorRole(actorRoleRaw);

    if (actorRole === "SOPORTE") {
      return ROLES_SOPORTE_VISIBLES;
    }

    return ["ADMINISTRATIVO", "SOPORTE"];
  }

  parseFilters(query = {}) {
    const rol = String(query.rol || "")
      .trim()
      .toUpperCase();
    const activoRaw = query.activo;

    const filters = {
      search: String(query.search || "").trim(),
    };

    if (rol) {
      filters.rol = rol;
    }

    if (activoRaw === "true" || activoRaw === true) {
      filters.activo = true;
    }

    if (activoRaw === "false" || activoRaw === false) {
      filters.activo = false;
    }

    return filters;
  }

  async getAll(query = {}, actorRoleRaw = "") {
    const filters = this.parseFilters(query);

    const allowedRoles = this.resolveAllowedRolesByActor(actorRoleRaw);

    if (!allowedRoles.includes(filters.rol)) {
      delete filters.rol;
    }

    filters.allowedRoles = allowedRoles;

    return this.repository.findAll(filters);
  }

  async getById(id, actorRoleRaw = "") {
    const allowedRoles = this.resolveAllowedRolesByActor(actorRoleRaw);
    const usuario = await this.repository.findById(id, allowedRoles);

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    return usuario;
  }

  normalizeRole(rol) {
    const normalized = String(rol || "")
      .trim()
      .toUpperCase();

    if (!ROLES_PERMITIDOS.includes(normalized)) {
      throw new Error("El perfil debe ser ADMINISTRATIVO o SOPORTE");
    }

    return normalized;
  }

  normalizeRoleForActor(rol, actorRoleRaw = "") {
    const actorRole = this.normalizeActorRole(actorRoleRaw);
    const normalized = String(rol || "")
      .trim()
      .toUpperCase();

    if (actorRole === "SOPORTE") {
      if (!ROLES_SOPORTE_VISIBLES.includes(normalized)) {
        throw new Error(
          "SOPORTE solo puede gestionar perfiles ADMIN, PROFESOR, ALUMNO y ADMINISTRATIVO",
        );
      }

      return normalized;
    }

    return this.normalizeRole(normalized);
  }

  async validateUniqueFields({ email, dni, currentId = null }) {
    const emailNormalized = String(email || "")
      .trim()
      .toLowerCase();

    const existingEmail =
      await this.repository.findUserByEmail(emailNormalized);

    if (existingEmail && existingEmail.id !== currentId) {
      throw new Error("El email ya existe");
    }

    if (!dni) {
      return;
    }

    const existingDni = await this.repository.findUserByDni(dni);

    if (existingDni && existingDni.id !== currentId) {
      throw new Error("El DNI ya existe");
    }
  }

  async create(data, actorRoleRaw = "") {
    const nombre = String(data.nombre || "").trim();
    const email = String(data.email || "")
      .trim()
      .toLowerCase();
    const password = String(data.password || "");

    if (!nombre) {
      throw new Error("El nombre es obligatorio");
    }

    if (!email) {
      throw new Error("El email es obligatorio");
    }

    if (password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres");
    }

    const rol = this.normalizeRoleForActor(data.rol, actorRoleRaw);

    const dni = normalizarDni(data.dni);

    if (!dni) {
      throw new Error("El DNI debe tener un formato válido");
    }

    const telefono = normalizarTelefono(data.telefono);

    if (!telefono) {
      throw new Error("El teléfono debe contener exactamente 9 dígitos");
    }

    await this.validateUniqueFields({ email, dni });

    const passwordHash = await bcrypt.hash(password, 10);

    return this.repository.create({
      nombre,
      email,
      dni,
      telefono,
      rol,
      activo: true,
      requiereCambioPassword: true,
      passwordHash,
    });
  }

  async update(id, data, actorRoleRaw = "") {
    const allowedRoles = this.resolveAllowedRolesByActor(actorRoleRaw);
    const current = await this.repository.findById(id, allowedRoles);

    if (!current) {
      throw new Error("Usuario no encontrado");
    }

    const nombre =
      data.nombre !== undefined
        ? String(data.nombre || "").trim()
        : current.nombre;
    const email =
      data.email !== undefined
        ? String(data.email || "")
            .trim()
            .toLowerCase()
        : current.email;

    const rol =
      data.rol !== undefined
        ? this.normalizeRoleForActor(data.rol, actorRoleRaw)
        : current.rol;

    const dni =
      data.dni !== undefined ? normalizarDni(data.dni) : (current.dni ?? null);

    if (!nombre) {
      throw new Error("El nombre es obligatorio");
    }

    if (!email) {
      throw new Error("El email es obligatorio");
    }

    if (data.dni !== undefined && !dni) {
      throw new Error("El DNI debe tener un formato válido");
    }

    const telefono =
      data.telefono !== undefined
        ? normalizarTelefono(data.telefono)
        : (current.telefono ?? null);

    if (data.telefono !== undefined && !telefono) {
      throw new Error("El teléfono debe contener exactamente 9 dígitos");
    }

    await this.validateUniqueFields({
      email,
      dni,
      currentId: id,
    });

    const payload = {
      nombre,
      email,
      dni,
      telefono,
      rol,
    };

    if (data.password !== undefined && String(data.password || "").trim()) {
      const password = String(data.password || "");

      if (password.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres");
      }

      payload.passwordHash = await bcrypt.hash(password, 10);
      payload.requiereCambioPassword = true;
    }

    return this.repository.update(id, payload);
  }

  async deactivate(id, actorRoleRaw = "") {
    const allowedRoles = this.resolveAllowedRolesByActor(actorRoleRaw);
    const current = await this.repository.findById(id, allowedRoles);

    if (!current) {
      throw new Error("Usuario no encontrado");
    }

    return this.repository.setActive(id, false);
  }

  async activate(id, actorRoleRaw = "") {
    const allowedRoles = this.resolveAllowedRolesByActor(actorRoleRaw);
    const current = await this.repository.findById(id, allowedRoles);

    if (!current) {
      throw new Error("Usuario no encontrado");
    }

    return this.repository.setActive(id, true);
  }

  async resetPassword(
    id,
    actorId,
    actorRoleRaw,
    motivo = null,
    newPassword = null,
  ) {
    const actorRole = this.normalizeActorRole(actorRoleRaw);

    if (actorRole !== "SOPORTE") {
      throw new Error("Solo SOPORTE puede resetear contraseñas");
    }

    const current = await this.repository.findById(id, ROLES_SOPORTE_VISIBLES);

    if (!current) {
      throw new Error("Usuario no encontrado");
    }

    if (!ROLES_SOPORTE_VISIBLES.includes(current.rol)) {
      throw new Error("No puedes resetear este perfil");
    }

    const rawPassword = String(newPassword || "").trim() || "Autoescuela123!";

    if (rawPassword.length < 8) {
      throw new Error("La nueva contraseña debe tener al menos 8 caracteres");
    }

    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const updated = await this.repository.update(id, {
      passwordHash,
      requiereCambioPassword: true,
    });

    await this.repository.createPasswordResetAudit({
      soporteId: actorId,
      usuarioObjetivoId: id,
      motivo: motivo ? String(motivo).trim() : null,
    });

    return {
      usuario: updated,
      passwordTemporal: rawPassword,
    };
  }

  async hardDelete(id, actorRoleRaw = "", actorId = null) {
    const actorRole = this.normalizeActorRole(actorRoleRaw);

    if (actorRole !== "ADMIN") {
      throw new Error("Solo ADMIN puede borrar definitivamente");
    }

    const current = await this.repository.findById(id, [
      "ADMINISTRATIVO",
      "SOPORTE",
    ]);

    if (!current) {
      throw new Error("Usuario no encontrado");
    }

    if (actorId && current.id === actorId) {
      throw new Error("No puedes eliminar tu propio usuario");
    }

    return this.repository.hardDelete(id);
  }
}
