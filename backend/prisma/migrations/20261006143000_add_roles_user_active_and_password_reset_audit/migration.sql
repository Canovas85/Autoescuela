ALTER TABLE "usuarios"
ADD COLUMN IF NOT EXISTS "activo" BOOLEAN NOT NULL DEFAULT true;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'Rol' AND e.enumlabel = 'ADMINISTRATIVO'
  ) THEN
    ALTER TYPE "Rol" ADD VALUE 'ADMINISTRATIVO';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'Rol' AND e.enumlabel = 'SOPORTE'
  ) THEN
    ALTER TYPE "Rol" ADD VALUE 'SOPORTE';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "auditoria_reseteos_password" (
  "id" TEXT NOT NULL,
  "soporteId" TEXT NOT NULL,
  "usuarioObjetivoId" TEXT NOT NULL,
  "motivo" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "auditoria_reseteos_password_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "auditoria_reseteos_password_soporteId_idx" ON "auditoria_reseteos_password"("soporteId");
CREATE INDEX IF NOT EXISTS "auditoria_reseteos_password_usuarioObjetivoId_idx" ON "auditoria_reseteos_password"("usuarioObjetivoId");
CREATE INDEX IF NOT EXISTS "auditoria_reseteos_password_createdAt_idx" ON "auditoria_reseteos_password"("createdAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'auditoria_reseteos_password_soporteId_fkey'
  ) THEN
    ALTER TABLE "auditoria_reseteos_password"
    ADD CONSTRAINT "auditoria_reseteos_password_soporteId_fkey"
    FOREIGN KEY ("soporteId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'auditoria_reseteos_password_usuarioObjetivoId_fkey'
  ) THEN
    ALTER TABLE "auditoria_reseteos_password"
    ADD CONSTRAINT "auditoria_reseteos_password_usuarioObjetivoId_fkey"
    FOREIGN KEY ("usuarioObjetivoId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
