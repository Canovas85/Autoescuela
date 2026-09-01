import bcrypt from "bcryptjs";

const LICENCIAS_VALIDAS = new Set(["B", "A1", "A2", "A", "C", "D", "E"]);

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

const normalizarPermisosLicencias = (valor, fallbackLicencia = undefined) => {
  const origen =
    valor !== undefined
      ? valor
      : fallbackLicencia !== undefined
        ? [fallbackLicencia]
        : [];

  const lista = Array.isArray(origen) ? origen : [origen];
  const normalizadas = [
    ...new Set(
      lista
        .map((item) =>
          String(item || "")
            .trim()
            .toUpperCase(),
        )
        .filter(Boolean),
    ),
  ];

  if (normalizadas.length === 0) {
    throw new Error("Debes seleccionar al menos un permiso");
  }

  const invalidas = normalizadas.filter(
    (licencia) => !LICENCIAS_VALIDAS.has(licencia),
  );
  if (invalidas.length > 0) {
    throw new Error("Hay permisos de licencia no válidos");
  }

  return normalizadas;
};

export class ProfesoresService {
  constructor(repository, accountActivationService = null) {
    this.repository = repository;
    this.accountActivationService = accountActivationService;
  }

  async create(data, context = {}) {
    const nombre = typeof data.nombre === "string" ? data.nombre.trim() : "";

    if (!nombre) {
      throw new Error("El nombre es obligatorio");
    }

    if (!data.email) {
      throw new Error("El email es obligatorio");
    }

    const permisosLicencias = normalizarPermisosLicencias(
      data.permisosLicencias,
      data.licenciaConducir ?? data.tipoLicencia ?? data.especialidad,
    );

    if (!data.telefono) {
      throw new Error("El teléfono es obligatorio");
    }

    if (!data.password) {
      throw new Error("La contraseña es obligatoria");
    }

    if (data.password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres");
    }

    const existingUser = await this.repository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("El email ya existe");
    }

    if (
      data.dni === undefined ||
      data.dni === null ||
      String(data.dni).trim() === ""
    ) {
      throw new Error("El DNI es obligatorio");
    }

    const dni = normalizarDni(data.dni);
    if (!dni) {
      throw new Error("El DNI debe tener un formato válido");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const profesor = await this.repository.create({
      ...data,
      nombre,
      dni,
      permisosLicencias,
      licenciaConducir: permisosLicencias[0],
      passwordHash,
      rol: "PROFESOR",
      activo: true,
    });

    if (this.accountActivationService) {
      try {
        await this.accountActivationService.issueActivationForUser({
          usuarioId: profesor.id,
          createdById: context.createdById || null,
        });
      } catch (error) {
        console.error(
          "No se pudo enviar el enlace de activación al profesor:",
          error.message,
        );
      }
    }

    return profesor;
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id) {
    return this.repository.findById(id);
  }

  async update(id, data) {
    const payload = {};

    if (Object.prototype.hasOwnProperty.call(data, "nombre")) {
      const nombre = typeof data.nombre === "string" ? data.nombre.trim() : "";
      if (!nombre) {
        throw new Error("El nombre es obligatorio");
      }
      payload.nombre = nombre;
    }

    if (Object.prototype.hasOwnProperty.call(data, "email")) {
      const email = typeof data.email === "string" ? data.email.trim() : "";
      if (!email) {
        throw new Error("El email es obligatorio");
      }

      const existingUser = await this.repository.findByEmail(email);
      if (existingUser && existingUser.id !== id) {
        throw new Error("El email ya existe");
      }

      payload.email = email;
    }

    if (Object.prototype.hasOwnProperty.call(data, "dni")) {
      if (
        data.dni === undefined ||
        data.dni === null ||
        String(data.dni).trim() === ""
      ) {
        throw new Error("El DNI es obligatorio");
      }

      const dni = normalizarDni(data.dni);
      if (!dni) {
        throw new Error("El DNI debe tener un formato válido");
      }

      const existingDniUser = await this.repository.findUserByDni(dni);
      if (existingDniUser && existingDniUser.id !== id) {
        throw new Error("El DNI ya existe");
      }

      payload.dni = dni;
    }

    if (Object.prototype.hasOwnProperty.call(data, "telefono")) {
      const telefono =
        typeof data.telefono === "string" ? data.telefono.trim() : "";
      if (!telefono) {
        throw new Error("El teléfono es obligatorio");
      }
      payload.telefono = telefono;
    }

    const hayPermisos = Object.prototype.hasOwnProperty.call(
      data,
      "permisosLicencias",
    );
    const licenciaLegacy =
      data.licenciaConducir ?? data.tipoLicencia ?? data.especialidad;

    if (hayPermisos || licenciaLegacy !== undefined) {
      const permisosLicencias = normalizarPermisosLicencias(
        hayPermisos ? data.permisosLicencias : undefined,
        licenciaLegacy,
      );

      payload.permisosLicencias = permisosLicencias;
      payload.licenciaConducir = permisosLicencias[0];
    }

    return this.repository.update(id, payload);
  }

  async deactivate(id) {
    return this.repository.deactivate(id);
  }

  async activate(id) {
    return this.repository.activate(id);
  }
}
