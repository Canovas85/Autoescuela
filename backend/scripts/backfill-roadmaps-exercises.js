import "dotenv/config";

import prisma from "../src/config/prisma.js";
import { HOJA_RUTA_EJERCICIOS_CATALOGO } from "../src/shared/domain/hoja-ruta-ejercicios.js";

const EXERCISE_IDS = HOJA_RUTA_EJERCICIOS_CATALOGO.map((item) => item.id);

const pickRandomExercises = () => {
  const min = 2;
  const max = 5;
  const count = Math.min(
    EXERCISE_IDS.length,
    Math.floor(Math.random() * (max - min + 1)) + min,
  );

  const shuffled = [...EXERCISE_IDS];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
};

async function run() {
  const rows = await prisma.hojaRuta.findMany({
    where: {
      estado: "REGISTRADA",
      ejerciciosRealizados: {
        isEmpty: true,
      },
    },
    select: {
      id: true,
    },
  });

  let updated = 0;

  for (const row of rows) {
    const ejercicios = pickRandomExercises();

    await prisma.hojaRuta.update({
      where: {
        id: row.id,
      },
      data: {
        ejerciciosRealizados: ejercicios,
      },
    });

    updated += 1;
  }

  console.log(
    `Backfill ejercicios hoja ruta completado. Actualizadas: ${updated}`,
  );
}

run()
  .catch((error) => {
    console.error("Error en backfill de ejercicios:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
