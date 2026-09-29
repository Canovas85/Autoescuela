import "dotenv/config";

import prisma from "../src/config/prisma.js";

const parseArgs = (argv) => {
  const args = {
    studentName: "David Ruiz Cortes",
  };

  for (const token of argv.slice(2)) {
    if (!token.startsWith("--")) {
      continue;
    }

    const [key, ...valueParts] = token.slice(2).split("=");
    const value = valueParts.join("=").trim();

    if (key === "student-name" && value) {
      args.studentName = value;
    }
  }

  return args;
};

const toTokens = (name) =>
  String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

async function repairStudent(tx, alumno) {
  const aptoCount = await tx.solicitudExamen.count({
    where: {
      alumnoId: alumno.id,
      tipo: "PRACTICO",
      estado: {
        in: ["APTO", "APROBADO"],
      },
    },
  });

  if (aptoCount === 0) {
    return {
      alumnoId: alumno.id,
      alumnoNombre: alumno.usuario?.nombre || "-",
      skipped: true,
      reason: "Sin resultado APTO práctico",
      pagosEliminados: 0,
      facturasEliminadas: 0,
      solicitudesDesvinculadas: 0,
    };
  }

  const pagosPendientes = await tx.pago.findMany({
    where: {
      alumnoId: alumno.id,
      tipo: "EXAMEN_PRACTICO_GASTOS",
      estado: "PENDIENTE",
    },
    select: {
      id: true,
      numeroFacturaPago: true,
    },
  });

  let solicitudesDesvinculadas = 0;
  let facturasEliminadas = 0;
  let pagosEliminados = 0;

  for (const pago of pagosPendientes) {
    const unlinkResult = await tx.solicitudExamen.updateMany({
      where: {
        alumnoId: alumno.id,
        tipo: "PRACTICO",
        pagoGastoPracticoId: pago.id,
      },
      data: {
        pagoGastoPracticoId: null,
      },
    });

    solicitudesDesvinculadas += unlinkResult.count;

    if (pago.numeroFacturaPago) {
      const deletedFacturas = await tx.factura.deleteMany({
        where: {
          numero: pago.numeroFacturaPago,
          alumnoId: alumno.id,
          estado: {
            in: ["EMITIDA", "PENDIENTE", "ANULADA"],
          },
        },
      });

      facturasEliminadas += deletedFacturas.count;
    }

    await tx.pago.delete({
      where: {
        id: pago.id,
      },
    });

    pagosEliminados += 1;
  }

  return {
    alumnoId: alumno.id,
    alumnoNombre: alumno.usuario?.nombre || "-",
    skipped: false,
    pagosEliminados,
    facturasEliminadas,
    solicitudesDesvinculadas,
  };
}

async function main() {
  const args = parseArgs(process.argv);
  const tokens = toTokens(args.studentName);

  if (tokens.length === 0) {
    throw new Error(
      "Debes indicar un nombre de alumno válido en --student-name",
    );
  }

  const alumnos = await prisma.alumno.findMany({
    where: {
      usuario: {
        nombre: {
          contains: tokens[0],
          mode: "insensitive",
        },
      },
    },
    include: {
      usuario: {
        select: {
          nombre: true,
        },
      },
    },
  });

  const target = alumnos.filter((alumno) => {
    const source = String(alumno.usuario?.nombre || "").toLowerCase();
    return tokens.every((token) => source.includes(token.toLowerCase()));
  });

  if (target.length === 0) {
    throw new Error(`No se encontró ningún alumno para: ${args.studentName}`);
  }

  const summary = [];

  for (const alumno of target) {
    const result = await prisma.$transaction((tx) => repairStudent(tx, alumno));
    summary.push(result);
  }

  console.log("Reparación de gasto práctico tras APTO completada");

  for (const item of summary) {
    if (item.skipped) {
      console.log(
        `- ${item.alumnoNombre} (${item.alumnoId}): omitido - ${item.reason}`,
      );
      continue;
    }

    console.log(
      `- ${item.alumnoNombre} (${item.alumnoId}): pagos eliminados=${item.pagosEliminados}, facturas eliminadas=${item.facturasEliminadas}, solicitudes desvinculadas=${item.solicitudesDesvinculadas}`,
    );
  }
}

main()
  .catch((error) => {
    console.error(
      "Error reparando gasto práctico tras APTO:",
      error.message || error,
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
