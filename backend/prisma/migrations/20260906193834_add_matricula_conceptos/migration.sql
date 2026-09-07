-- CreateTable
CREATE TABLE "matriculas_conceptos" (
    "id" TEXT NOT NULL,
    "matriculaId" TEXT NOT NULL,
    "tarifaConceptoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "observaciones" TEXT,

    CONSTRAINT "matriculas_conceptos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "matriculas_conceptos_matriculaId_idx"
    ON "matriculas_conceptos"("matriculaId");

-- CreateIndex
CREATE INDEX "matriculas_conceptos_tarifaConceptoId_idx"
    ON "matriculas_conceptos"("tarifaConceptoId");

-- AddForeignKey
ALTER TABLE "matriculas_conceptos"
    ADD CONSTRAINT "matriculas_conceptos_matriculaId_fkey"
    FOREIGN KEY ("matriculaId") REFERENCES "matriculas"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "matriculas_conceptos"
    ADD CONSTRAINT "matriculas_conceptos_tarifaConceptoId_fkey"
    FOREIGN KEY ("tarifaConceptoId") REFERENCES "tarifas_concepto"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
