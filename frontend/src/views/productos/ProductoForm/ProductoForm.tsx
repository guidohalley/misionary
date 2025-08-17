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
import { HiOutlineArrowLeft, HiOutlineSave, HiOutlineX, HiOutlineCube } from 'react-icons/hi';
import { productoSchema } from '../schemas';
import type { ProductoFormData } from '../types';
import { usePersona } from '@/modules/persona/hooks/usePersona';
import { useProductoAuxiliarData } from '@/modules/producto/hooks/useProducto';
import { TipoPersona, RolUsuario } from '@/views/personas/schemas';
import { useAuth } from '@/contexts/AuthContext';

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
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { personas, refreshPersonas } = usePersona();
  const { monedas, loading: loadingMonedas } = useProductoAuxiliarData();
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
  } = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema), // Reactivado con el schema actualizado
    defaultValues: initialData || {
      nombre: '',
      costoProveedor: 0,
      margenAgencia: 0,
      precio: 0,
      proveedorId: mustUseOwnId ? user?.id : undefined, // Precargar ID si es proveedor puro
      monedaId: 1, // ARS por defecto
    },
  });

  const monedaIdSeleccionada = watch('monedaId');
  const monedaSeleccionada = monedas.find(m => m.id === monedaIdSeleccionada);
  
  // Watch para cálculo automático del precio
  const costoProveedor = watch('costoProveedor');
  const margenAgencia = watch('margenAgencia');

  // Efecto para calcular precio automáticamente
  useEffect(() => {
    if (costoProveedor > 0 && margenAgencia >= 0) {
      const precioCalculado = costoProveedor * (1 + margenAgencia / 100);
      setValue('precio', Number(precioCalculado.toFixed(2)));
    }
  }, [costoProveedor, margenAgencia, setValue]);

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
      className="container mx-auto p-4 max-w-7xl"
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
            onClick={() => navigate('/productos')}
            className="hover:text-blue-600 transition-colors"
          >
            Productos
          </button>
          <span>/</span>
          <span>{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</span>
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
              <HiOutlineCube className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {isEdit ? 'Editar Producto' : 'Agregar Nuevo Producto'}
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
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isEdit ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </div>
      </motion.div>

      <FormContainer>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Columna Principal - Información del Producto */}
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
                        Información del Producto
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Configure la información básica del producto
                      </p>
                    </div>

                    <div className="space-y-4">
                      <FormItem
                        label="Nombre del Producto"
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
                              placeholder="Ej: Hosting Web Premium, Dominio .com, etc."
                              disabled={isSubmitting}
                              className="rounded-lg"
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
                        Configure el costo del proveedor y margen de agencia. El precio se calculará automáticamente.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormItem
                        label="Costo del Proveedor"
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
                              onChange={(val: number) => field.onChange(Number.isFinite(val) ? val : 0)}
                              currency={monedaSeleccionada?.codigo || 'ARS'}
                              currencySymbol={monedaSeleccionada?.simbolo || '$'}
                              placeholder="0,00"
                              disabled={isSubmitting}
                            />
                          )}
                        />
                      </FormItem>

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
                              value={field.value ?? ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                field.onChange(val === '' ? undefined : Number(val));
                              }}
                              placeholder="Ej: 25 (para 25%)"
                              disabled={isSubmitting}
                              className="rounded-lg"
                              suffix="%"
                            />
                          )}
                        />
                      </FormItem>
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
                              disabled={true}
                              className="bg-gray-50 dark:bg-gray-700"
                            />
                          )}
                        />
                      </FormItem>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Columna Lateral - Proveedor y Configuración */}
            <div className="space-y-6">
              
              {/* Proveedor */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <Card>
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Proveedor
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {mustUseOwnId 
                          ? 'Como proveedor, solo puedes crear productos para tu cuenta'
                          : 'Seleccione el proveedor del producto'
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
              
              {/* Información del Sistema */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <div className="p-6">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      💡 Información
                    </h4>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Los precios se almacenan en la moneda seleccionada</li>
                      <li>• ARS (Peso Argentino) es la moneda por defecto</li>
                      <li>• El producto será visible en presupuestos</li>
                      <li>• El proveedor debe estar registrado previamente</li>
                    </ul>
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

export default ProductoForm;
