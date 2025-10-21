import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, Button, Input, Select, FormItem, FormContainer, DatePicker } from '@/components/ui'
import Dialog from '@/components/ui/Dialog'
import MoneyInput from '@/components/shared/MoneyInput'
import { HiOutlineCash, HiOutlineSave, HiOutlineX } from 'react-icons/hi'
import { useFinanzas } from '@/modules/finanzas/hooks/useFinanzas'
import { getResumenProveedores, type ResumenProveedor } from '@/services/finanzasService'
import { fetchPersonas } from '@/modules/persona/service'
import { crearRecibo } from '@/services/reciboService'
import { useGastoAuxiliarData } from '@/modules/gasto/hooks/useGasto'
import { useAppSelector } from '@/store'
import useAuthority from '@/utils/hooks/useAuthority'

const FinanzasResumen: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const presupuestoIdFromUrl = params.id ? Number(params.id) : undefined
  const { resumen, fetchResumen, createPagoAdmin, pagosAdmin, fetchPagosAdmin } = useFinanzas()
  const { presupuestos, monedas } = useGastoAuxiliarData()
  const userState = useAppSelector((s) => s.auth.user)
  const userAuthority = userState.authority
  const currentEmail = userState.email
  const isAdmin = useAuthority(userAuthority, ['ADMIN'])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [proveedores, setProveedores] = useState<ResumenProveedor[]>([])
  const [provSel, setProvSel] = useState<ResumenProveedor | null>(null)
  const [provForm, setProvForm] = useState({
    personaId: undefined as number | undefined,
    presupuestoId: undefined as number | undefined,
    concepto: '',
    monto: 0,
    monedaId: 1,
    fecha: new Date(),
    metodoPago: 'transferencia',
    emailNotificacion: '',
  })
  const [form, setForm] = useState({
    presupuestoId: presupuestoIdFromUrl as number | undefined,
    adminId: undefined as number | undefined,
    monto: 0,
    monedaId: 1,
    metodoPago: 'transferencia',
    concepto: '',
  })
  const [admins, setAdmins] = useState<{ value: number; label: string; email?: string }[]>([])
  const [showAdminPay, setShowAdminPay] = useState(false)
  const openAdminPay = () => {
    if (!isAdmin) return
    let suggested = 0
    try {
      if (resumen && Array.isArray(admins) && admins.length > 0) {
        const base = Number(resumen.disponibleAdmin ?? 0)
        const divisor = admins.length || 1
        suggested = Number((base / divisor).toFixed(2))
      }
    } catch {}
    // Preseleccionar admin logueado si existe y no hay uno seleccionado
    const mine = admins.find((a) => a.email && a.email === currentEmail)
    setForm((f) => ({ ...f, monto: suggested, adminId: f.adminId ?? mine?.value }))
    setShowAdminPay(true)
  }

  const monedaOptions = useMemo(() => (
    Array.isArray(monedas) ? monedas : []
  ).map(m => ({ value: m.id, label: `${m.simbolo} ${m.codigo}` })), [monedas])

  const selectedMoneda = (monedas || []).find(m => m.id === form.monedaId)

  const cargar = async () => {
    if (!form.presupuestoId) return
    await fetchResumen(form.presupuestoId)
    await fetchPagosAdmin(form.presupuestoId)
    try {
      const list = await getResumenProveedores(form.presupuestoId)
      setProveedores(list)
    } catch {}
  }

  useEffect(() => {
    // Inicializar presupuesto desde URL y cargar admins (personas internas)
    if (presupuestoIdFromUrl && form.presupuestoId !== presupuestoIdFromUrl) {
      setForm((f) => ({ ...f, presupuestoId: presupuestoIdFromUrl }))
    }
    const loadAdmins = async () => {
      try {
        const personas = await fetchPersonas()
        const internos = (personas || []).filter((p: any) => Array.isArray(p.roles) && p.roles.includes('ADMIN'))
        const arr = internos.map((p: any) => ({ value: p.id, label: p.nombre, email: p.email }))
        setAdmins(arr)
        // Si el usuario actual es ADMIN, preseleccionar su propio id
        if (isAdmin && currentEmail) {
          const mine = arr.find((a) => a.email === currentEmail)
          if (mine) setForm((f) => ({ ...f, adminId: f.adminId ?? mine.value }))
        }
      } catch {}
    }
    loadAdmins()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presupuestoIdFromUrl])

  useEffect(() => {
    if (form.presupuestoId) {
      cargar()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.presupuestoId])

  const abrirPagoProveedor = (p: ResumenProveedor) => {
    setProvSel(p)
    setProvForm({
      personaId: p.proveedorId,
      presupuestoId: form.presupuestoId,
      concepto: `Pago a proveedor - Presupuesto #${form.presupuestoId}`,
      monto: Number(p.pendienteProveedor || 0),
      monedaId: form.monedaId || 1,
      fecha: new Date(),
      metodoPago: 'transferencia',
      emailNotificacion: p.proveedorEmail || '',
    })
  }

  const submitPagoProveedor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAdmin) {
      alert('Solo usuarios ADMIN pueden registrar pagos')
      return
    }
    if (!provForm.presupuestoId || !provForm.personaId || !provForm.concepto || provForm.monto <= 0) {
      alert('Completá proveedor, concepto y monto válido')
      return
    }
    if (!provForm.emailNotificacion?.trim()) {
      alert('Ingresá un email para notificar al proveedor')
      return
    }
    try {
      setIsSubmitting(true)
      await crearRecibo({
        personaId: provForm.personaId,
        presupuestoId: provForm.presupuestoId,
        concepto: provForm.concepto,
        monto: provForm.monto,
        monedaId: provForm.monedaId,
        fecha: provForm.fecha.toISOString(),
        metodoPago: provForm.metodoPago,
        emailNotificacion: provForm.emailNotificacion,
      })
      // Refresh resumen y tabla de proveedores
      await cargar()
      setProvSel(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const pagar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.presupuestoId || form.monto <= 0 || !form.adminId) {
      alert('Seleccioná presupuesto, ADMIN y monto válido')
      return
    }
    try {
      setIsSubmitting(true)
      await createPagoAdmin({
        adminId: form.adminId,
        presupuestoId: form.presupuestoId,
        monto: form.monto,
        fecha: new Date().toISOString(),
        metodoPago: form.metodoPago,
        concepto: form.concepto || undefined,
        monedaId: form.monedaId,
      } as any)
      await cargar()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="container mx-auto p-4 max-w-6xl">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.3 }} className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <button onClick={() => navigate('/finanzas')} className="hover:text-blue-600 transition-colors">Finanzas</button>
          <span>/</span>
          <span>Resumen</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <HiOutlineCash className="text-blue-600" />
          Finanzas: Resumen por Presupuesto #{form.presupuestoId}
        </h1>
      </motion.div>

      {resumen && (
        <Card className="mt-6">
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded p-3">
              <div className="text-gray-500">Moneda</div>
              <div className="text-xl font-semibold">{resumen.moneda}</div>
            </div>
            <div className="border rounded p-3">
              <div className="text-gray-500">Total</div>
              <div className="text-xl font-semibold">{Number(resumen.totalPrecio || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="border rounded p-3">
              <div className="text-gray-500">Ganancia empresa</div>
              <div className="text-xl font-semibold">{Number(resumen.totalGananciaEmpresa || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="border rounded p-3">
              <div className="text-gray-500">Pagado proveedor</div>
              <div className="text-xl font-semibold">{Number(resumen.totalPagadoProveedor || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
            </div>
            {isAdmin && (
              <div className="border rounded p-3">
                <div className="text-gray-500">Pagado admin</div>
                <div className="text-xl font-semibold">{Number(resumen.totalPagadoAdmin || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
              </div>
            )}
            {isAdmin && (
              <div className="border rounded p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-500">Disponible admin</div>
                    <div className="text-xl font-semibold">{Number(resumen.disponibleAdmin || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
                  </div>
                  <Button size="sm" onClick={openAdminPay}>Pagar a admin</Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <Dialog isOpen={showAdminPay} onClose={() => setShowAdminPay(false)} onRequestClose={() => setShowAdminPay(false)}>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Pagar a ADMIN</h3>
          <form
            onSubmit={(e) => {
              pagar(e)
              if (!isSubmitting) setShowAdminPay(false)
            }}
          >
            <FormContainer>
              <FormItem label="ADMIN" asterisk>
                <Select
                  options={admins}
                  value={admins.find(a => a.value === form.adminId)}
                  onChange={(o) => setForm({ ...form, adminId: o?.value })}
                  placeholder="Elegí el admin a pagar"
                />
              </FormItem>
              <FormItem label="Monto" asterisk>
                <MoneyInput
                  value={form.monto}
                  onChange={(v) => setForm({ ...form, monto: v })}
                  currency={selectedMoneda?.codigo || 'ARS'}
                  currencySymbol={selectedMoneda?.simbolo || '$'}
                />
              </FormItem>
              <FormItem label="Moneda" asterisk>
                <Select
                  options={monedaOptions}
                  value={monedaOptions.find(o => o.value === form.monedaId)}
                  onChange={(o) => setForm({ ...form, monedaId: o?.value || 1 })}
                />
              </FormItem>
              <FormItem label="Método de pago">
                <Select
                  options={[{ value: 'transferencia', label: 'Transferencia' }, { value: 'efectivo', label: 'Efectivo' }]}
                  value={{ value: form.metodoPago, label: form.metodoPago.charAt(0).toUpperCase() + form.metodoPago.slice(1) }}
                  onChange={(o) => setForm({ ...form, metodoPago: o?.value || 'transferencia' })}
                />
              </FormItem>
              <FormItem label="Concepto">
                <Input value={form.concepto} onChange={(e) => setForm({ ...form, concepto: e.target.value })} />
              </FormItem>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="plain" onClick={() => setShowAdminPay(false)}>Cancelar</Button>
                <Button type="submit" variant="solid" loading={isSubmitting} disabled={isSubmitting || !form.presupuestoId}>Pagar</Button>
              </div>
            </FormContainer>
          </form>
        </div>
      </Dialog>

  {isAdmin && form.presupuestoId && pagosAdmin?.length > 0 && (
        <Card className="mt-6">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-3">Pagos a ADMIN</h3>
            {/* Vista Desktop - Tabla */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">Fecha</th>
                    <th className="py-2 pr-4">Admin</th>
                    <th className="py-2 pr-4">Concepto</th>
                    <th className="py-2 pr-4 text-right">Monto</th>
                    <th className="py-2 pr-4">Método</th>
                  </tr>
                </thead>
                <tbody>
                  {pagosAdmin.map((p: any, idx: number) => (
                    <tr key={p.id || idx} className="border-b last:border-b-0">
                      <td className="py-2 pr-4">{p.fecha ? new Date(p.fecha).toLocaleDateString() : '-'}</td>
                      <td className="py-2 pr-4">{p.admin?.nombre || p.adminId}</td>
                      <td className="py-2 pr-4">{p.concepto || '-'}</td>
                      <td className="py-2 pr-4 text-right">{Number(p.monto || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 pr-4">{p.metodoPago}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vista Mobile - Cards */}
            <div className="md:hidden space-y-3">
              {pagosAdmin.map((p: any, idx: number) => (
                <div key={p.id || idx} className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Fecha:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">{p.fecha ? new Date(p.fecha).toLocaleDateString() : '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Admin:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">{p.admin?.nombre || p.adminId}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500 dark:text-gray-400">Concepto:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">{p.concepto || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Monto:</span>
                      <span className="ml-2 font-bold text-green-600 dark:text-green-400">{Number(p.monto || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Método:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">{p.metodoPago}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {form.presupuestoId && proveedores.length > 0 && (
        <Card className="mt-6">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-3">Pagos por proveedor</h3>
            {/* Vista Desktop - Tabla */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">Proveedor</th>
                    <th className="py-2 pr-4 text-right">Total costo</th>
                    <th className="py-2 pr-4 text-right">Pagado</th>
                    <th className="py-2 pr-4 text-right">Pendiente</th>
                    <th className="py-2 pr-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {proveedores.map(p => (
                    <tr key={p.proveedorId} className="border-b last:border-b-0">
                      <td className="py-2 pr-4">
                        <div className="font-medium">{p.proveedorNombre}</div>
                        {p.proveedorEmail && <div className="text-xs text-gray-500">{p.proveedorEmail}</div>}
                      </td>
                      <td className="py-2 pr-4 text-right">{p.totalCostoProveedor.toLocaleString('es-AR', { minimumFractionDigits: 2 })} {p.moneda}</td>
                      <td className="py-2 pr-4 text-right">{p.totalPagadoProveedor.toLocaleString('es-AR', { minimumFractionDigits: 2 })} {p.moneda}</td>
                      <td className="py-2 pr-4 text-right font-semibold">{p.pendienteProveedor.toLocaleString('es-AR', { minimumFractionDigits: 2 })} {p.moneda}</td>
                      <td className="py-2 pr-4 text-right">
                        {isAdmin && (
                          <Button size="sm" onClick={() => abrirPagoProveedor(p)}>Pagar</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vista Mobile - Cards */}
            <div className="md:hidden space-y-3">
              {proveedores.map(p => (
                <div key={p.proveedorId} className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <div className="mb-2">
                    <div className="font-medium text-gray-900 dark:text-white">{p.proveedorNombre}</div>
                    {p.proveedorEmail && <div className="text-xs text-gray-500 dark:text-gray-400">{p.proveedorEmail}</div>}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Total costo:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">{p.totalCostoProveedor.toLocaleString('es-AR', { minimumFractionDigits: 2 })} {p.moneda}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Pagado:</span>
                      <span className="ml-2 font-medium text-green-600 dark:text-green-400">{p.totalPagadoProveedor.toLocaleString('es-AR', { minimumFractionDigits: 2 })} {p.moneda}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500 dark:text-gray-400">Pendiente:</span>
                      <span className="ml-2 font-bold text-orange-600 dark:text-orange-400">{p.pendienteProveedor.toLocaleString('es-AR', { minimumFractionDigits: 2 })} {p.moneda}</span>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <Button size="sm" onClick={() => abrirPagoProveedor(p)} className="w-full">Pagar</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {provSel && (
        <Card className="mt-4">
          <form onSubmit={submitPagoProveedor} className="p-4">
            <div className="mb-3 text-sm text-gray-600">
              Registrando pago a <span className="font-medium">{provSel.proveedorNombre}</span> — Pendiente sugerido: {provSel.pendienteProveedor.toLocaleString('es-AR', { minimumFractionDigits: 2 })} {provSel.moneda}
            </div>
            <FormContainer>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem label="Concepto" asterisk>
                  <Input value={provForm.concepto} onChange={(e) => setProvForm({ ...provForm, concepto: e.target.value })} />
                </FormItem>
                <FormItem label="Monto" asterisk>
                  <MoneyInput value={provForm.monto} onChange={(v) => setProvForm({ ...provForm, monto: v })} />
                </FormItem>
                <FormItem label="Moneda" asterisk>
                  <Select
                    options={(monedas || []).map((m) => ({ value: m.id, label: `${m.simbolo} ${m.codigo}` }))}
                    value={(monedas || []).map((m) => ({ value: m.id, label: `${m.simbolo} ${m.codigo}` })).find(o => o.value === provForm.monedaId)}
                    onChange={(o) => setProvForm({ ...provForm, monedaId: o?.value || 1 })}
                  />
                </FormItem>
                <FormItem label="Fecha" asterisk>
                  <DatePicker value={provForm.fecha} onChange={(d) => setProvForm({ ...provForm, fecha: d || new Date() })} />
                </FormItem>
                <FormItem label="Método de pago">
                  <Select
                    options={[{ value: 'transferencia', label: 'Transferencia' }, { value: 'efectivo', label: 'Efectivo' }]}
                    value={{ value: provForm.metodoPago, label: provForm.metodoPago.charAt(0).toUpperCase() + provForm.metodoPago.slice(1) }}
                    onChange={(o) => setProvForm({ ...provForm, metodoPago: o?.value || 'transferencia' })}
                  />
                </FormItem>
                <FormItem label="Email de notificación" asterisk className="md:col-span-2">
                  <Input value={provForm.emailNotificacion} onChange={(e) => setProvForm({ ...provForm, emailNotificacion: e.target.value })} />
                </FormItem>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="plain" onClick={() => setProvSel(null)}>Cancelar</Button>
                <Button type="submit" variant="solid" loading={isSubmitting} disabled={isSubmitting}>Registrar pago</Button>
              </div>
            </FormContainer>
          </form>
        </Card>
      )}
    </motion.div>
  )
}

export default FinanzasResumen
