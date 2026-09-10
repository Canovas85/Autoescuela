-- Add bono price and support billing for bono purchases.

-- AlterTable
ALTER TABLE "bonos"
ADD COLUMN "precio" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "pagos"
ADD COLUMN "compraBonoId" TEXT;

-- AlterTable
ALTER TABLE "facturas"
ADD COLUMN "compraBonoId" TEXT,
ALTER COLUMN "matriculaId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "pagos_compraBonoId_idx" ON "pagos"("compraBonoId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "facturas_matriculaId_idx" ON "facturas"("matriculaId");

-- CreateIndex
CREATE INDEX "facturas_compraBonoId_idx" ON "facturas"("compraBonoId");

-- AddForeignKey
ALTER TABLE "pagos"
ADD CONSTRAINT "pagos_compraBonoId_fkey"
FOREIGN KEY ("compraBonoId") REFERENCES "compras_bonos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturas"
ADD CONSTRAINT "facturas_compraBonoId_fkey"
FOREIGN KEY ("compraBonoId") REFERENCES "compras_bonos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
