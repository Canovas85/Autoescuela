-- CreateTable
CREATE TABLE "tarifas_concepto_historial" (
    "id" TEXT NOT NULL,
    "tarifaConceptoId" TEXT NOT NULL,
    "permiso" TEXT NOT NULL,
    "concepto" TEXT NOT NULL,
    "precioAnterior" DECIMAL(10,2),
    "precioNuevo" DECIMAL(10,2) NOT NULL,
    "motivo" TEXT,
    "usuarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tarifas_concepto_historial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tarifas_concepto_historial_tarifaConceptoId_idx"
    ON "tarifas_concepto_historial"("tarifaConceptoId");

-- CreateIndex
CREATE INDEX "tarifas_concepto_historial_permiso_idx"
    ON "tarifas_concepto_historial"("permiso");

-- CreateIndex
CREATE INDEX "tarifas_concepto_historial_createdAt_idx"
    ON "tarifas_concepto_historial"("createdAt");

-- AddForeignKey
ALTER TABLE "tarifas_concepto_historial"
    ADD CONSTRAINT "tarifas_concepto_historial_tarifaConceptoId_fkey"
    FOREIGN KEY ("tarifaConceptoId") REFERENCES "tarifas_concepto"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
