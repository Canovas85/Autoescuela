-- Add booking/payment tracking fields in clases_practicas
ALTER TABLE "clases_practicas"
ADD COLUMN "compraBonoId" TEXT,
ADD COLUMN "metodoPago" TEXT NOT NULL DEFAULT 'INDIVIDUAL',
ADD COLUMN "pagoLimiteAt" TIMESTAMP(3),
ADD COLUMN "canceladaPor" TEXT,
ADD COLUMN "canceladaConPenalizacion" BOOLEAN NOT NULL DEFAULT false;

-- Link pagos and facturas to a practical class
ALTER TABLE "pagos"
ADD COLUMN "clasePracticaId" TEXT;

ALTER TABLE "facturas"
ADD COLUMN "clasePracticaId" TEXT;

-- Notifications inbox
CREATE TABLE "notificaciones" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "metadata" JSONB,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX "clases_practicas_compraBonoId_idx" ON "clases_practicas"("compraBonoId");
CREATE INDEX "pagos_clasePracticaId_idx" ON "pagos"("clasePracticaId");
CREATE INDEX "facturas_clasePracticaId_idx" ON "facturas"("clasePracticaId");
CREATE INDEX "notificaciones_usuarioId_idx" ON "notificaciones"("usuarioId");
CREATE INDEX "notificaciones_tipo_idx" ON "notificaciones"("tipo");
CREATE INDEX "notificaciones_leida_idx" ON "notificaciones"("leida");
CREATE INDEX "notificaciones_createdAt_idx" ON "notificaciones"("createdAt");

-- Foreign keys
ALTER TABLE "clases_practicas"
ADD CONSTRAINT "clases_practicas_compraBonoId_fkey"
FOREIGN KEY ("compraBonoId") REFERENCES "compras_bonos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "pagos"
ADD CONSTRAINT "pagos_clasePracticaId_fkey"
FOREIGN KEY ("clasePracticaId") REFERENCES "clases_practicas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "facturas"
ADD CONSTRAINT "facturas_clasePracticaId_fkey"
FOREIGN KEY ("clasePracticaId") REFERENCES "clases_practicas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "notificaciones"
ADD CONSTRAINT "notificaciones_usuarioId_fkey"
FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
