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
import { HiOutlineArrowLeft, HiOutlineSave, HiOutlineX, HiOutlineCash } from 'react-icons/hi';
import { useGasto, useGastoAuxiliarData } from '@/modules/gasto/hooks/useGasto';
import { CategoriaGasto, categoriasGastoOptions, frecuenciaOptions } from '../schemas';

const GastoNew: React.FC = () => {
  const navigate = useNavigate();
  const { createGastoOperativo } = useGasto();
  const { monedas, proveedores } = useGastoAuxiliarData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    concepto: '',
    descripcion: '',
    monto: 0,
    monedaId: 1,
    fecha: new Date(),
    categoria: '' as CategoriaGasto | '',
    esRecurrente: false,
    frecuencia: '',
    proveedorId: undefined as number | undefined,
    comprobante: '',
    observaciones: '',
    activo: true
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.concepto || !formData.categoria || formData.monto <= 0) {
      alert('Por favor complete los campos requeridos');
      return;
    }

    try {
      setIsSubmitting(true);
      await createGastoOperativo({
        ...formData,
        categoria: formData.categoria as string
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

  const categoriaOptions = categoriasGastoOptions.map(categoria => ({
    value: categoria.value,
    label: `${categoria.icon} ${categoria.label}`
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

                <FormItem
                  label="Categoría"
                  asterisk
                >
                  <Select
                    options={categoriaOptions}
                    placeholder="Selecciona una categoría"
                    isDisabled={isSubmitting}
                    onChange={(option) => setFormData({...formData, categoria: option?.value || ''})}
                    value={categoriaOptions.find(option => option.value === formData.categoria)}
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
                  <Input
                    value={formData.monto}
                    onChange={(e) => setFormData({...formData, monto: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    disabled={isSubmitting}
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
