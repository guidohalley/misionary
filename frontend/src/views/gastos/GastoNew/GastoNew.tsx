import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Input, 
  Select, 
  FormItem, 
  FormContainer,
  Badge,
  DatePicker,
  Checkbox
} from '@/components/ui';
import MoneyInput from '@/components/shared/MoneyInput';
import { HiOutlineArrowLeft, HiOutlineSave, HiOutlineX, HiOutlineCash } from 'react-icons/hi';
import { useGasto, useGastoAuxiliarData } from '@/modules/gasto/hooks/useGasto';
import { fetchTiposGasto } from '@/modules/gasto/service';
import { frecuenciaOptions } from '../schemas';
import { fetchCategorias, createCategoria } from '@/modules/categoria/service';
import { useAuth } from '@/contexts/AuthContext';

const GastoNew: React.FC = () => {
  const navigate = useNavigate();
  const { createGastoOperativo } = useGasto();
  const { monedas, proveedores } = useGastoAuxiliarData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    concepto: '',
    descripcion: '',
    monto: 0,
    monedaId: 1,
    fecha: new Date(),
  categoriaId: undefined as number | undefined,
    tipoId: undefined as number | undefined,
    esRecurrente: false,
    frecuencia: '',
    proveedorId: undefined as number | undefined,
    comprobante: '',
    observaciones: '',
    activo: true
  });
  const [tipos, setTipos] = useState<{value:number,label:string,color?:string}[]>([]);
  const [categorias, setCategorias] = useState<{value:number,label:string}[]>([]);

  React.useEffect(() => {
    fetchTiposGasto().then(list => {
      setTipos(list.filter(t=>t.activo).map(t=>({value:t.id,label:t.nombre,color:t.color||undefined})));
    }).catch(()=>setTipos([]));
    fetchCategorias(true).then(list => {
      setCategorias(list.map(c=>({ value: c.id, label: c.nombre })));
    }).catch(()=>setCategorias([]));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  if (!formData.concepto || !formData.categoriaId || formData.monto <= 0) {
      alert('Por favor complete los campos requeridos');
      return;
    }

    try {
      setIsSubmitting(true);
      await createGastoOperativo({
        ...formData,
  categoriaId: formData.categoriaId as number
      });
      navigate('/gastos');
    } catch (error) {
      console.error('Error al crear gasto operativo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/gastos');
  };

  // Mapear opciones para Select con validación
  const monedaOptions = React.useMemo(() => {
    if (!monedas || !Array.isArray(monedas)) {
      return [];
    }
    return monedas.map(moneda => ({
      value: moneda.id,
      label: `${moneda.simbolo} ${moneda.codigo} - ${moneda.nombre}`
    }));
  }, [monedas]);

  const proveedorOptions = React.useMemo(() => {
    const baseOptions = [{ value: undefined, label: 'Sin proveedor' }];
    if (!proveedores || !Array.isArray(proveedores)) {
      return baseOptions;
    }
    return [
      ...baseOptions,
      ...proveedores.map(proveedor => ({
        value: proveedor.id,
        label: proveedor.nombre
      }))
    ];
  }, [proveedores]);

  const categoriaOptions = categorias;
  const tipoOptions = [{value: undefined as any, label: 'Sin tipo'}, ...tipos];

  // Obtener la moneda seleccionada para el MoneyInput
  const selectedMoneda = monedas.find(m => m.id === formData.monedaId);

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
            onClick={() => navigate('/gastos')}
            className="hover:text-blue-600 transition-colors"
          >
            Gastos Operativos
          </button>
          <span>/</span>
          <span>Nuevo Gasto</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <HiOutlineCash className="text-blue-600" />
          Nuevo Gasto Operativo
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Registra un nuevo gasto operativo de la empresa
        </p>
      </motion.div>

      {/* Formulario */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Card>
          <form onSubmit={onSubmit}>
            <FormContainer>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Información Básica */}
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    📋 Información Básica
                  </h2>
                </div>

                <FormItem
                  label="Concepto"
                  asterisk
                >
                  <Input
                    value={formData.concepto}
                    onChange={(e) => setFormData({...formData, concepto: e.target.value})}
                    placeholder="Ej: Alquiler oficina, Sueldo desarrollador..."
                    disabled={isSubmitting}
                  />
                </FormItem>

                <FormItem label="Categoría" asterisk>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select
                        options={categoriaOptions}
                        placeholder="Selecciona una categoría"
                        isDisabled={isSubmitting}
                        onChange={(option) => setFormData({...formData, categoriaId: option?.value})}
                        value={categoriaOptions.find(option => option.value === formData.categoriaId)}
                      />
                    </div>
                    {user?.roles?.includes('ADMIN') && (
                      <Button
                        type="button"
                        variant="twoTone"
                        onClick={async () => {
                          const nombre = prompt('Nueva categoría (se guardará en MAYÚSCULAS):');
                          if (!nombre) return;
                          try {
                            const nueva = await createCategoria(nombre.toUpperCase());
                            const opt = { value: nueva.id, label: nueva.nombre };
                            setCategorias(prev => [...prev, opt]);
                            setFormData(prev => ({ ...prev, categoriaId: nueva.id }));
                          } catch (e) {
                            alert('No se pudo crear la categoría');
                          }
                        }}
                      >
                        Crear
                      </Button>
                    )}
                  </div>
                </FormItem>

                <FormItem label="Tipo (opcional)">
                  <Select
                    options={tipoOptions}
                    placeholder="Selecciona un tipo"
                    isDisabled={isSubmitting}
                    onChange={(option) => setFormData({...formData, tipoId: option?.value})}
                    value={tipoOptions.find(option => option.value === formData.tipoId)}
                  />
                </FormItem>

                <FormItem
                  label="Descripción"
                  className="lg:col-span-2"
                >
                  <Input
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    placeholder="Descripción detallada del gasto (opcional)"
                    disabled={isSubmitting}
                  />
                </FormItem>

                {/* Información Financiera */}
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    💰 Información Financiera
                  </h2>
                </div>

                <FormItem
                  label="Monto"
                  asterisk
                >
                  <MoneyInput
                    value={formData.monto}
                    onChange={(value) => setFormData({...formData, monto: value})}
                    currency={selectedMoneda?.codigo || 'ARS'}
                    currencySymbol={selectedMoneda?.simbolo || '$'}
                    placeholder="0,00"
                    disabled={isSubmitting}
                    min={0}
                  />
                </FormItem>

                <FormItem
                  label="Moneda"
                  asterisk
                >
                  <Select
                    options={monedaOptions}
                    placeholder="Selecciona la moneda"
                    isDisabled={isSubmitting}
                    onChange={(option) => setFormData({...formData, monedaId: option?.value || 1})}
                    value={monedaOptions.find(option => option.value === formData.monedaId)}
                  />
                </FormItem>

                <FormItem
                  label="Fecha del Gasto"
                  asterisk
                >
                  <DatePicker
                    placeholder="Selecciona la fecha"
                    disabled={isSubmitting}
                    value={formData.fecha}
                    onChange={(date) => setFormData({...formData, fecha: date || new Date()})}
                  />
                </FormItem>

                <FormItem
                  label="Proveedor"
                >
                  <Select
                    options={proveedorOptions}
                    placeholder="Selecciona un proveedor (opcional)"
                    isDisabled={isSubmitting}
                    onChange={(option) => setFormData({...formData, proveedorId: option?.value})}
                    value={proveedorOptions.find(option => option.value === formData.proveedorId)}
                  />
                </FormItem>

                {/* Información Adicional */}
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    📝 Información Adicional
                  </h2>
                </div>

                <FormItem
                  label="Número de Comprobante"
                >
                  <Input
                    value={formData.comprobante}
                    onChange={(e) => setFormData({...formData, comprobante: e.target.value})}
                    placeholder="Número de factura/recibo (opcional)"
                    disabled={isSubmitting}
                  />
                </FormItem>

                <FormItem label="¿Es un gasto recurrente?">
                  <Checkbox
                    checked={formData.esRecurrente}
                    onChange={(checked) => setFormData({...formData, esRecurrente: checked})}
                    disabled={isSubmitting}
                  >
                    Sí, es un gasto recurrente
                  </Checkbox>
                </FormItem>

                {formData.esRecurrente && (
                  <FormItem
                    label="Frecuencia"
                    className="lg:col-span-2"
                  >
                    <Select
                      options={frecuenciaOptions}
                      placeholder="Selecciona la frecuencia"
                      isDisabled={isSubmitting}
                      onChange={(option) => setFormData({...formData, frecuencia: option?.value || ''})}
                      value={frecuenciaOptions.find(option => option.value === formData.frecuencia)}
                    />
                  </FormItem>
                )}

                <FormItem
                  label="Observaciones"
                  className="lg:col-span-2"
                >
                  <Input
                    value={formData.observaciones}
                    onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                    placeholder="Observaciones adicionales (opcional)"
                    disabled={isSubmitting}
                  />
                </FormItem>

              </div>
            </FormContainer>

            {/* Botones */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <Button
                type="button"
                variant="plain"
                icon={<HiOutlineX />}
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="solid"
                icon={<HiOutlineSave />}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Crear Gasto
              </Button>
            </motion.div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default GastoNew;
