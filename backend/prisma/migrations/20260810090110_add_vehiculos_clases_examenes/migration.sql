-- CreateTable
CREATE TABLE "vehiculos" (
    "id" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "marca" TEXT,
    "modelo" TEXT,
    "tipoPermiso" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clases_practicas" (
    "id" TEXT NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "profesorId" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "duracion" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "clases_practicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "examenes" (
    "id" TEXT NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "examenes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_matricula_key" ON "vehiculos"("matricula");

-- CreateIndex
CREATE INDEX "clases_practicas_alumnoId_idx" ON "clases_practicas"("alumnoId");

-- CreateIndex
CREATE INDEX "clases_practicas_profesorId_idx" ON "clases_practicas"("profesorId");

-- CreateIndex
CREATE INDEX "clases_practicas_vehiculoId_idx" ON "clases_practicas"("vehiculoId");

-- CreateIndex
CREATE INDEX "clases_practicas_fecha_idx" ON "clases_practicas"("fecha");

-- CreateIndex
CREATE INDEX "examenes_alumnoId_idx" ON "examenes"("alumnoId");

-- CreateIndex
CREATE INDEX "examenes_fecha_idx" ON "examenes"("fecha");

-- AddForeignKey
ALTER TABLE "clases_practicas" ADD CONSTRAINT "clases_practicas_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "alumnos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clases_practicas" ADD CONSTRAINT "clases_practicas_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "profesores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clases_practicas" ADD CONSTRAINT "clases_practicas_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examenes" ADD CONSTRAINT "examenes_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "alumnos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
