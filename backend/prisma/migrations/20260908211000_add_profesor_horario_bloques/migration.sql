-- CreateTable
CREATE TABLE "profesor_horarios_bloque" (
  "id" TEXT NOT NULL,
  "profesorId" TEXT NOT NULL,
  "diaSemana" INTEGER NOT NULL,
  "horaInicio" TEXT NOT NULL,
  "horaFin" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "profesor_horarios_bloque_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "profesor_horarios_bloque_profesorId_diaSemana_idx"
ON "profesor_horarios_bloque"("profesorId", "diaSemana");

-- AddForeignKey
ALTER TABLE "profesor_horarios_bloque"
ADD CONSTRAINT "profesor_horarios_bloque_profesorId_fkey"
FOREIGN KEY ("profesorId") REFERENCES "profesores"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
