import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Button, FormItem, FormContainer, Input, Select, Notification, toast, Checkbox } from '@/components/ui';
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
  
  const { personas, refreshPersonas } = usePersona();
  const { productos, refreshProductos } = useProducto();
  const { servicios, refreshServicios } = useServicio();
  const { monedas, refreshMonedas } = useMoneda();
  const { getActiveImpuestos } = useImpuesto();
  
  const [impuestosDisponibles, setImpuestosDisponibles] = useState<Impuesto[]>([]);
  
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

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

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
        }))
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
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
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
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
