-- AlterTable
ALTER TABLE "promociones"
ADD COLUMN "requiereCarnetEstudiante" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "edadMinima" INTEGER,
ADD COLUMN "edadMaxima" INTEGER,
ADD COLUMN "requiereFidelidad" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "facturas" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "matriculaId" TEXT NOT NULL,
    "concepto" TEXT NOT NULL,
    "baseImponible" DECIMAL(10,2) NOT NULL,
    "descuento" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'EMITIDA',
    "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaPago" TIMESTAMP(3),

    CONSTRAINT "facturas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "facturas_numero_key" ON "facturas"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "facturas_matriculaId_key" ON "facturas"("matriculaId");

-- CreateIndex
CREATE INDEX "facturas_alumnoId_idx" ON "facturas"("alumnoId");

-- CreateIndex
CREATE INDEX "facturas_estado_idx" ON "facturas"("estado");

-- CreateIndex
CREATE INDEX "facturas_fechaEmision_idx" ON "facturas"("fechaEmision");

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_matriculaId_fkey" FOREIGN KEY ("matriculaId") REFERENCES "matriculas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
