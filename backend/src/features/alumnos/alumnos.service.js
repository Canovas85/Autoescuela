import bcrypt from "bcryptjs";

export class AlumnosService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(data) {
    if (!data.email) {
      throw new Error("El email es obligatorio");
    }

    if (!data.password) {
      throw new Error("La contraseña es obligatoria");
    }

    if (data.password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres");
    }

    if (!data.tipoLicencia) {
      throw new Error("La licencia objetivo es obligatoria");
    }

    if (!data.telefono) {
      throw new Error("El teléfono es obligatorio");
    }

    const existingUser = await this.repository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("El email ya existe");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.repository.create({
      ...data,
      passwordHash,
      rol: "ALUMNO",
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
