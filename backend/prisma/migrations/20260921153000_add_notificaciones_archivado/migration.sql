ALTER TABLE "notificaciones"
ADD COLUMN "archivada" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "archivedAt" TIMESTAMP(3);

CREATE INDEX "notificaciones_archivada_idx" ON "notificaciones"("archivada");
