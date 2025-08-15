-- CreateEnum (if not exists)
DO $$ BEGIN
    CREATE TYPE "TipoCotizacion" AS ENUM ('OFICIAL', 'BLUE', 'TARJETA', 'MEP', 'CCL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum (if not exists)
DO $$ BEGIN
    CREATE TYPE "CategoriaGasto" AS ENUM ('OFICINA', 'PERSONAL', 'MARKETING', 'TECNOLOGIA', 'SERVICIOS', 'TRANSPORTE', 'COMUNICACION', 'OTROS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable (if not exists)
CREATE TABLE IF NOT EXISTS "TipoGasto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "color" TEXT,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoGasto_pkey" PRIMARY KEY ("id")
);

-- AlterTable (safe)
DO $$ BEGIN
    ALTER TABLE "GastoOperativo" ADD COLUMN IF NOT EXISTS "categoria" "CategoriaGasto" NOT NULL DEFAULT 'OTROS';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "GastoOperativo" ADD COLUMN IF NOT EXISTS "tipoId" INTEGER;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- AlterTable (safe)
DO $$ BEGIN
    ALTER TABLE "TipoCambio" ADD COLUMN IF NOT EXISTS "fuente" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "TipoCambio" ADD COLUMN IF NOT EXISTS "tipo" "TipoCotizacion" NOT NULL DEFAULT 'OFICIAL';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- DropIndex (safe)
DROP INDEX IF EXISTS "TipoCambio_monedaDesdeId_monedaHaciaId_fecha_key";

-- CreateIndex (safe)
CREATE UNIQUE INDEX IF NOT EXISTS "TipoGasto_slug_key" ON "TipoGasto"("slug");

-- CreateIndex (safe)
CREATE INDEX IF NOT EXISTS "TipoCambio_fecha_idx" ON "TipoCambio"("fecha");

-- CreateIndex (safe)
CREATE UNIQUE INDEX IF NOT EXISTS "TipoCambio_monedaDesdeId_monedaHaciaId_tipo_fecha_key" ON "TipoCambio"("monedaDesdeId", "monedaHaciaId", "tipo", "fecha");

-- AddForeignKey (safe)
DO $$ BEGIN
    ALTER TABLE "GastoOperativo" ADD CONSTRAINT "GastoOperativo_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "TipoGasto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- DropTable if exists old Categoria
DROP TABLE IF EXISTS "Categoria";
