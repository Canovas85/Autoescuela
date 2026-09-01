-- CreateTable
CREATE TABLE "activaciones_cuenta" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,
    "resendCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "activaciones_cuenta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "activaciones_cuenta_tokenHash_key" ON "activaciones_cuenta"("tokenHash");

-- CreateIndex
CREATE INDEX "activaciones_cuenta_usuarioId_idx" ON "activaciones_cuenta"("usuarioId");

-- CreateIndex
CREATE INDEX "activaciones_cuenta_expiresAt_idx" ON "activaciones_cuenta"("expiresAt");

-- CreateIndex
CREATE INDEX "activaciones_cuenta_usedAt_idx" ON "activaciones_cuenta"("usedAt");

-- AddForeignKey
ALTER TABLE "activaciones_cuenta" ADD CONSTRAINT "activaciones_cuenta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
