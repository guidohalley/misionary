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
import { Impuesto } from '@/modules/impuesto/types';
import { Moneda } from '@/modules/moneda/types';
import { fetchPersonas } from '@/modules/persona/service';
import { useImpuesto } from '@/modules/impuesto/hooks/useImpuesto';
import { useMoneda } from '@/modules/moneda/hooks/useMoneda';
import { Input, Button, Select, FormItem, FormContainer, Dialog, Card, Checkbox } from '@/components/ui';
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
  const [impuestosSeleccionados, setImpuestosSeleccionados] = useState<number[]>(
    initialValues?.presupuestoImpuestos?.map(pi => pi.impuestoId) || []
  );
  
  const { getActiveImpuestos } = useImpuesto();
  const { monedas } = useMoneda();
  const [impuestosActivos, setImpuestosActivos] = useState<Impuesto[]>([]);
  
  // Filtrar monedas activas
  const monedasActivas = monedas.filter(m => m.activo);

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
      monedaId: 1, // ARS por defecto
      impuestosSeleccionados: [],
    },
  });

  // Cargar clientes e impuestos
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Cargar clientes
        const personasData = await fetchPersonas();
        const clientesList = personasData.filter(p => p.tipo === 'CLIENTE');
        setClientes(clientesList);
        
        // Cargar impuestos activos
        const impuestosData = await getActiveImpuestos();
        setImpuestosActivos(impuestosData);
        
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [getActiveImpuestos]);

  // Calcular totales cuando cambian los items o impuestos seleccionados
  useEffect(() => {
    const subtotal = items.reduce((acc, item) => {
      return acc + (item.cantidad * item.precioUnitario);
    }, 0);
    
    // Calcular impuestos basado en los seleccionados
    const totalImpuestos = impuestosSeleccionados.reduce((acc, impuestoId) => {
      const impuesto = impuestosActivos.find(i => i.id === impuestoId);
      if (impuesto) {
        return acc + (subtotal * impuesto.porcentaje / 100);
      }
      return acc;
    }, 0);
    
    const total = subtotal + totalImpuestos;

    setValue('items', items);
    setValue('subtotal', subtotal);
    setValue('impuestos', totalImpuestos);
    setValue('total', total);
    setValue('impuestosSeleccionados', impuestosSeleccionados);
  }, [items, impuestosSeleccionados, impuestosActivos, setValue]);

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

  const handleToggleImpuesto = (impuestoId: number) => {
    setImpuestosSeleccionados(prev => {
      if (prev.includes(impuestoId)) {
        return prev.filter(id => id !== impuestoId);
      } else {
        return [...prev, impuestoId];
      }
    });
  };

  const clientesOptions = clientes.map(c => ({
    value: c.id,
    label: c.nombre,
  }));

  const monedasOptions = monedasActivas.map(m => ({
    value: m.id,
    label: `${m.nombre} (${m.simbolo})`,
  }));

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="Seleccionar cliente..."
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
                  rules={{ required: 'Debe seleccionar una moneda' }}
                  render={({ field }) => (
                    <Select
                      options={monedasOptions}
                      value={monedasOptions.find(option => option.value === field.value)}
                      onChange={option => field.onChange(option?.value)}
                      placeholder="Seleccionar moneda..."
                    />
                  )}
                />
              </FormItem>
            </div>
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

            {/* Selección de Impuestos */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-md font-semibold mb-3">Impuestos a Aplicar</h4>
              {impuestosActivos.length > 0 ? (
                <div className="space-y-2">
                  {impuestosActivos.map(impuesto => (
                    <div key={impuesto.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={impuestosSeleccionados.includes(impuesto.id)}
                        onChange={() => handleToggleImpuesto(impuesto.id)}
                      />
                      <span className="text-sm">
                        {impuesto.nombre} ({impuesto.porcentaje}%)
                        {impuesto.descripcion && (
                          <span className="text-gray-500 ml-1">- {impuesto.descripcion}</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No hay impuestos activos configurados</p>
              )}
            </div>

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
