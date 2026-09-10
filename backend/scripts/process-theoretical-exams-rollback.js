import dotenv from "dotenv";

import prisma from "../src/config/prisma.js";

dotenv.config();

const parseArgs = (argv) => {
  const args = {
    batchId: null,
    dryRun: false,
    strict: true,
    force: false,
    operator: null,
    reason: null,
  };

  for (const token of argv.slice(2)) {
    if (!token.startsWith("--")) {
      continue;
    }

    const [key, ...valueParts] = token.slice(2).split("=");
    const value = valueParts.join("=");

    switch (key) {
      case "batch-id":
        args.batchId = value || null;
        break;
      case "dry-run":
        args.dryRun = true;
        break;
      case "strict":
        args.strict = value !== "false";
        break;
      case "force":
        args.force = true;
        break;
      case "operator":
        args.operator = value || null;
        break;
      case "reason":
        args.reason = value || null;
        break;
      default:
        break;
    }
  }

  if (!args.batchId) {
    throw new Error("Parametro --batch-id es obligatorio.");
  }

  if (args.force) {
    args.strict = false;
  }

  return args;
};

const lockProcess = async (tx) => {
  await tx.$executeRawUnsafe(
    "SELECT pg_advisory_xact_lock(hashtext('theoretical_exam_process_lock'))",
  );
};

const buildConflicts = async (tx, snapshotSolicitudes, snapshotPagos) => {
  const conflicts = [];

  for (const item of snapshotSolicitudes) {
    const current = await tx.solicitudExamen.findUnique({
      where: { id: item.solicitudId },
      select: {
        id: true,
        estado: true,
        erroresExamen: true,
        aciertosExamen: true,
      },
    });

    if (!current) {
      conflicts.push({
        type: "SOLICITUD_MISSING",
        id: item.solicitudId,
        message: "La solicitud no existe actualmente.",
      });
      continue;
    }

    if (
      current.estado !== item.afterEstado ||
      (current.erroresExamen ?? null) !== (item.afterErrores ?? null) ||
      (current.aciertosExamen ?? null) !== (item.afterAciertos ?? null)
    ) {
      conflicts.push({
        type: "SOLICITUD_CHANGED",
        id: item.solicitudId,
        message:
          "La solicitud no coincide con el estado AFTER del snapshot. Posible modificacion externa.",
      });
    }
  }

  for (const item of snapshotPagos) {
    const current = await tx.pago.findUnique({
      where: { id: item.pagoId },
      select: {
        id: true,
        convocatoriasConsumidas: true,
      },
    });

    if (!current) {
      conflicts.push({
        type: "PAGO_MISSING",
        id: item.pagoId,
        message: "El pago no existe actualmente.",
      });
      continue;
    }

    if (
      Number(current.convocatoriasConsumidas ?? 0) !==
      Number(item.afterConvocatoriasConsumidas ?? 0)
    ) {
      conflicts.push({
        type: "PAGO_CHANGED",
        id: item.pagoId,
        message:
          "El pago no coincide con convocatorias AFTER del snapshot. Posible modificacion externa.",
      });
    }
  }

  return conflicts;
};

const printResult = (result) => {
  console.log("Rollback de examenes teoricos");
  console.log(`- Batch ID: ${result.batchId}`);
  console.log(`- Dry run: ${result.dryRun ? "SI" : "NO"}`);
  console.log(`- Strict: ${result.strict ? "SI" : "NO"}`);
  console.log(`- Solicitudes revertidas: ${result.revertedSolicitudes}`);
  console.log(`- Pagos revertidos: ${result.revertedPagos}`);
  console.log(`- Conflictos: ${result.conflicts.length}`);

  if (result.conflicts.length > 0) {
    console.log("- Detalle conflictos:");
    for (const item of result.conflicts) {
      console.log(`  * [${item.type}] ${item.id}: ${item.message}`);
    }
  }
};

