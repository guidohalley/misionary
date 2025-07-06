/*
  Warnings:

  - You are about to alter the column `subtotal` on the `Factura` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(15,2)`.
  - You are about to alter the column `impuestos` on the `Factura` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(15,2)`.
  - You are about to alter the column `total` on the `Factura` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(15,2)`.
  - You are about to alter the column `porcentaje` on the `Impuesto` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `precioUnitario` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(15,2)`.
  - You are about to alter the column `subtotal` on the `Presupuesto` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(15,2)`.
  - You are about to alter the column `impuestos` on the `Presupuesto` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(15,2)`.
  - You are about to alter the column `total` on the `Presupuesto` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(15,2)`.
  - You are about to alter the column `monto` on the `PresupuestoImpuesto` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(15,2)`.
  - You are about to drop the column `activo` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `categoria` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `complejidad` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `imagenUrl` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `tiempoEstimado` on the `Producto` table. All the data in the column will be lost.
  - You are about to alter the column `precio` on the `Producto` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(15,2)`.
  - You are about to alter the column `monto` on the `Recibo` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(15,2)`.
  - You are about to drop the column `activo` on the `Servicio` table. All the data in the column will be lost.
  - You are about to drop the column `imagenUrl` on the `Servicio` table. All the data in the column will be lost.
  - You are about to drop the column `tipoServicio` on the `Servicio` table. All the data in the column will be lost.
  - You are about to alter the column `precio` on the `Servicio` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(15,2)`.

*/
-- CreateEnum
CREATE TYPE "CodigoMoneda" AS ENUM ('ARS', 'USD', 'EUR');

-- AlterTable
ALTER TABLE "Factura" ADD COLUMN     "monedaId" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "tipoCambioFecha" TIMESTAMP(3),
ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(15,2),
ALTER COLUMN "impuestos" SET DATA TYPE DECIMAL(15,2),
ALTER COLUMN "total" SET DATA TYPE DECIMAL(15,2);

-- AlterTable
ALTER TABLE "Impuesto" ALTER COLUMN "porcentaje" SET DATA TYPE DECIMAL(5,2);

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "precioUnitario" SET DATA TYPE DECIMAL(15,2);

-- AlterTable
ALTER TABLE "Presupuesto" ADD COLUMN     "monedaId" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "tipoCambioFecha" TIMESTAMP(3),
ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(15,2),
ALTER COLUMN "impuestos" SET DATA TYPE DECIMAL(15,2),
ALTER COLUMN "total" SET DATA TYPE DECIMAL(15,2);

-- AlterTable
ALTER TABLE "PresupuestoImpuesto" ALTER COLUMN "monto" SET DATA TYPE DECIMAL(15,2);

-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "activo",
DROP COLUMN "categoria",
DROP COLUMN "complejidad",
DROP COLUMN "descripcion",
DROP COLUMN "imagenUrl",
DROP COLUMN "tiempoEstimado",
ADD COLUMN     "monedaId" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "precio" SET DATA TYPE DECIMAL(15,2);

-- AlterTable
ALTER TABLE "Recibo" ALTER COLUMN "monto" SET DATA TYPE DECIMAL(15,2);

-- AlterTable
ALTER TABLE "Servicio" DROP COLUMN "activo",
DROP COLUMN "imagenUrl",
DROP COLUMN "tipoServicio",
ADD COLUMN     "monedaId" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "precio" SET DATA TYPE DECIMAL(15,2);

-- CreateTable
CREATE TABLE "Moneda" (
    "id" SERIAL NOT NULL,
    "codigo" "CodigoMoneda" NOT NULL,
    "nombre" TEXT NOT NULL,
    "simbolo" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Moneda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoCambio" (
    "id" SERIAL NOT NULL,
    "monedaDesdeId" INTEGER NOT NULL,
    "monedaHaciaId" INTEGER NOT NULL,
    "valor" DECIMAL(15,4) NOT NULL,
    "fecha" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TipoCambio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Moneda_codigo_key" ON "Moneda"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "TipoCambio_monedaDesdeId_monedaHaciaId_fecha_key" ON "TipoCambio"("monedaDesdeId", "monedaHaciaId", "fecha");

-- AddForeignKey
ALTER TABLE "TipoCambio" ADD CONSTRAINT "TipoCambio_monedaDesdeId_fkey" FOREIGN KEY ("monedaDesdeId") REFERENCES "Moneda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipoCambio" ADD CONSTRAINT "TipoCambio_monedaHaciaId_fkey" FOREIGN KEY ("monedaHaciaId") REFERENCES "Moneda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_monedaId_fkey" FOREIGN KEY ("monedaId") REFERENCES "Moneda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicio" ADD CONSTRAINT "Servicio_monedaId_fkey" FOREIGN KEY ("monedaId") REFERENCES "Moneda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presupuesto" ADD CONSTRAINT "Presupuesto_monedaId_fkey" FOREIGN KEY ("monedaId") REFERENCES "Moneda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_monedaId_fkey" FOREIGN KEY ("monedaId") REFERENCES "Moneda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
