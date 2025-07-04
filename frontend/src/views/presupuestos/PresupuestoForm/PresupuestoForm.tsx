import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Button, FormItem, FormContainer, Input, Select, Notification, toast } from '@/components/ui';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { presupuestoSchema } from '../schemas';
import type { PresupuestoFormData, ItemFormData } from '../types';
import { usePersona } from '@/modules/persona/hooks/usePersona';
import { useProducto } from '@/modules/producto/hooks/useProducto';
import { useServicio } from '@/modules/servicio/hooks/useServicio';

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
  const { personas, refreshPersonas } = usePersona();
  const { productos, refreshProductos } = useProducto();
  const { servicios, refreshServicios } = useServicio();
  
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
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");

  useEffect(() => {
    refreshPersonas();
    refreshProductos();
    refreshServicios();
  }, [refreshPersonas, refreshProductos, refreshServicios]);

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

  // Calcular totales automáticamente
  const calcularTotales = () => {
    const subtotal = watchItems?.reduce((sum, item) => {
      const cantidad = item?.cantidad || 0;
      const precio = item?.precioUnitario || 0;
      return sum + (cantidad * precio);
    }, 0) || 0;

    const impuestos = subtotal * 0.21; // 21% IVA
    const total = subtotal + impuestos;

    return { subtotal, impuestos, total };
  };

  const { subtotal, impuestos, total } = calcularTotales();

  const handleFormSubmit = async (data: PresupuestoFormData) => {
    try {
      setIsSubmitting(true);
      
      // Calcular totales para enviar al backend
      const totalesCalculados = calcularTotales();
      
      // Agregar totales calculados
      const dataWithTotals = {
        ...data,
        subtotal: totalesCalculados.subtotal,
        impuestos: totalesCalculados.impuestos,
        total: totalesCalculados.total,
        items: data.items.map(item => ({
          ...item,
          // Asegurar que precioUnitario sea el correcto del producto/servicio seleccionado
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
                      disabled={isSubmitting}
                      onChange={(option) => field.onChange(option?.value)}
                      value={clienteOptions.find(option => option.value === field.value)}
                    />
                  )}
                />
              </FormItem>
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
                              disabled={isSubmitting || !!watchItems?.[index]?.servicioId}
                              onChange={(option) => {
                                field.onChange(option?.value || undefined);
                                // Auto-completar precio si selecciona producto
                                if (option?.precio) {
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
                              disabled={isSubmitting || !!watchItems?.[index]?.productoId}
                              onChange={(option) => {
                                field.onChange(option?.value || undefined);
                                // Auto-completar precio si selecciona servicio
                                if (option?.precio) {
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
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA (21%):</span>
                  <span className="font-medium">{formatPrice(impuestos)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-green-600">{formatPrice(total)}</span>
                </div>
              </div>
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
