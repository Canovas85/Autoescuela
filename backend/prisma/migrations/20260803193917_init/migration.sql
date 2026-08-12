-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'PROFESOR', 'ALUMNO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profesores" (
    "id" TEXT NOT NULL,
    "licenciaConducir" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "profesores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alumnos" (
    "id" TEXT NOT NULL,
    "tipoLicenciaObjetivo" TEXT NOT NULL,
    "horasPracticasCompletadas" INTEGER NOT NULL DEFAULT 0,
    "profesorAsignadoId" TEXT,

    CONSTRAINT "alumnos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "profesores" ADD CONSTRAINT "profesores_id_fkey" FOREIGN KEY ("id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumnos" ADD CONSTRAINT "alumnos_id_fkey" FOREIGN KEY ("id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumnos" ADD CONSTRAINT "alumnos_profesorAsignadoId_fkey" FOREIGN KEY ("profesorAsignadoId") REFERENCES "profesores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
