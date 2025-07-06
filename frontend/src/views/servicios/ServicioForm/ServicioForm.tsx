import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Button, FormItem, FormContainer, Input, Select, Notification, toast } from '@/components/ui';
import { motion } from 'framer-motion';
import { servicioSchema } from '../schemas';
import type { ServicioFormData } from '../types';
import { usePersona } from '@/modules/persona/hooks/usePersona';
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
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ServicioFormData>({
    resolver: zodResolver(servicioSchema),
    defaultValues: initialData || {
      nombre: '',
      descripcion: '',
      precio: 0,
      proveedorId: undefined,
    },
  });

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
                asterisk
              >
                <Controller
                  name="nombre"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Ingresa el nombre del servicio"
                      disabled={isSubmitting}
                      className="rounded-lg"
                    />
                  )}
                />
              </FormItem>

              <FormItem
                label="Precio (ARS)"
                invalid={!!errors.precio}
                errorMessage={errors.precio?.message}
                asterisk
              >
                <Controller
                  name="precio"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      disabled={isSubmitting}
                      className="rounded-lg"
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Describe el servicio que ofreces"
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
                className="md:col-span-2"
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
