import fs from "fs";
import path from "path";

import { VEHICULOS_UPLOAD_DIR } from "./vehiculos.upload.js";
import {
  evaluateVehicleItvStatus,
  getItvPriceByPermiso,
  isCompletedClass,
  ITV_BLOCK_MESSAGE,
} from "../../shared/domain/vehiculo-itv.js";
import { generateFacturaNumber } from "../../shared/utils/factura-number.js";

export class VehiculosService {
  constructor(repository) {
    this.repository = repository;
  }

  parseOptionalDate(value) {
    if (value === undefined || value === null || String(value).trim() === "") {
      return null;
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new Error("La fecha de última ITV no es válida");
    }

    return parsed;
  }

  generateInvoiceNumber(attempt = 0) {
    return generateFacturaNumber(attempt);
  }

  async resolveProfessorActorId(userId) {
    if (!userId) {
      return null;
    }

    if (typeof this.repository.findProfesorById !== "function") {
      return null;
    }

    const profesor = await this.repository.findProfesorById(userId);
    return profesor?.id || null;
  }

  buildItvStatusFromVehicleData(vehiculo, now = new Date()) {
    const clases = Array.isArray(vehiculo?.clases) ? vehiculo.clases : [];
    const numeroClasesRealizadas = clases.filter((clase) =>
      isCompletedClass(clase, now),
    ).length;

    const latestItvExpense = vehiculo?.gastosCombustible?.[0] || null;
    const referenceDate =
      latestItvExpense?.createdAt || vehiculo?.createdAt || now;
    const kmBase = Number(latestItvExpense?.kilometrosVehiculo || 0);

    const completedClassesSinceReference = clases.filter((clase) => {
      if (!isCompletedClass(clase, now)) {
        return false;
      }

      const classDate = new Date(clase?.fecha);

      if (Number.isNaN(classDate.getTime())) {
        return false;
      }

      return classDate >= referenceDate;
    }).length;

    const itvStatus = evaluateVehicleItvStatus({
      vehiculo,
      referenceDate,
      kmBase,
      completedClassesSinceReference,
      now,
    });

    return {
      numeroClasesRealizadas,
      latestItvExpense,
      itvStatus,
      precioRevisionItv: getItvPriceByPermiso(vehiculo?.tipoPermiso),
    };
  }

  async getVehicleItvStatus(vehiculoId, now = new Date()) {
    const vehiculo = await this.repository.findById(vehiculoId);

    if (!vehiculo) {
      throw new Error("Vehículo no encontrado");
    }

    const latestItvExpense =
      typeof this.repository.findLatestItvExpenseByVehiculoId === "function"
        ? await this.repository.findLatestItvExpenseByVehiculoId(vehiculoId)
        : null;

    const referenceDate =
      latestItvExpense?.createdAt || vehiculo?.createdAt || now;
    const kmBase = Number(latestItvExpense?.kilometrosVehiculo || 0);

    const completedClassesSinceReference =
      typeof this.repository.countCompletedClassesByVehiculoSince === "function"
        ? await this.repository.countCompletedClassesByVehiculoSince(
            vehiculoId,
            referenceDate,
            now,
          )
        : 0;

    const itvStatus = evaluateVehicleItvStatus({
      vehiculo,
      referenceDate,
      kmBase,
      completedClassesSinceReference,
      now,
    });

    return {
      vehiculo,
      latestItvExpense,
      ...itvStatus,
      precioRevisionItv: getItvPriceByPermiso(vehiculo?.tipoPermiso),
    };
  }

