/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Impuesto` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Impuesto" ADD COLUMN     "descripcion" TEXT;

-- CreateTable
CREATE TABLE "PresupuestoImpuesto" (
    "id" SERIAL NOT NULL,
    "presupuestoId" INTEGER NOT NULL,
    "impuestoId" INTEGER NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PresupuestoImpuesto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PresupuestoImpuesto_presupuestoId_impuestoId_key" ON "PresupuestoImpuesto"("presupuestoId", "impuestoId");

-- CreateIndex
CREATE UNIQUE INDEX "Impuesto_nombre_key" ON "Impuesto"("nombre");

-- AddForeignKey
ALTER TABLE "PresupuestoImpuesto" ADD CONSTRAINT "PresupuestoImpuesto_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresupuestoImpuesto" ADD CONSTRAINT "PresupuestoImpuesto_impuestoId_fkey" FOREIGN KEY ("impuestoId") REFERENCES "Impuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
