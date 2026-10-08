ALTER TABLE "solicitudes_examen"
ADD COLUMN "fasePractica" INTEGER;

CREATE INDEX "solicitudes_examen_fasePractica_idx"
ON "solicitudes_examen"("fasePractica");
