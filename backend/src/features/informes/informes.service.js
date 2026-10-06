const PERIODS = {
  MONTH: "MONTH",
  QUARTER: "QUARTER",
  YEAR: "YEAR",
  CUSTOM: "CUSTOM",
};

const round2 = (value) =>
  Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;

const toDateKey = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const startOfDay = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const endOfDay = (date) => {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
};

export class InformesService {
  constructor(repository) {
    this.repository = repository;
  }

  classifyIncomeConcept(concepto) {
    const text = String(concepto || "").toLowerCase();

    if (text.includes("matricul")) {
      return "Matrículas";
    }

    if (text.includes("bono")) {
      return "Bonos";
    }

    if (text.includes("clase")) {
      return "Clases prácticas";
    }

    if (
      text.includes("tasa") ||
      text.includes("dgt") ||
      text.includes("examen")
    ) {
      return "Exámenes y tasas";
    }

    return "Otros";
  }

  resolveDateRange(filters = {}) {
    const now = new Date();
    const periodRaw = String(filters.period || filters.periodType || "MONTH")
      .trim()
      .toUpperCase();
    const period = PERIODS[periodRaw] || PERIODS.MONTH;

    if (period === PERIODS.CUSTOM) {
      const dateFrom = filters.dateFrom || filters.from;
      const dateTo = filters.dateTo || filters.to;

      const from = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
      const to = dateTo ? new Date(`${dateTo}T23:59:59.999`) : null;

      if (!from || Number.isNaN(from.getTime())) {
        throw new Error(
          "Para el periodo personalizado, dateFrom es obligatorio",
        );
      }

      if (!to || Number.isNaN(to.getTime())) {
        throw new Error("Para el periodo personalizado, dateTo es obligatorio");
      }

      if (to < from) {
        throw new Error("dateTo no puede ser anterior a dateFrom");
      }

      return {
        period,
        startDate: from,
        endDate: to,
      };
    }

    const year = Number.parseInt(filters.year || `${now.getFullYear()}`, 10);

    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      throw new Error("El año del filtro no es válido");
    }

    if (period === PERIODS.MONTH) {
      const month = Number.parseInt(
        filters.month || `${now.getMonth() + 1}`,
        10,
      );

      if (!Number.isInteger(month) || month < 1 || month > 12) {
        throw new Error("El mes del filtro no es válido");
      }

      return {
        period,
        startDate: new Date(year, month - 1, 1, 0, 0, 0, 0),
        endDate: new Date(year, month, 0, 23, 59, 59, 999),
      };
    }

    if (period === PERIODS.QUARTER) {
      const quarter = Number.parseInt(filters.quarter || "1", 10);

      if (!Number.isInteger(quarter) || quarter < 1 || quarter > 4) {
        throw new Error("El trimestre del filtro no es válido");
      }

      const startMonth = (quarter - 1) * 3;

      return {
        period,
        startDate: new Date(year, startMonth, 1, 0, 0, 0, 0),
        endDate: new Date(year, startMonth + 3, 0, 23, 59, 59, 999),
      };
    }

