import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Button, FormItem, FormContainer, Input, Select, Notification, toast } from '@/components/ui';
import MoneyInput from '@/components/shared/MoneyInput';
import { motion } from 'framer-motion';
import { servicioSchema } from '../schemas';
import type { ServicioFormData } from '../types';
import { usePersona } from '@/modules/persona/hooks/usePersona';
import { useServicioAuxiliarData } from '@/modules/servicio/hooks/useServicio';
import { TipoPersona, RolUsuario } from '@/views/personas/schemas';

interface ServicioFormProps {
  initialData?: ServicioFormData;
  onSubmit: (data: ServicioFormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const ServicioForm: React.FC<ServicioFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { personas, refreshPersonas } = usePersona();
  const { monedas, loading: loadingMonedas } = useServicioAuxiliarData();
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ServicioFormData>({
    // resolver: zodResolver(servicioSchema),
    defaultValues: initialData || {
      nombre: '',
      descripcion: '',
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

  const handleFormSubmit = async (data: ServicioFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      toast.push(
        <Notification title="Éxito" type="success">
          Servicio {isEdit ? 'actualizado' : 'creado'} correctamente
        </Notification>
      );
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Error al {isEdit ? 'actualizar' : 'crear'} el servicio
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
        <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Servicio' : 'Nuevo Servicio'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Modifica la información del servicio' : 'Completa los datos del nuevo servicio'}
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 pb-6">
          <FormContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem
                label="Nombre del Servicio"
                invalid={!!errors.nombre}
                errorMessage={errors.nombre?.message}
                className="md:col-span-2"
                asterisk
              >
                <Controller
                  name="nombre"
                  control={control}
                  rules={{ required: 'El nombre es requerido' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Ej: Consultoría SEO"
                      disabled={isSubmitting}
                      className="rounded-lg"
                    />
                  )}
                />
              </FormItem>

              <FormItem
                label="Descripción"
                invalid={!!errors.descripcion}
                errorMessage={errors.descripcion?.message}
                className="md:col-span-2"
                asterisk
              >
                <Controller
                  name="descripcion"
                  control={control}
                  rules={{ required: 'La descripción es requerida' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Describe detalladamente el servicio que se ofrece..."
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
                  rules={{ 
                    required: 'El precio es requerido',
                    min: { value: 0, message: 'El precio debe ser mayor o igual a 0' }
                  }}
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
                {isEdit ? 'Actualizar' : 'Crear'} Servicio
              </Button>
            </div>
          </FormContainer>
        </form>
      </Card>
    </motion.div>
  );
};

export default ServicioForm;
