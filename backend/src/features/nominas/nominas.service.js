import { buildNominaPdfBuffer } from "./nomina-pdf.util.js";

const PRORRATA_PAGAS_EXTRA = 313.37;
const DEDUCCION_CONTINGENCIAS = 115.85;
const DEDUCCION_DESEMPLEO = 38.2;
const DEDUCCION_FORMACION = 2.46;
const DEDUCCION_IRPF = 290.44;
const BASE_RETENCION_IRPF = 2151.42;
const PLUS_TRANSPORTE_MENSUAL = 45;
const IMPORTE_CONVOCATORIA_PRACTICO = 11;

const round2 = (value) =>
  Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;

const toMonthBounds = (year, month) => {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 0, 23, 59, 59, 999);

  return { start, end };
};

const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

const clampDate = (date, minDate, maxDate) => {
  if (date < minDate) {
    return minDate;
  }

  if (date > maxDate) {
    return maxDate;
  }

  return date;
};

const buildNominaNumberPrefix = (year, month) =>
  `NOM-${year}-${String(month).padStart(2, "0")}-`;

export class NominasService {
  constructor(repository) {
    this.repository = repository;
  }

  parseYearMonth(input = {}) {
    const now = new Date();
    const year = Number.parseInt(
      input.year ?? input.anio ?? now.getFullYear(),
      10,
    );
    const month = Number.parseInt(
      input.month ?? input.mes ?? now.getMonth() + 1,
      10,
    );

    if (!Number.isInteger(year) || year < 2026 || year > 2100) {
      throw new Error("El anio debe estar entre 2026 y 2100");
    }

    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new Error("El mes debe estar entre 1 y 12");
    }

