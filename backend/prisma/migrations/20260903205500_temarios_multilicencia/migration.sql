-- Pasar de TEXT a TEXT[] manteniendo los datos existentes
DROP INDEX IF EXISTS "temarios_tipoLicenciaObjetivo_idx";

ALTER TABLE "temarios"
ADD COLUMN "tipoLicenciaObjetivo_new" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "temarios"
SET "tipoLicenciaObjetivo_new" = ARRAY["tipoLicenciaObjetivo"];

ALTER TABLE "temarios" DROP COLUMN "tipoLicenciaObjetivo";

ALTER TABLE "temarios"
RENAME COLUMN "tipoLicenciaObjetivo_new" TO "tipoLicenciaObjetivo";

CREATE INDEX "temarios_tipoLicenciaObjetivo_idx"
ON "temarios" USING GIN ("tipoLicenciaObjetivo");
