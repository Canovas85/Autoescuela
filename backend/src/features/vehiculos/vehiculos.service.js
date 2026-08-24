import fs from "fs";
import path from "path";

import { VEHICULOS_UPLOAD_DIR } from "./vehiculos.upload.js";

export class VehiculosService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(data, imagenFile) {
    const matricula =
      typeof data.matricula === "string"
        ? data.matricula.trim().toUpperCase()
        : "";

    if (!matricula) {
      throw new Error("La matrícula es obligatoria");
    }

    const existingVehicle = await this.repository.findByMatricula(matricula);

    if (existingVehicle) {
      throw new Error("La matrícula ya existe");
    }

    const tipoPermiso =
      typeof data.tipoPermiso === "string"
        ? data.tipoPermiso.trim().toUpperCase()
        : "";

    if (!tipoPermiso) {
      throw new Error("El tipo de permiso es obligatorio");
    }

    return this.repository.create({
      ...data,
      matricula,
      tipoPermiso,
      marca: typeof data.marca === "string" ? data.marca.trim() : data.marca,
      modelo:
        typeof data.modelo === "string" ? data.modelo.trim() : data.modelo,
      imagenRuta: imagenFile
        ? `/api/uploads/vehiculos/${imagenFile.filename}`
        : null,
      activo: true,
    });
  }
  async getAll() {
    return this.repository.findAll();
  }

  async getById(id) {
    return this.repository.findById(id);
  }

  async update(id, data, imagenFile) {
    const payload = {};
    const eliminarImagen = ["true", "1", "on", "yes"].includes(
      String(data.eliminarImagen || "").toLowerCase(),
    );

    if (Object.prototype.hasOwnProperty.call(data, "matricula")) {
      const matricula =
        typeof data.matricula === "string"
          ? data.matricula.trim().toUpperCase()
          : "";

      if (!matricula) {
        throw new Error("La matrícula es obligatoria");
      }

      const existingVehicle = await this.repository.findByMatricula(matricula);
      if (existingVehicle && existingVehicle.id !== id) {
        throw new Error("La matrícula ya existe");
      }

      payload.matricula = matricula;
    }

    if (Object.prototype.hasOwnProperty.call(data, "tipoPermiso")) {
      const tipoPermiso =
        typeof data.tipoPermiso === "string"
          ? data.tipoPermiso.trim().toUpperCase()
          : "";

      if (!tipoPermiso) {
        throw new Error("El tipo de permiso es obligatorio");
      }

      payload.tipoPermiso = tipoPermiso;
    }

    if (Object.prototype.hasOwnProperty.call(data, "marca")) {
      payload.marca =
        typeof data.marca === "string" ? data.marca.trim() : data.marca;
    }

    if (Object.prototype.hasOwnProperty.call(data, "modelo")) {
      payload.modelo =
        typeof data.modelo === "string" ? data.modelo.trim() : data.modelo;
    }

    const vehiculoActual =
      imagenFile || eliminarImagen ? await this.repository.findById(id) : null;

    if (imagenFile) {
      payload.imagenRuta = `/api/uploads/vehiculos/${imagenFile.filename}`;
    } else if (eliminarImagen) {
      payload.imagenRuta = null;
    }

    const vehiculoActualizado = await this.repository.update(id, payload);

    if (
      vehiculoActual?.imagenRuta &&
      ((imagenFile && vehiculoActual.imagenRuta !== payload.imagenRuta) ||
        (eliminarImagen && !imagenFile))
    ) {
      const oldFilename = path.basename(vehiculoActual.imagenRuta);
      const oldPath = path.join(VEHICULOS_UPLOAD_DIR, oldFilename);

      try {
        fs.unlinkSync(oldPath);
      } catch {
        // Si no existe o falla el borrado, no bloquea la actualización.
      }
    }

    return vehiculoActualizado;
  }

  async deactivate(id) {
    return this.repository.deactivate(id);
  }

  async activate(id) {
    return this.repository.activate(id);
  }
}
