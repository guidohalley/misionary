import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Servicio, CreateServicioDTO, UpdateServicioDTO } from '../types';
import { Input, Button, Select, FormItem, FormContainer } from '@/components/ui';
import MoneyInput from '@/components/shared/MoneyInput';
import { useServicioAuxiliarData } from '../hooks/useServicio';

interface ServicioFormProps {
  initialValues?: Servicio;
  onSubmit: (data: CreateServicioDTO | UpdateServicioDTO) => void;
  onCancel?: () => void;
}

export function ServicioForm({
  initialValues,
  onSubmit,
  onCancel,
}: ServicioFormProps) {
  const { monedas, proveedores, loading: loadingAuxiliar } = useServicioAuxiliarData();

  const { 
    control, 
    handleSubmit, 
    watch,
    formState: { errors },
  } = useForm<CreateServicioDTO | UpdateServicioDTO>({
    defaultValues: initialValues || {
      nombre: '',
      descripcion: '',
      precio: 0,
      proveedorId: undefined,
      monedaId: 1, // ARS por defecto
    },
  });

  const monedaIdSeleccionada = watch('monedaId');
  const monedaSeleccionada = monedas.find(m => m.id === monedaIdSeleccionada);

  const proveedoresOptions = proveedores.map(p => ({
    value: p.id,
    label: p.nombre
  }));

  const monedasOptions = monedas.map(m => ({
    value: m.id,
    label: `${m.codigo} - ${m.nombre}`
  }));

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información básica del servicio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItem
            label="Nombre del Servicio"
            invalid={Boolean(errors.nombre)}
            errorMessage={errors.nombre?.message}
            className="md:col-span-2"
          >
            <Controller
              name="nombre"
              control={control}
              rules={{ required: 'El nombre es requerido' }}
              render={({ field }) => (
                <Input 
                  {...field} 
                  placeholder="Ej: Consultoría SEO"
                />
              )}
            />
          </FormItem>

          <FormItem
            label="Proveedor"
            invalid={Boolean(errors.proveedorId)}
            errorMessage={errors.proveedorId?.message}
          >
            <Controller
              name="proveedorId"
              control={control}
              rules={{ required: 'El proveedor es requerido' }}
              render={({ field }) => (
                <Select
                  options={proveedoresOptions}
                  value={proveedoresOptions.find(option => option.value === field.value)}
                  onChange={option => field.onChange(option?.value)}
                  isLoading={loadingAuxiliar}
                  isDisabled={loadingAuxiliar}
                  placeholder="Seleccionar proveedor..."
                />
              )}
            />
          </FormItem>

          <FormItem
            label="Moneda"
            invalid={Boolean(errors.monedaId)}
            errorMessage={errors.monedaId?.message}
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
                  isLoading={loadingAuxiliar}
                  isDisabled={loadingAuxiliar}
                  placeholder="Seleccionar moneda..."
                />
              )}
            />
          </FormItem>
        </div>

        {/* Descripción del servicio */}
        <div className="border-t pt-6">
          <FormItem
            label="Descripción"
            invalid={Boolean(errors.descripcion)}
            errorMessage={errors.descripcion?.message}
          >
            <Controller
              name="descripcion"
              control={control}
              rules={{ required: 'La descripción es requerida' }}
              render={({ field }) => (
                <Input 
                  {...field} 
                  placeholder="Describe detalladamente el servicio que se ofrece..."
                />
              )}
            />
          </FormItem>
        </div>

        {/* Campo de precio con MoneyInput */}
        <div className="border-t pt-6">
          <FormItem
            label="Precio"
            invalid={Boolean(errors.precio)}
            errorMessage={errors.precio?.message}
          >
            <Controller
              name="precio"
              control={control}
              rules={{ 
                required: 'El precio es requerido',
                min: {
                  value: 0,
                  message: 'El precio debe ser mayor o igual a 0'
                }
              }}
              render={({ field }) => (
                <MoneyInput
                  value={field.value || 0}
                  onChange={field.onChange}
                  currency={monedaSeleccionada?.codigo || 'ARS'}
                  currencySymbol={monedaSeleccionada?.simbolo || '$'}
                  placeholder="0,00"
                  className="max-w-md"
                />
              )}
            />
          </FormItem>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          {onCancel && (
            <Button variant="plain" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button 
            variant="solid" 
            type="submit"
            loading={loadingAuxiliar}
          >
            {initialValues ? 'Actualizar Servicio' : 'Crear Servicio'}
          </Button>
        </div>
      </form>
    </FormContainer>
  );
}

export default ServicioForm;
