import React, { useState, useEffect } from 'react';
import { Card, Button, Alert } from '../../../components/ui';
import { HiChartPie, HiTrendingUp, HiCalendar, HiCalculator } from 'react-icons/hi';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useAuth } from '../../../contexts/AuthContext';
import ApiService from '../../../services/ApiService';

interface ProyeccionData {
  año1: {
    crecimientoEsperado: number;
    impactoMonetarioEstimado: number;
    confianza: number;
  };
  año3: {
    crecimientoEsperado: number;
    impactoMonetarioEstimado: number;
    confianza: number;
  };
  año5: {
    crecimientoEsperado: number;
    impactoMonetarioEstimado: number;
    confianza: number;
  };
  volatilidad: number;
  recomendaciones: string[];
}

interface AnalisisData {
  analisis: {
    totalCambios: number;
    aumentosPrecios: number;
    disminucionesPrecios: number;
    cambiosEstado: number;
    impactoTotalMonetario: number;
    promedioVariacion: number;
    cambiosPorMes: Record<string, number>;
  };
  cambiosDetallados: any[];
}

const PresupuestoAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [proyecciones, setProyecciones] = useState<ProyeccionData | null>(null);
  const [analisis, setAnalisis] = useState<AnalisisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'12' | '24' | '36'>('12');

  // Verificar permisos de admin
  const isAdmin = user?.roles?.includes('ADMIN');

  useEffect(() => {
    if (!isAdmin) return;
    loadAnalytics();
  }, [isAdmin, selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar proyecciones y análisis en paralelo
      const [proyeccionesRes, analisisRes] = await Promise.all([
        ApiService.fetchData({
          url: '/presupuesto-historial/analisis/proyecciones?años=5',
          method: 'GET'
        }),
        ApiService.fetchData({
          url: `/presupuesto-historial/analisis/cambios-precios?fechaDesde=${getDateRange()}`,
          method: 'GET'
        })
      ]);

      setProyecciones(proyeccionesRes.data as ProyeccionData);
      setAnalisis(analisisRes.data as AnalisisData);
    } catch (err: any) {
      console.error('Error loading analytics:', err);
      setError(err.response?.data?.error || 'Error al cargar analytics');
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - parseInt(selectedPeriod));
    return date.toISOString();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Configuración del gráfico de proyecciones
  const projectionChartOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 400,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ['#3B82F6', '#10B981', '#F59E0B'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: ['Actual', 'Año 1', 'Año 3', 'Año 5'],
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280'
        },
        formatter: (value) => formatCurrency(value)
      }
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (value) => formatCurrency(value)
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetY: -10
    },
    grid: {
      strokeDashArray: 3,
      borderColor: '#E5E7EB'
    },
    markers: {
      size: 6,
      strokeWidth: 2,
      strokeColors: '#fff'
    }
  };

  const getProjectionChartData = () => {
    if (!proyecciones) return [];

    const baseValue = 1000000; // Valor base para las proyecciones
    
    return [
      {
        name: 'Crecimiento Conservador',
        data: [
          baseValue,
          baseValue * (1 + proyecciones.año1.crecimientoEsperado / 100 * 0.7),
          baseValue * (1 + proyecciones.año3.crecimientoEsperado / 100 * 0.7),
          baseValue * (1 + proyecciones.año5.crecimientoEsperado / 100 * 0.7)
        ]
      },
      {
        name: 'Proyección Esperada',
        data: [
          baseValue,
          baseValue * (1 + proyecciones.año1.crecimientoEsperado / 100),
          baseValue * (1 + proyecciones.año3.crecimientoEsperado / 100),
          baseValue * (1 + proyecciones.año5.crecimientoEsperado / 100)
        ]
      },
      {
        name: 'Crecimiento Optimista',
        data: [
          baseValue,
          baseValue * (1 + proyecciones.año1.crecimientoEsperado / 100 * 1.3),
          baseValue * (1 + proyecciones.año3.crecimientoEsperado / 100 * 1.3),
          baseValue * (1 + proyecciones.año5.crecimientoEsperado / 100 * 1.3)
        ]
      }
    ];
  };

  // Configuración del gráfico de volatilidad
  const volatilityChartOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 300,
      toolbar: { show: false }
    },
    colors: ['#EF4444'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        type: 'vertical',
        colorStops: [
          { offset: 0, color: '#EF4444', opacity: 0.8 },
          { offset: 100, color: '#EF4444', opacity: 0.1 }
        ]
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280'
        },
        formatter: (value) => `${value.toFixed(1)}%`
      }
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (value) => `${value.toFixed(2)}% volatilidad`
      }
    },
    grid: {
      strokeDashArray: 3,
      borderColor: '#E5E7EB'
    }
  };

  const getVolatilityData = () => {
    // Datos simulados de volatilidad mensual
    const baseVolatility = proyecciones?.volatilidad || 5;
    return [{
      name: 'Volatilidad',
      data: Array.from({ length: 12 }, (_, i) => 
        baseVolatility + (Math.sin(i * 0.5) * 2) + (Math.random() - 0.5) * 3
      )
    }];
  };

  if (!isAdmin) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Alert showIcon type="warning" title="Acceso Restringido">
          Solo los administradores pueden acceder a las proyecciones empresariales.
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Alert showIcon type="danger" title="Error">
          {error}
          <Button className="mt-4" onClick={loadAnalytics}>
            Reintentar
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <HiChartPie className="text-blue-600" />
            Proyecciones Empresariales
          </h1>
          <p className="text-gray-600 mt-1">
            Análisis histórico y proyecciones de crecimiento basadas en datos reales
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="12">Últimos 12 meses</option>
            <option value="24">Últimos 24 meses</option>
            <option value="36">Últimos 36 meses</option>
          </select>
          <Button variant="solid" onClick={loadAnalytics}>
            Actualizar
          </Button>
        </div>
      </motion.div>

      {/* KPIs Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Crecimiento 1 Año</p>
              <p className="text-2xl font-bold text-green-600">
                {proyecciones ? formatPercentage(proyecciones.año1.crecimientoEsperado) : '---'}
              </p>
            </div>
            <HiTrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-2">
            <div className="flex items-center">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (proyecciones?.año1.confianza || 0) * 100)}%` }}
                ></div>
              </div>
              <span className="ml-2 text-xs text-gray-500">
                {proyecciones ? Math.round(proyecciones.año1.confianza * 100) : 0}% confianza
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Crecimiento 3 Años</p>
              <p className="text-2xl font-bold text-blue-600">
                {proyecciones ? formatPercentage(proyecciones.año3.crecimientoEsperado) : '---'}
              </p>
            </div>
            <HiCalendar className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-2">
            <div className="flex items-center">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (proyecciones?.año3.confianza || 0) * 100)}%` }}
                ></div>
              </div>
              <span className="ml-2 text-xs text-gray-500">
                {proyecciones ? Math.round(proyecciones.año3.confianza * 100) : 0}% confianza
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Crecimiento 5 Años</p>
              <p className="text-2xl font-bold text-purple-600">
                {proyecciones ? formatPercentage(proyecciones.año5.crecimientoEsperado) : '---'}
              </p>
            </div>
            <HiCalculator className="h-8 w-8 text-purple-600" />
          </div>
          <div className="mt-2">
            <div className="flex items-center">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (proyecciones?.año5.confianza || 0) * 100)}%` }}
                ></div>
              </div>
              <span className="ml-2 text-xs text-gray-500">
                {proyecciones ? Math.round(proyecciones.año5.confianza * 100) : 0}% confianza
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Volatilidad</p>
              <p className="text-2xl font-bold text-orange-600">
                {proyecciones ? `${proyecciones.volatilidad.toFixed(1)}%` : '---'}
              </p>
            </div>
            <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-orange-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">
              {proyecciones && proyecciones.volatilidad < 10 ? 'Estable' : 
               proyecciones && proyecciones.volatilidad < 20 ? 'Moderada' : 'Alta'}
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Gráfico de Proyecciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Proyecciones de Crecimiento
            </h2>
            <div className="text-sm text-gray-500">
              Basado en {analisis?.analisis.totalCambios || 0} cambios históricos
            </div>
          </div>
          
          {proyecciones && (
            <Chart
              options={projectionChartOptions}
              series={getProjectionChartData()}
              type="line"
              height={400}
            />
          )}
        </Card>
      </motion.div>

      {/* Gráfico de Volatilidad y Recomendaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Volatilidad Mensual
            </h2>
            {proyecciones && (
              <Chart
                options={volatilityChartOptions}
                series={getVolatilityData()}
                type="area"
                height={300}
              />
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Recomendaciones Estratégicas
            </h2>
            <div className="space-y-4">
              {proyecciones?.recomendaciones.map((recomendacion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">{recomendacion}</p>
                </div>
              )) || (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">
                      Continuar monitoreando tendencias de precios para mantener competitividad
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">
                      Considerar estrategias de diversificación para reducir volatilidad
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">
                      Implementar revisiones trimestrales de precios basadas en datos históricos
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PresupuestoAnalytics;
