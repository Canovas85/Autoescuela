-- Add multi-license permissions for profesores while keeping legacy single license field
ALTER TABLE "profesores"
ADD COLUMN "permisosLicencias" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Backfill existing records from single license
UPDATE "profesores"
SET "permisosLicencias" = ARRAY["licenciaConducir"]
WHERE "licenciaConducir" IS NOT NULL
  AND "licenciaConducir" <> '';
