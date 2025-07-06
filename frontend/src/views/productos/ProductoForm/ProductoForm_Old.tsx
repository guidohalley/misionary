import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Button, FormItem, FormContainer, Input, Select, Notification, toast } from '@/components/ui';
import MoneyInput from '@/components/shared/MoneyInput';
import { motion } from 'framer-motion';
import { productoSchema } from '../schemas';
import type { ProductoFormData } from '../types';
import { usePersona } from '@/modules/persona/hooks/usePersona';
import { useProductoAuxiliarData } from '@/modules/producto/hooks/useProducto';
import { TipoPersona, RolUsuario } from '@/views/personas/schemas';

interface ProductoFormProps {
  initialData?: ProductoFormData;
  onSubmit: (data: ProductoFormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const ProductoForm: React.FC<ProductoFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { personas, refreshPersonas } = usePersona();
  const { monedas, loading: loadingMonedas } = useProductoAuxiliarData();
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProductoFormData>({
    // resolver: zodResolver(productoSchema),
    defaultValues: initialData || {
      nombre: '',
      precio: 0,
      proveedorId: undefined as any,
      monedaId: 1, // ARS por defecto
    },
  });

  const monedaIdSeleccionada = watch('monedaId');
  const monedaSeleccionada = monedas.find(m => m.id === monedaIdSeleccionada);

  useEffect(() => {
    refreshPersonas();
  }, [refreshPersonas]);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: ProductoFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      toast.push(
        <Notification title="Éxito" type="success">
          Producto {isEdit ? 'actualizado' : 'creado'} correctamente
        </Notification>
      );
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Error al {isEdit ? 'actualizar' : 'crear'} el producto
        </Notification>
      );
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrar solo proveedores
  const proveedores = personas.filter(persona => 
    persona.tipo === TipoPersona.PROVEEDOR || persona.roles.includes(RolUsuario.PROVEEDOR)
  );

  const proveedorOptions = proveedores.map(proveedor => ({
    value: proveedor.id,
    label: proveedor.nombre
  }));

  const monedasOptions = monedas.map(m => ({
    value: m.id,
    label: `${m.codigo} - ${m.nombre}`
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto p-6"
    >
      <Card className="rounded-lg shadow-lg border-0">
        <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Modifica la información del producto' : 'Completa los datos del nuevo producto'}
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 pb-6">
          <FormContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem
                label="Nombre del Producto"
                invalid={!!errors.nombre}
                errorMessage={errors.nombre?.message}
                className="md:col-span-2"
                asterisk
              >
                <Controller
                  name="nombre"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Ej: Hosting Web Premium"
                      disabled={isSubmitting}
                      className="rounded-lg"
                    />
                  )}
                />
              </FormItem>

              <FormItem
                label="Proveedor"
                invalid={!!errors.proveedorId}
                errorMessage={errors.proveedorId?.message}
                asterisk
              >
                <Controller
                  name="proveedorId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={proveedorOptions}
                      placeholder="Selecciona un proveedor"
                      isDisabled={isSubmitting}
                      onChange={(option) => field.onChange(option?.value)}
                      value={proveedorOptions.find(option => option.value === field.value)}
                    />
                  )}
                />
              </FormItem>

              <FormItem
                label="Moneda"
                invalid={!!errors.monedaId}
                errorMessage={errors.monedaId?.message}
                asterisk
              >
                <Controller
                  name="monedaId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={monedasOptions}
                      value={monedasOptions.find(option => option.value === field.value)}
                      onChange={option => field.onChange(option?.value)}
                      isLoading={loadingMonedas}
                      isDisabled={loadingMonedas || isSubmitting}
                      placeholder="Seleccionar moneda..."
                    />
                  )}
                />
              </FormItem>

              <FormItem
                label="Precio"
                invalid={!!errors.precio}
                errorMessage={errors.precio?.message}
                className="md:col-span-2"
                asterisk
              >
                <Controller
                  name="precio"
                  control={control}
                  render={({ field }) => (
                    <MoneyInput
                      value={field.value || 0}
                      onChange={field.onChange}
                      currency={monedaSeleccionada?.codigo || 'ARS'}
                      currencySymbol={monedaSeleccionada?.simbolo || '$'}
                      placeholder="0,00"
                      disabled={isSubmitting}
                      className="max-w-md"
                    />
                  )}
                />
              </FormItem>
            </div>

            <div className="flex justify-end space-x-4 mt-8 p-6 bg-gray-50 rounded-b-lg">
              <Button
                type="button"
                variant="plain"
                onClick={onCancel}
                disabled={isSubmitting}
                className="rounded-lg"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="solid"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="rounded-lg"
              >
                {isEdit ? 'Actualizar' : 'Crear'} Producto
              </Button>
            </div>
          </FormContainer>
        </form>
      </Card>
    </motion.div>
  );
};

export default ProductoForm;
