import "dotenv/config";

import prisma from "../src/config/prisma.js";
import { NominasRepository } from "../src/features/nominas/nominas.repository.js";
import { NominasService } from "../src/features/nominas/nominas.service.js";

const parseArg = (name) => {
  const prefix = `--${name}=`;
  const arg = process.argv.find((item) => item.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
};

async function run() {
  const year = Number.parseInt(parseArg("year") || "", 10);
  const month = Number.parseInt(parseArg("month") || "", 10);

  if (!Number.isInteger(year) || year < 2026 || year > 2100) {
    throw new Error("Debes indicar --year valido (2026..2100)");
  }

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("Debes indicar --month valido (1..12)");
  }

  await prisma.nomina.deleteMany({
    where: {
      anio: year,
      mes: month,
    },
  });

  const repository = new NominasRepository(prisma);
  const service = new NominasService(repository);

  const result = await service.generateMonthlyPayrolls({ year, month });

  console.log("Regeneracion de nominas completada");
  console.log(`- Periodo: ${year}-${String(month).padStart(2, "0")}`);
  console.log(`- Generadas: ${result.generated}`);
  console.log(`- Omitidas: ${result.skipped}`);
}

run()
  .catch((error) => {
    console.error("Error al regenerar nominas:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
