ALTER TABLE "alumnos"
ALTER COLUMN "estadoExpediente" SET DEFAULT 'PENDIENTE_MATRICULA';

UPDATE "alumnos" a
SET "estadoExpediente" = 'PENDIENTE_MATRICULA'
WHERE a."estadoExpediente" = 'EN_FORMACION'
  AND NOT EXISTS (
    SELECT 1
    FROM "matriculas" m
    WHERE m."alumnoId" = a."id"
      AND m."estado" = 'PAGADA'
  );
