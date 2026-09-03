import bcrypt from "bcryptjs";

const LICENCIAS_PERMITIDAS = ["B", "A1", "A2", "A", "C", "D", "E"];

const parseBoolean = (valor, defaultValue = false) => {
  if (valor === undefined || valor === null || valor === "") {
    return defaultValue;
  }

  if (typeof valor === "boolean") {
    return valor;
  }

  return ["true", "1", "on", "yes", "si", "sí"].includes(
    String(valor).trim().toLowerCase(),
  );
};

const parseFechaNacimiento = (valor) => {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  const entrada = String(valor).trim();

  if (!entrada) {
    return null;
  }

  const formatoEspanyol = /^\d{2}[/-]\d{2}[/-]\d{4}$/;
  if (formatoEspanyol.test(entrada)) {
    const [dia, mes, anio] = entrada.split(/[/-]/).map(Number);
    const fecha = new Date(anio, mes - 1, dia);

    if (
      fecha.getFullYear() !== anio ||
      fecha.getMonth() !== mes - 1 ||
      fecha.getDate() !== dia
    ) {
      return null;
    }

    return fecha;
  }

  const fechaIso = new Date(entrada);
  if (Number.isNaN(fechaIso.getTime())) {
    return null;
  }

  return fechaIso;
};

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

const calcularEdad = (fechaNacimiento) => {
  if (
    !(fechaNacimiento instanceof Date) ||
    Number.isNaN(fechaNacimiento.getTime())
  ) {
    return null;
  }

  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mesDiff = hoy.getMonth() - fechaNacimiento.getMonth();

  if (
    mesDiff < 0 ||
    (mesDiff === 0 && hoy.getDate() < fechaNacimiento.getDate())
  ) {
    edad -= 1;
  }

  return edad;
};

export class AlumnosService {
  constructor(
    repository,
    accountActivationService = null,
    matriculasRepository = null,
    promocionesRepository = null,
  ) {
    this.repository = repository;
    this.accountActivationService = accountActivationService;
    this.matriculasRepository = matriculasRepository;
    this.promocionesRepository = promocionesRepository;
  }

