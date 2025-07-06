-- DropForeignKey
ALTER TABLE "HistorialPrecio" DROP CONSTRAINT "HistorialPrecio_productoId_fkey";

-- DropForeignKey
ALTER TABLE "HistorialPrecio" DROP CONSTRAINT "HistorialPrecio_servicioId_fkey";

-- AddForeignKey
ALTER TABLE "HistorialPrecio" ADD CONSTRAINT "HistorialPrecio_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialPrecio" ADD CONSTRAINT "HistorialPrecio_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
