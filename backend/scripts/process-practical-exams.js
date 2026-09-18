import dotenv from "dotenv";

import prisma from "../src/config/prisma.js";
import { tasaDgtConfig } from "../src/config/tasa-dgt.config.js";
import { SolicitudesExamenRepository } from "../src/features/solicitudes-examen/solicitudes-examen.repository.js";
import { SolicitudesExamenService } from "../src/features/solicitudes-examen/solicitudes-examen.service.js";

dotenv.config();

async function main() {
  const repository = new SolicitudesExamenRepository(prisma);
  const service = new SolicitudesExamenService(repository, tasaDgtConfig);

  const result = await service.processScheduledPracticalResults();

  console.log("Procesado de convocatorias practicas completado");
  console.log(`- Procesadas: ${result.procesadas}`);
  console.log(`- Aptos: ${result.aptos}`);
  console.log(`- No aptos: ${result.noAptos}`);
  console.log(`- Faltas leves totales: ${result.faltasLevesTotales}`);
  console.log(
    `- Faltas deficientes totales: ${result.faltasDeficientesTotales}`,
  );
  console.log(
    `- Faltas eliminatorias totales: ${result.faltasEliminatoriasTotales}`,
  );
}

main()
  .catch((error) => {
    console.error("Error procesando resultados practicos:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
