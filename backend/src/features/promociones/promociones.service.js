import fs from "fs";
import path from "path";

import { PROMOCIONES_UPLOAD_DIR } from "./promociones.upload.js";

const normalizarTexto = (valor) =>
  typeof valor === "string" ? valor.trim() : "";

const LICENCIAS_VALIDAS = ["B", "A1", "A2", "A", "C", "D", "E"];

export class PromocionesService {
  constructor(repository) {
    this.repository = repository;
  }

  validarPayload(data) {
    const nombre = normalizarTexto(data.nombre);

    if (!nombre) {
      throw new Error("El nombre es obligatorio");
    }

    const precioOriginal = Number(data.precioOriginal);

    if (Number.isNaN(precioOriginal) || precioOriginal <= 0) {
      throw new Error("El precio original debe ser mayor que 0");
    }

    const precioPromocional = Number(data.precioPromocional);

    if (Number.isNaN(precioPromocional) || precioPromocional <= 0) {
      throw new Error("El precio promocional debe ser mayor que 0");
    }

    if (precioPromocional > precioOriginal) {
      throw new Error(
        "El precio promocional no puede ser superior al precio original",
      );
    }

    const licenciasAplicables = Array.isArray(data.licenciasAplicables)
      ? data.licenciasAplicables
      : data.licenciasAplicables
        ? [data.licenciasAplicables]
        : [];

    if (licenciasAplicables.length === 0) {
      throw new Error("Debe seleccionar al menos una licencia");
    }

    const licenciasInvalidas = licenciasAplicables.filter(
      (licencia) => !LICENCIAS_VALIDAS.includes(licencia),
    );

    if (licenciasInvalidas.length > 0) {
      throw new Error("Existen licencias no válidas");
    }

    return {
      nombre,

      descripcion: normalizarTexto(data.descripcion) || null,

      precioOriginal,

      precioPromocional,

      licenciasAplicables,

      imagenRuta: data.imagenRuta || null,

      fechaInicio: data.fechaInicio ? new Date(data.fechaInicio) : null,

      fechaFin: data.fechaFin ? new Date(data.fechaFin) : null,

      activa: data.activa === undefined ? true : Boolean(data.activa),
    };
  }

  async create(data, imagenFile) {
    console.log("CREATE DATA", data);
    console.log("CREATE FILE", imagenFile);

    const payload = this.validarPayload(data);

    payload.imagenRuta = imagenFile
      ? `/api/uploads/promociones/${imagenFile.filename}`
      : null;

    return this.repository.create(payload);
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id) {
    const promocion = await this.repository.findById(id);

    if (!promocion) {
      throw new Error("Promoción no encontrada");
    }

    return promocion;
  }

  async update(id, data, imagenFile) {
    const eliminarImagen = ["true", "1", "on", "yes"].includes(
      String(data.eliminarImagen || "").toLowerCase(),
    );

    const promocionActual =
      imagenFile || eliminarImagen ? await this.repository.findById(id) : null;

    const payload = this.validarPayload(data);

    if (imagenFile) {
      payload.imagenRuta = `/api/uploads/promociones/${imagenFile.filename}`;
    } else if (eliminarImagen) {
      payload.imagenRuta = null;
    }

    const promocionActualizada = await this.repository.update(id, payload);

    if (
      promocionActual?.imagenRuta &&
      ((imagenFile && promocionActual.imagenRuta !== payload.imagenRuta) ||
        (eliminarImagen && !imagenFile))
    ) {
      const oldFilename = path.basename(promocionActual.imagenRuta);

      const oldPath = path.join(PROMOCIONES_UPLOAD_DIR, oldFilename);

      try {
        fs.unlinkSync(oldPath);
      } catch {
        // si falla no bloqueamos la actualización
      }
    }

    return promocionActualizada;
  }

  async delete(id) {
    return this.repository.delete(id);
  }

  async activate(id) {
    return this.repository.activate(id);
  }

  async deactivate(id) {
    return this.repository.deactivate(id);
  }

  async getPublic() {
    return this.repository.findPublic();
  }
}
