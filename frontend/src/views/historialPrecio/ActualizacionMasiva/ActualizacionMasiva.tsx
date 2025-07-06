import { useState } from 'react';
import { Card, Button, Select, Input, FormItem, FormContainer, Alert, toast, Notification } from '@/components/ui';
import { HiRefresh, HiExclamationCircle } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useMonedas } from '@/modules/historialPrecio/hooks/useMonedas';
import { useActualizacionMasiva } from '@/modules/historialPrecio/hooks/useHistorialPrecio';
import AuthService from '@/services/AuthService';
import type { TipoItem } from '@/modules/historialPrecio/types';

const ActualizacionMasiva = () => {
  const [tipo, setTipo] = useState<TipoItem | ''>('');
  const [monedaId, setMonedaId] = useState('');
  const [porcentaje, setPorcentaje] = useState('');
  const [motivo, setMotivo] = useState('');

  // Hooks
  const { opcionesMonedasActivas, loading: loadingMonedas } = useMonedas();
  const { ejecutarActualizacionMasiva, loading, resultado } = useActualizacionMasiva();

  const tipoOptions = [
    { value: 'PRODUCTO', label: 'Productos' },
    { value: 'SERVICIO', label: 'Servicios' }
  ];

  const motivosComunes = [
    { value: 'Inflación', label: 'Inflación' },
    { value: 'Devaluación', label: 'Devaluación' },
    { value: 'Actualización por costos', label: 'Actualización por costos' },
    { value: 'Revisión anual', label: 'Revisión anual' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tipo || !monedaId || !porcentaje || !motivo) {
      toast.push(
        <Notification title="Error" type="warning">
          Por favor complete todos los campos requeridos.
        </Notification>
      );
      return;
    }

    try {
      const resultado = await ejecutarActualizacionMasiva({
        tipo: tipo as TipoItem,
        monedaId: parseInt(monedaId),
        porcentajeAumento: parseFloat(porcentaje),
        motivoCambio: motivo
      });

      if (resultado) {
        // Mostrar notificación de éxito
        toast.push(
          <Notification title="Actualización Exitosa" type="success">
            Se actualizaron {resultado.actualizados} elementos correctamente.
            {resultado.errores.length > 0 && ` ${resultado.errores.length} errores encontrados.`}
          </Notification>
        );

        // Limpiar formulario
        setTipo('');
        setMonedaId('');
        setPorcentaje('');
        setMotivo('');
      }

    } catch (error) {
      console.error('Error en actualización masiva:', error);
      
      // Mostrar notificación de error
      toast.push(
        <Notification title="Error" type="danger">
          Error al realizar la actualización masiva. Intente nuevamente.
        </Notification>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Alert
        type="warning"
        title="Atención"
        className="mb-6"
      >
        <div className="flex items-start space-x-2">
          <HiExclamationCircle className="text-amber-500 mt-0.5" />
          <div>
            <p>La actualización masiva de precios afectará a todos los productos o servicios de la moneda seleccionada.</p>
            <p className="mt-1 text-sm">Esta acción generará un nuevo registro en el historial de precios y cerrará los precios anteriores.</p>
          </div>
        </div>
      </Alert>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Actualización Masiva por Inflación/Devaluación
          </h3>

          <FormContainer>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem label="Tipo de Item" asterisk>
                  <Select
                    placeholder="Seleccionar tipo"
                    options={tipoOptions}
                    value={tipoOptions.find(opt => opt.value === tipo)}
                    onChange={(option) => setTipo(option?.value as TipoItem || '')}
                  />
                </FormItem>

                <FormItem label="Moneda" asterisk>
                  <Select
                    placeholder="Seleccionar moneda"
                    options={opcionesMonedasActivas}
                    value={opcionesMonedasActivas.find(opt => opt.value.toString() === monedaId)}
                    onChange={(option) => setMonedaId(option?.value?.toString() || '')}
                    isLoading={loadingMonedas}
                  />
                </FormItem>

                <FormItem label="Porcentaje de Aumento" asterisk>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Ej: 15.5 para 15.5%"
                    value={porcentaje}
                    onChange={(e) => setPorcentaje(e.target.value)}
                    suffix={<span className="text-gray-400">%</span>}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Valores negativos para descuentos. Ej: -10 para reducir 10%
                  </p>
                </FormItem>

                <FormItem label="Motivo del Cambio" asterisk>
                  <Select
                    placeholder="Seleccionar motivo"
                    options={motivosComunes}
                    value={motivosComunes.find(opt => opt.value === motivo)}
                    onChange={(option) => setMotivo(option?.value || '')}
                  />
                </FormItem>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Esta acción afectará todos los {tipo ? tipo.toLowerCase() + 's' : 'items'} en {opcionesMonedasActivas.find(m => m.value.toString() === monedaId)?.label || 'la moneda seleccionada'}
                    </p>
                    {porcentaje && (
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                        {parseFloat(porcentaje) > 0 ? 'Aumento' : 'Descuento'} del {Math.abs(parseFloat(porcentaje) || 0)}%
                      </p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    variant="solid"
                    icon={<HiRefresh />}
                    loading={loading}
                    disabled={!tipo || !monedaId || !porcentaje || !motivo}
                  >
                    {loading ? 'Actualizando...' : 'Ejecutar Actualización'}
                  </Button>
                </div>
              </div>
            </form>
          </FormContainer>
        </div>
      </Card>
    </motion.div>
  );
};

export default ActualizacionMasiva;
