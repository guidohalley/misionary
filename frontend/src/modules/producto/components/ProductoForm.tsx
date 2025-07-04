import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Producto, CreateProductoDTO, UpdateProductoDTO } from '../types';
import { Input, Button, Select, FormItem, FormContainer } from '@/components/ui';
import { Persona } from '@/modules/persona/types';
import { fetchPersonas } from '@/modules/persona/service';

interface ProductoFormProps {
  initialValues?: Producto;
  onSubmit: (data: CreateProductoDTO | UpdateProductoDTO) => void;
  onCancel?: () => void;
}

export function ProductoForm({
  initialValues,
  onSubmit,
  onCancel,
}: ProductoFormProps) {
  const [proveedores, setProveedores] = useState<Persona[]>([]);
  const [loadingProveedores, setLoadingProveedores] = useState(false);

  const { 
    control, 
    handleSubmit, 
    formState: { errors },
  } = useForm<CreateProductoDTO | UpdateProductoDTO>({
    defaultValues: initialValues || {
      nombre: '',
      precio: 0,
      proveedorId: undefined,
    },
  });

  useEffect(() => {
    const loadProveedores = async () => {
      try {
        setLoadingProveedores(true);
        const data = await fetchPersonas();
        // Filtrar solo los proveedores
        const proveedoresList = data.filter(p => p.tipo === 'PROVEEDOR');
        setProveedores(proveedoresList);
      } catch (error) {
        console.error('Error cargando proveedores:', error);
      } finally {
        setLoadingProveedores(false);
      }
    };

    loadProveedores();
  }, []);

  const proveedoresOptions = proveedores.map(p => ({
    value: p.id,
    label: p.nombre
  }));

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        <FormItem
          label="Nombre"
          invalid={Boolean(errors.nombre)}
          errorMessage={errors.nombre?.message}
        >
          <Controller
            name="nombre"
            control={control}
            rules={{ required: 'El nombre es requerido' }}
            render={({ field }) => (
              <Input {...field} />
            )}
          />
        </FormItem>

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
              <Input 
                {...field} 
                type="number" 
                step="0.01"
                value={field.value || ''}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                isLoading={loadingProveedores}
                isDisabled={loadingProveedores}
              />
            )}
          />
        </FormItem>

        <div className="col-span-2 flex justify-end gap-2 mt-4">
          {onCancel && (
            <Button variant="plain" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button variant="solid" type="submit">
            {initialValues ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </FormContainer>
  );
}

export default ProductoForm;
