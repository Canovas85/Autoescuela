import dotenv from "dotenv";

import prisma from "../src/config/prisma.js";
import { tasaDgtConfig } from "../src/config/tasa-dgt.config.js";

dotenv.config();

const TOTAL_PREGUNTAS_EXAMEN_TEORICO = 30;

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

const calcularAciertosTeorico = (erroresExamen) =>
  Math.max(TOTAL_PREGUNTAS_EXAMEN_TEORICO - Number(erroresExamen || 0), 0);

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

const buildBatchId = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `EXAM-${y}${m}${d}-${hh}${mm}${ss}`;
};

const lockProcess = async (tx) => {
  await tx.$executeRawUnsafe(
    "SELECT pg_advisory_xact_lock(hashtext('theoretical_exam_process_lock'))",
  );
};

const getCandidatas = async (tx, fechaObjetivoFin, onlyIds, limit) => {
  const where = {
    tipo: "TEORICO",
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
    orderBy: {
      fechaProgramada: "asc",
    },
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

  if (!pagoTasa) {
    return null;
  }

  return pagoTasa;
};

const construirPlanAplicacion = async (tx, candidatas, randomFn, options) => {
  const solicitudes = [];
  const pagoUpdatesByPagoId = new Map();

  for (const solicitud of candidatas) {
    const erroresExamen = Math.floor(randomFn() * 11);
    const aciertosExamen = calcularAciertosTeorico(erroresExamen);
    const afterEstado = erroresExamen <= 3 ? "APTO" : "NO_APTO";

    solicitudes.push({
      solicitudId: solicitud.id,
      alumnoId: solicitud.alumnoId,
      beforeEstado: solicitud.estado,
      beforeErrores: solicitud.erroresExamen,
      beforeAciertos: solicitud.aciertosExamen,
      afterEstado,
      afterErrores: erroresExamen,
      afterAciertos: aciertosExamen,
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

  const pagos = Array.from(pagoUpdatesByPagoId.values());

  const summary = solicitudes.reduce(
    (acc, item) => {
      acc.procesadas += 1;
      acc.aciertosTotales += item.afterAciertos;
      acc.erroresTotales += item.afterErrores;

      if (item.afterEstado === "APTO") {
        acc.aptos += 1;
      } else {
        acc.noAptos += 1;
      }

      return acc;
    },
    {
      procesadas: 0,
      aptos: 0,
      noAptos: 0,
      aciertosTotales: 0,
      erroresTotales: 0,
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
  console.log("Procesado teorico con snapshot");
  console.log(`- Batch ID: ${payload.batchId}`);
  console.log(`- Modo: ${payload.mode}`);
  console.log(`- Dry run: ${payload.dryRun ? "SI" : "NO"}`);
  console.log(`- Fecha objetivo: ${payload.targetDate}`);
  console.log(`- Procesadas: ${payload.summary.procesadas}`);
  console.log(`- Aptos: ${payload.summary.aptos}`);
  console.log(`- No aptos: ${payload.summary.noAptos}`);
  console.log(`- Aciertos totales: ${payload.summary.aciertosTotales}`);
  console.log(`- Errores totales: ${payload.summary.erroresTotales}`);
  console.log(`- Pagos actualizados: ${payload.summary.pagosActualizados}`);

  if (payload.solicitudes.length > 0) {
    console.log("- Solicitudes actualizadas:");
    for (const item of payload.solicitudes) {
      console.log(
        `  * ${item.solicitudId} (${item.alumnoId}): ${item.beforeEstado} -> ${item.afterEstado}, errores ${item.beforeErrores ?? "null"} -> ${item.afterErrores}, aciertos ${item.beforeAciertos ?? "null"} -> ${item.afterAciertos}`,
      );
    }
  }

  if (payload.pagos.length > 0) {
    console.log("- Pagos con convocatorias consumidas:");
    for (const item of payload.pagos) {
      console.log(
        `  * ${item.pagoId} (${item.alumnoId}): ${item.beforeConvocatoriasConsumidas} -> ${item.afterConvocatoriasConsumidas}`,
      );
    }
  }
};

async function main() {
  const args = parseArgs(process.argv);
  const batchId = args.batchId || buildBatchId();
  const randomFn = createSeededRandom(args.seed || batchId);
  const fechaObjetivo = inicioDelDia(args.date);
  const fechaObjetivoFin = finDelDia(args.date);

  const result = await prisma.$transaction(async (tx) => {
    await lockProcess(tx);

    const existingBatch = await tx.theoreticalExamProcessBatch.findUnique({
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

    await tx.theoreticalExamProcessBatch.create({
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
      await tx.theoreticalExamProcessSolicitud.createMany({
        data: plan.solicitudes.map((item) => ({
          batchId,
          solicitudId: item.solicitudId,
          alumnoId: item.alumnoId,
          beforeEstado: item.beforeEstado,
          beforeErrores: item.beforeErrores,
          beforeAciertos: item.beforeAciertos,
          afterEstado: item.afterEstado,
          afterErrores: item.afterErrores,
          afterAciertos: item.afterAciertos,
        })),
      });

      for (const item of plan.solicitudes) {
        await tx.solicitudExamen.update({
          where: {
            id: item.solicitudId,
          },
          data: {
            estado: item.afterEstado,
            erroresExamen: item.afterErrores,
            aciertosExamen: item.afterAciertos,
          },
        });
      }
    }

    if (plan.pagos.length > 0) {
      await tx.theoreticalExamProcessPago.createMany({
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
      "Error en apply de examenes teoricos:",
      error.message || error,
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
