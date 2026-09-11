-- Renombra la tabla de convocatorias teóricas para soportar convocatorias de teórico y práctico.
ALTER TABLE "convocatorias_teorico" RENAME TO "convocatorias_examen";

-- Añade el tipo de examen para distinguir entre TEORICO y PRACTICO.
ALTER TABLE "convocatorias_examen"
ADD COLUMN "tipoExamen" TEXT NOT NULL DEFAULT 'TEORICO';

-- Mantiene índices útiles y crea índice por tipo.
CREATE INDEX "convocatorias_examen_tipoExamen_idx" ON "convocatorias_examen"("tipoExamen");

-- Evita duplicados por misma fecha, licencia y tipo.
CREATE UNIQUE INDEX "convocatorias_examen_fecha_licencia_tipoExamen_key"
ON "convocatorias_examen"("fecha", "licencia", "tipoExamen");
