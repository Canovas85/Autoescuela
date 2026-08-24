import bcrypt from "bcryptjs";

const LICENCIAS_PERMITIDAS = ["B", "A1", "A2", "A", "C", "D"];

const parseFechaNacimiento = (valor) => {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  const entrada = String(valor).trim();

  if (!entrada) {
    return null;
  }

  const formatoEspanyol = /^\d{2}-\d{2}-\d{4}$/;
  if (formatoEspanyol.test(entrada)) {
    const [dia, mes, anio] = entrada.split("-").map(Number);
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

export class AlumnosService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(data) {
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
        "La licencia objetivo debe ser una de las permitidas: B, A1, A2, A, C, D",
      );
    }

    if (!data.telefono) {
      throw new Error("El teléfono es obligatorio");
    }

    const dni = normalizarDni(data.dni);
    if (
      data.dni !== undefined &&
      data.dni !== null &&
      data.dni !== "" &&
      !dni
    ) {
      throw new Error("El DNI debe tener un formato válido");
    }

    const fechaNacimiento = parseFechaNacimiento(data.fechaNacimiento);
    if (
      data.fechaNacimiento !== undefined &&
      data.fechaNacimiento !== null &&
      String(data.fechaNacimiento).trim() !== "" &&
      !fechaNacimiento
    ) {
      throw new Error("La fecha de nacimiento debe ser una fecha válida");
    }

    const existingUser = await this.repository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("El email ya existe");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.repository.create({
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
    return this.repository.update(id, data);
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
