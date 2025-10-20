-- AlterTable
ALTER TABLE "Presupuesto" ADD COLUMN     "margenAgenciaGlobal" DECIMAL(5,2),
ADD COLUMN     "montoGananciaAgencia" DECIMAL(15,2),
ADD COLUMN     "usarGananciaGlobal" BOOLEAN NOT NULL DEFAULT false;