  mapVehiculoWithStats(vehiculo, now = new Date()) {
    const {
      numeroClasesRealizadas,
      latestItvExpense,
      itvStatus,
      precioRevisionItv,
    } = this.buildItvStatusFromVehicleData(vehiculo, now);

    return {
      ...vehiculo,
      numeroClasesRealizadas,
      itvPendiente: itvStatus.pendiente,
      itvMotivos: itvStatus.motivos,
      itvPrecioRevision: precioRevisionItv,
      itvFechaReferencia: itvStatus.fechaReferenciaRevision,
      itvFechaLimite: itvStatus.fechaLimiteRevision,
      itvKmRecorridosDesdeUltimaRevision:
        itvStatus.kmRecorridosDesdeUltimaRevision,
      itvClasesEfectuadasDesdeUltimaRevision:
        itvStatus.clasesEfectuadasDesdeUltimaRevision,
      ultimaRevisionItvRegistradaAt: latestItvExpense?.createdAt || null,
      ultimaRevisionItvNumeroFactura: latestItvExpense?.numeroFactura || null,
    };
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
      fechaUltimaItv: this.parseOptionalDate(data.fechaUltimaItv),
      imagenRuta: imagenFile
        ? `/api/uploads/vehiculos/${imagenFile.filename}`
        : null,
      activo: true,
    });
  }
  async getAll() {
    const rows = await this.repository.findAll();
    const now = new Date();

    return (rows || []).map((vehiculo) =>
      this.mapVehiculoWithStats(vehiculo, now),
    );
  }

  async getById(id) {
    const vehiculo = await this.repository.findById(id);

    if (!vehiculo) {
      return null;
    }

    return this.mapVehiculoWithStats(vehiculo);
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

    if (Object.prototype.hasOwnProperty.call(data, "fechaUltimaItv")) {
      payload.fechaUltimaItv = this.parseOptionalDate(data.fechaUltimaItv);
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
    if (
      typeof this.repository.findById !== "function" ||
      typeof this.repository.findFutureOrCurrentClassesByVehiculo !== "function"
    ) {
      return this.repository.deactivate(id);
    }

    const impacto = await this.getDeactivationImpact(id);

    if ((impacto.clasesAfectadas || []).length > 0) {
      throw new Error(
        "No se puede desactivar el vehículo sin reasignar previamente todas las clases afectadas",
      );
    }

    return this.repository.deactivate(id);
  }

  async getDeactivationImpact(id) {
    const vehiculo = await this.repository.findById(id);

    if (!vehiculo) {
      throw new Error("Vehículo no encontrado");
    }

    const now = new Date();
    const clases = await this.repository.findFutureOrCurrentClassesByVehiculo(
      id,
      now,
    );

    const impacto = await Promise.all(
      clases.map(async (clase) => {
        const permisoClase = String(clase.vehiculo?.tipoPermiso || "")
          .trim()
          .toUpperCase();

        const opciones =
          await this.repository.findActiveCompatibleVehiclesByPermiso(
            permisoClase,
            id,
          );

        return {
          claseId: clase.id,
          alumnoNombre: clase.alumno?.usuario?.nombre || "Alumno",
          fecha: clase.fecha,
          estado: clase.estado,
          permiso: permisoClase,
          enCurso: clase.hojaRuta?.estado === "EN_CURSO",
          opciones: opciones.map((item) => ({
            id: item.id,
            matricula: item.matricula,
            marca: item.marca,
            modelo: item.modelo,
            tipoPermiso: item.tipoPermiso,
            kmActuales: item.kmActuales,
            combustibleActualPct: item.combustibleActualPct,
          })),
        };
      }),
    );

    return {
      vehiculo,
      clasesAfectadas: impacto,
    };
  }

  async deactivateWithReassignment(id, reasignaciones) {
    const vehiculo = await this.repository.findById(id);

    if (!vehiculo) {
      throw new Error("Vehículo no encontrado");
    }

    if (vehiculo.activo === false) {
      throw new Error("El vehículo ya está desactivado");
    }

    const now = new Date();
    const clasesAfectadas =
      await this.repository.findFutureOrCurrentClassesByVehiculo(id, now);

    if (!clasesAfectadas.length) {
      return this.repository.deactivate(id);
    }

    if (!Array.isArray(reasignaciones) || reasignaciones.length === 0) {
      throw new Error(
        "Debes reasignar todas las clases afectadas antes de desactivar el vehículo",
      );
    }

    const assignmentMap = new Map(
      reasignaciones.map((row) => [String(row.claseId), row]),
    );

    for (const clase of clasesAfectadas) {
      const item = assignmentMap.get(String(clase.id));

      if (!item?.nuevoVehiculoId) {
        throw new Error(
          `Falta reasignar la clase ${clase.id} antes de desactivar el vehículo`,
        );
      }

      const permisoClase = String(clase.vehiculo?.tipoPermiso || "")
        .trim()
        .toUpperCase();

      const opciones =
        await this.repository.findActiveCompatibleVehiclesByPermiso(
          permisoClase,
          id,
        );

      const nuevoVehiculo = opciones.find(
        (vehiculoItem) => vehiculoItem.id === item.nuevoVehiculoId,
      );

      if (!nuevoVehiculo) {
        throw new Error(
          `El nuevo vehículo de la clase ${clase.id} no está activo o no es compatible con la licencia`,
        );
      }

      if (clase.hojaRuta?.estado === "EN_CURSO") {
        const km = Number(item.kmActualesNuevoVehiculo);
        const combustible = Number(item.combustibleActualPctNuevoVehiculo);

        if (!Number.isInteger(km) || km < 0) {
          throw new Error(
            `Debes indicar un kilometraje válido para la clase en curso ${clase.id}`,
          );
        }

        if (
          !Number.isInteger(combustible) ||
          combustible < 0 ||
          combustible > 100
        ) {
          throw new Error(
            `Debes indicar un combustible válido (0-100) para la clase en curso ${clase.id}`,
          );
        }
      }
    }

    const assignments = clasesAfectadas.map((clase) => {
      const item = assignmentMap.get(String(clase.id));
      const enCurso = clase.hojaRuta?.estado === "EN_CURSO";

      return {
        claseId: clase.id,
        nuevoVehiculoId: String(item.nuevoVehiculoId),
        kmActualesNuevoVehiculo: enCurso
          ? Number(item.kmActualesNuevoVehiculo)
          : null,
        combustibleActualPctNuevoVehiculo: enCurso
          ? Number(item.combustibleActualPctNuevoVehiculo)
          : null,
      };
    });

    for (const assignment of assignments) {
      const itvStatus = await this.getVehicleItvStatus(
        assignment.nuevoVehiculoId,
      );

      if (itvStatus.pendiente) {
        throw new Error(ITV_BLOCK_MESSAGE);
      }
    }

    return this.repository.deactivateWithReassignments({
      vehiculoId: id,
      assignments,
    });
  }

  async payItv(vehiculoId, userId = null) {
    const itvStatus = await this.getVehicleItvStatus(vehiculoId);

    if (!itvStatus.pendiente) {
      throw new Error(
        "Este vehículo no tiene una revisión ITV pendiente en este momento",
      );
    }

    const concepto = `Revisión ITV - ${itvStatus.vehiculo.matricula}`;
    const total = Number(getItvPriceByPermiso(itvStatus.vehiculo.tipoPermiso));
    const profesorActorId = await this.resolveProfessorActorId(userId);

    let attempt = 0;

    while (attempt < 3) {
      const numeroFactura = this.generateInvoiceNumber(attempt);

      try {
        const payload = {
          vehiculoId,
          profesorId: profesorActorId,
          numeroFactura,
          concepto,
          total,
          kilometrosVehiculo: Number(itvStatus.vehiculo.kmActuales || 0),
          fechaRevision: new Date(),
        };

        const result =
          await this.repository.createItvExpenseAndInvoice(payload);

        return {
          message: "Pago de revisión ITV registrado correctamente",
          numeroFactura,
          concepto,
          total,
          vehiculo: result.vehiculo,
        };
      } catch (error) {
        if (error?.code !== "P2002" || attempt === 2) {
          throw error;
        }

        attempt += 1;
      }
    }

    throw new Error(
      "No se pudo generar el número de factura para la revisión ITV",
    );
  }

  async activate(id) {
    return this.repository.activate(id);
  }
}
