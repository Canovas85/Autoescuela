import prisma from "./src/config/prisma.js";

console.log("ANTES");

try {
  const result = await prisma.$queryRaw`SELECT 1 AS valor`;

  console.log(result);
} catch (error) {
  console.error("ERROR QUERY:");
  console.error(error);
}

console.log("DESPUES");
