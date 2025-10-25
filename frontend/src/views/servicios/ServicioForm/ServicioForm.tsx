import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  FormItem, 
  FormContainer, 
  Input, 
  Select, 
  Notification, 
  toast 
} from '@/components/ui';
import MoneyInput from '@/components/shared/MoneyInput';
import { HiOutlineArrowLeft, HiOutlineSave, HiOutlineX, HiOutlineCog } from 'react-icons/hi';
import { servicioSchema } from '../schemas';
import type { ServicioFormData } from '../types';
import { usePersona } from '@/modules/persona/hooks/usePersona';
import { useServicioAuxiliarData } from '@/modules/servicio/hooks/useServicio';
import { TipoPersona, RolUsuario } from '@/views/personas/schemas';
import { useAuth } from '@/contexts/AuthContext';

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
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { personas, refreshPersonas } = usePersona();
  const { monedas, loading: loadingMonedas } = useServicioAuxiliarData();
  const { user } = useAuth();

  // Determinar permisos del usuario actual
  const isAdmin = user?.roles.includes('ADMIN') || false;
  const isProveedor = user?.roles.includes('PROVEEDOR') || false;
  const canSelectAnyProvider = isAdmin; // Solo ADMIN puede elegir cualquier proveedor
  const mustUseOwnId = isProveedor && !isAdmin; // PROVEEDOR puro debe usar su propio ID

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ServicioFormData>({
    resolver: zodResolver(servicioSchema), // Reactivado con el schema actualizado
    defaultValues: initialData || {
      nombre: '',
      descripcion: '',
      costoProveedor: 0,
      margenAgencia: isProveedor ? 35 : 0, // 35% por defecto para proveedores
      precio: 0,
      proveedorId: mustUseOwnId ? user?.id : undefined, // Precargar ID si es proveedor puro
      monedaId: 1, // ARS por defecto
    },
  });

  const monedaIdSeleccionada = watch('monedaId');
  const monedaSeleccionada = monedas.find(m => m.id === monedaIdSeleccionada);
  
  // Watch para cálculo de preview del precio (solo visual, no se envía)
  const costoProveedor = watch('costoProveedor');
  const margenAgencia = watch('margenAgencia');

  // Preview del precio calculado (solo para mostrar, el backend calculará el real)
  const precioPreview = useMemo(() => {
    if (costoProveedor > 0 && margenAgencia >= 0) {
      return Math.round(costoProveedor * (1 + margenAgencia / 100) * 100) / 100;
    }
    return 0;
  }, [costoProveedor, margenAgencia]);

  useEffect(() => {
    refreshPersonas();
  }, [refreshPersonas]);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // Efecto para precargar el proveedor si es un proveedor puro y no hay datos iniciales
  useEffect(() => {
    if (mustUseOwnId && user?.id && !initialData) {
      setValue('proveedorId', user.id);
    }
  }, [mustUseOwnId, user?.id, initialData, setValue]);

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

  const handleCancel = () => {
    onCancel();
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
      transition={{ duration: 0.4 }}
      className="w-full max-w-[98%] sm:max-w-[95%] md:max-w-[90%] xl:max-w-7xl mx-auto p-3 sm:p-4"
    >
      {/* Header con breadcrumbs */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <button 
            onClick={() => navigate('/servicios')}
            className="hover:text-green-600 transition-colors"
          >
            Servicios
          </button>
          <span>/</span>
          <span>{isEdit ? 'Editar Servicio' : 'Nuevo Servicio'}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className="p-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <HiOutlineArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex items-center gap-2">
              <HiOutlineCog className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {isEdit ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="plain" 
              onClick={handleCancel}
              icon={<HiOutlineX />}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="solid"
              loading={isSubmitting}
              onClick={handleSubmit(handleFormSubmit)}
              icon={<HiOutlineSave />}
              className="bg-green-600 hover:bg-green-700"
            >
              {isEdit ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </div>
      </motion.div>

      <FormContainer>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Columna Principal - Información del Servicio */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Información Básica */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <Card>
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Información del Servicio
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Configure la información básica del servicio
                      </p>
                    </div>

                    <div className="space-y-4">
                      <FormItem
                        label="Nombre del Servicio"
                        invalid={!!errors.nombre}
                        errorMessage={errors.nombre?.message}
                        asterisk
                      >
                        <Controller
                          name="nombre"
                          control={control}
                          rules={{ required: 'El nombre es requerido' }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="Ej: Consultoría SEO, Diseño de Logo, etc."
                              disabled={isSubmitting}
                              className="rounded-lg"
                            />
                          )}
                        />
                      </FormItem>

                      <FormItem
                        label="Descripción del Servicio"
                        invalid={!!errors.descripcion}
                        errorMessage={errors.descripcion?.message}
                        asterisk
                      >
                        <Controller
                          name="descripcion"
                          control={control}
                          rules={{ required: 'La descripción es requerida' }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="Describe detalladamente qué incluye este servicio..."
                              disabled={isSubmitting}
                              className="rounded-lg h-20"
                            />
                          )}
                        />
                      </FormItem>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Pricing y Moneda */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <Card>
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Pricing y Moneda
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {isProveedor 
                          ? 'Configure el costo de su servicio. El precio final se calculará automáticamente.'
                          : 'Configure el costo del proveedor y margen de agencia. El precio se calculará automáticamente.'
                        }
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormItem
                        label={isProveedor ? "Costo del Servicio" : "Costo del Proveedor"}
                        invalid={!!errors.costoProveedor}
                        errorMessage={errors.costoProveedor?.message}
                        asterisk
                      >
                        <Controller
                          name="costoProveedor"
                          control={control}
                          rules={{ 
                            required: 'El costo del proveedor es requerido',
                            min: { value: 0, message: 'El costo debe ser mayor o igual a 0' }
                          }}
                          render={({ field }) => (
                            <MoneyInput
                              value={field.value || 0}
                              onChange={field.onChange}
                              currency={monedaSeleccionada?.codigo || 'ARS'}
                              currencySymbol={monedaSeleccionada?.simbolo || '$'}
                              placeholder="0,00"
                              disabled={isSubmitting}
                            />
                          )}
                        />
                      </FormItem>

                      {/* Solo mostrar margen de agencia si NO es proveedor */}
                      {!isProveedor && (
                        <FormItem
                          label="Margen de Agencia (%)"
                          invalid={!!errors.margenAgencia}
                          errorMessage={errors.margenAgencia?.message}
                          asterisk
                        >
                          <Controller
                            name="margenAgencia"
                            control={control}
                            rules={{ 
                              required: 'El margen de agencia es requerido',
                              min: { value: 0, message: 'El margen debe ser mayor o igual a 0' },
                              max: { value: 1000, message: 'El margen no puede exceder 1000%' }
                            }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                min="0"
                                max="1000"
                                value={field.value || ''}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                placeholder="Ej: 25 (para 25%)"
                                disabled={isSubmitting}
                                className="rounded-lg"
                                suffix="%"
                              />
                            )}
                          />
                        </FormItem>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <FormItem
                        label="Moneda"
                        invalid={!!errors.monedaId}
                        errorMessage={errors.monedaId?.message}
                        asterisk
                      >
                        <Controller
                          name="monedaId"
                          control={control}
                          rules={{ required: 'La moneda es requerida' }}
                          render={({ field }) => (
                            <Select
                              options={monedasOptions}
                              value={monedasOptions.find(option => option.value === field.value)}
                              onChange={option => field.onChange(option?.value)}
                              isLoading={loadingMonedas}
                              isDisabled={loadingMonedas || isSubmitting}
                              placeholder="Seleccionar moneda..."
                              className="rounded-lg"
                            />
                          )}
                        />
                      </FormItem>

                      {/* Solo mostrar precio final si NO es proveedor */}
                      {!isProveedor && (
                        <FormItem
                          label="Precio Final (Calculado automáticamente)"
                          invalid={!!errors.precio}
                          errorMessage={errors.precio?.message}
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
                                disabled={true} // Siempre readonly porque se calcula automáticamente
                                className="bg-gray-50 dark:bg-gray-700"
                              />
                            )}
                          />
                        </FormItem>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Columna Lateral - Proveedor y Configuración */}
            <div className="space-y-6">
              
              {/* Información del Sistema */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                  <div className="p-6">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      💡 Información
                    </h4>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Los precios se almacenan en la moneda seleccionada</li>
                      <li>• ARS (Peso Argentino) es la moneda por defecto</li>
                      <li>• El servicio será visible en presupuestos</li>
                      <li>• El proveedor debe estar registrado previamente</li>
                      <li>• Una descripción detallada mejora la comunicación</li>
                    </ul>
                  </div>
                </Card>
              </motion.div>

              {/* Proveedor */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <Card>
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Proveedor
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {mustUseOwnId 
                          ? 'Como proveedor, solo puedes crear servicios para tu cuenta'
                          : 'Seleccione el proveedor del servicio'
                        }
                      </p>
                    </div>

                    <FormItem
                      label="Proveedor"
                      invalid={!!errors.proveedorId}
                      errorMessage={errors.proveedorId?.message}
                      asterisk
                    >
                      <Controller
                        name="proveedorId"
                        control={control}
                        rules={{ required: 'El proveedor es requerido' }}
                        render={({ field }) => (
                          <Select
                            options={proveedorOptions}
                            value={proveedorOptions.find(option => option.value === field.value)}
                            onChange={option => field.onChange(option?.value)}
                            isDisabled={isSubmitting || mustUseOwnId} // Deshabilitar si es proveedor puro
                            placeholder={mustUseOwnId ? "Tu cuenta (automático)" : "Seleccionar proveedor..."}
                            className="rounded-lg"
                          />
                        )}
                      />
                    </FormItem>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </form>
      </FormContainer>
    </motion.div>
  );
};

export default ServicioForm;
