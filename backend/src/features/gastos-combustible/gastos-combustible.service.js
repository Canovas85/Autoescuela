import {
  calculateRepostajeToFull,
  NUMERO_TARJETA_AUTOESCUELA,
  TITULAR_TARJETA_AUTOESCUELA,
} from "../../shared/utils/vehiculo-combustible.js";
import { generateFacturaNumber } from "../../shared/utils/factura-number.js";

const COMBUSTIBLE_UMBRAL_REPOSTAJE = 20;

const toMoney = (value) => Number(value).toFixed(2);

const mapGasto = (gasto) => ({
  id: gasto.id,
  numeroFactura: gasto.numeroFactura,
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
}
