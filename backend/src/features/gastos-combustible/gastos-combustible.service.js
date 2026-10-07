import {
  calculateRepostajeToFull,
  NUMERO_TARJETA_AUTOESCUELA,
  TITULAR_TARJETA_AUTOESCUELA,
} from "../../shared/utils/vehiculo-combustible.js";
import { generateFacturaNumber } from "../../shared/utils/factura-number.js";
import {
  evaluateVehicleItvStatus,
  getItvPriceByPermiso,
  ITV_BLOCK_MESSAGE,
} from "../../shared/domain/vehiculo-itv.js";

const COMBUSTIBLE_UMBRAL_REPOSTAJE = 20;

const toMoney = (value) => Number(value).toFixed(2);

const mapGasto = (gasto) => ({
  id: gasto.id,
  numeroFactura: gasto.numeroFactura,
  tipoGasto: gasto.tipoGasto || "COMBUSTIBLE",
  concepto: gasto.concepto || "Repostaje combustible",
  titularTarjeta: gasto.titularTarjeta,
  numeroTarjeta: gasto.numeroTarjeta,
  combustibleAntesPct: gasto.combustibleAntesPct,
  combustibleDespuesPct: gasto.combustibleDespuesPct,
  litrosRepostados: Number(gasto.litrosRepostados),
  precioLitro: Number(gasto.precioLitro),
  total: Number(gasto.total),
  kilometrosVehiculo: gasto.kilometrosVehiculo,
  rutaRecibo: gasto.rutaRecibo,
  createdAt: gasto.createdAt,
  vehiculo: {
    id: gasto.vehiculo?.id,
    matricula: gasto.vehiculo?.matricula,
    marca: gasto.vehiculo?.marca,
    modelo: gasto.vehiculo?.modelo,
    tipoPermiso: gasto.vehiculo?.tipoPermiso,
  },
  profesor: {
    id: gasto.profesor?.id,
    nombre: gasto.profesor?.usuario?.nombre || "Profesor",
    email: gasto.profesor?.usuario?.email || "",
  },
});

export class GastosCombustibleService {
  constructor(repository, notificacionesRepository = null) {
    this.repository = repository;
    this.notificacionesRepository = notificacionesRepository;
  }

  async getAll() {
    const rows = await this.repository.findAll();
    return rows.map(mapGasto);
  }

  async getMine(profesorId) {
    const rows = await this.repository.findMine(profesorId);
    return rows.map(mapGasto);
  }

  async resolveProfessorActorId(userId) {
    if (!userId) {
      return null;
    }

    const profesor = await this.repository.findProfesorById(userId);
    return profesor?.id || null;
  }

  async assertItvPending(vehiculoId) {
    const vehiculo = await this.repository.findVehiculoById(vehiculoId);

    if (!vehiculo || vehiculo.activo === false) {
      throw new Error("Vehículo no encontrado o inactivo");
    }

    const now = new Date();
    const latestItvExpense =
      await this.repository.findLatestItvExpenseByVehiculoId(vehiculoId);
    const referenceDate =
      latestItvExpense?.createdAt || vehiculo?.createdAt || now;
    const kmBase = Number(latestItvExpense?.kilometrosVehiculo || 0);

    const completedClassesSinceReference =
      await this.repository.countCompletedClassesByVehiculoSince(
        vehiculoId,
        referenceDate,
        now,
      );

    const itvStatus = evaluateVehicleItvStatus({
      vehiculo,
      referenceDate,
      kmBase,
      completedClassesSinceReference,
      now,
    });

    return {
      vehiculo,
      itvStatus,
      latestItvExpense,
      precioRevision: getItvPriceByPermiso(vehiculo.tipoPermiso),
    };
  }

