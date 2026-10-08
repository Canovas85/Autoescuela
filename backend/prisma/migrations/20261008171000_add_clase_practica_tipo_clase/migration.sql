ALTER TABLE "clases_practicas"
ADD COLUMN "tipoClasePractica" TEXT NOT NULL DEFAULT 'CIRCULACION';

CREATE INDEX "clases_practicas_tipoClasePractica_idx"
ON "clases_practicas"("tipoClasePractica");
