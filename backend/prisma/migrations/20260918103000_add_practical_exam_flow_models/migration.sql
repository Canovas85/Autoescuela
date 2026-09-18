ALTER TABLE "solicitudes_examen"
ADD COLUMN "pagoGastoPracticoId" TEXT,
ADD COLUMN "faltasLeves" INTEGER,
ADD COLUMN "faltasDeficientes" INTEGER,
ADD COLUMN "faltasEliminatorias" INTEGER,
ADD COLUMN "motivoNoApto" TEXT;

CREATE INDEX "solicitudes_examen_pagoGastoPracticoId_idx" ON "solicitudes_examen"("pagoGastoPracticoId");

ALTER TABLE "solicitudes_examen"
ADD CONSTRAINT "solicitudes_examen_pagoGastoPracticoId_fkey"
FOREIGN KEY ("pagoGastoPracticoId") REFERENCES "pagos"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "practical_exam_process_batches" (
  "id" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "mode" TEXT NOT NULL,
  "targetDate" DATE NOT NULL,
  "seed" TEXT,
  "operator" TEXT,
  "reason" TEXT,
  "dryRun" BOOLEAN NOT NULL DEFAULT false,
  "summary" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "appliedAt" TIMESTAMP(3),
  "rolledBackAt" TIMESTAMP(3),

  CONSTRAINT "practical_exam_process_batches_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "practical_exam_process_solicitudes" (
  "id" BIGSERIAL NOT NULL,
  "batchId" TEXT NOT NULL,
  "solicitudId" TEXT NOT NULL,
  "alumnoId" TEXT NOT NULL,
  "beforeEstado" TEXT NOT NULL,
  "beforeErrores" INTEGER,
  "beforeAciertos" INTEGER,
  "beforeFaltasLeves" INTEGER,
  "beforeFaltasDeficientes" INTEGER,
  "beforeFaltasEliminatorias" INTEGER,
  "beforeMotivoNoApto" TEXT,
  "afterEstado" TEXT NOT NULL,
  "afterErrores" INTEGER,
  "afterAciertos" INTEGER,
  "afterFaltasLeves" INTEGER NOT NULL,
  "afterFaltasDeficientes" INTEGER NOT NULL,
  "afterFaltasEliminatorias" INTEGER NOT NULL,
  "afterMotivoNoApto" TEXT,
  "createdExamenId" TEXT,
  "revertedAt" TIMESTAMP(3),
  "conflictReason" TEXT,

  CONSTRAINT "practical_exam_process_solicitudes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "practical_exam_process_pagos" (
  "id" BIGSERIAL NOT NULL,
  "batchId" TEXT NOT NULL,
  "pagoId" TEXT NOT NULL,
  "alumnoId" TEXT NOT NULL,
  "beforeConvocatoriasConsumidas" INTEGER NOT NULL,
  "afterConvocatoriasConsumidas" INTEGER NOT NULL,
  "applied" BOOLEAN NOT NULL DEFAULT true,
  "revertedAt" TIMESTAMP(3),
  "conflictReason" TEXT,

  CONSTRAINT "practical_exam_process_pagos_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "practical_exam_process_solicitudes_batchId_solicitudId_key" ON "practical_exam_process_solicitudes"("batchId", "solicitudId");
CREATE INDEX "practical_exam_process_solicitudes_batchId_idx" ON "practical_exam_process_solicitudes"("batchId");
CREATE INDEX "practical_exam_process_solicitudes_solicitudId_idx" ON "practical_exam_process_solicitudes"("solicitudId");

CREATE UNIQUE INDEX "practical_exam_process_pagos_batchId_pagoId_key" ON "practical_exam_process_pagos"("batchId", "pagoId");
CREATE INDEX "practical_exam_process_pagos_batchId_idx" ON "practical_exam_process_pagos"("batchId");
CREATE INDEX "practical_exam_process_pagos_pagoId_idx" ON "practical_exam_process_pagos"("pagoId");

CREATE INDEX "practical_exam_process_batches_status_idx" ON "practical_exam_process_batches"("status");
CREATE INDEX "practical_exam_process_batches_createdAt_idx" ON "practical_exam_process_batches"("createdAt");

ALTER TABLE "practical_exam_process_solicitudes"
ADD CONSTRAINT "practical_exam_process_solicitudes_batchId_fkey"
FOREIGN KEY ("batchId") REFERENCES "practical_exam_process_batches"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "practical_exam_process_pagos"
ADD CONSTRAINT "practical_exam_process_pagos_batchId_fkey"
FOREIGN KEY ("batchId") REFERENCES "practical_exam_process_batches"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
