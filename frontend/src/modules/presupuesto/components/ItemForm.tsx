import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { CreateItemDTO } from '../types';
import { Producto } from '@/modules/producto/types';
import { Input, Button, Select, FormItem, FormContainer } from '@/components/ui';
import { fetchProductos } from '@/modules/producto/service';

interface ItemFormProps {
  initialValues?: CreateItemDTO;
  onSubmit: (data: CreateItemDTO) => void;
  onCancel: () => void;
}

export function ItemForm({ initialValues, onSubmit, onCancel }: ItemFormProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateItemDTO>({
    defaultValues: initialValues || {
      productoId: undefined,
      servicioId: undefined,
      cantidad: 1,
      precioUnitario: 0,
    },
  });

  const selectedProductoId = watch('productoId');

  useEffect(() => {
    const loadProductos = async () => {
      try {
        setLoading(true);
        const data = await fetchProductos();
        setProductos(data);
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProductos();
  }, []);

  useEffect(() => {
    if (selectedProductoId) {
      const producto = productos.find(p => p.id === selectedProductoId);
      if (producto) {
        setValue('precioUnitario', producto.precio);
      }
    }
  }, [selectedProductoId, productos, setValue]);

  const productosOptions = productos.map(p => ({
    value: p.id,
    label: `${p.nombre} - $${p.precio.toFixed(2)}`,
  }));

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        <FormItem
          label="Producto"
          invalid={Boolean(errors.productoId)}
          errorMessage={errors.productoId?.message}
        >
          <Controller
            name="productoId"
            control={control}
            rules={{ required: 'Debe seleccionar un producto' }}
            render={({ field }) => (
              <Select
                options={productosOptions}
                value={productosOptions.find(option => option.value === field.value)}
                onChange={option => field.onChange(option?.value)}
                isLoading={loading}
              />
            )}
          />
        </FormItem>

        <FormItem
          label="Cantidad"
          invalid={Boolean(errors.cantidad)}
          errorMessage={errors.cantidad?.message}
        >
          <Controller
            name="cantidad"
            control={control}
            rules={{
              required: 'La cantidad es requerida',
              min: { value: 1, message: 'La cantidad debe ser mayor a 0' },
            }}
            render={({ field }) => (
              <Input
                type="number"
                min={1}
                {...field}
                onChange={e => field.onChange(parseInt(e.target.value))}
              />
            )}
          />
        </FormItem>

        <FormItem
          label="Precio Unitario"
          invalid={Boolean(errors.precioUnitario)}
          errorMessage={errors.precioUnitario?.message}
        >
          <Controller
            name="precioUnitario"
            control={control}
            rules={{
              required: 'El precio unitario es requerido',
              min: { value: 0, message: 'El precio debe ser mayor o igual a 0' },
            }}
            render={({ field }) => (
              <Input
                type="number"
                step="0.01"
                {...field}
                onChange={e => field.onChange(parseFloat(e.target.value))}
              />
            )}
          />
        </FormItem>

        <div className="col-span-2 flex justify-end gap-2">
          <Button variant="plain" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="solid" type="submit">
            {initialValues ? 'Actualizar' : 'Agregar'} Item
          </Button>
        </div>
      </form>
    </FormContainer>
  );
}

export default ItemForm;