    return {
      period,
      startDate: new Date(year, 0, 1, 0, 0, 0, 0),
      endDate: new Date(year, 11, 31, 23, 59, 59, 999),
    };
  }

  toMovementFacturas(facturas = []) {
    return (facturas || []).map((item) => ({
      id: `factura-${item.id}`,
      tipo: "FACTURA",
      concepto: item.concepto || "Factura",
      categoria: this.classifyIncomeConcept(item.concepto),
      estado: item.estado || "-",
      fecha: item.fechaEmision,
      importe: round2(item.total),
      alumno: item.alumno?.usuario?.nombre || "-",
      referencia: item.numero || item.id,
    }));
  }

  toMovementPagos(pagos = []) {
    return (pagos || []).map((item) => ({
      id: `pago-${item.id}`,
      tipo: "PAGO",
      concepto: item.concepto || "Pago",
      categoria: this.classifyIncomeConcept(item.concepto),
      estado: item.estado || "-",
      fecha: item.fechaPago || item.fechaCreacion,
      importe: round2(item.importe),
      alumno: item.alumno?.usuario?.nombre || "-",
      referencia: item.numeroFacturaPago || item.id,
    }));
  }

  toMovementGastos(gastos = []) {
    return (gastos || []).map((item) => ({
      id: `gasto-${item.id}`,
      tipo: "GASTO",
      concepto: "Combustible",
      categoria: "Gastos operativos",
      estado: "REGISTRADO",
      fecha: item.createdAt,
      importe: round2(Number(item.total || 0) * -1),
      alumno: "-",
      referencia: item.numeroFactura || item.id,
      detalle:
        `${item.vehiculo?.matricula || "Vehículo"} ${item.vehiculo?.marca || ""} ${item.vehiculo?.modelo || ""}`.trim(),
    }));
  }

  buildCashFlowSeries(facturasPagadas = [], gastos = [], startDate, endDate) {
    const incomeByDate = new Map();
    const expenseByDate = new Map();

    for (const item of facturasPagadas) {
      const key = toDateKey(item.fechaPago || item.fechaEmision);
      if (!key) {
        continue;
      }
      incomeByDate.set(
        key,
        round2((incomeByDate.get(key) || 0) + Number(item.total || 0)),
      );
    }

    for (const item of gastos) {
      const key = toDateKey(item.createdAt);
      if (!key) {
        continue;
      }
      expenseByDate.set(
        key,
        round2((expenseByDate.get(key) || 0) + Number(item.total || 0)),
      );
    }

    const rows = [];
    const cursor = startOfDay(startDate);
    const end = endOfDay(endDate);
    let saldoAcumulado = 0;

    while (cursor <= end) {
      const key = toDateKey(cursor);
      const ingresos = round2(incomeByDate.get(key) || 0);
      const gastosDia = round2(expenseByDate.get(key) || 0);
      const balanceDiario = round2(ingresos - gastosDia);
      saldoAcumulado = round2(saldoAcumulado + balanceDiario);

      rows.push({
        fecha: key,
        ingresos,
        gastos: gastosDia,
        balanceDiario,
        saldoAcumulado,
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    return rows;
  }

  buildIncomeDistribution(facturasPagadas = []) {
    const grouped = new Map();

    for (const item of facturasPagadas) {
      const category = this.classifyIncomeConcept(item.concepto);
      grouped.set(
        category,
        round2((grouped.get(category) || 0) + Number(item.total || 0)),
      );
    }

    const total = round2(
      [...grouped.values()].reduce((acc, value) => acc + Number(value || 0), 0),
    );

    return [...grouped.entries()]
      .map(([categoria, amount]) => ({
        categoria,
        total: round2(amount),
        porcentaje: total > 0 ? round2((Number(amount) / total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }

  async getAdminAccountingReport(filters = {}) {
    const { period, startDate, endDate } = this.resolveDateRange(filters);

    const [facturas, pagos, gastos] = await Promise.all([
      this.repository.findFacturasBetween(startDate, endDate),
      this.repository.findPagosBetween(startDate, endDate),
      this.repository.findGastosCombustibleBetween(startDate, endDate),
    ]);

    const facturasPagadas = (facturas || []).filter(
      (item) => String(item.estado || "").toUpperCase() === "PAGADA",
    );

    const facturasPendientesMatricula = (facturas || []).filter((item) => {
      const estado = String(item.estado || "").toUpperCase();
      const concepto = String(item.concepto || "").toLowerCase();

      return (
        (estado === "PENDIENTE" || estado === "EMITIDA") &&
        concepto.includes("matricul")
      );
    });

    const ingresosTotales = round2(
      facturasPagadas.reduce((acc, item) => acc + Number(item.total || 0), 0),
    );

    const gastosTotales = round2(
      (gastos || []).reduce((acc, item) => acc + Number(item.total || 0), 0),
    );

    const cobrosPendientesMatricula = round2(
      facturasPendientesMatricula.reduce(
        (acc, item) => acc + Number(item.total || 0),
        0,
      ),
    );

    const movimientos = [
      ...this.toMovementFacturas(facturas),
      ...this.toMovementPagos(pagos),
      ...this.toMovementGastos(gastos),
    ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    return {
      periodo: {
        type: period,
        from: startDate,
        to: endDate,
      },
      kpis: {
        ingresosTotales,
        gastosTotales,
        beneficioNeto: round2(ingresosTotales - gastosTotales),
        cobrosPendientesMatricula,
      },
      cobrosPendientes: {
        total: cobrosPendientesMatricula,
        totalFacturas: facturasPendientesMatricula.length,
      },
      flujoCaja: this.buildCashFlowSeries(
        facturasPagadas,
        gastos,
        startDate,
        endDate,
      ),
      distribucionIngresos: this.buildIncomeDistribution(facturasPagadas),
      movimientos,
    };
  }
}