  async createRefuelExpense(profesorId, vehiculoId, reciboFile) {
    const profesor = await this.repository.findProfesorById(profesorId);

    if (!profesor) {
      throw new Error("Profesor no encontrado");
    }

    const licencias = Array.isArray(profesor.permisosLicencias)
      ? profesor.permisosLicencias
      : [];

    const vehiculo = await this.repository.findVehiculoCompatible(
      licencias,
      vehiculoId,
    );

    if (!vehiculo) {
      throw new Error(
        "Vehículo no encontrado o no compatible con los permisos del profesor",
      );
    }

    if (vehiculo.combustibleActualPct >= COMBUSTIBLE_UMBRAL_REPOSTAJE) {
      throw new Error(
        "Solo se permite repostar desde este flujo si el vehículo tiene menos del 20% de combustible",
      );
    }

    const repostaje = calculateRepostajeToFull({
      combustibleActualPct: vehiculo.combustibleActualPct,
      tipoPermiso: vehiculo.tipoPermiso,
    });

    const gasto = await this.repository.createGastoAndRefuelVehiculo({
      profesorId,
      vehiculoId: vehiculo.id,
      numeroFactura: generateFacturaNumber(),
      titularTarjeta: TITULAR_TARJETA_AUTOESCUELA,
      numeroTarjeta: NUMERO_TARJETA_AUTOESCUELA,
      combustibleAntesPct: vehiculo.combustibleActualPct,
      litrosRepostados: toMoney(repostaje.litrosARepostar),
      precioLitro: toMoney(repostaje.precioLitro),
      total: toMoney(repostaje.total),
      kilometrosVehiculo: vehiculo.kmActuales,
      rutaRecibo: reciboFile
        ? `/api/uploads/gastos-combustible/${reciboFile.filename}`
        : null,
    });

    if (this.notificacionesRepository) {
      await this.notificacionesRepository.createForRole("ADMIN", {
        tipo: "GASTO_COMBUSTIBLE_REGISTRADO",
        titulo: "Gasto de combustible registrado",
        mensaje: `Se ha registrado un gasto de combustible para el vehículo ${vehiculo.matricula}`,
        metadata: {
          gastoCombustibleId: gasto.id,
          vehiculoId: vehiculo.id,
          route: "/gastos",
        },
      });
    }

    return {
      message: "Repostaje registrado correctamente",
      gasto: mapGasto(gasto),
      resumenRepostaje: {
        capacidadLitros: repostaje.capacidadLitros,
        litrosActualesAntes: repostaje.litrosActuales,
        litrosRepostados: repostaje.litrosARepostar,
        precioLitro: repostaje.precioLitro,
        total: repostaje.total,
      },
    };
  }

  async createItvExpense(userId, vehiculoId) {
    const itvContext = await this.assertItvPending(vehiculoId);

    if (!itvContext.itvStatus.pendiente) {
      throw new Error(
        "Este vehículo no tiene una revisión ITV pendiente en este momento",
      );
    }

    const profesorId = await this.resolveProfessorActorId(userId);
    const concepto = `Revisión ITV - ${itvContext.vehiculo.matricula}`;
    const total = Number(itvContext.precioRevision);
    const fechaRevision = new Date();

    let attempt = 0;

    while (attempt < 3) {
      const numeroFactura = generateFacturaNumber(attempt);

      try {
        const result = await this.repository.createItvExpenseAndInvoice({
          profesorId,
          vehiculoId,
          numeroFactura,
          concepto,
          total,
          kilometrosVehiculo: Number(itvContext.vehiculo.kmActuales || 0),
          fechaRevision,
        });

        if (this.notificacionesRepository) {
          await this.notificacionesRepository.createForRole("ADMIN", {
            tipo: "REVISION_ITV_PAGADA",
            titulo: "Revisión ITV registrada",
            mensaje: `Se ha registrado el pago de revisión ITV del vehículo ${itvContext.vehiculo.matricula}`,
            metadata: {
              vehiculoId,
              numeroFactura,
              route: "/gastos",
            },
          });
        }

        return {
          message: "Pago de revisión ITV registrado correctamente",
          bloqueoMensaje: ITV_BLOCK_MESSAGE,
          gasto: mapGasto(result.gasto),
        };
      } catch (error) {
        if (error?.code !== "P2002" || attempt === 2) {
          throw error;
        }

        attempt += 1;
      }
    }

    throw new Error("No se pudo registrar el pago de revisión ITV");
  }
}
