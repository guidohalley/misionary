import { useState } from 'react'
import { getResumenPresupuesto, crearPagoAdmin } from '@/services/finanzasService'

export default function FinanzasView() {
  const [presupuestoId, setPresupuestoId] = useState<number | ''>('' as any)
  const [resumen, setResumen] = useState<any>(null)
  const [monto, setMonto] = useState<number | ''>('' as any)
  const [metodo, setMetodo] = useState('transferencia')
  const [mensaje, setMensaje] = useState<string>('')

  const cargar = async () => {
    setMensaje('')
    if (!presupuestoId) return
    try {
      const data = await getResumenPresupuesto(Number(presupuestoId))
      setResumen(data)
    } catch (e: any) {
      setMensaje(e?.response?.data?.error || 'Error al cargar resumen')
    }
  }

  const pagar = async () => {
    setMensaje('')
    if (!presupuestoId || !monto) return
    try {
      const now = new Date().toISOString()
      await crearPagoAdmin({
        adminId: 1,
        presupuestoId: Number(presupuestoId),
        monto: Number(monto),
        fecha: now,
        metodoPago: metodo,
      })
      await cargar()
      setMensaje('Pago registrado')
    } catch (e: any) {
      setMensaje(e?.response?.data?.error || e?.message || 'Error al pagar')
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Finanzas</h1>
      <div className="flex gap-2 items-center mb-4">
        <input className="border px-2 py-1 w-40" placeholder="Presupuesto ID" value={presupuestoId as any} onChange={e=>setPresupuestoId(e.target.value as any)} />
        <button className="px-3 py-1 bg-black text-white" onClick={cargar}>Cargar resumen</button>
      </div>
      {resumen && (
        <div className="border rounded p-3 mb-4">
          <div>Moneda: {resumen.moneda}</div>
          <div>Total: {resumen.totalPrecio}</div>
          <div>Ganancia empresa: {resumen.totalGananciaEmpresa}</div>
          <div>Pagado proveedor: {resumen.totalPagadoProveedor}</div>
          <div>Pagado admin: {resumen.totalPagadoAdmin}</div>
          <div>Disponible admin: {resumen.disponibleAdmin}</div>
        </div>
      )}
      <div className="flex gap-2 items-center">
        <input className="border px-2 py-1 w-32" placeholder="Monto" value={monto as any} onChange={e=>setMonto(e.target.value as any)} />
        <select className="border px-2 py-1" value={metodo} onChange={e=>setMetodo(e.target.value)}>
          <option value="transferencia">Transferencia</option>
          <option value="efectivo">Efectivo</option>
        </select>
        <button className="px-3 py-1 bg-black text-white" onClick={pagar}>Pagar ADMIN</button>
      </div>
      {mensaje && <div className="mt-3 text-sm">{mensaje}</div>}
    </div>
  )
}
