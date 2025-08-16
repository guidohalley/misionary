/*
  Warnings:

  - The values [MEP,CCL] on the enum `TipoCotizacion` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "TokenTipo" AS ENUM ('INVITE', 'RESET');

-- AlterEnum
BEGIN;
CREATE TYPE "TipoCotizacion_new" AS ENUM ('OFICIAL', 'BLUE', 'TARJETA');
ALTER TABLE "TipoCambio" ALTER COLUMN "tipo" DROP DEFAULT;
ALTER TABLE "TipoCambio" ALTER COLUMN "tipo" TYPE "TipoCotizacion_new" USING ("tipo"::text::"TipoCotizacion_new");
ALTER TYPE "TipoCotizacion" RENAME TO "TipoCotizacion_old";
ALTER TYPE "TipoCotizacion_new" RENAME TO "TipoCotizacion";
DROP TYPE "TipoCotizacion_old";
ALTER TABLE "TipoCambio" ALTER COLUMN "tipo" SET DEFAULT 'OFICIAL';
COMMIT;

-- AlterTable
ALTER TABLE "Persona" ADD COLUMN     "providerArea" TEXT,
ADD COLUMN     "providerRoles" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "AuthToken" (
    "id" SERIAL NOT NULL,
    "tipo" "TokenTipo" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "personaId" INTEGER,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresupuestoVersion" (
    "id" SERIAL NOT NULL,
    "presupuestoId" INTEGER NOT NULL,
    "versionNumero" INTEGER NOT NULL,
    "subtotalAnterior" DECIMAL(15,2),
    "subtotalNuevo" DECIMAL(15,2) NOT NULL,
    "impuestosAnterior" DECIMAL(15,2),
    "impuestosNuevo" DECIMAL(15,2) NOT NULL,
    "totalAnterior" DECIMAL(15,2),
    "totalNuevo" DECIMAL(15,2) NOT NULL,
    "estadoAnterior" "EstadoPresupuesto",
    "estadoNuevo" "EstadoPresupuesto" NOT NULL,
    "usuarioModificacionId" INTEGER,
    "motivoCambio" TEXT,
    "fechaCambio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "snapshotData" JSONB NOT NULL,
    "tipoOperacion" TEXT NOT NULL DEFAULT 'UPDATE',

    CONSTRAINT "PresupuestoVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthToken_tokenHash_key" ON "AuthToken"("tokenHash");

-- CreateIndex
CREATE INDEX "AuthToken_personaId_idx" ON "AuthToken"("personaId");

-- CreateIndex
CREATE INDEX "AuthToken_expiresAt_idx" ON "AuthToken"("expiresAt");

-- CreateIndex
CREATE INDEX "PresupuestoVersion_presupuestoId_idx" ON "PresupuestoVersion"("presupuestoId");

-- CreateIndex
CREATE INDEX "PresupuestoVersion_fechaCambio_idx" ON "PresupuestoVersion"("fechaCambio");

-- CreateIndex
CREATE INDEX "PresupuestoVersion_usuarioModificacionId_idx" ON "PresupuestoVersion"("usuarioModificacionId");

-- CreateIndex
CREATE UNIQUE INDEX "PresupuestoVersion_presupuestoId_versionNumero_key" ON "PresupuestoVersion"("presupuestoId", "versionNumero");

-- AddForeignKey
ALTER TABLE "AuthToken" ADD CONSTRAINT "AuthToken_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresupuestoVersion" ADD CONSTRAINT "PresupuestoVersion_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresupuestoVersion" ADD CONSTRAINT "PresupuestoVersion_usuarioModificacionId_fkey" FOREIGN KEY ("usuarioModificacionId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;
