import { useEffect, useMemo, useState } from 'react'
import { Card, Button, DatePicker, Table, Dialog, Input, Tooltip, Select } from '@/components/ui'
import { listarCobrosClienteApi, crearCobroClienteApi, fetchClientes, fetchPresupuestos } from '@/modules/dashboard/service'
import { FiInfo } from 'react-icons/fi'
import { useAppSelector } from '@/store'
import { NumericFormat } from 'react-number-format'
import { useMonedas } from '@/modules/historialPrecio/hooks/useMonedas'

const { THead, TBody, Tr, Th, Td } = Table

export default function RentabilidadMain() {
  const currentUser = useAppSelector((s) => s.auth.user)
  const roles: any[] = (currentUser?.authority || []) as any
  const isAdmin = roles?.includes('ADMIN')
  const [desde, setDesde] = useState<Date>(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [hasta, setHasta] = useState<Date>(() => new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
  const [cobros, setCobros] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<any>({ presupuestoId: '', clienteId: '', monto: '', fecha: new Date().toISOString().split('T')[0], metodoPago: 'EFECTIVO', concepto: '' })
  const [clienteOptions, setClienteOptions] = useState<{value: string; label: string}[]>([])
  const [presupuestoOptions, setPresupuestoOptions] = useState<{value: string; label: string}[]>([])
  const [presupuestosCliente, setPresupuestosCliente] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const { opcionesMonedasActivas, getMonedaById } = useMonedas()

  const rangeQs = useMemo(() => ({ desde: desde.toISOString(), hasta: new Date(hasta.getFullYear(), hasta.getMonth(), hasta.getDate(), 23, 59, 59, 999).toISOString() }), [desde, hasta])

  useEffect(() => {
    const load = async () => {
      const data = await listarCobrosClienteApi(rangeQs)
      setCobros(
        data.map((c: any) => ({
          ...c,
          fecha: new Date(c.fecha).toLocaleDateString('es-AR'),
          cliente: c.presupuesto?.cliente?.nombre || '-',
          empresa: c.presupuesto?.empresa?.nombre || '-',
        }))
      )
    }
    load()
  }, [rangeQs.desde, rangeQs.hasta])

  useEffect(() => {
    // Prefetch clientes para el modal
    const loadClientes = async () => {
      const clientes = await fetchClientes()
      setClienteOptions(clientes.map((c: any) => ({ value: String(c.id), label: c.nombre })))
    }
    loadClientes()
  }, [])

  const onClienteChange = async (opt: any) => {
    const clienteId = opt?.value || ''
    setForm((f: any) => ({ ...f, clienteId, presupuestoId: '', monedaId: '' }))
    if (clienteId) {
      const pres = await fetchPresupuestos({ clienteId })
      setPresupuestosCliente(pres)
      setPresupuestoOptions(
        pres.map((p: any) => ({
          value: String(p.id),
          label: `#${p.id} · ${(p.empresa?.nombre) || '-'} · ${(p.estado) || ''}`,
        }))
      )
    } else {
      setPresupuestosCliente([])
      setPresupuestoOptions([])
    }
  }

  const onPresupuestoChange = (opt: any, presList: any[]) => {
    const presupuestoId = opt?.value || ''
    let monedaId = ''
    if (presupuestoId) {
      const p = presList.find((pp: any) => String(pp.id) === String(presupuestoId))
      if (p?.moneda?.id) monedaId = String(p.moneda.id)
    }
    setForm((f: any) => ({ ...f, presupuestoId, monedaId }))
  }

  const onCreate = async () => {
    if (!form.presupuestoId || !form.monto) return
    setSaving(true)
    try {
      await crearCobroClienteApi({
        presupuestoId: Number(form.presupuestoId),
        monto: Number(form.monto),
        fecha: new Date(form.fecha).toISOString(),
        metodoPago: form.metodoPago,
        concepto: form.concepto,
        monedaId: form.monedaId ? Number(form.monedaId) : undefined,
      })
      setOpen(false)
      // reload
      const data = await listarCobrosClienteApi(rangeQs)
      setCobros(
        data.map((c: any) => ({
          ...c,
          fecha: new Date(c.fecha).toLocaleDateString('es-AR'),
          cliente: c.presupuesto?.cliente?.nombre || '-',
          empresa: c.presupuesto?.empresa?.nombre || '-',
        }))
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-center gap-2">
          <div>
            <div className="text-xs text-gray-600 mb-1">Desde</div>
            <DatePicker value={desde} onChange={(d) => d && setDesde(d as Date)} />
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Hasta</div>
            <DatePicker value={hasta} onChange={(d) => d && setHasta(d as Date)} />
          </div>
        </div>
        <div>
          {isAdmin ? (
            <Button variant="twoTone" onClick={() => setOpen(true)}>Registrar cobro del cliente</Button>
          ) : (
            <div className="text-xs text-gray-500">Solo ADMIN pueden registrar cobros directos</div>
          )}
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold">Cobros del cliente (sin factura)</div>
          <Tooltip title="Registra pagos del cliente no asociados a AFIP/factura (efectivo, otras formas).">
            <span className="text-gray-400 hover:text-gray-600 cursor-help"><FiInfo /></span>
          </Tooltip>
        </div>
        <Table>
          <THead>
            <Tr>
              <Th>Fecha</Th>
              <Th>Presupuesto</Th>
              <Th>Cliente</Th>
              <Th>Empresa</Th>
              <Th>Monto</Th>
              <Th>Método</Th>
              <Th>Concepto</Th>
            </Tr>
          </THead>
          <TBody>
            {cobros.map((c) => (
              <Tr key={c.id}>
                <Td>{c.fecha}</Td>
                <Td>#{c.presupuestoId}</Td>
                <Td>{c.cliente || '-'}</Td>
                <Td>{c.empresa || '-'}</Td>
                <Td>
                  {new Intl.NumberFormat('es-AR', { style: 'currency', currency: c.moneda?.codigo || c.presupuesto?.moneda?.codigo || 'ARS' }).format(Number(c.monto || 0))}
                </Td>
                <Td>{c.metodoPago}</Td>
                <Td>{c.concepto || '-'}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Card>

      <Dialog isOpen={open} onClose={() => setOpen(false)} onRequestClose={() => setOpen(false)}>
        <h3 className="text-lg font-semibold mb-3">Registrar cobro del cliente</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-gray-600 mb-1">Cliente</div>
            <Select
              placeholder="Seleccioná un cliente"
              options={clienteOptions}
              value={clienteOptions.find((o) => o.value === form.clienteId) || null}
              onChange={onClienteChange}
            />
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Presupuesto</div>
            <Select
              placeholder={form.clienteId ? 'Seleccioná un presupuesto' : 'Primero seleccioná un cliente'}
              isDisabled={!form.clienteId}
              options={presupuestoOptions}
              value={presupuestoOptions.find((o) => o.value === form.presupuestoId) || null}
              onChange={(opt: any) => onPresupuestoChange(opt, presupuestosCliente)}
            />
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Monto</div>
            <NumericFormat
              value={form.monto}
              onValueChange={(vals) => setForm({ ...form, monto: vals.floatValue || '' })}
              thousandSeparator='.'
              decimalSeparator=','
              allowNegative={false}
              decimalScale={2}
              customInput={Input as any}
              placeholder="Ej: 100.000,00"
            />
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Fecha</div>
            <Input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Moneda</div>
            <Select
              placeholder="Seleccioná una moneda"
              options={opcionesMonedasActivas as any}
              value={(opcionesMonedasActivas as any)?.find((o: any) => String(o.value) === String(form.monedaId)) || null}
              onChange={(opt: any) => setForm({ ...form, monedaId: opt?.value || '' })}
            />
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Método de pago</div>
            <Input value={form.metodoPago} onChange={(e) => setForm({ ...form, metodoPago: e.target.value })} placeholder="EFECTIVO / TRANSFERENCIA" />
          </div>
          <div className="sm:col-span-2">
            <div className="text-xs text-gray-600 mb-1">Concepto</div>
            <Input value={form.concepto} onChange={(e) => setForm({ ...form, concepto: e.target.value })} placeholder="Detalle (opcional)" />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="plain" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={onCreate} disabled={!isAdmin || !form.presupuestoId || !form.monto || saving} loading={saving}>Guardar</Button>
        </div>
      </Dialog>
    </div>
  )
}