    return { year, month };
  }

  parseListFilters(query = {}) {
    const profesorNombre = String(
      query.profesorNombre || query.search || "",
    ).trim();
    const mesRaw = query.mes;
    const anioRaw = query.anio;

    const mes =
      mesRaw === undefined || mesRaw === ""
        ? null
        : Number.parseInt(mesRaw, 10);
    const anio =
      anioRaw === undefined || anioRaw === ""
        ? null
        : Number.parseInt(anioRaw, 10);

    if (mes !== null && (!Number.isInteger(mes) || mes < 1 || mes > 12)) {
      throw new Error("Filtro mes no valido");
    }

    if (
      anio !== null &&
      (!Number.isInteger(anio) || anio < 2026 || anio > 2100)
    ) {
      throw new Error("Filtro anio no valido");
    }

    return {
      profesorNombre,
      mes,
      anio,
    };
  }

  computeWorkedDays({
    fechaAlta,
    fechaBaja,
    periodStart,
    periodEnd,
    daysInMonth,
  }) {
    const alta = fechaAlta ? new Date(fechaAlta) : new Date(periodStart);
    const baja = fechaBaja ? new Date(fechaBaja) : new Date(periodEnd);

    const start = clampDate(alta, periodStart, periodEnd);
    const end = clampDate(baja, periodStart, periodEnd);

    if (end < start) {
      return 0;
    }

    const msPerDay = 24 * 60 * 60 * 1000;
    const days = Math.floor((end.getTime() - start.getTime()) / msPerDay) + 1;

    return Math.max(0, Math.min(days, daysInMonth));
  }

  async getAll(query = {}) {
    const filters = this.parseListFilters(query);
    return this.repository.findAll(filters);
  }

  async getMine(profesorId, query = {}) {
    const filters = this.parseListFilters(query);
    return this.repository.findMine(profesorId, filters);
  }

  async getPreview(nominaId, user = {}) {
    const role = String(user?.rol || "").toUpperCase();

    const nomina =
      role === "PROFESOR"
        ? await this.repository.findByIdAndProfesor(nominaId, user.id)
        : await this.repository.findById(nominaId);

    if (!nomina) {
      throw new Error("Nomina no encontrada");
    }

    return nomina;
  }

  async getPdf(nominaId, user = {}) {
    const nomina = await this.getPreview(nominaId, user);
    const buffer = await buildNominaPdfBuffer(nomina);
    const fileName = `Nomina_${nomina.numero}.pdf`;

    return {
      buffer,
      fileName,
    };
  }

  async buildNextNominaNumber(year, month) {
    const prefix = buildNominaNumberPrefix(year, month);
    const last = await this.repository.findLastNumberForMonth(prefix);

    if (!last?.numero) {
      return `${prefix}0001`;
    }

    const lastSeq = Number.parseInt(last.numero.slice(prefix.length), 10);
    const nextSeq = Number.isInteger(lastSeq) ? lastSeq + 1 : 1;

    return `${prefix}${String(nextSeq).padStart(4, "0")}`;
  }

  buildNominaPayload({
    profesor,
    periodStart,
    periodEnd,
    year,
    month,
    workedDays,
    daysInMonth,
    practicalCount,
    numero,
  }) {
    const salarioBaseMensual = Number(profesor.salarioBaseMensual || 1253.5);
    const importeSalarioBase = round2(
      (salarioBaseMensual / daysInMonth) * workedDays,
    );

    const plusTransporte = PLUS_TRANSPORTE_MENSUAL;
    const plusProductividad = round2(
      practicalCount.total * IMPORTE_CONVOCATORIA_PRACTICO,
    );

    const totalDevengos = round2(
      importeSalarioBase +
        plusTransporte +
        plusProductividad +
        PRORRATA_PAGAS_EXTRA,
    );

    const totalDeducciones = round2(
      DEDUCCION_CONTINGENCIAS +
        DEDUCCION_DESEMPLEO +
        DEDUCCION_FORMACION +
        DEDUCCION_IRPF,
    );

    return {
      numero,
      profesorId: profesor.id,
      anio: year,
      mes: month,
      periodoInicio: periodStart,
      periodoFin: periodEnd,
      diasMes: daysInMonth,
      diasTrabajados: workedDays,
      salarioBaseMensual: salarioBaseMensual,
      importeSalarioBase,
      plusTransporte,
      plusProductividad,
      presentadosApto: practicalCount.aptos,
      presentadosNoApto: practicalCount.noAptos,
      totalPresentados: practicalCount.total,
      prorrataPagasExtra: PRORRATA_PAGAS_EXTRA,
      deduccionContingenciasComunes: DEDUCCION_CONTINGENCIAS,
      deduccionDesempleo: DEDUCCION_DESEMPLEO,
      deduccionFormacionProfesional: DEDUCCION_FORMACION,
      deduccionIrpf: DEDUCCION_IRPF,
      totalDevengos,
      totalDeducciones,
      liquidoPercibir: round2(totalDevengos - totalDeducciones),
      baseCotizacionComunes: totalDevengos,
      baseCotizacionProfesionales: totalDevengos,
      baseRetencionIrpf: BASE_RETENCION_IRPF,
      estado: "GENERADA",
      fechaGeneracion: new Date(),
    };
  }

  async generateMonthlyPayrolls(input = {}) {
    const { year, month } = this.parseYearMonth(input);
    const { start: periodStart, end: periodEnd } = toMonthBounds(year, month);
    const daysInMonth = getDaysInMonth(year, month);

    const profesores = await this.repository.findPayrollEligibleProfessors(
      periodStart,
      periodEnd,
    );

    let generated = 0;
    let skipped = 0;

    for (const profesor of profesores) {
      const existing = await this.repository.findExistingByProfessorAndMonth(
        profesor.id,
        year,
        month,
      );

      if (existing) {
        skipped += 1;
        continue;
      }

      const workedDays = this.computeWorkedDays({
        fechaAlta: profesor.fechaAlta || profesor.usuario?.fechaCreacion,
        fechaBaja: profesor.fechaBaja,
        periodStart,
        periodEnd,
        daysInMonth,
      });

      if (workedDays <= 0) {
        skipped += 1;
        continue;
      }

      const practicalCount =
        await this.repository.countResolvedPracticalByProfessor(
          profesor.id,
          periodStart,
          periodEnd,
        );

      const numero = await this.buildNextNominaNumber(year, month);
      const payload = this.buildNominaPayload({
        profesor,
        periodStart,
        periodEnd,
        year,
        month,
        workedDays,
        daysInMonth,
        practicalCount,
        numero,
      });

      await this.repository.create(payload);
      generated += 1;
    }

    return {
      year,
      month,
      generated,
      skipped,
      totalProfesores: profesores.length,
    };
  }

  async generateMissingFrom2026() {
    const now = new Date();
    const startYear = 2026;
    const months = [];

    for (let year = startYear; year <= now.getFullYear(); year += 1) {
      const maxMonth = year === now.getFullYear() ? now.getMonth() + 1 : 12;

      for (let month = 1; month <= maxMonth; month += 1) {
        months.push({ year, month });
      }
    }

    const summary = [];

    for (const monthData of months) {
      // Reusa la misma logica y evita duplicados por unique constraint.
      const item = await this.generateMonthlyPayrolls(monthData);
      summary.push(item);
    }

    return {
      totalMeses: months.length,
      summary,
    };
  }
}
