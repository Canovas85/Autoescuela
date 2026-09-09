-- Add errors field to exam requests
ALTER TABLE "solicitudes_examen"
ADD COLUMN "erroresExamen" INTEGER;

-- Create DGT theoretical exam calendar table
CREATE TABLE "convocatorias_teorico" (
  "id" TEXT NOT NULL,
  "fecha" TIMESTAMP(3) NOT NULL,
  "licencia" TEXT NOT NULL,
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "convocatorias_teorico_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "convocatorias_teorico_fecha_idx" ON "convocatorias_teorico"("fecha");
CREATE INDEX "convocatorias_teorico_licencia_idx" ON "convocatorias_teorico"("licencia");
CREATE INDEX "convocatorias_teorico_activo_idx" ON "convocatorias_teorico"("activo");
