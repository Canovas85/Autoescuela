-- AlterTable
ALTER TABLE "solicitudes_examen"
ADD COLUMN "aciertosExamen" INTEGER;

-- Backfill
UPDATE "solicitudes_examen"
SET "aciertosExamen" = GREATEST(30 - "erroresExamen", 0)
WHERE "tipo" = 'TEORICO'
	AND "erroresExamen" IS NOT NULL
	AND "aciertosExamen" IS NULL;
