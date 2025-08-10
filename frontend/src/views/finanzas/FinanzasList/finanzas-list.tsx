import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button, Card, Input, Select, Tooltip } from '@/components/ui'
import DataTable from '@/components/shared/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { HiOutlinePencil, HiOutlineTrash, HiOutlineCurrencyDollar, HiOutlineEye } from 'react-icons/hi'
import { useFinanzas } from '@/modules/finanzas/hooks/useFinanzas'
import { usePresupuesto } from '@/modules/presupuesto/hooks/usePresupuesto'
import type { Presupuesto } from '@/modules/presupuesto/types'
import * as finanzasService from '@/services/finanzasService'

const FinanzasList: React.FC = () => {
  const navigate = useNavigate()
  const { presupuestos, loading, error, refreshPresupuestos, deletePresupuesto } = usePresupuesto()
  const { fetchResumen } = useFinanzas()

  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [resumenMap, setResumenMap] = useState<Record<number, finanzasService.ResumenPresupuesto>>({})

  const filtered = useMemo(() => {
    if (!search) return presupuestos
    const term = search.toLowerCase()
    return presupuestos.filter(p => `${p.id}`.includes(term) || p.cliente?.nombre?.toLowerCase().includes(term))
  }, [presupuestos, search])

  useEffect(() => {
    // Cargar resúmenes de los primeros N visibles para performance simple
    const load = async () => {
      const ids = filtered.slice(0, pageSize).map(p => p.id)
      const newMap: Record<number, finanzasService.ResumenPresupuesto> = { ...resumenMap }
      for (const id of ids) {
        if (!newMap[id]) {
          try {
            newMap[id] = await fetchResumen(id)
          } catch (e) {
            // noop
          }
        }
      }
      setResumenMap(newMap)
    }
    if (filtered.length) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, pageSize])

  const columns = useMemo<ColumnDef<Presupuesto>[]>(() => [
    {
      header: '#',
      accessorKey: 'id',
      size: 70,
      cell: ({ row }) => <div className="font-medium text-gray-900">#{row.original.id}</div>,
    },
    {
      header: 'Cliente',
      accessorKey: 'cliente.nombre',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-medium text-gray-900">{row.original.cliente?.nombre}</div>
          <div className="text-xs text-gray-500">{row.original.cliente?.email}</div>
        </div>
      ),
    },
    {
      header: 'Empresa',
      id: 'empresa',
      cell: ({ row }) => (
        <div className="text-sm text-gray-700">
          {row.original.empresa?.nombre || '—'}
        </div>
      ),
    },
    {
      header: 'Ganancia (empresa)',
      id: 'gananciaEmpresa',
      cell: ({ row }) => {
        const r = resumenMap[row.original.id]
        const simbolo = row.original.moneda?.simbolo || '$'
        const valueNum = Number(r?.totalGananciaEmpresa ?? NaN)
        const text = Number.isFinite(valueNum)
          ? `${simbolo} ${valueNum.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : '—'
        return <div className="text-right font-semibold">{text}</div>
      },
    },
    {
      header: 'Fecha desde',
      id: 'fechaDesde',
      cell: ({ row }) => (
        <div className="text-sm">{new Date(row.original.createdAt).toLocaleDateString('es-AR')}</div>
      ),
    },
    {
      header: 'Fecha hasta',
      id: 'fechaHasta',
      cell: ({ row }) => (
        <div className="text-sm">{new Date(row.original.updatedAt).toLocaleDateString('es-AR')}</div>
      ),
    },
    {
      header: 'Acciones',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          <Tooltip title="Ver resumen">
            <Button size="xs" variant="plain" icon={<HiOutlineEye />} onClick={() => navigate(`/finanzas/${row.original.id}`)} />
          </Tooltip>
          <Tooltip title="Registrar pago a proveedor">
            <Button size="xs" variant="plain" icon={<HiOutlineCurrencyDollar />} onClick={() => navigate(`/finanzas/${row.original.id}`)} />
          </Tooltip>
          <Tooltip title="Editar presupuesto">
            <Button size="xs" variant="plain" icon={<HiOutlinePencil />} onClick={() => navigate(`/presupuestos/edit/${row.original.id}`)} />
          </Tooltip>
          <Tooltip title="Eliminar presupuesto">
            <Button size="xs" variant="plain" className="text-red-600 hover:text-red-800" icon={<HiOutlineTrash />} onClick={() => onDelete(row.original)} />
          </Tooltip>
        </div>
      ),
    },
  ], [navigate, resumenMap])

  const onDelete = async (p: Presupuesto) => {
    if (!window.confirm(`¿Eliminar presupuesto #${p.id}? Esta acción no se puede deshacer.`)) return
    try {
      await deletePresupuesto(p.id)
    } catch (e) {
      // Opcional: notificación de error
      console.error('Error al eliminar presupuesto', e)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finanzas</h1>
          <p className="text-gray-600">Resumen y acciones por presupuesto</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="solid" onClick={() => navigate('/recibos/new')}>Registrar pago a proveedor</Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input className="w-64" placeholder="Buscar por # o cliente" value={search} onChange={(e) => setSearch(e.target.value)} />
          {(() => {
            const pageSizeOptions: { value: number; label: string }[] = [
              { value: 10, label: '10 por página' },
              { value: 25, label: '25 por página' },
              { value: 50, label: '50 por página' },
            ]
            const selected = pageSizeOptions.find(o => o.value === pageSize) || pageSizeOptions[0]
            return (
              <Select
                value={selected}
                onChange={(opt: any) => { if (opt && typeof opt.value === 'number') setPageSize(opt.value) }}
                options={pageSizeOptions}
              />
            )
          })()}
        </div>
      </Card>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        skeletonAvatarColumns={[]}
        pagingData={{ total: filtered.length, pageIndex: 0, pageSize }}
      />

      {error && (
        <div className="text-red-600">{error}</div>
      )}
    </motion.div>
  )
}

export default FinanzasList
