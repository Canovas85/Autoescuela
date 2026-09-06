-- CreateEnum
CREATE TYPE "TipoPrecio" AS ENUM ('FIJO', 'VARIABLE', 'POR_CLASE', 'POR_EXAMEN');

-- CreateTable
CREATE TABLE "tarifas_concepto" (
    "id" TEXT NOT NULL,
    "permiso" TEXT NOT NULL,
    "concepto" TEXT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "tipo" "TipoPrecio" NOT NULL,
    "descripcion" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tarifas_concepto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tarifas_concepto_permiso_idx" ON "tarifas_concepto"("permiso");

-- CreateIndex
CREATE INDEX "tarifas_concepto_activa_idx" ON "tarifas_concepto"("activa");

-- CreateIndex
CREATE UNIQUE INDEX "tarifas_concepto_permiso_concepto_key" ON "tarifas_concepto"("permiso", "concepto");
