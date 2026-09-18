import dotenv from "dotenv";

import prisma from "../src/config/prisma.js";
import { tasaDgtConfig } from "../src/config/tasa-dgt.config.js";

dotenv.config();

const inicioDelDia = (fecha = new Date()) => {
  const value = new Date(fecha);
  value.setHours(0, 0, 0, 0);
  return value;
};

const finDelDia = (fecha = new Date()) => {
  const value = new Date(fecha);
  value.setHours(23, 59, 59, 999);
  return value;
};

const normalizarLicenciaObjetivo = (valor) =>
  String(valor || "")
    .trim()
    .toUpperCase() || "B";

const FALTAS_CATALOGO_PRACTICO = {
  leves: [
    "Uso tardío del intermitente",
    "Posicionamiento mejorable en carril",
    "Distancia de seguridad ajustada",
    "Reducción de velocidad mejorable",
    "Observación lateral incompleta",
    "Anticipación mejorable en cruce",
    "Control de embrague mejorable",
    "Corrección leve de trayectoria",
    "Señalización tardía en maniobra",
    "Entrada amplia en giro",
    "Alineación mejorable al estacionar",
    "Control de velocidad irregular",
  ],
  deficientes: [
    "Incorporación con observación insuficiente",
    "Prioridad no respetada sin riesgo extremo",
    "Velocidad inadecuada en tramo crítico",
    "Maniobra con control insuficiente",
    "Distancia de seguridad claramente insuficiente",
    "Frenada tardía ante señalización",
  ],
  eliminatorias: [
    "No respetar semáforo en rojo",
    "No ceder el paso con riesgo",
    "Invadir carril contrario con peligro",
    "No detenerse en stop obligatorio",
    "Intervención del examinador por seguridad",
  ],
};

const parseArgs = (argv) => {
  const args = {
    date: new Date(),
    seed: null,
    onlyIds: null,
    limit: null,
    exactCount: null,
    dryRun: false,
    batchId: null,
    operator: null,
    reason: null,
    noConsumeConvocatoria: false,
  };

  for (const token of argv.slice(2)) {
    if (!token.startsWith("--")) {
      continue;
    }

    const [key, ...valueParts] = token.slice(2).split("=");
    const value = valueParts.join("=");

    switch (key) {
      case "date":
        args.date = new Date(value);
        break;
      case "seed":
        args.seed = value || null;
        break;
      case "only-ids":
        args.onlyIds = (value || "")
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);
        break;
      case "limit":
        args.limit = Number(value);
        break;
      case "exact-count":
        args.exactCount = Number(value);
        break;
      case "dry-run":
        args.dryRun = true;
        break;
      case "batch-id":
        args.batchId = value || null;
        break;
      case "operator":
        args.operator = value || null;
        break;
      case "reason":
        args.reason = value || null;
        break;
      case "no-consume-convocatoria":
        args.noConsumeConvocatoria = true;
        break;
      default:
        break;
    }
  }

  if (Number.isNaN(args.date.getTime())) {
    throw new Error("Parametro --date invalido. Usa formato YYYY-MM-DD.");
  }

  if (
    args.limit !== null &&
    (!Number.isInteger(args.limit) || args.limit <= 0)
  ) {
    throw new Error("Parametro --limit invalido. Debe ser entero > 0.");
  }

  if (
    args.exactCount !== null &&
    (!Number.isInteger(args.exactCount) || args.exactCount < 0)
  ) {
    throw new Error("Parametro --exact-count invalido. Debe ser entero >= 0.");
  }

  return args;
};

