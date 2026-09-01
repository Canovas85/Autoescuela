-- CreateTable
CREATE TABLE "clases_directo" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "videoUrl" TEXT NOT NULL,
    "duracionSegundos" INTEGER NOT NULL DEFAULT 0,
    "profesorId" TEXT,
    "permiso" TEXT NOT NULL DEFAULT 'B',
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clases_directo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clases_directo_permiso_idx" ON "clases_directo"("permiso");

-- CreateIndex
CREATE INDEX "clases_directo_activa_idx" ON "clases_directo"("activa");

-- CreateIndex
CREATE INDEX "clases_directo_profesorId_idx" ON "clases_directo"("profesorId");

-- AddForeignKey
ALTER TABLE "clases_directo" ADD CONSTRAINT "clases_directo_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "profesores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
