ALTER TABLE "alumnos"
ADD COLUMN IF NOT EXISTS "estadoExpediente" TEXT NOT NULL DEFAULT 'EN_FORMACION';

ALTER TABLE "alumnos"
ADD COLUMN IF NOT EXISTS "licenciaObtenidaAt" TIMESTAMP(3);

UPDATE "alumnos" a
SET
  "estadoExpediente" = 'LICENCIA_OBTENIDA',
  "licenciaObtenidaAt" = COALESCE(
    a."licenciaObtenidaAt",
    (
      SELECT MAX(COALESCE(s."fechaProgramada", s."fechaSolicitud"))
      FROM "solicitudes_examen" s
      WHERE s."alumnoId" = a."id"
        AND s."tipo" = 'PRACTICO'
        AND s."estado" = 'APTO'
    )
  )
WHERE EXISTS (
  SELECT 1
  FROM "solicitudes_examen" s
  WHERE s."alumnoId" = a."id"
    AND s."tipo" = 'PRACTICO'
    AND s."estado" = 'APTO'
);
