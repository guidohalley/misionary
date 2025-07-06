-- CreateEnum
CREATE TYPE "CategoriaGasto" AS ENUM ('OFICINA', 'PERSONAL', 'MARKETING', 'TECNOLOGIA', 'SERVICIOS', 'TRANSPORTE', 'COMUNICACION', 'OTROS');

-- CreateTable
CREATE TABLE "GastoOperativo" (
    "id" SERIAL NOT NULL,
    "concepto" TEXT NOT NULL,
    "descripcion" TEXT,
    "monto" DECIMAL(15,2) NOT NULL,
    "monedaId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "categoria" "CategoriaGasto" NOT NULL,
    "esRecurrente" BOOLEAN NOT NULL DEFAULT false,
    "frecuencia" TEXT,
    "proveedorId" INTEGER,
    "comprobante" TEXT,
    "observaciones" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GastoOperativo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsignacionGastoProyecto" (
    "id" SERIAL NOT NULL,
    "gastoId" INTEGER NOT NULL,
    "presupuestoId" INTEGER NOT NULL,
    "porcentaje" DECIMAL(5,2) NOT NULL,
    "montoAsignado" DECIMAL(15,2) NOT NULL,
    "justificacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AsignacionGastoProyecto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AsignacionGastoProyecto_gastoId_presupuestoId_key" ON "AsignacionGastoProyecto"("gastoId", "presupuestoId");

-- AddForeignKey
ALTER TABLE "GastoOperativo" ADD CONSTRAINT "GastoOperativo_monedaId_fkey" FOREIGN KEY ("monedaId") REFERENCES "Moneda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GastoOperativo" ADD CONSTRAINT "GastoOperativo_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionGastoProyecto" ADD CONSTRAINT "AsignacionGastoProyecto_gastoId_fkey" FOREIGN KEY ("gastoId") REFERENCES "GastoOperativo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionGastoProyecto" ADD CONSTRAINT "AsignacionGastoProyecto_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