  async create(data, context = {}) {
    const nombre = typeof data.nombre === "string" ? data.nombre.trim() : "";

    if (!nombre) {
      throw new Error("El nombre es obligatorio");
    }

    if (!data.email) {
      throw new Error("El email es obligatorio");
    }

    if (!data.password) {
      throw new Error("La contraseña es obligatoria");
    }

    if (data.password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres");
    }

    const tipoLicenciaObjetivo =
      data.tipoLicenciaObjetivo ?? data.tipoLicencia ?? "";
    const licenciaNormalizada = String(tipoLicenciaObjetivo)
      .trim()
      .toUpperCase();

    if (!licenciaNormalizada) {
      throw new Error("La licencia objetivo es obligatoria");
    }

    if (!LICENCIAS_PERMITIDAS.includes(licenciaNormalizada)) {
      throw new Error(
        "La licencia objetivo debe ser una de las permitidas: B, A1, A2, A, C, D, E",
      );
    }

    if (!data.telefono) {
      throw new Error("El teléfono es obligatorio");
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

    if (
      data.fechaNacimiento === undefined ||
      data.fechaNacimiento === null ||
      String(data.fechaNacimiento).trim() === ""
    ) {
      throw new Error("La fecha de nacimiento es obligatoria");
    }

    const fechaNacimiento = parseFechaNacimiento(data.fechaNacimiento);
    if (!fechaNacimiento) {
      throw new Error("La fecha de nacimiento debe ser una fecha válida");
    }

    const esEstudiante = parseBoolean(data.esEstudiante, false);

    const promocionesElegibles = await this.getEligiblePromotionsForEnrollment({
      tipoLicenciaObjetivo: licenciaNormalizada,
      fechaNacimiento,
      dni,
      esEstudiante,
    });

    const promocionSeleccionada = this.resolveSelectedPromotion({
      promocionesElegibles,
      promocionId: data.promocionId,
    });

    const passwordHash = await bcrypt.hash(data.password, 10);

    const alumno = await this.repository.create({
      ...data,
      nombre,
      dni,
      fechaNacimiento,
      telefono: String(data.telefono).trim(),
      tipoLicenciaObjetivo: licenciaNormalizada,
      passwordHash,
      rol: "ALUMNO",
      activo: true,
    });

    if (this.matriculasRepository) {
      const tarifa =
        await this.matriculasRepository.findTarifaByLicencia(
          licenciaNormalizada,
        );

      if (!tarifa) {
        throw new Error(
          `No existe tarifa configurada para la licencia ${licenciaNormalizada}`,
        );
      }

      const precioBase = tarifa.precio;

      const precioFinal = promocionSeleccionada
        ? promocionSeleccionada.precioPromocional
        : tarifa.precio;

      const matriculaPayload = {
        alumnoId: alumno.id,
        licencia: licenciaNormalizada,
        precioBase,
        precioFinal,
        promocionId: promocionSeleccionada?.id ?? null,
        estado: "PENDIENTE",
      };

      const baseNumerica = Number(precioBase);
      const finalNumerico = Number(precioFinal);

      const facturaPayload = {
        concepto: promocionSeleccionada
          ? `Matricula licencia ${licenciaNormalizada} - ${promocionSeleccionada.nombre}`
          : `Matricula licencia ${licenciaNormalizada}`,
        baseImponible: precioBase,
        descuento:
          baseNumerica > finalNumerico
            ? Number((baseNumerica - finalNumerico).toFixed(2))
            : 0,
        total: precioFinal,
        estado: "EMITIDA",
      };

      if (typeof this.matriculasRepository.createWithFactura === "function") {
        await this.matriculasRepository.createWithFactura(
          matriculaPayload,
          facturaPayload,
        );
      } else {
        await this.matriculasRepository.create(matriculaPayload);
      }
    }

    if (this.accountActivationService) {
      try {
        await this.accountActivationService.issueActivationForUser({
          usuarioId: alumno.id,
          createdById: context.createdById || null,
        });
      } catch (error) {
        console.error(
          "No se pudo enviar el enlace de activación al alumno:",
          error.message,
        );
      }
    }

    return alumno;
  }

  async getEligiblePromotionsForEnrollment(data) {
    if (!this.promocionesRepository) {
      return [];
    }

    const tipoLicenciaObjetivo =
      data.tipoLicenciaObjetivo ?? data.tipoLicencia ?? "";

    const licenciaNormalizada = String(tipoLicenciaObjetivo)
      .trim()
      .toUpperCase();

    if (
      !licenciaNormalizada ||
      !LICENCIAS_PERMITIDAS.includes(licenciaNormalizada)
    ) {
      throw new Error(
        "La licencia objetivo debe ser una de las permitidas: B, A1, A2, A, C, D, E",
      );
    }

    const fechaNacimiento =
      data.fechaNacimiento instanceof Date
        ? data.fechaNacimiento
        : parseFechaNacimiento(data.fechaNacimiento);

    if (!fechaNacimiento) {
      throw new Error("La fecha de nacimiento debe ser una fecha válida");
    }

    const dni = normalizarDni(data.dni);
    const esEstudiante = parseBoolean(data.esEstudiante, false);

    const promocionesBase =
      await this.promocionesRepository.findActiveByLicense(
        licenciaNormalizada,
        new Date(),
      );

    const edad = calcularEdad(fechaNacimiento);

    const requiereFidelidad = promocionesBase.some(
      (promocion) => promocion.requiereFidelidad,
    );

    const cumpleFidelidad = requiereFidelidad
      ? await this.repository.hasApprovedHistoryByDni(dni)
      : false;

    return promocionesBase.filter((promocion) => {
      if (promocion.requiereCarnetEstudiante && !esEstudiante) {
        return false;
      }

      if (
        promocion.edadMinima !== null &&
        promocion.edadMinima !== undefined &&
        (edad === null || edad < promocion.edadMinima)
      ) {
        return false;
      }

      if (
        promocion.edadMaxima !== null &&
        promocion.edadMaxima !== undefined &&
        (edad === null || edad > promocion.edadMaxima)
      ) {
        return false;
      }

      if (promocion.requiereFidelidad && !cumpleFidelidad) {
        return false;
      }

      return true;
    });
  }

  resolveSelectedPromotion({ promocionesElegibles, promocionId }) {
    if (
      !Array.isArray(promocionesElegibles) ||
      promocionesElegibles.length === 0
    ) {
      return null;
    }

    if (!promocionId) {
      if (promocionesElegibles.length > 1) {
        throw new Error(
          "Existen varias promociones aplicables. Debe seleccionar una promoción antes de confirmar el alta.",
        );
      }

      return promocionesElegibles[0];
    }

    const promocionSeleccionada = promocionesElegibles.find(
      (promocion) => promocion.id === promocionId,
    );

    if (!promocionSeleccionada) {
      throw new Error(
        "La promoción seleccionada no es válida para el alumno o no está vigente.",
      );
    }

    return promocionSeleccionada;
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id) {
    const alumno = await this.repository.findById(id);

    if (!alumno) {
      throw new Error("Alumno no encontrado");
    }

    return alumno;
  }

  async update(id, data) {
    const matricula = await this.matriculasRepository.findActiveByAlumnoId(id);
    const payload = {
      ...data,
    };
    if (matricula && matricula.estado === "PAGADA") {
      const licenciaNueva = data.tipoLicenciaObjetivo ?? data.tipoLicencia;

      if (licenciaNueva && licenciaNueva !== matricula.licencia) {
        throw new Error(
          "No se puede modificar la licencia porque la matrícula ya ha sido abonada.",
        );
      }
    }
    if (data.password?.trim()) {
      if (data.password.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres");
      }

      payload.passwordHash = await bcrypt.hash(data.password, 10);

      delete payload.password;
    } else {
      delete payload.password;
    }

    return this.repository.update(id, payload);
  }

  async deactivate(id) {
    return this.repository.deactivate(id);
  }

  async activate(id) {
    return this.repository.activate(id);
  }

  // async getById(id) {
  //   const alumno = await this.repository.findById(id);

  //   if (!alumno) {
  //     throw new Error("Alumno no encontrado");
  //   }

  //   return alumno;
  // }
}
