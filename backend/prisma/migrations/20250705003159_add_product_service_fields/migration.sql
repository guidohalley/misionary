-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "categoria" TEXT,
ADD COLUMN     "complejidad" TEXT,
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "imagenUrl" TEXT,
ADD COLUMN     "tiempoEstimado" INTEGER;

-- AlterTable
ALTER TABLE "Servicio" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "imagenUrl" TEXT,
ADD COLUMN     "tipoServicio" TEXT;
