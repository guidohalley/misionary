import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarRecibos } from '@/services/reciboService'
import { Card, Button, Input, DatePicker, Select, Table, Tag, Tooltip, Pagination } from '@/components/ui'
import { HiOutlinePlus, HiOutlineSearch, HiOutlineEye } from 'react-icons/hi'
import { useAppSelector } from '@/store'
import * as gastoService from '@/modules/gasto/service'

export default function RecibosView() {
  const navigate = useNavigate()
  const currentUser = useAppSelector((s) => s.auth.user)
  const roles: any[] = (currentUser?.authority || []) as any
  const isAdmin = roles?.includes('ADMIN')

  const [recibos, setRecibos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [proveedores, setProveedores] = useState<any[]>([])
  const [fProveedorId, setFProveedorId] = useState<string>('')
  const [fConcepto, setFConcepto] = useState('')
  const [fDesde, setFDesde] = useState<Date | null>(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [fHasta, setFHasta] = useState<Date | null>(new Date())
  const [detalleOpen, setDetalleOpen] = useState<any | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [data, provs] = await Promise.all([
          listarRecibos(),
          gastoService.fetchProveedores().catch(() => []),
        ])
        setRecibos(Array.isArray(data) ? data : [])
        setProveedores(Array.isArray(provs) ? provs : [])
      } catch (e) {
        setError('Error al cargar recibos')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const proveedorOptions = useMemo(() => proveedores.map((p: any) => ({ value: String(p.id), label: p.nombre })), [proveedores])

  const filtrados = useMemo(() => {
    const desde = fDesde ? new Date(fDesde.setHours(0,0,0,0)) : null
    const hasta = fHasta ? new Date(new Date(fHasta).setHours(23,59,59,999)) : null
    return (recibos || []).filter((r: any) => {
      if (fProveedorId && String(r.personaId) !== String(fProveedorId)) return false
      if (fConcepto && !String(r.concepto || '').toLowerCase().includes(fConcepto.toLowerCase())) return false
      if (desde || hasta) {
        const fr = new Date(r.fecha)
        if (desde && fr < desde) return false
        if (hasta && fr > hasta) return false
      }
      return true
    })
  }, [recibos, fProveedorId, fConcepto, fDesde, fHasta])

  const totalPorMoneda = useMemo(() => {
    const agg: Record<string, number> = {}
    for (const r of filtrados) {
      const moneda = r.moneda?.codigo || r.presupuesto?.moneda?.codigo || 'ARS'
      const m = Number(r.monto || 0)
      agg[moneda] = (agg[moneda] || 0) + m
    }
    return agg
  }, [filtrados])

  const totalPages = Math.max(1, Math.ceil(filtrados.length / pageSize))
  const pageData = filtrados.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Recibos</h1>
          <div className="text-xs text-gray-500">Pagos a proveedores con notificación por email</div>
        </div>
        {isAdmin && (
          <Button variant="solid" icon={<HiOutlinePlus />} onClick={() => navigate('/recibos/new')}>Nuevo Recibo</Button>
        )}
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <div className="text-xs text-gray-600 mb-1">Proveedor</div>
            <Select
              placeholder="Todos"
              options={proveedorOptions}
              value={proveedorOptions.find((o) => o.value === fProveedorId) || null}
              onChange={(opt: any) => { setFProveedorId(opt?.value || ''); setPage(1) }}
              isClearable
            />
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Buscar concepto</div>
            <div className="relative">
              <Input value={fConcepto} onChange={(e) => { setFConcepto(e.target.value); setPage(1) }} placeholder="Ej: anticipo, comisión..." />
              <HiOutlineSearch className="absolute right-3 top-2.5 text-gray-400" />
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Desde</div>
            <DatePicker value={fDesde || undefined} onChange={(d) => { setFDesde((d as Date) || null); setPage(1) }} />
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Hasta</div>
            <DatePicker value={fHasta || undefined} onChange={(d) => { setFHasta((d as Date) || null); setPage(1) }} />
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span className="mr-2">{filtrados.length} recibos</span>
          {Object.keys(totalPorMoneda).map((k) => (
            <Tag key={k} className="mr-1">{new Intl.NumberFormat('es-AR', { style: 'currency', currency: k }).format(totalPorMoneda[k])}</Tag>
          ))}
        </div>
        {totalPages > 1 && (
          <Pagination currentPage={page} total={filtrados.length} pageSize={pageSize} onChange={(p) => setPage(p)} />
        )}
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Cargando...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : filtrados.length === 0 ? (
          <div className="p-6 text-center text-gray-500">Sin resultados para los filtros seleccionados</div>
        ) : (
          <Table>
            <Table.THead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Proveedor</Table.Th>
                <Table.Th>Presupuesto</Table.Th>
                <Table.Th>Concepto</Table.Th>
                <Table.Th>Monto</Table.Th>
                <Table.Th>Fecha</Table.Th>
                <Table.Th>Método</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.THead>
            <Table.TBody>
              {pageData.map((r) => {
                const moneda = r.moneda?.codigo || r.presupuesto?.moneda?.codigo || 'ARS'
                const montoFmt = new Intl.NumberFormat('es-AR', { style: 'currency', currency: moneda }).format(Number(r.monto || 0))
                return (
                  <Table.Tr key={r.id}>
                    <Table.Td>#{r.id}</Table.Td>
                    <Table.Td>{r.persona?.nombre || r.personaId}</Table.Td>
                    <Table.Td>{r.presupuestoId ? `#${r.presupuestoId}` : '-'}</Table.Td>
                    <Table.Td>
                      <Tooltip title={r.concepto || ''}>
                        <span className="line-clamp-1 max-w-[260px] block">{r.concepto || '-'}</span>
                      </Tooltip>
                    </Table.Td>
                    <Table.Td className="whitespace-nowrap font-semibold">{montoFmt}</Table.Td>
                    <Table.Td>{new Date(r.fecha).toLocaleDateString('es-AR')}</Table.Td>
                    <Table.Td className="uppercase text-xs">{r.metodoPago}</Table.Td>
                    <Table.Td>
                      <Button size="sm" variant="twoTone" icon={<HiOutlineEye />} onClick={() => setDetalleOpen(r)}>Ver</Button>
                    </Table.Td>
                  </Table.Tr>
                )
              })}
            </Table.TBody>
          </Table>
        )}
      </Card>

      {detalleOpen && (
        <Card className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-lg font-semibold">Recibo #{detalleOpen.id}</div>
              <div className="text-xs text-gray-500">Proveedor: {detalleOpen.persona?.nombre || detalleOpen.personaId}</div>
            </div>
            <Button variant="plain" onClick={() => setDetalleOpen(null)}>Cerrar</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-500">Concepto:</span> {detalleOpen.concepto || '-'}</div>
            <div><span className="text-gray-500">Presupuesto:</span> {detalleOpen.presupuestoId ? `#${detalleOpen.presupuestoId}` : '-'}</div>
            <div><span className="text-gray-500">Fecha:</span> {new Date(detalleOpen.fecha).toLocaleString('es-AR')}</div>
            <div><span className="text-gray-500">Método:</span> {detalleOpen.metodoPago}</div>
            <div><span className="text-gray-500">Monto:</span> {new Intl.NumberFormat('es-AR', { style: 'currency', currency: detalleOpen.moneda?.codigo || detalleOpen.presupuesto?.moneda?.codigo || 'ARS' }).format(Number(detalleOpen.monto || 0))}</div>
          </div>
        </Card>
      )}
    </div>
  )
}
