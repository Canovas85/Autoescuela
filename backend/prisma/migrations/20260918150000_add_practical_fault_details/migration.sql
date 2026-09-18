ALTER TABLE "solicitudes_examen"
ADD COLUMN "faltasLevesDetalle" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "faltasDeficientesDetalle" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "faltasEliminatoriasDetalle" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "practical_exam_process_solicitudes"
ADD COLUMN "beforeFaltasLevesDetalle" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "beforeFaltasDeficientesDetalle" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "beforeFaltasEliminatoriasDetalle" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "afterFaltasLevesDetalle" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "afterFaltasDeficientesDetalle" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "afterFaltasEliminatoriasDetalle" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
