-- CreateEnum
CREATE TYPE "FrecuenciaContrato" AS ENUM ('UNICO', 'MENSUAL', 'TRIMESTRAL', 'ANUAL');

-- DropIndex
DROP INDEX "Factura_presupuestoId_key";

-- AlterTable
ALTER TABLE "Presupuesto" ADD COLUMN     "esRecurrente" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "frecuencia" "FrecuenciaContrato",
ADD COLUMN     "periodoFin" TIMESTAMP(3),
ADD COLUMN     "periodoInicio" TIMESTAMP(3),
ADD COLUMN     "precioPeriodo" DECIMAL(15,2),
ADD COLUMN     "renovacionAutomatica" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "CobroCliente" (
    "id" SERIAL NOT NULL,
    "presupuestoId" INTEGER NOT NULL,
    "monto" DECIMAL(15,2) NOT NULL,
    "monedaId" INTEGER NOT NULL DEFAULT 1,
    "fecha" TIMESTAMP(3) NOT NULL,
    "metodoPago" TEXT NOT NULL,
    "concepto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CobroCliente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CobroCliente_presupuestoId_idx" ON "CobroCliente"("presupuestoId");

-- CreateIndex
CREATE INDEX "CobroCliente_fecha_idx" ON "CobroCliente"("fecha");

-- AddForeignKey
ALTER TABLE "CobroCliente" ADD CONSTRAINT "CobroCliente_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CobroCliente" ADD CONSTRAINT "CobroCliente_monedaId_fkey" FOREIGN KEY ("monedaId") REFERENCES "Moneda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
