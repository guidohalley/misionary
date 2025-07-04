import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  Presupuesto, 
  CreatePresupuestoDTO, 
  UpdatePresupuestoDTO,
  CreateItemDTO,
  Item 
} from '../types';
import { Persona } from '@/modules/persona/types';
import { fetchPersonas } from '@/modules/persona/service';
import { Input, Button, Select, FormItem, FormContainer, Dialog, Card } from '@/components/ui';
import ItemList from './ItemList';
import ItemForm from './ItemForm';

interface PresupuestoFormProps {
  initialValues?: Presupuesto;
  onSubmit: (data: CreatePresupuestoDTO | UpdatePresupuestoDTO) => void;
  onCancel?: () => void;
}

export function PresupuestoForm({
  initialValues,
  onSubmit,
  onCancel,
}: PresupuestoFormProps) {
  const [clientes, setClientes] = useState<Persona[]>([]);
  const [items, setItems] = useState<CreateItemDTO[]>(initialValues?.items || []);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePresupuestoDTO | UpdatePresupuestoDTO>({
    defaultValues: initialValues || {
      clienteId: undefined,
      items: [],
      subtotal: 0,
      impuestos: 0,
      total: 0,
    },
  });

  // Cargar clientes
  useEffect(() => {
    const loadClientes = async () => {
      try {
        setLoading(true);
        const data = await fetchPersonas();
        // Filtrar solo los clientes
        const clientesList = data.filter(p => p.tipo === 'CLIENTE');
        setClientes(clientesList);
      } catch (error) {
        console.error('Error cargando clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClientes();
  }, []);

  // Calcular totales cuando cambian los items
  useEffect(() => {
    const subtotal = items.reduce((acc, item) => {
      return acc + (item.cantidad * item.precioUnitario);
    }, 0);
    
    const impuestos = subtotal * 0.21; // 21% IVA
    const total = subtotal + impuestos;

    setValue('items', items);
    setValue('subtotal', subtotal);
    setValue('impuestos', impuestos);
    setValue('total', total);
  }, [items, setValue]);

  const handleAddItem = (item: CreateItemDTO) => {
    if (editingItemIndex !== null) {
      setItems(prev => {
        const newItems = [...prev];
        newItems[editingItemIndex] = item;
        return newItems;
      });
      setEditingItemIndex(null);
    } else {
      setItems(prev => [...prev, item]);
    }
    setShowItemForm(false);
  };

  const handleEditItem = (index: number) => {
    setEditingItemIndex(index);
    setShowItemForm(true);
  };

  const handleDeleteItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const clientesOptions = clientes.map(c => ({
    value: c.id,
    label: c.nombre,
  }));

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <div className="p-4">
            <FormItem
              label="Cliente"
              invalid={Boolean(errors.clienteId)}
              errorMessage={errors.clienteId?.message}
            >
              <Controller
                name="clienteId"
                control={control}
                rules={{ required: 'Debe seleccionar un cliente' }}
                render={({ field }) => (
                  <Select
                    options={clientesOptions}
                    value={clientesOptions.find(option => option.value === field.value)}
                    onChange={option => field.onChange(option?.value)}
                    isLoading={loading}
                  />
                )}
              />
            </FormItem>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Items del Presupuesto</h3>
              <Button 
                variant="solid" 
                onClick={() => {
                  setEditingItemIndex(null);
                  setShowItemForm(true);
                }}
              >
                Agregar Item
              </Button>
            </div>

            <ItemList
              items={items as Item[]}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />

            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>$ {watch('subtotal')?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuestos (21%):</span>
                <span>$ {watch('impuestos')?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>$ {watch('total')?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button variant="plain" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button variant="solid" type="submit" disabled={items.length === 0}>
            {initialValues ? 'Actualizar' : 'Crear'} Presupuesto
          </Button>
        </div>
      </form>

      <Dialog
        isOpen={showItemForm}
        onClose={() => setShowItemForm(false)}
        onRequestClose={() => setShowItemForm(false)}
      >
        <h4 className="text-lg font-semibold mb-4">
          {editingItemIndex !== null ? 'Editar' : 'Agregar'} Item
        </h4>
        <ItemForm
          initialValues={editingItemIndex !== null ? items[editingItemIndex] : undefined}
          onSubmit={handleAddItem}
          onCancel={() => setShowItemForm(false)}
        />
      </Dialog>
    </FormContainer>
  );
}

export default PresupuestoForm;
