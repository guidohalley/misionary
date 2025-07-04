-- CreateEnum
CREATE TYPE "TipoPersona" AS ENUM ('CLIENTE', 'PROVEEDOR', 'INTERNO');

-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'CONTADOR', 'PROVEEDOR');

-- CreateEnum
CREATE TYPE "EstadoPresupuesto" AS ENUM ('BORRADOR', 'ENVIADO', 'APROBADO', 'FACTURADO');

-- CreateEnum
CREATE TYPE "EstadoFactura" AS ENUM ('EMITIDA', 'PAGADA', 'ANULADA');

-- CreateTable
CREATE TABLE "Persona" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoPersona" NOT NULL,
    "telefono" TEXT,
    "cvu" TEXT,
    "roles" "RolUsuario"[],
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "proveedorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servicio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "proveedorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Presupuesto" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "impuestos" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "estado" "EstadoPresupuesto" NOT NULL DEFAULT 'BORRADOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Presupuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "presupuestoId" INTEGER NOT NULL,
    "productoId" INTEGER,
    "servicioId" INTEGER,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factura" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "presupuestoId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "impuestos" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "estado" "EstadoFactura" NOT NULL,
    "impuestoAplicadoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Factura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recibo" (
    "id" SERIAL NOT NULL,
    "personaId" INTEGER NOT NULL,
    "concepto" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "metodoPago" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recibo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Impuesto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "porcentaje" DOUBLE PRECISION NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Impuesto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Persona_email_key" ON "Persona"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_numero_key" ON "Factura"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_presupuestoId_key" ON "Factura"("presupuestoId");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicio" ADD CONSTRAINT "Servicio_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presupuesto" ADD CONSTRAINT "Presupuesto_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_impuestoAplicadoId_fkey" FOREIGN KEY ("impuestoAplicadoId") REFERENCES "Impuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recibo" ADD CONSTRAINT "Recibo_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
