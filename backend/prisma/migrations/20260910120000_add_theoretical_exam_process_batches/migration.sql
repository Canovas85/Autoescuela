CREATE TABLE "theoretical_exam_process_batches" (
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

  CONSTRAINT "theoretical_exam_process_batches_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "theoretical_exam_process_solicitudes" (
  "id" BIGSERIAL NOT NULL,
  "batchId" TEXT NOT NULL,
  "solicitudId" TEXT NOT NULL,
  "alumnoId" TEXT NOT NULL,
  "beforeEstado" TEXT NOT NULL,
  "beforeErrores" INTEGER,
  "beforeAciertos" INTEGER,
  "afterEstado" TEXT NOT NULL,
  "afterErrores" INTEGER NOT NULL,
  "afterAciertos" INTEGER NOT NULL,
  "revertedAt" TIMESTAMP(3),
  "conflictReason" TEXT,

  CONSTRAINT "theoretical_exam_process_solicitudes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "theoretical_exam_process_pagos" (
  "id" BIGSERIAL NOT NULL,
  "batchId" TEXT NOT NULL,
  "pagoId" TEXT NOT NULL,
  "alumnoId" TEXT NOT NULL,
  "beforeConvocatoriasConsumidas" INTEGER NOT NULL,
  "afterConvocatoriasConsumidas" INTEGER NOT NULL,
  "applied" BOOLEAN NOT NULL DEFAULT true,
  "revertedAt" TIMESTAMP(3),
  "conflictReason" TEXT,

  CONSTRAINT "theoretical_exam_process_pagos_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "theoretical_exam_process_solicitudes_batchId_solicitudId_key" ON "theoretical_exam_process_solicitudes"("batchId", "solicitudId");
CREATE INDEX "theoretical_exam_process_solicitudes_batchId_idx" ON "theoretical_exam_process_solicitudes"("batchId");
CREATE INDEX "theoretical_exam_process_solicitudes_solicitudId_idx" ON "theoretical_exam_process_solicitudes"("solicitudId");

CREATE UNIQUE INDEX "theoretical_exam_process_pagos_batchId_pagoId_key" ON "theoretical_exam_process_pagos"("batchId", "pagoId");
CREATE INDEX "theoretical_exam_process_pagos_batchId_idx" ON "theoretical_exam_process_pagos"("batchId");
CREATE INDEX "theoretical_exam_process_pagos_pagoId_idx" ON "theoretical_exam_process_pagos"("pagoId");

CREATE INDEX "theoretical_exam_process_batches_status_idx" ON "theoretical_exam_process_batches"("status");
CREATE INDEX "theoretical_exam_process_batches_createdAt_idx" ON "theoretical_exam_process_batches"("createdAt");

ALTER TABLE "theoretical_exam_process_solicitudes"
ADD CONSTRAINT "theoretical_exam_process_solicitudes_batchId_fkey"
FOREIGN KEY ("batchId") REFERENCES "theoretical_exam_process_batches"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "theoretical_exam_process_pagos"
ADD CONSTRAINT "theoretical_exam_process_pagos_batchId_fkey"
FOREIGN KEY ("batchId") REFERENCES "theoretical_exam_process_batches"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
