-- CreateTable
CREATE TABLE "HistorialPrecio" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER,
    "servicioId" INTEGER,
    "monedaId" INTEGER NOT NULL,
    "precio" DECIMAL(15,2) NOT NULL,
    "fechaDesde" TIMESTAMP(3) NOT NULL,
    "fechaHasta" TIMESTAMP(3),
    "motivoCambio" TEXT,
    "usuarioId" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistorialPrecio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HistorialPrecio" ADD CONSTRAINT "HistorialPrecio_monedaId_fkey" FOREIGN KEY ("monedaId") REFERENCES "Moneda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialPrecio" ADD CONSTRAINT "HistorialPrecio_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialPrecio" ADD CONSTRAINT "HistorialPrecio_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialPrecio" ADD CONSTRAINT "HistorialPrecio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "HistorialPrecio_productoId_activo_idx" ON "HistorialPrecio"("productoId", "activo");

-- CreateIndex
CREATE INDEX "HistorialPrecio_servicioId_activo_idx" ON "HistorialPrecio"("servicioId", "activo");

-- CreateIndex
CREATE INDEX "HistorialPrecio_fechaDesde_idx" ON "HistorialPrecio"("fechaDesde");

-- AddColumn para campos de comisión si no existen
ALTER TABLE "Producto" ADD COLUMN IF NOT EXISTS "costoProveedor" DECIMAL(15,2);
ALTER TABLE "Producto" ADD COLUMN IF NOT EXISTS "margenAgencia" DECIMAL(5,2);

ALTER TABLE "Servicio" ADD COLUMN IF NOT EXISTS "costoProveedor" DECIMAL(15,2);
ALTER TABLE "Servicio" ADD COLUMN IF NOT EXISTS "margenAgencia" DECIMAL(5,2);
