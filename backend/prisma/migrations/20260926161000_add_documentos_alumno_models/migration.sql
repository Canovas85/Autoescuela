CREATE TABLE IF NOT EXISTS "documentos_alumno" (
  "id" TEXT NOT NULL,
  "alumnoId" TEXT NOT NULL,
  "tipo" TEXT NOT NULL,
  "estado" TEXT NOT NULL DEFAULT 'PENDIENTE_VALIDACION',
  "observaciones" TEXT,
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "documentos_alumno_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "documentos_alumno_archivos" (
  "id" TEXT NOT NULL,
  "documentoId" TEXT NOT NULL,
  "nombreOriginal" TEXT NOT NULL,
  "nombreArchivo" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "tamanioBytes" INTEGER NOT NULL,
  "ruta" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "documentos_alumno_archivos_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "documentos_alumno_alumnoId_idx" ON "documentos_alumno"("alumnoId");
CREATE INDEX IF NOT EXISTS "documentos_alumno_estado_idx" ON "documentos_alumno"("estado");
CREATE INDEX IF NOT EXISTS "documentos_alumno_archivos_documentoId_idx" ON "documentos_alumno_archivos"("documentoId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'documentos_alumno_alumnoId_fkey'
  ) THEN
    ALTER TABLE "documentos_alumno"
    ADD CONSTRAINT "documentos_alumno_alumnoId_fkey"
    FOREIGN KEY ("alumnoId") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'documentos_alumno_archivos_documentoId_fkey'
  ) THEN
    ALTER TABLE "documentos_alumno_archivos"
    ADD CONSTRAINT "documentos_alumno_archivos_documentoId_fkey"
    FOREIGN KEY ("documentoId") REFERENCES "documentos_alumno"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
