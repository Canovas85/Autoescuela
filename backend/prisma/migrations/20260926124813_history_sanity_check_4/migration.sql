-- AlterTable
ALTER TABLE "convocatorias_examen"
RENAME CONSTRAINT "convocatorias_teorico_pkey" TO "convocatorias_examen_pkey";

ALTER TABLE "convocatorias_examen"
ALTER COLUMN "tipoExamen" DROP DEFAULT;

-- AlterTable
ALTER TABLE "practical_exam_process_solicitudes" ALTER COLUMN "beforeFaltasLevesDetalle" DROP DEFAULT,
ALTER COLUMN "beforeFaltasDeficientesDetalle" DROP DEFAULT,
ALTER COLUMN "beforeFaltasEliminatoriasDetalle" DROP DEFAULT,
ALTER COLUMN "afterFaltasLevesDetalle" DROP DEFAULT,
ALTER COLUMN "afterFaltasDeficientesDetalle" DROP DEFAULT,
ALTER COLUMN "afterFaltasEliminatoriasDetalle" DROP DEFAULT;

-- RenameIndex
ALTER INDEX "convocatorias_teorico_activo_idx" RENAME TO "convocatorias_examen_activo_idx";

-- RenameIndex
ALTER INDEX "convocatorias_teorico_fecha_idx" RENAME TO "convocatorias_examen_fecha_idx";

-- RenameIndex
ALTER INDEX "convocatorias_teorico_licencia_idx" RENAME TO "convocatorias_examen_licencia_idx";
