import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Button, FormItem, FormContainer, Input, Select, Alert } from '@/components/ui';
import { motion } from 'framer-motion';
import { tipoCambioSchema } from '../schemas';
import type { TipoCambioFormData } from '../types';
import { codigoMonedaViewOptions, CodigoMoneda } from '../types';

interface TipoCambioFormProps {
  loading?: boolean;
  error?: string | null;
  onSubmit: (data: TipoCambioFormData) => Promise<void>;
}

const TipoCambioForm: React.FC<TipoCambioFormProps> = ({
  loading = false,
  error = null,
  onSubmit
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<TipoCambioFormData>({
    resolver: zodResolver(tipoCambioSchema),
    defaultValues: {
      monedaDesde: undefined,
      monedaHacia: undefined,
      valor: 0,
      fecha: new Date().toISOString().split('T')[0]
    },
  });

  const monedaDesde = watch('monedaDesde');

  const handleFormSubmit = async (data: TipoCambioFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      reset(); // Limpiar formulario después de envío exitoso
    } catch (error) {
      console.error('Error en formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrar opciones de moneda destino para evitar la misma moneda
  const monedaHaciaOptions = codigoMonedaViewOptions.filter(
    option => option.value !== monedaDesde
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Nuevo Tipo de Cambio
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Configure el tipo de cambio entre monedas
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <Alert showIcon className="mb-4" type="danger">
                {error}
              </Alert>
            </motion.div>
          )}

          <FormContainer>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Moneda Origen */}
                <FormItem
                  label="Moneda Origen"
                  invalid={!!errors.monedaDesde}
                  errorMessage={errors.monedaDesde?.message}
                >
                  <Controller
                    name="monedaDesde"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={codigoMonedaViewOptions}
                        placeholder="Seleccionar moneda origen"
                        value={codigoMonedaViewOptions.find(option => option.value === field.value) || null}
                        onChange={(option) => field.onChange(option?.value)}
                        isDisabled={isSubmitting}
                      />
                    )}
                  />
                </FormItem>

                {/* Moneda Destino */}
                <FormItem
                  label="Moneda Destino"
                  invalid={!!errors.monedaHacia}
                  errorMessage={errors.monedaHacia?.message}
                >
                  <Controller
                    name="monedaHacia"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={monedaHaciaOptions}
                        placeholder="Seleccionar moneda destino"
                        value={monedaHaciaOptions.find(option => option.value === field.value) || null}
                        onChange={(option) => field.onChange(option?.value)}
                        isDisabled={isSubmitting || !monedaDesde}
                      />
                    )}
                  />
                </FormItem>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Valor del Tipo de Cambio */}
                <FormItem
                  label="Valor"
                  invalid={!!errors.valor}
                  errorMessage={errors.valor?.message}
                >
                  <Controller
                    name="valor"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        step="0.0001"
                        min="0"
                        placeholder="Ej: 1.2500"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </FormItem>

                {/* Fecha */}
                <FormItem
                  label="Fecha"
                  invalid={!!errors.fecha}
                  errorMessage={errors.fecha?.message}
                >
                  <Controller
                    name="fecha"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="date"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </FormItem>
              </motion.div>

              {/* Botones */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="flex justify-end space-x-4 pt-4"
              >
                <Button
                  type="button"
                  variant="plain"
                  onClick={() => reset()}
                  disabled={isSubmitting}
                >
                  Limpiar
                </Button>
                <Button
                  type="submit"
                  variant="solid"
                  loading={isSubmitting || loading}
                  disabled={isSubmitting || loading}
                >
                  Crear Tipo de Cambio
                </Button>
              </motion.div>
            </form>
          </FormContainer>
        </div>
      </Card>
    </motion.div>
  );
};

export default TipoCambioForm;