const toSeedInt = (seed) => {
  if (!seed) {
    return Date.now() >>> 0;
  }

  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const createSeededRandom = (seedValue) => {
  let state = toSeedInt(seedValue);

  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const randomIntBetween = (randomFn, min, max) =>
  Math.floor(randomFn() * (max - min + 1)) + min;

const getDateKey = (value) => {
  const date = new Date(value || Date.now());
  return date.toISOString().slice(0, 10);
};

const pickFaultDetails = (randomFn, catalog, count, prefix) => {
  if (!Number.isInteger(count) || count <= 0) {
    return [];
  }

  const pool = [...catalog];
  const picked = [];

  for (let index = 0; index < count; index += 1) {
    if (pool.length > 0) {
      const pickIndex = randomIntBetween(randomFn, 0, pool.length - 1);
      picked.push(pool.splice(pickIndex, 1)[0]);
    } else {
      picked.push(`${prefix} ${index + 1}`);
    }
  }

  return picked;
};

const enrichFaltasWithDetail = (randomFn, faltas) => ({
  ...faltas,
  faltasLevesDetalle: pickFaultDetails(
    randomFn,
    FALTAS_CATALOGO_PRACTICO.leves,
    faltas.faltasLeves,
    "Falta leve",
  ),
  faltasDeficientesDetalle: pickFaultDetails(
    randomFn,
    FALTAS_CATALOGO_PRACTICO.deficientes,
    faltas.faltasDeficientes,
    "Falta deficiente",
  ),
  faltasEliminatoriasDetalle: pickFaultDetails(
    randomFn,
    FALTAS_CATALOGO_PRACTICO.eliminatorias,
    faltas.faltasEliminatorias,
    "Falta eliminatoria",
  ),
});

const shouldBeNoAptoPractico = ({
  faltasLeves,
  faltasDeficientes,
  faltasEliminatorias,
}) =>
  faltasEliminatorias >= 1 ||
  faltasDeficientes >= 2 ||
  (faltasDeficientes === 1 && faltasLeves >= 5) ||
  faltasLeves >= 10;

const getMotivoNoAptoPractico = ({
  faltasLeves,
  faltasDeficientes,
  faltasEliminatorias,
}) => {
  if (faltasEliminatorias >= 1) return "ELIMINATORIA";
  if (faltasDeficientes >= 2) return "DOBLE_DEFICIENTE";
  if (faltasDeficientes === 1 && faltasLeves >= 5)
    return "DEFICIENTE_MAS_LEVES";
  if (faltasLeves >= 10) return "LEVES";
  return null;
};

const generarFaltasApto = (randomFn) => {
  const templates = [
    {
      faltasLeves: randomIntBetween(randomFn, 0, 4),
      faltasDeficientes: 0,
      faltasEliminatorias: 0,
    },
    {
      faltasLeves: randomIntBetween(randomFn, 0, 3),
      faltasDeficientes: 1,
      faltasEliminatorias: 0,
    },
    {
      faltasLeves: randomIntBetween(randomFn, 0, 8),
      faltasDeficientes: 0,
      faltasEliminatorias: 0,
    },
  ];

  return templates[randomIntBetween(randomFn, 0, templates.length - 1)];
};

const generarFaltasNoApto = (randomFn) => {
  const scenario = randomIntBetween(randomFn, 1, 4);

  if (scenario === 1) {
    return {
      faltasLeves: randomIntBetween(randomFn, 0, 4),
      faltasDeficientes: 0,
      faltasEliminatorias: 1,
    };
  }

  if (scenario === 2) {
    return {
      faltasLeves: randomIntBetween(randomFn, 0, 3),
      faltasDeficientes: 2,
      faltasEliminatorias: 0,
    };
  }

  if (scenario === 3) {
    return {
      faltasLeves: randomIntBetween(randomFn, 5, 8),
      faltasDeficientes: 1,
      faltasEliminatorias: 0,
    };
  }

  return {
    faltasLeves: randomIntBetween(randomFn, 10, 12),
    faltasDeficientes: 0,
    faltasEliminatorias: 0,
  };
};

const buildBatchId = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `PEX-${y}${m}${d}-${hh}${mm}${ss}`;
};

const lockProcess = async (tx) => {
  await tx.$executeRawUnsafe(
    "SELECT pg_advisory_xact_lock(hashtext('practical_exam_process_lock'))",
  );
};

const getCandidatas = async (tx, fechaObjetivoFin, onlyIds, limit) => {
  const where = {
    tipo: "PRACTICO",
    estado: {
      in: ["SOLICITADO", "PROGRAMADO", "PENDIENTE"],
    },
    fechaProgramada: {
      lte: fechaObjetivoFin,
    },
  };

  if (onlyIds && onlyIds.length > 0) {
    where.id = {
      in: onlyIds,
    };
  }

  return tx.solicitudExamen.findMany({
    where,
    orderBy: [
      {
        fechaProgramada: "asc",
      },
      {
        fechaSolicitud: "asc",
      },
      {
        id: "asc",
      },
    ],
    take: limit || undefined,
  });
};

const getPagoTasaInfo = async (tx, alumnoId, conceptoPattern) => {
  const matriculaPagada = await tx.matricula.findFirst({
    where: {
      alumnoId,
      estado: "PAGADA",
    },
    orderBy: {
      fechaPago: "desc",
    },
  });

  if (!matriculaPagada) {
    return null;
  }

  const licenciaObjetivo = normalizarLicenciaObjetivo(matriculaPagada.licencia);

  const pagoTasa = await tx.pago.findFirst({
    where: {
      alumnoId,
      tipo: "TASA_DGT_21",
      permiso: licenciaObjetivo,
      estado: "PAGADO",
      concepto: {
        contains: conceptoPattern,
        mode: "insensitive",
      },
    },
    orderBy: [{ fechaPago: "desc" }, { fechaCreacion: "desc" }],
  });

  return pagoTasa;
};

const construirPlanAplicacion = async (tx, candidatas, randomFn, options) => {
  const candidatasUnicas = [];
  const candidatasDuplicadas = [];
  const seenPerDay = new Set();

  for (const solicitud of candidatas) {
    const key = `${solicitud.alumnoId}|${getDateKey(
      solicitud.fechaProgramada || solicitud.fechaSolicitud,
    )}`;

    if (seenPerDay.has(key)) {
      candidatasDuplicadas.push(solicitud);
      continue;
    }

    seenPerDay.add(key);
    candidatasUnicas.push(solicitud);
  }

  const solicitudes = [];
  const pagoUpdatesByPagoId = new Map();

  for (const solicitud of candidatasUnicas) {
    const targetApto = randomFn() < 0.6;
    const faltasBase = targetApto
      ? generarFaltasApto(randomFn)
      : generarFaltasNoApto(randomFn);
    const faltas = enrichFaltasWithDetail(randomFn, faltasBase);
    const noApto = shouldBeNoAptoPractico(faltas);
    const afterEstado = noApto ? "NO_APTO" : "APTO";

    solicitudes.push({
      solicitudId: solicitud.id,
      alumnoId: solicitud.alumnoId,
      beforeEstado: solicitud.estado,
      beforeErrores: solicitud.erroresExamen,
      beforeAciertos: solicitud.aciertosExamen,
      beforeFaltasLeves: solicitud.faltasLeves,
      beforeFaltasDeficientes: solicitud.faltasDeficientes,
      beforeFaltasEliminatorias: solicitud.faltasEliminatorias,
      beforeFaltasLevesDetalle: solicitud.faltasLevesDetalle || [],
      beforeFaltasDeficientesDetalle: solicitud.faltasDeficientesDetalle || [],
      beforeFaltasEliminatoriasDetalle:
        solicitud.faltasEliminatoriasDetalle || [],
      beforeMotivoNoApto: solicitud.motivoNoApto,
      afterEstado,
      afterErrores: null,
      afterAciertos: null,
      afterFaltasLeves: faltas.faltasLeves,
      afterFaltasDeficientes: faltas.faltasDeficientes,
      afterFaltasEliminatorias: faltas.faltasEliminatorias,
      afterFaltasLevesDetalle: faltas.faltasLevesDetalle,
      afterFaltasDeficientesDetalle: faltas.faltasDeficientesDetalle,
      afterFaltasEliminatoriasDetalle: faltas.faltasEliminatoriasDetalle,
      afterMotivoNoApto: noApto ? getMotivoNoAptoPractico(faltas) : null,
    });

    if (afterEstado !== "NO_APTO" || options.noConsumeConvocatoria) {
      continue;
    }

    const pagoTasa = await getPagoTasaInfo(
      tx,
      solicitud.alumnoId,
      tasaDgtConfig.conceptoPattern,
    );

    if (!pagoTasa) {
      continue;
    }

    const incluidas = Number(pagoTasa.convocatoriasIncluidas || 0);
    const consumidas = Number(pagoTasa.convocatoriasConsumidas || 0);

    if (consumidas >= incluidas) {
      continue;
    }

    const alreadyPlanned = pagoUpdatesByPagoId.get(pagoTasa.id);
    if (alreadyPlanned) {
      alreadyPlanned.afterConvocatoriasConsumidas += 1;
      continue;
    }

    pagoUpdatesByPagoId.set(pagoTasa.id, {
      pagoId: pagoTasa.id,
      alumnoId: solicitud.alumnoId,
      beforeConvocatoriasConsumidas: consumidas,
      afterConvocatoriasConsumidas: consumidas + 1,
      applied: true,
    });
  }

  for (const duplicada of candidatasDuplicadas) {
    solicitudes.push({
      solicitudId: duplicada.id,
      alumnoId: duplicada.alumnoId,
      beforeEstado: duplicada.estado,
      beforeErrores: duplicada.erroresExamen,
      beforeAciertos: duplicada.aciertosExamen,
      beforeFaltasLeves: duplicada.faltasLeves,
      beforeFaltasDeficientes: duplicada.faltasDeficientes,
      beforeFaltasEliminatorias: duplicada.faltasEliminatorias,
      beforeFaltasLevesDetalle: duplicada.faltasLevesDetalle || [],
      beforeFaltasDeficientesDetalle: duplicada.faltasDeficientesDetalle || [],
      beforeFaltasEliminatoriasDetalle:
        duplicada.faltasEliminatoriasDetalle || [],
      beforeMotivoNoApto: duplicada.motivoNoApto,
      afterEstado: "CANCELADO",
      afterErrores: duplicada.erroresExamen,
      afterAciertos: duplicada.aciertosExamen,
      afterFaltasLeves: Number(duplicada.faltasLeves || 0),
      afterFaltasDeficientes: Number(duplicada.faltasDeficientes || 0),
      afterFaltasEliminatorias: Number(duplicada.faltasEliminatorias || 0),
      afterFaltasLevesDetalle: duplicada.faltasLevesDetalle || [],
      afterFaltasDeficientesDetalle: duplicada.faltasDeficientesDetalle || [],
      afterFaltasEliminatoriasDetalle:
        duplicada.faltasEliminatoriasDetalle || [],
      afterMotivoNoApto: duplicada.motivoNoApto,
    });
  }

  const pagos = Array.from(pagoUpdatesByPagoId.values());

  const summary = solicitudes.reduce(
    (acc, item) => {
      acc.procesadas += 1;
      acc.faltasLevesTotales += item.afterFaltasLeves;
      acc.faltasDeficientesTotales += item.afterFaltasDeficientes;
      acc.faltasEliminatoriasTotales += item.afterFaltasEliminatorias;

      if (item.afterEstado === "APTO") {
        acc.aptos += 1;
      } else if (item.afterEstado === "NO_APTO") {
        acc.noAptos += 1;
      } else if (item.afterEstado === "CANCELADO") {
        acc.canceladasDuplicadas += 1;
      }

      return acc;
    },
    {
      procesadas: 0,
      aptos: 0,
      noAptos: 0,
      canceladasDuplicadas: 0,
      faltasLevesTotales: 0,
      faltasDeficientesTotales: 0,
      faltasEliminatoriasTotales: 0,
      pagosActualizados: pagos.length,
    },
  );

  return {
    solicitudes,
    pagos,
    summary,
  };
};

const imprimirResumen = (payload) => {
  console.log("Procesado practico con snapshot");
  console.log(`- Batch ID: ${payload.batchId}`);
  console.log(`- Modo: ${payload.mode}`);
  console.log(`- Dry run: ${payload.dryRun ? "SI" : "NO"}`);
  console.log(`- Fecha objetivo: ${payload.targetDate}`);
  console.log(`- Procesadas: ${payload.summary.procesadas}`);
  console.log(`- Aptos: ${payload.summary.aptos}`);
  console.log(`- No aptos: ${payload.summary.noAptos}`);
  console.log(
    `- Canceladas por duplicidad: ${payload.summary.canceladasDuplicadas}`,
  );
  console.log(`- Faltas leves totales: ${payload.summary.faltasLevesTotales}`);
  console.log(
    `- Faltas deficientes totales: ${payload.summary.faltasDeficientesTotales}`,
  );
  console.log(
    `- Faltas eliminatorias totales: ${payload.summary.faltasEliminatoriasTotales}`,
  );
  console.log(`- Pagos actualizados: ${payload.summary.pagosActualizados}`);
};

async function main() {
  const args = parseArgs(process.argv);
  const batchId = args.batchId || buildBatchId();
  const randomFn = createSeededRandom(args.seed || batchId);
  const fechaObjetivo = inicioDelDia(args.date);
  const fechaObjetivoFin = finDelDia(args.date);

  const result = await prisma.$transaction(async (tx) => {
    await lockProcess(tx);

    const existingBatch = await tx.practicalExamProcessBatch.findUnique({
      where: { id: batchId },
    });

    if (existingBatch) {
      throw new Error(`Ya existe un batch con id ${batchId}.`);
    }

    const candidatas = await getCandidatas(
      tx,
      fechaObjetivoFin,
      args.onlyIds,
      args.limit,
    );

    if (args.exactCount !== null && candidatas.length !== args.exactCount) {
      throw new Error(
        `Exact count no cumplido. Esperadas: ${args.exactCount}. Encontradas: ${candidatas.length}.`,
      );
    }

    const plan = await construirPlanAplicacion(tx, candidatas, randomFn, {
      noConsumeConvocatoria: args.noConsumeConvocatoria,
    });

    const mode = args.dryRun ? "DRY_RUN" : "APPLY";

    const basePayload = {
      batchId,
      mode,
      dryRun: args.dryRun,
      targetDate: fechaObjetivo.toISOString().slice(0, 10),
      summary: plan.summary,
      solicitudes: plan.solicitudes,
      pagos: plan.pagos,
    };

    if (args.dryRun) {
      return basePayload;
    }

    await tx.practicalExamProcessBatch.create({
      data: {
        id: batchId,
        status: "APPLIED",
        mode,
        targetDate: fechaObjetivo,
        seed: args.seed || batchId,
        operator: args.operator,
        reason: args.reason,
        dryRun: false,
        summary: plan.summary,
        appliedAt: new Date(),
      },
    });

    if (plan.solicitudes.length > 0) {
      await tx.practicalExamProcessSolicitud.createMany({
        data: plan.solicitudes.map((item) => ({
          batchId,
          solicitudId: item.solicitudId,
          alumnoId: item.alumnoId,
          beforeEstado: item.beforeEstado,
          beforeErrores: item.beforeErrores,
          beforeAciertos: item.beforeAciertos,
          beforeFaltasLeves: item.beforeFaltasLeves,
          beforeFaltasDeficientes: item.beforeFaltasDeficientes,
          beforeFaltasEliminatorias: item.beforeFaltasEliminatorias,
          beforeFaltasLevesDetalle: item.beforeFaltasLevesDetalle,
          beforeFaltasDeficientesDetalle: item.beforeFaltasDeficientesDetalle,
          beforeFaltasEliminatoriasDetalle:
            item.beforeFaltasEliminatoriasDetalle,
          beforeMotivoNoApto: item.beforeMotivoNoApto,
          afterEstado: item.afterEstado,
          afterErrores: item.afterErrores,
          afterAciertos: item.afterAciertos,
          afterFaltasLeves: item.afterFaltasLeves,
          afterFaltasDeficientes: item.afterFaltasDeficientes,
          afterFaltasEliminatorias: item.afterFaltasEliminatorias,
          afterFaltasLevesDetalle: item.afterFaltasLevesDetalle,
          afterFaltasDeficientesDetalle: item.afterFaltasDeficientesDetalle,
          afterFaltasEliminatoriasDetalle: item.afterFaltasEliminatoriasDetalle,
          afterMotivoNoApto: item.afterMotivoNoApto,
        })),
      });

      for (const item of plan.solicitudes) {
        const updatedCount = await tx.solicitudExamen.updateMany({
          where: {
            id: item.solicitudId,
            tipo: "PRACTICO",
            estado: {
              in: ["SOLICITADO", "PROGRAMADO", "PENDIENTE"],
            },
          },
          data: {
            estado: item.afterEstado,
            erroresExamen: item.afterErrores,
            aciertosExamen: item.afterAciertos,
            faltasLeves: item.afterFaltasLeves,
            faltasDeficientes: item.afterFaltasDeficientes,
            faltasEliminatorias: item.afterFaltasEliminatorias,
            faltasLevesDetalle: item.afterFaltasLevesDetalle,
            faltasDeficientesDetalle: item.afterFaltasDeficientesDetalle,
            faltasEliminatoriasDetalle: item.afterFaltasEliminatoriasDetalle,
            motivoNoApto: item.afterMotivoNoApto,
            observaciones:
              item.afterEstado === "CANCELADO"
                ? "Cancelada automáticamente por duplicidad de solicitud práctica en la misma fecha."
                : undefined,
          },
        });

        if (updatedCount.count === 0 || item.afterEstado === "CANCELADO") {
          continue;
        }

        const updated = await tx.solicitudExamen.findUnique({
          where: {
            id: item.solicitudId,
          },
        });

        if (!updated) {
          continue;
        }

        const examen = await tx.examen.create({
          data: {
            alumnoId: updated.alumnoId,
            tipo: "PRACTICO",
            fecha: updated.fechaProgramada || new Date(),
            estado: updated.estado === "APTO" ? "APROBADO" : "SUSPENDIDO",
          },
        });

        await tx.practicalExamProcessSolicitud.updateMany({
          where: {
            batchId,
            solicitudId: item.solicitudId,
          },
          data: {
            createdExamenId: examen.id,
          },
        });
      }
    }

    if (plan.pagos.length > 0) {
      await tx.practicalExamProcessPago.createMany({
        data: plan.pagos.map((item) => ({
          batchId,
          pagoId: item.pagoId,
          alumnoId: item.alumnoId,
          beforeConvocatoriasConsumidas: item.beforeConvocatoriasConsumidas,
          afterConvocatoriasConsumidas: item.afterConvocatoriasConsumidas,
          applied: true,
        })),
      });

      for (const item of plan.pagos) {
        await tx.pago.update({
          where: {
            id: item.pagoId,
          },
          data: {
            convocatoriasConsumidas: item.afterConvocatoriasConsumidas,
          },
        });
      }
    }

    return basePayload;
  });

  imprimirResumen(result);
}

main()
  .catch((error) => {
    console.error(
      "Error en apply de examenes practicos:",
      error.message || error,
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
