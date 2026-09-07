-- CreateTable
CREATE TABLE "preguntas_dgt" (
    "id" TEXT NOT NULL,
    "licencia" TEXT[],
    "enunciado" TEXT NOT NULL,
    "imagenRuta" TEXT,
    "explicacion" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "preguntas_dgt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respuestas_pregunta_dgt" (
    "id" TEXT NOT NULL,
    "preguntaId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "correcta" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER,

    CONSTRAINT "respuestas_pregunta_dgt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "examenes_dgt_alumno" (
    "id" TEXT NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "licencia" TEXT NOT NULL,
    "totalPreguntas" INTEGER NOT NULL,
    "aciertos" INTEGER NOT NULL,
    "fallos" INTEGER NOT NULL,
    "aprobado" BOOLEAN NOT NULL,
    "duracionSegundos" INTEGER,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "examenes_dgt_alumno_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "preguntas_dgt_activa_idx" ON "preguntas_dgt"("activa");

-- CreateIndex
CREATE INDEX "preguntas_dgt_createdAt_idx" ON "preguntas_dgt"("createdAt");

-- CreateIndex
CREATE INDEX "preguntas_dgt_licencia_idx" ON "preguntas_dgt" USING GIN ("licencia");

-- CreateIndex
CREATE INDEX "respuestas_pregunta_dgt_preguntaId_idx" ON "respuestas_pregunta_dgt"("preguntaId");

-- CreateIndex
CREATE INDEX "examenes_dgt_alumno_alumnoId_idx" ON "examenes_dgt_alumno"("alumnoId");

-- CreateIndex
CREATE INDEX "examenes_dgt_alumno_licencia_idx" ON "examenes_dgt_alumno"("licencia");

-- CreateIndex
CREATE INDEX "examenes_dgt_alumno_fecha_idx" ON "examenes_dgt_alumno"("fecha");

-- AddForeignKey
ALTER TABLE "respuestas_pregunta_dgt" ADD CONSTRAINT "respuestas_pregunta_dgt_preguntaId_fkey" FOREIGN KEY ("preguntaId") REFERENCES "preguntas_dgt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examenes_dgt_alumno" ADD CONSTRAINT "examenes_dgt_alumno_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
