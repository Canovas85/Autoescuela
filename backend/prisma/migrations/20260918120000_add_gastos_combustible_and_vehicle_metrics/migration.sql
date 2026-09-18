-- Añade métricas actuales del vehículo para hoja de ruta y repostajes.
ALTER TABLE "vehiculos"
ADD COLUMN "kmActuales" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "combustibleActualPct" INTEGER NOT NULL DEFAULT 100;

-- Crea entidad de gastos de combustible asociada a profesor y vehículo.
CREATE TABLE "gastos_combustible" (
  "id" TEXT NOT NULL,
  "numeroFactura" TEXT NOT NULL,
  "profesorId" TEXT NOT NULL,
  "vehiculoId" TEXT NOT NULL,
  "titularTarjeta" TEXT NOT NULL,
  "numeroTarjeta" TEXT NOT NULL,
  "combustibleAntesPct" INTEGER NOT NULL,
  "combustibleDespuesPct" INTEGER NOT NULL DEFAULT 100,
  "litrosRepostados" DECIMAL(10, 2) NOT NULL,
  "precioLitro" DECIMAL(10, 2) NOT NULL,
  "total" DECIMAL(10, 2) NOT NULL,
  "kilometrosVehiculo" INTEGER NOT NULL,
  "rutaRecibo" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "gastos_combustible_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "gastos_combustible_numeroFactura_key" ON "gastos_combustible"("numeroFactura");
CREATE INDEX "gastos_combustible_profesorId_idx" ON "gastos_combustible"("profesorId");
CREATE INDEX "gastos_combustible_vehiculoId_idx" ON "gastos_combustible"("vehiculoId");
CREATE INDEX "gastos_combustible_createdAt_idx" ON "gastos_combustible"("createdAt");

ALTER TABLE "gastos_combustible"
ADD CONSTRAINT "gastos_combustible_profesorId_fkey"
FOREIGN KEY ("profesorId") REFERENCES "profesores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "gastos_combustible"
ADD CONSTRAINT "gastos_combustible_vehiculoId_fkey"
FOREIGN KEY ("vehiculoId") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
