import prisma from "./src/config/prisma.js";

try {
  const user = await prisma.usuario.findUnique({
    where: {
      email: "pandozales@yahoo.es",
    },
  });

  console.log(user);
} catch (error) {
  console.error(error);
}
