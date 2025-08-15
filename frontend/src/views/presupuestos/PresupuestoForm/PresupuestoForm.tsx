import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Button, FormItem, FormContainer, Input, Select, Notification, toast, Checkbox, DatePicker } from '@/components/ui';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { presupuestoSchema } from '../schemas';
import type { PresupuestoFormData, ItemFormData } from '../types';
import { usePersona } from '@/modules/persona/hooks/usePersona';
import { useProducto } from '@/modules/producto/hooks/useProducto';
import { useServicio } from '@/modules/servicio/hooks/useServicio';
import { useMoneda } from '@/modules/moneda/hooks/useMoneda';
import { useImpuesto } from '@/modules/impuesto/hooks/useImpuesto';
import { usePresupuestoCalculations } from '../hooks/usePresupuestoCalculations';
import { Impuesto } from '@/modules/impuesto/types';

interface PresupuestoFormProps {
  initialData?: PresupuestoFormData;
  onSubmit: (data: PresupuestoFormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const PresupuestoForm: React.FC<PresupuestoFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [impuestosSeleccionados, setImpuestosSeleccionados] = useState<Impuesto[]>([]);
  const [vigenciaPreset, setVigenciaPreset] = useState<'NONE' | '1M' | '3M' | '6M' | '1Y'>(isEdit ? 'NONE' : '1M')
  
  const { personas, refreshPersonas } = usePersona();
  const { productos, refreshProductos } = useProducto();
  const { servicios, refreshServicios } = useServicio();
  const { monedas, refreshMonedas } = useMoneda();
  const { getActiveImpuestos } = useImpuesto();
  
  const [impuestosDisponibles, setImpuestosDisponibles] = useState<Impuesto[]>([]);
  
  // Obtener fechas por defecto (hoy + 1 mes)
  const getDefaultDates = () => {
    const today = new Date();
    const oneMonthLater = addMonths(today, 1);
    return {
      inicio: toYMD(today),
      fin: toYMD(oneMonthLater)
    };
  };

  // Helper functions for date management
  const toYMD = (d: Date) => d.toISOString().split('T')[0];
  const addMonths = (d: Date, months: number) => {
    const dt = new Date(d);
    const day = dt.getDate();
    dt.setMonth(dt.getMonth() + months);
    // Ajuste de fin de mes para evitar desbordes (30->31 etc.)
    if (dt.getDate() < day) {
      dt.setDate(0);
    }
    return dt;
  };

  const defaultDates = getDefaultDates();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<PresupuestoFormData>({
    resolver: zodResolver(presupuestoSchema),
    defaultValues: initialData || {
      clienteId: undefined,
      items: [{ cantidad: 1, precioUnitario: 0 }],
      impuestosSeleccionados: [],
      monedaId: 1, // ARS por defecto
      periodoInicio: defaultDates.inicio,
      periodoFin: defaultDates.fin,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");

  // Usar el hook de cálculos con los impuestos seleccionados
  const { subtotal, impuestos, total, detalleImpuestos } = usePresupuestoCalculations(
    watchItems, 
    impuestosSeleccionados
  );

  // Helpers para fechas y presets de vigencia
  const watchPeriodoInicio = watch('periodoInicio')
  const watchPeriodoFin = watch('periodoFin')
  
  // Calcular duración para mostrar al usuario
  const calcularDuracion = () => {
    if (!watchPeriodoInicio || !watchPeriodoFin) return null;
    
    const inicio = new Date(watchPeriodoInicio);
    const fin = new Date(watchPeriodoFin);
    const diffTime = Math.abs(fin.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 día";
    if (diffDays < 7) return `${diffDays} días`;
    if (diffDays < 30) return `${Math.round(diffDays / 7)} semana${Math.round(diffDays / 7) > 1 ? 's' : ''}`;
    if (diffDays < 365) return `${Math.round(diffDays / 30)} mes${Math.round(diffDays / 30) > 1 ? 'es' : ''}`;
    
    const years = Math.floor(diffDays / 365);
    const months = Math.round((diffDays % 365) / 30);
    
    if (years === 1 && months === 0) return "1 año";
    if (years > 1 && months === 0) return `${years} años`;
    if (years === 1) return `1 año y ${months} mes${months > 1 ? 'es' : ''}`;
    return `${years} años y ${months} mes${months > 1 ? 'es' : ''}`;
  };

  const duracion = calcularDuracion();
  
  useEffect(() => {
    if (vigenciaPreset === 'NONE') return
    // Si no hay periodoInicio, poner hoy por defecto
    let base = watchPeriodoInicio ? new Date(watchPeriodoInicio) : new Date()
    if (!watchPeriodoInicio) {
      setValue('periodoInicio', toYMD(base))
    }
    let fin = base
    if (vigenciaPreset === '1M') fin = addMonths(base, 1)
    if (vigenciaPreset === '3M') fin = addMonths(base, 3)
    if (vigenciaPreset === '6M') fin = addMonths(base, 6)
    if (vigenciaPreset === '1Y') fin = addMonths(base, 12)
    setValue('periodoFin', toYMD(fin))
  }, [vigenciaPreset, watchPeriodoInicio, setValue])

  useEffect(() => {
    refreshPersonas();
    refreshProductos();
    refreshServicios();
    refreshMonedas();
    
    // Cargar impuestos activos
    const loadImpuestos = async () => {
      try {
        const impuestosActivos = await getActiveImpuestos();
        setImpuestosDisponibles(impuestosActivos);
      } catch (error) {
        console.error('Error cargando impuestos:', error);
      }
    };
    
    loadImpuestos();
  }, [refreshPersonas, refreshProductos, refreshServicios, refreshMonedas, getActiveImpuestos]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  // Ref para rastrear si ya inicializamos
  const initializedRef = useRef(false);
  const lastInitialDataRef = useRef<any>(null);

  useEffect(() => {
    if (initialData && (!initializedRef.current || JSON.stringify(lastInitialDataRef.current) !== JSON.stringify(initialData))) {
      // Normalizar fechas ISO a YYYY-MM-DD para inputs type=date
      const norm = (d?: string) => (d ? new Date(d).toISOString().slice(0, 10) : undefined)
      
      console.log('🔄 Inicializando formulario con datos:', initialData);
      
      reset({
        ...initialData,
        periodoInicio: norm((initialData as any).periodoInicio),
        periodoFin: norm((initialData as any).periodoFin),
      });

      // Precargar impuestos seleccionados si existen
      if ((initialData as any).presupuestoImpuestos && impuestosDisponibles.length > 0) {
        const impuestosIds = (initialData as any).presupuestoImpuestos.map((pi: any) => pi.impuestoId);
        const impuestosDelPresupuesto = impuestosDisponibles.filter(imp => impuestosIds.includes(imp.id));
        setImpuestosSeleccionados(impuestosDelPresupuesto);
        console.log('✅ Impuestos precargados:', impuestosDelPresupuesto);
      }

      initializedRef.current = true;
      lastInitialDataRef.current = initialData;
    }
  }, [initialData, reset, impuestosDisponibles]);

  const handleFormSubmit = async (data: PresupuestoFormData) => {
    try {
      setIsSubmitting(true);
      
      // Agregar totales calculados e impuestos seleccionados
      const dataWithTotals = {
        ...data,
        subtotal,
        impuestos,
        total,
        impuestosSeleccionados: impuestosSeleccionados.map(imp => imp.id),
        items: data.items.map(item => ({
          ...item,
          precioUnitario: item.precioUnitario
        })),
        // Normalizar fechas a ISO si vienen como string YYYY-MM-DD
        periodoInicio: data.periodoInicio ? new Date(data.periodoInicio).toISOString() : undefined,
        periodoFin: data.periodoFin ? new Date(data.periodoFin).toISOString() : undefined,
      };

      await onSubmit(dataWithTotals);
      toast.push(
        <Notification title="Éxito" type="success">
          Presupuesto {isEdit ? 'actualizado' : 'creado'} correctamente
        </Notification>
      );
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Error al {isEdit ? 'actualizar' : 'crear'} el presupuesto
        </Notification>
      );
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddItem = () => {
    append({ cantidad: 1, precioUnitario: 0 });
  };

  const handleRemoveItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Filtrar solo clientes
  const clientes = personas.filter(persona => 
    persona.tipo === 'CLIENTE'
  );

  const clienteOptions = clientes.map(cliente => ({
    value: cliente.id,
    label: cliente.nombre
  }));

  const monedaOptions = monedas.map(moneda => ({
    value: moneda.id,
    label: `${moneda.nombre} (${moneda.simbolo})`
  }));

  const productoOptions = productos.map(producto => ({
    value: producto.id,
    label: `${producto.nombre} - ${formatPrice(producto.precio)}`,
    precio: producto.precio
  }));

  const servicioOptions = servicios.map(servicio => ({
    value: servicio.id,
    label: `${servicio.nombre} - ${formatPrice(servicio.precio)}`,
    precio: servicio.precio
  }));

  const handleImpuestoToggle = (impuesto: Impuesto, checked: boolean) => {
    if (checked) {
      setImpuestosSeleccionados(prev => [...prev, impuesto]);
    } else {
      setImpuestosSeleccionados(prev => prev.filter(imp => imp.id !== impuesto.id));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
          </h2>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Modifica la información del presupuesto' : 'Completa los datos del nuevo presupuesto'}
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FormContainer>
            {/* Cliente */}
            <div className="mb-8">
              <FormItem
                label="Cliente"
                invalid={!!errors.clienteId}
                errorMessage={errors.clienteId?.message}
              >
                <Controller
                  name="clienteId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={clienteOptions}
                      placeholder="Selecciona un cliente"
                      isDisabled={isSubmitting}
                      onChange={(option) => field.onChange(option?.value)}
                      value={clienteOptions.find(option => option.value === field.value)}
                    />
                  )}
                />
              </FormItem>
            </div>

            {/* Configuración del presupuesto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Moneda */}
              <FormItem
                label="Moneda"
                invalid={!!errors.monedaId}
                errorMessage={errors.monedaId?.message}
              >
                <Controller
                  name="monedaId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={monedaOptions}
                      placeholder="Selecciona una moneda"
                      isDisabled={isSubmitting}
                      onChange={(option) => field.onChange(option?.value)}
                      value={monedaOptions.find(option => option.value === field.value)}
                    />
                  )}
                />
              </FormItem>

              {/* Rango de vigencia */}
              <div className="grid grid-cols-2 gap-4">
                <FormItem
                  label="Vigencia desde"
                  invalid={!!errors.periodoInicio}
                  errorMessage={errors.periodoInicio?.message}
                >
                  <Controller
                    name="periodoInicio"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="date"
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </FormItem>
                <FormItem
                  label="Vigencia hasta"
                  invalid={!!errors.periodoFin}
                  errorMessage={errors.periodoFin?.message}
                >
                  <Controller
                    name="periodoFin"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="date"
                        disabled={isSubmitting || vigenciaPreset !== 'NONE'}
                      />
                    )}
                  />
                </FormItem>
              </div>

              {/* Indicador de duración */}
              {duracion && (
                <div className="mb-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 text-sm font-medium">
                        📏 Duración: {duracion}
                      </span>
                      {watchPeriodoInicio && watchPeriodoFin && (() => {
                        const diffDays = Math.ceil(Math.abs(new Date(watchPeriodoFin).getTime() - new Date(watchPeriodoInicio).getTime()) / (1000 * 60 * 60 * 24));
                        if (diffDays >= 365) {
                          return <span className="text-orange-600 text-xs">🎯 Ideal para proyecciones anuales</span>;
                        } else if (diffDays >= 90) {
                          return <span className="text-green-600 text-xs">✅ Buena para análisis trimestral</span>;
                        } else if (diffDays >= 30) {
                          return <span className="text-blue-600 text-xs">📊 Válida para análisis mensual</span>;
                        } else if (diffDays >= 7) {
                          return <span className="text-gray-600 text-xs">⚡ Vigencia corta</span>;
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* Presets de duración */}
              <div className="mb-2">
                <div className="text-sm font-medium text-gray-700 mb-2">⚡ Duración rápida</div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={vigenciaPreset === 'NONE' ? 'solid' : 'twoTone'}
                    className={vigenciaPreset === 'NONE' ? 'bg-gray-600 text-white' : ''}
                    onClick={() => setVigenciaPreset('NONE')}
                  >
                    🔓 Manual
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={vigenciaPreset === '1M' ? 'solid' : 'twoTone'}
                    className={vigenciaPreset === '1M' ? 'bg-green-600 text-white' : ''}
                    onClick={() => setVigenciaPreset('1M')}
                  >
                    📅 1 mes
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={vigenciaPreset === '3M' ? 'solid' : 'twoTone'}
                    className={vigenciaPreset === '3M' ? 'bg-blue-600 text-white' : ''}
                    onClick={() => setVigenciaPreset('3M')}
                  >
                    🗓️ 3 meses
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={vigenciaPreset === '6M' ? 'solid' : 'twoTone'}
                    className={vigenciaPreset === '6M' ? 'bg-purple-600 text-white' : ''}
                    onClick={() => setVigenciaPreset('6M')}
                  >
                    📆 6 meses
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={vigenciaPreset === '1Y' ? 'solid' : 'twoTone'}
                    className={vigenciaPreset === '1Y' ? 'bg-orange-600 text-white' : ''}
                    onClick={() => setVigenciaPreset('1Y')}
                  >
                    🗓️ 1 año
                  </Button>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  💡 Se calcula automáticamente desde "Vigencia desde". Para proyecciones anuales usa 1 año.
                </div>
              </div>

              {/* Impuestos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Impuestos a Aplicar
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {impuestosDisponibles.map((impuesto) => (
                    <div key={impuesto.id} className="flex items-center">
                      <Checkbox
                        checked={impuestosSeleccionados.some(imp => imp.id === impuesto.id)}
                        onChange={(checked) => handleImpuestoToggle(impuesto, checked)}
                        disabled={isSubmitting}
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        {impuesto.nombre} ({impuesto.porcentaje}%)
                        {impuesto.descripcion && (
                          <span className="text-gray-500 text-xs block">
                            {impuesto.descripcion}
                          </span>
                        )}
                      </label>
                    </div>
                  ))}
                  {impuestosDisponibles.length === 0 && (
                    <p className="text-sm text-gray-500">No hay impuestos configurados</p>
                  )}
                </div>
                {impuestosSeleccionados.length === 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    Debe seleccionar al menos un impuesto
                  </p>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Items del Presupuesto</h3>
                  <p className="text-sm text-gray-600">Cada item puede ser un producto o un servicio. Agrega múltiples items para combinar productos y servicios.</p>
                </div>
                <Button
                  type="button"
                  variant="twoTone"
                  icon={<HiOutlinePlus />}
                  onClick={handleAddItem}
                  disabled={isSubmitting}
                  className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                >
                  Agregar Otro Item
                </Button>
              </div>

              <AnimatePresence>
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium text-gray-700">Item #{index + 1}</h4>
                        <p className="text-xs text-gray-500">Selecciona un producto O un servicio para este item</p>
                      </div>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="plain"
                          size="sm"
                          icon={<HiOutlineTrash />}
                          onClick={() => handleRemoveItem(index)}
                          disabled={isSubmitting}
                          className="text-red-600 hover:text-red-700"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Producto */}
                      <FormItem
                        label="Producto"
                        invalid={!!errors.items?.[index]?.productoId}
                        errorMessage={errors.items?.[index]?.productoId?.message}
                      >
                        <Controller
                          name={`items.${index}.productoId`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={[{ value: '', label: 'Sin producto' }, ...productoOptions]}
                              placeholder="Seleccionar producto"
                              isDisabled={isSubmitting || !!watchItems?.[index]?.servicioId}
                              onChange={(option) => {
                                field.onChange(option?.value || undefined);
                                // Auto-completar precio si selecciona producto
                                if (option && 'precio' in option && option.precio) {
                                  setValue(`items.${index}.precioUnitario`, option.precio);
                                  // Limpiar servicio si selecciona producto
                                  setValue(`items.${index}.servicioId`, undefined);
                                }
                              }}
                              value={productoOptions.find(option => option.value === field.value) || { value: '', label: 'Sin producto' }}
                            />
                          )}
                        />
                      </FormItem>

                      {/* Servicio (alternativo a producto) */}
                      <FormItem
                        label="Servicio"
                        invalid={!!errors.items?.[index]?.servicioId}
                        errorMessage={errors.items?.[index]?.servicioId?.message}
                      >
                        <Controller
                          name={`items.${index}.servicioId`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={[{ value: '', label: 'Sin servicio' }, ...servicioOptions]}
                              placeholder="Seleccionar servicio"
                              isDisabled={isSubmitting || !!watchItems?.[index]?.productoId}
                              onChange={(option) => {
                                field.onChange(option?.value || undefined);
                                // Auto-completar precio si selecciona servicio
                                if (option && 'precio' in option && option.precio) {
                                  setValue(`items.${index}.precioUnitario`, option.precio);
                                  // Limpiar producto si selecciona servicio
                                  setValue(`items.${index}.productoId`, undefined);
                                }
                              }}
                              value={servicioOptions.find(option => option.value === field.value) || { value: '', label: 'Sin servicio' }}
                            />
                          )}
                        />
                      </FormItem>

                      {/* Cantidad */}
                      <FormItem
                        label="Cantidad"
                        invalid={!!errors.items?.[index]?.cantidad}
                        errorMessage={errors.items?.[index]?.cantidad?.message}
                      >
                        <Controller
                          name={`items.${index}.cantidad`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              min="1"
                              placeholder="1"
                              disabled={isSubmitting}
                              onChange={(e) => {
                                const val = Number(e.target.value)
                                field.onChange(Number.isFinite(val) && val > 0 ? Math.floor(val) : 1)
                              }}
                            />
                          )}
                        />
                      </FormItem>

                      {/* Precio Unitario */}
                      <FormItem
                        label="Precio Unitario"
                        invalid={!!errors.items?.[index]?.precioUnitario}
                        errorMessage={errors.items?.[index]?.precioUnitario?.message}
                      >
                        <Controller
                          name={`items.${index}.precioUnitario`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              disabled={isSubmitting}
                              onChange={(e) => {
                                const val = Number(e.target.value)
                                field.onChange(Number.isFinite(val) && val >= 0 ? val : 0)
                              }}
                            />
                          )}
                        />
                      </FormItem>
                    </div>

                    {/* Subtotal del item */}
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {watchItems?.[index]?.productoId && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Producto
                          </span>
                        )}
                        {watchItems?.[index]?.servicioId && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Servicio
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        Subtotal: {formatPrice((watchItems?.[index]?.cantidad || 0) * (watchItems?.[index]?.precioUnitario || 0))}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {errors.items?.message && (
                <p className="text-red-600 text-sm mt-2">{errors.items.message}</p>
              )}
            </div>

            {/* Totales */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                {detalleImpuestos.map((detalle) => (
                  <div key={detalle.impuesto.id} className="flex justify-between">
                    <span className="text-gray-600">
                      {detalle.impuesto.nombre} ({detalle.impuesto.porcentaje}%):
                    </span>
                    <span className="font-medium">{formatPrice(detalle.monto)}</span>
                  </div>
                ))}
                
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-green-600">{formatPrice(total)}</span>
                </div>
              </div>
              
              {impuestosSeleccionados.length === 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    ⚠️ No se han seleccionado impuestos. El total no incluye impuestos.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="plain"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="solid"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isEdit ? 'Actualizar' : 'Crear'} Presupuesto
              </Button>
            </div>
          </FormContainer>
        </form>
      </Card>
    </motion.div>
  );
};

export default PresupuestoForm;
