import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, Button, Input, Select, FormItem, FormContainer, DatePicker } from '@/components/ui'
import MoneyInput from '@/components/shared/MoneyInput'
import { HiOutlineSave, HiOutlineX, HiOutlineReceiptRefund } from 'react-icons/hi'
import { useRecibo, useReciboAuxiliarData } from '@/modules/recibo/hooks/useRecibo'
import { fetchPresupuestoById } from '@/modules/presupuesto/service'
import { getResumenPresupuesto } from '@/services/finanzasService'
import { listarRecibos } from '@/services/reciboService'

const ReciboNew: React.FC = () => {
  const navigate = useNavigate()
  const { createRecibo } = useRecibo()
  const { monedas, proveedores, presupuestos } = useReciboAuxiliarData()
  const [params] = useSearchParams()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    personaId: undefined as number | undefined,
    presupuestoId: undefined as number | undefined,
    concepto: '',
    monto: 0,
    monedaId: 1,
    fecha: new Date(),
    metodoPago: 'transferencia',
    emailNotificacion: '',
  })

  const [cargandoPreset, setCargandoPreset] = useState(false)

  const monedaOptions = useMemo(() => (Array.isArray(monedas) ? monedas : []).map(m => ({ value: m.id, label: `${m.simbolo} ${m.codigo}` })), [monedas])
  const proveedorOptionsBase = useMemo(() => (Array.isArray(proveedores) ? proveedores : []).map(p => ({ value: p.id, label: p.nombre, email: p.email } as any)), [proveedores])
  const presupuestoOptions = useMemo(() => (
    Array.isArray(presupuestos) ? presupuestos : []
  ).map(p => ({
    value: p.id,
    label: `Presupuesto #${p.id} - Total: ${p.total}`
  })), [presupuestos])

  const selectedMoneda = (monedas || []).find(m => m.id === formData.monedaId)

  useEffect(() => {
    const p = params.get('presupuestoId')
    const prov = params.get('personaId')
    setFormData((s) => ({
      ...s,
      presupuestoId: p ? Number(p) : s.presupuestoId,
      personaId: prov ? Number(prov) : s.personaId,
    }))
  }, [params])

  // Cuando hay presupuestoId, precargar concepto, proveedor (si único) y monto sugerido
  useEffect(() => {
    const cargarDesdePresupuesto = async () => {
      if (!formData.presupuestoId) return
      try {
        setCargandoPreset(true)
        const [pres, resumen] = await Promise.all([
          fetchPresupuestoById(formData.presupuestoId),
          getResumenPresupuesto(formData.presupuestoId),
        ])
        // Moneda sugerida desde presupuesto
        const monedaId = pres.monedaId || formData.monedaId

        // Concepto a partir del item si hay 1 solo; si hay varios, genérico
        let concepto = `Pago Proveedor - Presupuesto #${pres.id}`
        if (Array.isArray(pres.items) && pres.items.length === 1) {
          const it: any = pres.items[0]
          if (it?.producto?.nombre) concepto = it.producto.nombre as string
          if (it?.servicio?.nombre) concepto = it.servicio.nombre as string
        }

        // Proveedores involucrados en el presupuesto
        const proveedoresEnPresupuesto = new Set<number>()
        for (const itRaw of pres.items || []) {
          const it: any = itRaw
          if (it?.producto?.proveedorId) proveedoresEnPresupuesto.add(Number(it.producto.proveedorId))
          if (it?.servicio?.proveedorId) proveedoresEnPresupuesto.add(Number(it.servicio.proveedorId))
        }

        let personaId: number | undefined = formData.personaId
        if (!personaId && proveedoresEnPresupuesto.size === 1) {
          personaId = Array.from(proveedoresEnPresupuesto)[0]
          // Si conocemos el proveedor y lo tenemos cargado, autocompletar email
          const prov = (proveedores || []).find(p => p.id === personaId)
          if (prov?.email) {
            setFormData(s => ({ ...s, emailNotificacion: s.emailNotificacion || prov.email }))
          }
        }

        // Calcular monto sugerido general (si no hay proveedor elegido) o por proveedor si hay uno elegido
        const calcTotalProveedor = (provId?: number) => {
          let total = 0
          for (const itRaw of pres.items || []) {
            const it: any = itRaw
            const cantidad = Number(it?.cantidad || 1)
            // si se pasa provId, solo acumular ítems de ese proveedor
            if (it?.producto && (!provId || Number(it.producto.proveedorId) === provId)) {
              total += Number(it.producto.costoProveedor) * cantidad
            }
            if (it?.servicio && (!provId || Number(it.servicio.proveedorId) === provId)) {
              total += Number(it.servicio.costoProveedor) * cantidad
            }
          }
          return total
        }

        const provIdForCalc = personaId
        const costoProveedorTotal = calcTotalProveedor(provIdForCalc)
        let yaPagado = 0
        if (provIdForCalc) {
          try {
            const pagosProveedor = await listarRecibos(provIdForCalc, pres.id)
            if (Array.isArray(pagosProveedor)) {
              yaPagado = pagosProveedor.reduce((acc: number, r: any) => acc + Number(r.monto || 0), 0)
            }
          } catch {
            // ignorar errores de fetch parciales
          }
        } else {
          // Sin proveedor elegido, usar total pagado del presupuesto
          yaPagado = Number(resumen?.totalPagadoProveedor ?? 0)
        }
        const sugerido = Math.max(0, Number(costoProveedorTotal) - yaPagado)

        setFormData(s => ({
          ...s,
          concepto,
          personaId,
          monto: sugerido || s.monto,
          monedaId,
        }))
      } catch (e) {
        console.error('No se pudo pre-cargar desde presupuesto:', e)
      } finally {
        setCargandoPreset(false)
      }
    }
    cargarDesdePresupuesto()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.presupuestoId, formData.personaId, proveedores])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const selectedProveedor = proveedorOptions.find(o => o.value === formData.personaId) as any
    const proveedorEmail = selectedProveedor?.email || ''
    const emailToUse = formData.emailNotificacion?.trim() || proveedorEmail
    if (!formData.presupuestoId) {
      alert('El presupuesto es obligatorio')
      return
    }
    if (!formData.personaId || !formData.concepto || formData.monto <= 0) {
      alert('Completar proveedor, concepto y monto')
      return
    }
    if (!emailToUse) {
      alert('Este proveedor no tiene email registrado. Ingrese un email de notificación para enviar el recibo.')
      return
    }
    try {
      setIsSubmitting(true)
      await createRecibo({
        personaId: formData.personaId,
        presupuestoId: formData.presupuestoId,
        concepto: formData.concepto,
        monto: formData.monto,
        monedaId: formData.monedaId,
        fecha: formData.fecha.toISOString(),
        metodoPago: formData.metodoPago,
        emailNotificacion: emailToUse,
      } as any)
      navigate('/recibos')
    } catch (err) {
      console.error('Error al crear recibo:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filtrar proveedores a los del presupuesto elegido (si hay)
  const proveedorOptions = useMemo(() => {
    if (!formData.presupuestoId) return proveedorOptionsBase
    const presupuesto = (presupuestos || []).find(p => p.id === formData.presupuestoId)
    if (!presupuesto) return proveedorOptionsBase
    const ids = new Set<number>()
    for (const it of presupuesto.items || []) {
      const anyIt: any = it
      if (anyIt?.producto?.proveedorId) ids.add(Number(anyIt.producto.proveedorId))
      if (anyIt?.servicio?.proveedorId) ids.add(Number(anyIt.servicio.proveedorId))
    }
    return proveedorOptionsBase.filter(o => ids.has(Number(o.value)))
  }, [proveedorOptionsBase, presupuestos, formData.presupuestoId])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="container mx-auto p-4 max-w-5xl">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.3 }} className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <button onClick={() => navigate('/recibos')} className="hover:text-blue-600 transition-colors">Recibos</button>
          <span>/</span>
          <span>Nuevo Recibo</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <HiOutlineReceiptRefund className="text-blue-600" />
          Nuevo Recibo a Proveedor
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Registra un pago a proveedor y notifica por email.</p>
      </motion.div>

      <Card>
        <form onSubmit={onSubmit}>
          <FormContainer>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormItem label="Proveedor" asterisk>
                <Select
                  options={proveedorOptions}
                  placeholder="Selecciona el proveedor"
                  isDisabled={isSubmitting}
                  onChange={(o: any) => setFormData({ ...formData, personaId: o?.value, emailNotificacion: o?.email || formData.emailNotificacion })}
                  value={proveedorOptions.find(o => o.value === formData.personaId)}
                />
              </FormItem>

              <FormItem label="Presupuesto" asterisk>
                <Select
                  options={presupuestoOptions}
                  placeholder="Vincular a presupuesto (opcional)"
                  isDisabled={isSubmitting}
                  onChange={(o) => setFormData({ ...formData, presupuestoId: o?.value })}
                  value={presupuestoOptions.find(o => o.value === formData.presupuestoId)}
                />
              </FormItem>

              <FormItem label="Concepto" asterisk>
                <Input
                  value={formData.concepto}
                  onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                  placeholder="Detalle del pago"
                  disabled={isSubmitting}
                />
              </FormItem>

              <FormItem label="Monto" asterisk>
                <MoneyInput
                  value={formData.monto}
                  onChange={(v) => setFormData({ ...formData, monto: v })}
                  currency={selectedMoneda?.codigo || 'ARS'}
                  currencySymbol={selectedMoneda?.simbolo || '$'}
                />
              </FormItem>

              <FormItem label="Moneda" asterisk>
                <Select
                  options={monedaOptions}
                  placeholder="Selecciona la moneda"
                  isDisabled={isSubmitting}
                  onChange={(o) => setFormData({ ...formData, monedaId: o?.value || 1 })}
                  value={monedaOptions.find(o => o.value === formData.monedaId)}
                />
              </FormItem>

              <FormItem label="Fecha" asterisk>
                <DatePicker
                  value={formData.fecha}
                  onChange={(d) => setFormData({ ...formData, fecha: d || new Date() })}
                  disabled={isSubmitting}
                />
              </FormItem>

              <FormItem label="Método de pago">
                <Select
                  options={[
                    { value: 'transferencia', label: 'Transferencia' },
                    { value: 'efectivo', label: 'Efectivo' },
                  ]}
                  value={{ value: formData.metodoPago, label: formData.metodoPago.charAt(0).toUpperCase() + formData.metodoPago.slice(1) }}
                  onChange={(o) => setFormData({ ...formData, metodoPago: o?.value || 'transferencia' })}
                />
              </FormItem>

              <FormItem label="Email de notificación (opcional)" className="lg:col-span-2">
                <Input
                  value={formData.emailNotificacion}
                  onChange={(e) => setFormData({ ...formData, emailNotificacion: e.target.value })}
                  placeholder="ej: proveedor@empresa.com"
                  disabled={isSubmitting}
                />
              </FormItem>
            </div>
          </FormContainer>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.3 }} className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button type="button" variant="plain" icon={<HiOutlineX />} disabled={isSubmitting} onClick={() => navigate('/recibos')}>Cancelar</Button>
            <Button type="submit" variant="solid" icon={<HiOutlineSave />} loading={isSubmitting} disabled={isSubmitting}>Crear Recibo</Button>
          </motion.div>
        </form>
      </Card>
    </motion.div>
  )
}

export default ReciboNew
