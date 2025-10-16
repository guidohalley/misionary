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
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Estadísticas de Cambios de Precios
            </h3>
            
            <div className="flex gap-3 flex-wrap">
              <DatePicker
                placeholder="Fecha desde"
                value={fechaDesde}
                onChange={(date) => setFechaDesde(date || new Date())}
                size="sm"
              />
              
              <DatePicker
                placeholder="Fecha hasta"
                value={fechaHasta}
                onChange={(date) => setFechaHasta(date || new Date())}
                size="sm"
              />
              
              <Select
                placeholder="Moneda"
                options={opcionesMoneda}
                value={opcionesMoneda.find(opt => opt.value === monedaId)}
                onChange={(option) => setMonedaId(option?.value?.toString() || '')}
                className="min-w-[150px]"
              />
              
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-6 py-2 rounded-lg transition-all duration-200 bg-gradient-to-br from-blue-500 to-blue-600 hover:shadow-lg hover:shadow-blue-300 dark:hover:shadow-blue-900/50 text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Cargando...' : 'Actualizar'}
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Métricas generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border border-blue-100 dark:border-blue-900/30 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total de Cambios
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                  {estadisticas?.totalCambios || 0}
                </p>
              </div>
              <HiChartBar className="h-12 w-12 text-blue-200 dark:text-blue-800" />
            </div>
          </div>
        </Card>

        <Card className="shadow-lg border border-green-100 dark:border-green-900/30 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Promedio de Aumento
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                  {estadisticas?.promedioAumentoPorcentaje || 0}%
                </p>
              </div>
              <HiTrendingUp className="h-12 w-12 text-green-200 dark:text-green-800" />
            </div>
          </div>
        </Card>

        <Card className="shadow-lg border border-purple-100 dark:border-purple-900/30 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Período Analizado
                </p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                  {Math.ceil((fechaHasta.getTime() - fechaDesde.getTime()) / (1000 * 60 * 60 * 24))} días
                </p>
              </div>
              <HiCalendar className="h-12 w-12 text-purple-200 dark:text-purple-800" />
            </div>
          </div>
        </Card>
      </div>

      {/* Cambios por motivo */}
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Cambios por Motivo
          </h4>
          
          <div className="space-y-4">
            {estadisticas?.cambiosPorMotivo ? Object.entries(estadisticas.cambiosPorMotivo).map(([motivo, cantidad], index) => {
              const porcentaje = estadisticas?.totalCambios ? (cantidad / estadisticas.totalCambios * 100).toFixed(1) : '0';
              return (
                <div key={motivo} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <div 
                      className={`w-4 h-4 rounded-full ${motivoColors[index % motivoColors.length]}`}
                    />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {motivo}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {cantidad} cambios
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">
                        {porcentaje}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center text-gray-500 py-8">
                No hay datos de cambios por motivo
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Actividad reciente */}
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Actividad por Día (Últimos 5 días)
          </h4>
          
          <div className="space-y-4">
            {estadisticas?.cambiosPorDia ? estadisticas.cambiosPorDia.slice(-5).map((dia) => {
              const maxCantidad = Math.max(...(estadisticas?.cambiosPorDia?.map(d => d.cantidad) || [1]));
              return (
              <div key={dia.fecha} className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[100px]">
                  {new Date(dia.fecha).toLocaleDateString('es-AR')}
                </span>
                <div className="flex items-center space-x-3 flex-1 mx-4">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-xs">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${Math.min((dia.cantidad / maxCantidad) * 100, 100)}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white min-w-[3rem] text-right">
                    {dia.cantidad}
                  </span>
                </div>
              </div>
              );
            }) : (
              <div className="text-center text-gray-500 py-8">
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
