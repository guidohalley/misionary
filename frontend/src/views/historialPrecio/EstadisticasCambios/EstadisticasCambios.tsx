import { useState, useEffect } from 'react';
import { Card, Button, Select, DatePicker } from '@/components/ui';
import { HiRefresh, HiChartBar, HiTrendingUp, HiCalendar } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useEstadisticasCambios, useMonedas } from '@/modules/historialPrecio';

const EstadisticasCambios = () => {
  const [fechaDesde, setFechaDesde] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // 30 días atrás
  const [fechaHasta, setFechaHasta] = useState<Date>(new Date());
  const [monedaId, setMonedaId] = useState('');

  // Hooks
  const { 
    estadisticas, 
    loading, 
    fetchEstadisticas,
    limpiarEstadisticas 
  } = useEstadisticasCambios();
  
  const { opcionesMonedasActivas } = useMonedas();

  // Cargar estadísticas cuando cambien los filtros
  useEffect(() => {
    const filtros = {
      fechaDesde: fechaDesde.toISOString().split('T')[0],
      fechaHasta: fechaHasta.toISOString().split('T')[0],
      ...(monedaId && { monedaId: parseInt(monedaId) })
    };
    fetchEstadisticas(filtros);
  }, [fetchEstadisticas, fechaDesde, fechaHasta, monedaId]);

  // Opciones de moneda con opción "todas"
  const opcionesMoneda = [
    { value: '', label: 'Todas las monedas' },
    ...opcionesMonedasActivas
  ];

  const handleRefresh = async () => {
    const filtros = {
      fechaDesde: fechaDesde.toISOString().split('T')[0],
      fechaHasta: fechaHasta.toISOString().split('T')[0],
      ...(monedaId && { monedaId: parseInt(monedaId) })
    };
    await fetchEstadisticas(filtros);
  };

  const motivoColors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-yellow-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-indigo-500'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Filtros */}
      <Card>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Estadísticas de Cambios de Precios
            </h3>
            
            <div className="flex gap-3">
              <DatePicker
                placeholder="Fecha desde"
                value={fechaDesde}
                onChange={(date) => setFechaDesde(date || new Date())}
              />
              
              <DatePicker
                placeholder="Fecha hasta"
                value={fechaHasta}
                onChange={(date) => setFechaHasta(date || new Date())}
              />
              
              <Select
                placeholder="Moneda"
                options={opcionesMoneda}
                value={opcionesMoneda.find(opt => opt.value === monedaId)}
                onChange={(option) => setMonedaId(option?.value?.toString() || '')}
                className="min-w-[150px]"
              />
              
              <Button
                variant="solid"
                icon={<HiRefresh />}
                onClick={handleRefresh}
                loading={loading}
              >
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Métricas generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HiChartBar className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total de Cambios
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {estadisticas?.totalCambios || 0}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HiTrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Promedio de Aumento
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {estadisticas?.promedioAumentoPorcentaje || 0}%
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HiCalendar className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Período Analizado
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {Math.ceil((fechaHasta.getTime() - fechaDesde.getTime()) / (1000 * 60 * 60 * 24))} días
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Cambios por motivo */}
      <Card>
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Cambios por Motivo
          </h4>
          
          <div className="space-y-3">
            {estadisticas?.cambiosPorMotivo ? Object.entries(estadisticas.cambiosPorMotivo).map(([motivo, cantidad], index) => {
              const porcentaje = estadisticas?.totalCambios ? (cantidad / estadisticas.totalCambios * 100).toFixed(1) : '0';
              return (
                <div key={motivo} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className={`w-3 h-3 rounded-full ${motivoColors[index % motivoColors.length]}`}
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {motivo}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {cantidad} cambios
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {porcentaje}%
                    </span>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center text-gray-500 py-4">
                No hay datos de cambios por motivo
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Actividad reciente */}
      <Card>
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Actividad por Día (Últimos 5 días)
          </h4>
          
          <div className="space-y-2">
            {estadisticas?.cambiosPorDia ? estadisticas.cambiosPorDia.slice(-5).map((dia) => {
              const maxCantidad = Math.max(...(estadisticas?.cambiosPorDia?.map(d => d.cantidad) || [1]));
              return (
              <div key={dia.fecha} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(dia.fecha).toLocaleDateString('es-AR')}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min((dia.cantidad / maxCantidad) * 100, 100)}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[2rem]">
                    {dia.cantidad}
                  </span>
                </div>
              </div>
              );
            }) : (
              <div className="text-center text-gray-500 py-4">
                No hay datos de actividad reciente
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default EstadisticasCambios;
