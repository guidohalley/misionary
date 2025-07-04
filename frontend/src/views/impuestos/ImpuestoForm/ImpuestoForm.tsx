import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Button, FormItem, FormContainer, Input, Switcher, Notification, toast } from '@/components/ui';
import { motion } from 'framer-motion';
import { impuestoSchema } from '../schemas';
import type { ImpuestoFormData } from '../schemas';

interface ImpuestoFormProps {
  initialData?: ImpuestoFormData;
  onSubmit: (data: ImpuestoFormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const ImpuestoForm: React.FC<ImpuestoFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ImpuestoFormData>({
    resolver: zodResolver(impuestoSchema),
    defaultValues: initialData || {
      nombre: '',
      porcentaje: 0,
      descripcion: '',
      activo: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: ImpuestoFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      toast.push(
        <Notification title="Éxito" type="success">
          Impuesto {isEdit ? 'actualizado' : 'creado'} correctamente
        </Notification>
      );
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Error al {isEdit ? 'actualizar' : 'crear'} el impuesto
        </Notification>
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Impuesto' : 'Nuevo Impuesto'}
          </h2>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Modifica la información del impuesto' : 'Completa los datos del nuevo impuesto'}
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FormContainer>
            {/* Nombre */}
            <FormItem
              label="Nombre del Impuesto"
              invalid={!!errors.nombre}
              errorMessage={errors.nombre?.message}
            >
              <Controller
                name="nombre"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Ej: IVA, IIBB, Retención Ganancias"
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormItem>

            {/* Porcentaje */}
            <FormItem
              label="Porcentaje (%)"
              invalid={!!errors.porcentaje}
              errorMessage={errors.porcentaje?.message}
            >
              <Controller
                name="porcentaje"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="Ej: 21.00"
                    disabled={isSubmitting}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />
            </FormItem>

            {/* Descripción */}
            <FormItem
              label="Descripción (Opcional)"
              invalid={!!errors.descripcion}
              errorMessage={errors.descripcion?.message}
            >
              <Controller
                name="descripcion"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    textArea
                    rows={3}
                    placeholder="Descripción adicional del impuesto..."
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormItem>

            {/* Estado Activo */}
            <FormItem
              label="Estado"
              invalid={!!errors.activo}
              errorMessage={errors.activo?.message}
            >
              <Controller
                name="activo"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center space-x-3">
                    <Switcher
                      checked={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-gray-600">
                      {field.value ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                )}
              />
            </FormItem>

            <div className="flex justify-end space-x-4 mt-6">
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
                {isEdit ? 'Actualizar' : 'Crear'} Impuesto
              </Button>
            </div>
          </FormContainer>
        </form>
      </Card>
    </motion.div>
  );
};

export default ImpuestoForm;
