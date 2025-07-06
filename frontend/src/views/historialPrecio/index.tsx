import { useState } from 'react';
import { Card, Tabs, Button } from '@/components/ui';
import { HiClock, HiTrendingUp, HiChartBar, HiRefresh } from 'react-icons/hi';
import HistorialPrecioList from './HistorialPrecioList/HistorialPrecioList';
import ActualizacionMasiva from './ActualizacionMasiva/ActualizacionMasiva';
import PreciosDesactualizados from './PreciosDesactualizados/PreciosDesactualizados';
import EstadisticasCambios from './EstadisticasCambios/EstadisticasCambios';
import { motion } from 'framer-motion';

// Seguir el patrón exitoso de las instrucciones.txt
const HistorialPrecioView = () => {
  const [activeTab, setActiveTab] = useState('historial');

  const tabs = [
    {
      key: 'historial',
      label: 'Historial de Precios',
      icon: <HiClock className="text-lg" />,
      component: <HistorialPrecioList />
    },
    {
      key: 'actualizacion',
      label: 'Actualización Masiva',
      icon: <HiRefresh className="text-lg" />,
      component: <ActualizacionMasiva />
    },
    {
      key: 'desactualizados',
      label: 'Precios Desactualizados',
      icon: <HiTrendingUp className="text-lg" />,
      component: <PreciosDesactualizados />
    },
    {
      key: 'estadisticas',
      label: 'Estadísticas',
      icon: <HiChartBar className="text-lg" />,
      component: <EstadisticasCambios />
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Precios Dinámicos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Sistema multi-moneda con historial y actualizaciones masivas
          </p>
        </div>
      </div>

      <Card className="p-0">
        <Tabs 
          value={activeTab} 
          onChange={(val) => setActiveTab(val)}
          variant="pill"
        >
          <div className="px-6 pt-6">
            <Tabs.TabList>
              {tabs.map((tab) => (
                <Tabs.TabNav 
                  key={tab.key} 
                  value={tab.key}
                  icon={tab.icon}
                >
                  {tab.label}
                </Tabs.TabNav>
              ))}
            </Tabs.TabList>
          </div>
          
          <div className="p-6">
            {tabs.map((tab) => (
              <Tabs.TabContent key={tab.key} value={tab.key}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {tab.component}
                </motion.div>
              </Tabs.TabContent>
            ))}
          </div>
        </Tabs>
      </Card>
    </motion.div>
  );
};

export default HistorialPrecioView;
