ALTER TABLE "vehiculos"
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "gastos_combustible"
ALTER COLUMN "profesorId" DROP NOT NULL,
ADD COLUMN "tipoGasto" TEXT NOT NULL DEFAULT 'COMBUSTIBLE',
ADD COLUMN "concepto" TEXT;

UPDATE "gastos_combustible"
SET "concepto" = 'Repostaje combustible'
WHERE "concepto" IS NULL;

CREATE INDEX "gastos_combustible_tipoGasto_idx"
ON "gastos_combustible"("tipoGasto");

ALTER TABLE "gastos_combustible"
DROP CONSTRAINT "gastos_combustible_profesorId_fkey";

ALTER TABLE "gastos_combustible"
ADD CONSTRAINT "gastos_combustible_profesorId_fkey"
FOREIGN KEY ("profesorId") REFERENCES "profesores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "facturas"
ALTER COLUMN "alumnoId" DROP NOT NULL;

ALTER TABLE "facturas"
DROP CONSTRAINT "facturas_alumnoId_fkey";

ALTER TABLE "facturas"
ADD CONSTRAINT "facturas_alumnoId_fkey"
FOREIGN KEY ("alumnoId") REFERENCES "alumnos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
