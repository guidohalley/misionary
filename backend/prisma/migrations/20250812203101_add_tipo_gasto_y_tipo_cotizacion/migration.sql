/*
  Warnings:

  - A unique constraint covering the columns `[monedaDesdeId,monedaHaciaId,tipo,fecha]` on the table `TipoCambio` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TipoCotizacion" AS ENUM ('OFICIAL', 'BLUE', 'TARJETA');

-- DropIndex
DROP INDEX "TipoCambio_monedaDesdeId_monedaHaciaId_fecha_key";

-- AlterTable
ALTER TABLE "GastoOperativo" ADD COLUMN     "tipoId" INTEGER;

-- AlterTable
ALTER TABLE "TipoCambio" ADD COLUMN     "fuente" TEXT,
ADD COLUMN     "tipo" "TipoCotizacion" NOT NULL DEFAULT 'OFICIAL';

-- CreateTable
CREATE TABLE "TipoGasto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "color" TEXT,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoGasto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoGasto_slug_key" ON "TipoGasto"("slug");

-- CreateIndex
CREATE INDEX "TipoCambio_fecha_idx" ON "TipoCambio"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "TipoCambio_monedaDesdeId_monedaHaciaId_tipo_fecha_key" ON "TipoCambio"("monedaDesdeId", "monedaHaciaId", "tipo", "fecha");

-- AddForeignKey
ALTER TABLE "GastoOperativo" ADD CONSTRAINT "GastoOperativo_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "TipoGasto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
