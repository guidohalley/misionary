import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Button, FormItem, FormContainer, Input, Select, Alert, Badge } from '@/components/ui';
import { motion } from 'framer-motion';
import { HiOutlineCalculator, HiOutlineRefresh } from 'react-icons/hi';
import { conversionSchema } from '../schemas';
import type { ConversionFormData, ConversionResponse } from '../types';
import { codigoMonedaViewOptions, getSimboloMoneda } from '../types';

interface ConversionFormProps {
  loading?: boolean;
  error?: string | null;
  ultimaConversion?: ConversionResponse | null;
  onSubmit: (data: ConversionFormData) => Promise<void>;
  onClear?: () => void;
}

const ConversionForm: React.FC<ConversionFormProps> = ({
  loading = false,
  error = null,
  ultimaConversion = null,
  onSubmit,
  onClear
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ConversionFormData>({
    resolver: zodResolver(conversionSchema),
    defaultValues: {
      monto: 0,
      monedaDesde: undefined,
      monedaHacia: undefined,
      fecha: undefined
    },
  });

  const monedaDesde = watch('monedaDesde');

  const handleFormSubmit = async (data: ConversionFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error('Error en conversión:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    reset();
    onClear?.();
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
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Formulario de Conversión */}
      <Card>
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <HiOutlineCalculator className="w-5 h-5 mr-2" />
              Convertir Moneda
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Realice conversiones entre diferentes monedas
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
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {/* Monto */}
                <FormItem
                  label="Monto"
                  invalid={!!errors.monto}
                  errorMessage={errors.monto?.message}
                >
                  <Controller
                    name="monto"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Ej: 100.00"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </FormItem>

                {/* Moneda Origen */}
                <FormItem
                  label="De"
                  invalid={!!errors.monedaDesde}
                  errorMessage={errors.monedaDesde?.message}
                >
                  <Controller
                    name="monedaDesde"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={codigoMonedaViewOptions}
                        placeholder="Seleccionar moneda"
                        value={codigoMonedaViewOptions.find(option => option.value === field.value) || null}
                        onChange={(option) => field.onChange(option?.value)}
                        isDisabled={isSubmitting}
                      />
                    )}
                  />
                </FormItem>

                {/* Moneda Destino */}
                <FormItem
                  label="A"
                  invalid={!!errors.monedaHacia}
                  errorMessage={errors.monedaHacia?.message}
                >
                  <Controller
                    name="monedaHacia"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={monedaHaciaOptions}
                        placeholder="Seleccionar moneda"
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
                {/* Fecha (Opcional) */}
                <FormItem
                  label="Fecha (Opcional)"
                  invalid={!!errors.fecha}
                  errorMessage={errors.fecha?.message}
                >
                  <Controller
                    name="fecha"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="date"
                        value={field.value || ''}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                        placeholder="Dejar vacío para usar tipo de cambio actual"
                      />
                    )}
                  />
                </FormItem>

                {/* Botones */}
                <FormItem label=" ">
                  <div className="flex space-x-2">
                    <Button
                      type="submit"
                      variant="solid"
                      loading={isSubmitting || loading}
                      disabled={isSubmitting || loading}
                      icon={<HiOutlineCalculator />}
                      className="flex-1"
                    >
                      Convertir
                    </Button>
                    <Button
                      type="button"
                      variant="plain"
                      onClick={handleClear}
                      disabled={isSubmitting}
                      icon={<HiOutlineRefresh />}
                    >
                      Limpiar
                    </Button>
                  </div>
                </FormItem>
              </motion.div>
            </form>
          </FormContainer>
        </div>
      </Card>

      {/* Resultado de Conversión */}
      {ultimaConversion && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="p-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="mb-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Resultado de la Conversión
                </h3>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
              >
                {/* Monto Original */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {getSimboloMoneda(ultimaConversion.monedaDesde)} {ultimaConversion.montoOriginal.toFixed(2)}
                  </div>
                  <Badge className="mt-2 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    {ultimaConversion.monedaDesde}
                  </Badge>
                </div>

                {/* Flecha y Tipo de Cambio */}
                <div className="text-center">
                  <div className="text-gray-500 dark:text-gray-400 mb-2">→</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Tipo de cambio: {ultimaConversion.tipoCambio?.valor ? parseFloat(ultimaConversion.tipoCambio.valor.toString()).toFixed(4) : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Fecha: {ultimaConversion.fecha}
                  </div>
                </div>

                {/* Monto Convertido */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {getSimboloMoneda(ultimaConversion.monedaHacia)} {ultimaConversion.montoConvertido.toFixed(2)}
                  </div>
                  <Badge className="mt-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {ultimaConversion.monedaHacia}
                  </Badge>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ConversionForm;
