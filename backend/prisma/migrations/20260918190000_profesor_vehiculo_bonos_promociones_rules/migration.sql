-- Bonos por licencia y bonos internos promocionales
ALTER TABLE "bonos"
  ADD COLUMN "licencia" TEXT NOT NULL DEFAULT 'B',
  ADD COLUMN "esInterno" BOOLEAN NOT NULL DEFAULT false;

UPDATE "bonos" SET "licencia" = 'B' WHERE "licencia" IS NULL;

CREATE INDEX "bonos_licencia_idx" ON "bonos"("licencia");

-- Trazabilidad de compras de bono por promoción/matrícula
ALTER TABLE "compras_bonos"
  ADD COLUMN "matriculaOrigenId" TEXT,
  ADD COLUMN "origenPromocionId" TEXT;

CREATE INDEX "compras_bonos_matriculaOrigenId_idx" ON "compras_bonos"("matriculaOrigenId");
CREATE INDEX "compras_bonos_origenPromocionId_idx" ON "compras_bonos"("origenPromocionId");

-- Reglas extra de promoción: pagos gratis de examen y clases gratis
ALTER TABLE "promociones"
  ADD COLUMN "incluyePagoExamenGratis" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "clasesGratisIncluidas" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "licenciaClasesGratis" TEXT;

-- Histórico de reasignación de profesor al alumno
CREATE TABLE "alumnos_profesor_historial" (
  "id" TEXT NOT NULL,
  "alumnoId" TEXT NOT NULL,
  "profesorAnteriorId" TEXT NOT NULL,
  "profesorNuevoId" TEXT NOT NULL,
  "changedById" TEXT,
  "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "motivo" TEXT,
  CONSTRAINT "alumnos_profesor_historial_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "alumnos_profesor_historial_alumnoId_idx" ON "alumnos_profesor_historial"("alumnoId");
CREATE INDEX "alumnos_profesor_historial_profesorAnteriorId_idx" ON "alumnos_profesor_historial"("profesorAnteriorId");
CREATE INDEX "alumnos_profesor_historial_profesorNuevoId_idx" ON "alumnos_profesor_historial"("profesorNuevoId");
CREATE INDEX "alumnos_profesor_historial_changedAt_idx" ON "alumnos_profesor_historial"("changedAt");

ALTER TABLE "alumnos_profesor_historial"
  ADD CONSTRAINT "alumnos_profesor_historial_alumnoId_fkey"
  FOREIGN KEY ("alumnoId") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "alumnos_profesor_historial"
  ADD CONSTRAINT "alumnos_profesor_historial_profesorAnteriorId_fkey"
  FOREIGN KEY ("profesorAnteriorId") REFERENCES "profesores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "alumnos_profesor_historial"
  ADD CONSTRAINT "alumnos_profesor_historial_profesorNuevoId_fkey"
  FOREIGN KEY ("profesorNuevoId") REFERENCES "profesores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
