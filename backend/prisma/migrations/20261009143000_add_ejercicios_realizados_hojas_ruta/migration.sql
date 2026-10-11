ALTER TABLE "hojas_ruta"
ADD COLUMN "ejerciciosRealizados" TEXT[] DEFAULT ARRAY[]::TEXT[];

UPDATE "hojas_ruta"
SET "ejerciciosRealizados" = ARRAY[]::TEXT[]
WHERE "ejerciciosRealizados" IS NULL;

ALTER TABLE "hojas_ruta"
ALTER COLUMN "ejerciciosRealizados" SET NOT NULL;
