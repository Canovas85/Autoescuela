-- Migration puente para sanear el historial de Prisma.
-- Crea pagos antes de migraciones que hacen ALTER TABLE sobre pagos.

CREATE TABLE IF NOT EXISTS "pagos" (
  "id" TEXT NOT NULL,
  "alumnoId" TEXT NOT NULL,
  "matriculaId" TEXT,
  "tipo" TEXT NOT NULL,
  "concepto" TEXT NOT NULL,
  "permiso" TEXT NOT NULL,
  "importe" DECIMAL(10,2) NOT NULL,
  "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
  "convocatoriasIncluidas" INTEGER NOT NULL DEFAULT 2,
  "convocatoriasConsumidas" INTEGER NOT NULL DEFAULT 0,
  "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "fechaPago" TIMESTAMP(3),
  "numeroFacturaPago" TEXT,
  "observaciones" TEXT,

  CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "pagos_alumnoId_idx" ON "pagos"("alumnoId");
CREATE INDEX IF NOT EXISTS "pagos_matriculaId_idx" ON "pagos"("matriculaId");
CREATE INDEX IF NOT EXISTS "pagos_estado_idx" ON "pagos"("estado");
CREATE INDEX IF NOT EXISTS "pagos_tipo_idx" ON "pagos"("tipo");
CREATE INDEX IF NOT EXISTS "pagos_permiso_idx" ON "pagos"("permiso");
CREATE INDEX IF NOT EXISTS "pagos_fechaCreacion_idx" ON "pagos"("fechaCreacion");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'pagos_alumnoId_fkey'
  ) THEN
    ALTER TABLE "pagos"
    ADD CONSTRAINT "pagos_alumnoId_fkey"
    FOREIGN KEY ("alumnoId") REFERENCES "alumnos"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'pagos_matriculaId_fkey'
  ) THEN
    ALTER TABLE "pagos"
    ADD CONSTRAINT "pagos_matriculaId_fkey"
    FOREIGN KEY ("matriculaId") REFERENCES "matriculas"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
