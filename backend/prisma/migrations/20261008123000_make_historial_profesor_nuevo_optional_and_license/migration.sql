-- Permite registrar histórico de licencias obtenidas sin profesor nuevo de reasignación.
ALTER TABLE "alumnos_profesor_historial"
  ALTER COLUMN "profesorNuevoId" DROP NOT NULL;

ALTER TABLE "alumnos_profesor_historial"
  ADD COLUMN "licenciaObtenida" TEXT;

CREATE INDEX "alumnos_profesor_historial_licenciaObtenida_idx"
  ON "alumnos_profesor_historial"("licenciaObtenida");
