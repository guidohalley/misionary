/*
  Warnings:

  - Made the column `costoProveedor` on table `Producto` required. This step will fail if there are existing NULL values in that column.
  - Made the column `margenAgencia` on table `Producto` required. This step will fail if there are existing NULL values in that column.
  - Made the column `costoProveedor` on table `Servicio` required. This step will fail if there are existing NULL values in that column.
  - Made the column `margenAgencia` on table `Servicio` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ReciboTipo" AS ENUM ('PROVEEDOR', 'ADMIN');

-- AlterTable
ALTER TABLE "Factura" ADD COLUMN     "empresaId" INTEGER;

-- AlterTable
ALTER TABLE "Presupuesto" ADD COLUMN     "empresaId" INTEGER;

-- AlterTable
ALTER TABLE "Producto" ALTER COLUMN "costoProveedor" SET NOT NULL,
ALTER COLUMN "margenAgencia" SET NOT NULL;

-- AlterTable
ALTER TABLE "Recibo" ADD COLUMN     "monedaId" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "presupuestoId" INTEGER,
ADD COLUMN     "tipo" "ReciboTipo" NOT NULL DEFAULT 'PROVEEDOR';

-- AlterTable
ALTER TABLE "Servicio" ALTER COLUMN "costoProveedor" SET NOT NULL,
ALTER COLUMN "margenAgencia" SET NOT NULL;

-- CreateTable
CREATE TABLE "Empresa" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "razonSocial" TEXT,
    "cuit" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "clienteId" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PagoAdmin" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "presupuestoId" INTEGER NOT NULL,
    "monto" DECIMAL(15,2) NOT NULL,
    "monedaId" INTEGER NOT NULL DEFAULT 1,
    "fecha" TIMESTAMP(3) NOT NULL,
    "metodoPago" TEXT NOT NULL,
    "concepto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PagoAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cuit_key" ON "Empresa"("cuit");

-- CreateIndex
CREATE INDEX "Empresa_clienteId_idx" ON "Empresa"("clienteId");

-- CreateIndex
CREATE INDEX "Empresa_activo_idx" ON "Empresa"("activo");

-- CreateIndex
CREATE INDEX "PagoAdmin_presupuestoId_idx" ON "PagoAdmin"("presupuestoId");

-- AddForeignKey
ALTER TABLE "Empresa" ADD CONSTRAINT "Empresa_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presupuesto" ADD CONSTRAINT "Presupuesto_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recibo" ADD CONSTRAINT "Recibo_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recibo" ADD CONSTRAINT "Recibo_monedaId_fkey" FOREIGN KEY ("monedaId") REFERENCES "Moneda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagoAdmin" ADD CONSTRAINT "PagoAdmin_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagoAdmin" ADD CONSTRAINT "PagoAdmin_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagoAdmin" ADD CONSTRAINT "PagoAdmin_monedaId_fkey" FOREIGN KEY ("monedaId") REFERENCES "Moneda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