async function main() {
  const args = parseArgs(process.argv);

  const result = await prisma.$transaction(async (tx) => {
    await lockProcess(tx);

    const batch = await tx.theoreticalExamProcessBatch.findUnique({
      where: { id: args.batchId },
      include: {
        solicitudes: true,
        pagos: true,
      },
    });

    if (!batch) {
      throw new Error(`No existe batch con id ${args.batchId}.`);
    }

    if (batch.status === "ROLLED_BACK") {
      return {
        batchId: batch.id,
        dryRun: args.dryRun,
        strict: args.strict,
        revertedSolicitudes: 0,
        revertedPagos: 0,
        conflicts: [],
        alreadyRolledBack: true,
      };
    }

    if (batch.status !== "APPLIED") {
      throw new Error(
        `Estado de batch invalido para rollback: ${batch.status}. Esperado: APPLIED.`,
      );
    }

    const conflicts = await buildConflicts(tx, batch.solicitudes, batch.pagos);

    if (args.strict && conflicts.length > 0) {
      throw new Error(
        `Rollback cancelado por conflictos (${conflicts.length}) con --strict habilitado.`,
      );
    }

    if (args.dryRun) {
      return {
        batchId: batch.id,
        dryRun: true,
        strict: args.strict,
        revertedSolicitudes: batch.solicitudes.length,
        revertedPagos: batch.pagos.length,
        conflicts,
        alreadyRolledBack: false,
      };
    }

    let revertedSolicitudes = 0;
    let revertedPagos = 0;

    for (const item of batch.solicitudes) {
      const hasConflict = conflicts.some(
        (conflict) =>
          conflict.id === item.solicitudId &&
          (conflict.type === "SOLICITUD_CHANGED" ||
            conflict.type === "SOLICITUD_MISSING"),
      );

      if (hasConflict && !args.force) {
        continue;
      }

      if (!hasConflict) {
        await tx.solicitudExamen.update({
          where: {
            id: item.solicitudId,
          },
          data: {
            estado: item.beforeEstado,
            erroresExamen: item.beforeErrores,
            aciertosExamen: item.beforeAciertos,
          },
        });
        revertedSolicitudes += 1;
      }

      await tx.theoreticalExamProcessSolicitud.update({
        where: {
          id: item.id,
        },
        data: {
          revertedAt: new Date(),
          conflictReason: hasConflict
            ? "Conflicto detectado al revertir solicitud"
            : null,
        },
      });
    }

    for (const item of batch.pagos) {
      const hasConflict = conflicts.some(
        (conflict) =>
          conflict.id === item.pagoId &&
          (conflict.type === "PAGO_CHANGED" ||
            conflict.type === "PAGO_MISSING"),
      );

      if (hasConflict && !args.force) {
        continue;
      }

      if (!hasConflict) {
        await tx.pago.update({
          where: {
            id: item.pagoId,
          },
          data: {
            convocatoriasConsumidas: item.beforeConvocatoriasConsumidas,
          },
        });
        revertedPagos += 1;
      }

      await tx.theoreticalExamProcessPago.update({
        where: {
          id: item.id,
        },
        data: {
          revertedAt: new Date(),
          conflictReason: hasConflict
            ? "Conflicto detectado al revertir pago"
            : null,
        },
      });
    }

    const status =
      conflicts.length > 0 && !args.force ? "CONFLICTED" : "ROLLED_BACK";

    await tx.theoreticalExamProcessBatch.update({
      where: {
        id: batch.id,
      },
      data: {
        status,
        rolledBackAt: new Date(),
        reason: args.reason || batch.reason,
        operator: args.operator || batch.operator,
      },
    });

    return {
      batchId: batch.id,
      dryRun: false,
      strict: args.strict,
      revertedSolicitudes,
      revertedPagos,
      conflicts,
      alreadyRolledBack: false,
    };
  });

  if (result.alreadyRolledBack) {
    console.log(`Batch ${result.batchId} ya estaba revertido.`);
    return;
  }

  printResult(result);
}

main()
  .catch((error) => {
    console.error(
      "Error en rollback de examenes teoricos:",
      error.message || error,
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
