-- CreateTable
CREATE TABLE "PresupuestoVersion" (
    "id" SERIAL NOT NULL,
    "presupuestoId" INTEGER NOT NULL,
    "versionNumero" INTEGER NOT NULL,
    "subtotalAnterior" DECIMAL(15,2),
    "subtotalNuevo" DECIMAL(15,2) NOT NULL,
    "impuestosAnterior" DECIMAL(15,2),
    "impuestosNuevo" DECIMAL(15,2) NOT NULL,
    "totalAnterior" DECIMAL(15,2),
    "totalNuevo" DECIMAL(15,2) NOT NULL,
    "estadoAnterior" "EstadoPresupuesto",
    "estadoNuevo" "EstadoPresupuesto" NOT NULL,
    "usuarioModificacionId" INTEGER,
    "motivoCambio" TEXT,
    "fechaCambio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "snapshotData" JSONB NOT NULL,
    "tipoOperacion" TEXT NOT NULL DEFAULT 'UPDATE',

    CONSTRAINT "PresupuestoVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PresupuestoVersion_presupuestoId_idx" ON "PresupuestoVersion"("presupuestoId");

-- CreateIndex
CREATE INDEX "PresupuestoVersion_fechaCambio_idx" ON "PresupuestoVersion"("fechaCambio");

-- CreateIndex
CREATE INDEX "PresupuestoVersion_usuarioModificacionId_idx" ON "PresupuestoVersion"("usuarioModificacionId");

-- CreateIndex
CREATE UNIQUE INDEX "PresupuestoVersion_presupuestoId_versionNumero_key" ON "PresupuestoVersion"("presupuestoId", "versionNumero");

-- AddForeignKey
ALTER TABLE "PresupuestoVersion" ADD CONSTRAINT "PresupuestoVersion_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresupuestoVersion" ADD CONSTRAINT "PresupuestoVersion_usuarioModificacionId_fkey" FOREIGN KEY ("usuarioModificacionId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;
