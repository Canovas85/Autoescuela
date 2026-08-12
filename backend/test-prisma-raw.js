import prisma from "./src/config/prisma.js";

try {
  const result = await prisma.$queryRaw`SELECT 1`;

  console.log(result);
} catch (error) {
  console.error(error);
}
