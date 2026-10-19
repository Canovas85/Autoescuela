import "dotenv/config";

import prisma from "../src/config/prisma.js";
import { resolveExpedientePhase } from "../src/shared/domain/expediente-phase.js";
import { normalizeLicenseCode } from "../src/shared/domain/exam-license-rules.js";

const parseArgs = (argv) => {
  const args = {
    dryRun: false,
    limit: null,
  };

  for (const token of argv.slice(2)) {
    if (token === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (!token.startsWith("--")) {
      continue;
    }

    const [key, ...valueParts] = token.slice(2).split("=");
    const value = valueParts.join("=").trim();

    if (key === "limit" && value) {
      const parsed = Number.parseInt(value, 10);

      if (Number.isInteger(parsed) && parsed > 0) {
        args.limit = parsed;
      }
    }
  }

  return args;
};

const toExpedienteContext = (alumno) => {
  const matriculaActual = alumno.matriculas?.[0] || null;
  const licenciaObjetivo = normalizeLicenseCode(
    matriculaActual?.licencia || alumno.tipoLicenciaObjetivo,
  );

  return {
    estadoExpediente: alumno.estadoExpediente,
    matriculaEstado: matriculaActual?.estado,
    licenciaObjetivo,
    solicitudesExamen: alumno.solicitudesExamen || [],
    clases: alumno.clases || [],
  };
};

async function main() {
  const args = parseArgs(process.argv);

  const alumnos = await prisma.alumno.findMany({
    orderBy: {
      id: "asc",
    },
    ...(args.limit
      ? {
          take: args.limit,
        }
      : {}),
    select: {
      id: true,
      tipoLicenciaObjetivo: true,
      estadoExpediente: true,
      matriculas: {
        select: {
          estado: true,
          licencia: true,
        },
        orderBy: {
          fechaCreacion: "desc",
        },
        take: 1,
      },
      solicitudesExamen: {
        select: {
          tipo: true,
          fasePractica: true,
          estado: true,
          fechaSolicitud: true,
          fechaProgramada: true,
        },
      },
      clases: {
        select: {
          estado: true,
          tipoClasePractica: true,
          hojaRuta: {
            select: {
              estado: true,
            },
          },
        },
      },
    },
  });

  const updates = [];

  for (const alumno of alumnos) {
    const phase = resolveExpedientePhase(toExpedienteContext(alumno));
    const current = String(alumno.estadoExpediente || "").toUpperCase();

    if (current === phase.code) {
      continue;
    }

    updates.push({
      alumnoId: alumno.id,
      from: current || "(VACIO)",
      to: phase.code,
    });
  }

  if (!args.dryRun && updates.length > 0) {
    await prisma.$transaction(
      updates.map((item) =>
        prisma.alumno.update({
          where: {
            id: item.alumnoId,
          },
          data: {
            estadoExpediente: item.to,
          },
        }),
      ),
    );
  }

  console.log("Migración IA-015 de estadoExpediente finalizada");
  console.log(`- Modo dry-run: ${args.dryRun ? "SI" : "NO"}`);
  console.log(`- Alumnos evaluados: ${alumnos.length}`);
  console.log(`- Alumnos a actualizar: ${updates.length}`);

  if (updates.length > 0) {
    const maxLines = 40;
    const shown = updates.slice(0, maxLines);

    console.log(`- Cambios mostrados: ${shown.length}/${updates.length}`);

    for (const item of shown) {
      console.log(`  ${item.alumnoId}: ${item.from} -> ${item.to}`);
    }

    if (updates.length > maxLines) {
      console.log(
        `  ... ${updates.length - maxLines} cambios adicionales no mostrados`,
      );
    }
  }
}

main()
  .catch((error) => {
    console.error("Error en migración IA-015 de estadoExpediente:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
