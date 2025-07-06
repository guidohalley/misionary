import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Tabs } from '@/components/ui';
import MonedaList from './MonedaList';
import TipoCambioForm from './TipoCambioForm';
import ConversionForm from './ConversionForm';
import TipoCambioHistorial from './TipoCambioHistorial';
import { useMoneda, useTipoCambio, useConversion } from '@/modules/moneda/hooks/useMoneda';

const MonedaView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('monedas');
  
  const { monedas, loading: loadingMonedas, error: errorMonedas } = useMoneda();
  const { 
    tiposCambio, 
    loading: loadingTiposCambio, 
    error: errorTiposCambio,
    upsertTipoCambio,
    fetchHistorial
  } = useTipoCambio();
  const {
    ultimaConversion,
    loading: loadingConversion,
    error: errorConversion,
    convertirMoneda,
    limpiarConversion
  } = useConversion();

  const handleTipoCambioSubmit = async (data: any) => {
    try {
      await upsertTipoCambio(data);
      // Refrescar historial si está activo
      if (activeTab === 'historial') {
        await fetchHistorial(data.monedaDesde, data.monedaHacia);
      }
    } catch (error) {
      console.error('Error al crear tipo de cambio:', error);
    }
  };

  const handleConversionSubmit = async (data: any) => {
    try {
      await convertirMoneda(data);
    } catch (error) {
      console.error('Error al convertir moneda:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto p-4 space-y-6"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Sistema Multi-Moneda
        </h1>
      </motion.div>

      {/* Tabs Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Card className="p-0">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.TabList>
              <Tabs.TabNav value="monedas">Monedas</Tabs.TabNav>
              <Tabs.TabNav value="tipos-cambio">Tipos de Cambio</Tabs.TabNav>
              <Tabs.TabNav value="conversion">Conversión</Tabs.TabNav>
              <Tabs.TabNav value="historial">Historial</Tabs.TabNav>
            </Tabs.TabList>
            
            <div className="p-6">
              <Tabs.TabContent value="monedas">
                <MonedaList
                  monedas={monedas}
                  loading={loadingMonedas}
                  error={errorMonedas}
                />
              </Tabs.TabContent>

              <Tabs.TabContent value="tipos-cambio">
                <TipoCambioForm
                  onSubmit={handleTipoCambioSubmit}
                  loading={loadingTiposCambio}
                  error={errorTiposCambio}
                />
              </Tabs.TabContent>

              <Tabs.TabContent value="conversion">
                <ConversionForm
                  onSubmit={handleConversionSubmit}
                  onClear={limpiarConversion}
                  loading={loadingConversion}
                  error={errorConversion}
                  ultimaConversion={ultimaConversion}
                />
              </Tabs.TabContent>

              <Tabs.TabContent value="historial">
                <TipoCambioHistorial
                  tiposCambio={tiposCambio}
                  loading={loadingTiposCambio}
                  error={errorTiposCambio}
                  onFetchHistorial={fetchHistorial}
                />
              </Tabs.TabContent>
            </div>
          </Tabs>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default MonedaView;
