import { Card, Button, Tooltip, Tag } from '@/components/ui'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiFilePlus, FiPlusCircle, FiUserPlus, FiTruck, FiCalendar, FiInfo } from 'react-icons/fi'
import Chart from '@/components/shared/Chart'
import { useDashboardKpis, useGastosPorCategoria } from '@/modules/dashboard/hooks'

const Home = () => {
    const { 
        loading, 
        error, 
        ingresosPorMoneda, 
        clientesActivosCount, 
        totalGastos, 
        totalGastosReales,
        totalGastosProyectados,
        empresasCount, 
        gananciaProveedor30d, 
        tieneRolProveedor, 
        ultimosIngresosProveedor30d, 
        recibosProveedor30d, 
        kpisAdminMes, 
        periodoSeleccionado, 
        rangoFechas, 
        seleccionarPeriodo, 
        cobrosPeriodo 
    } = useDashboardKpis()
    const navigate = useNavigate()
    const gastosCat = useGastosPorCategoria()

    const labelPeriodoCorto = periodoSeleccionado === '30D' ? 'últimos 30 días' : periodoSeleccionado === 'TRIMESTRE' ? 'trimestre' : 'mes'

    return (
        <div className="w-full max-w-[98%] sm:max-w-[95%] md:max-w-[92%] xl:max-w-[88%] 2xl:max-w-[85%] mx-auto px-3 sm:px-4 py-4 sm:py-6">
            {/* Header responsive - Stack en mobile, inline en desktop */}
            <div className="mb-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Resumen operativo y atajos a tus acciones frecuentes</p>
                </div>
                {/* Selector de período para KPIs de Finanzas - Responsive */}
                {kpisAdminMes && (
                    <div className="flex flex-col sm:items-end gap-1">
                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                            <FiCalendar className="opacity-80" />
                            <span>Período</span>
                        </div>
                        <div className="flex items-center flex-wrap gap-1.5 sm:gap-1">
                            <Tooltip title="Últimos 30 días">
                                <Button
                                    size="sm"
                                    variant="plain"
                                    className={`!px-2.5 sm:!px-3 !py-2 sm:!py-1.5 !min-h-[44px] sm:!min-h-0 rounded-full border ${periodoSeleccionado === '30D' ? '!bg-black dark:!bg-white !text-white dark:!text-black border-black dark:border-white' : '!bg-white dark:!bg-gray-700 !text-gray-800 dark:!text-gray-200 border-gray-200 dark:border-gray-600 hover:!bg-gray-50 dark:hover:!bg-gray-600'}`}
                                    onClick={() => seleccionarPeriodo('30D')}
                                >
                                    30 días
                                </Button>
                            </Tooltip>
                            <Tooltip title="Desde el 1 al último día del mes actual">
                                <Button
                                    size="sm"
                                    variant="plain"
                                    className={`!px-2.5 sm:!px-3 !py-2 sm:!py-1.5 !min-h-[44px] sm:!min-h-0 rounded-full border ${periodoSeleccionado === 'MES' ? '!bg-black dark:!bg-white !text-white dark:!text-black border-black dark:border-white' : '!bg-white dark:!bg-gray-700 !text-gray-800 dark:!text-gray-200 border-gray-200 dark:border-gray-600 hover:!bg-gray-50 dark:hover:!bg-gray-600'}`}
                                    onClick={() => seleccionarPeriodo('MES')}
                                >
                                    Este mes
                                </Button>
                            </Tooltip>
                            <Tooltip title="Mes actual + dos anteriores">
                                <Button
                                    size="sm"
                                    variant="plain"
                                    className={`!px-2.5 sm:!px-3 !py-2 sm:!py-1.5 !min-h-[44px] sm:!min-h-0 rounded-full border ${periodoSeleccionado === 'TRIMESTRE' ? '!bg-black dark:!bg-white !text-white dark:!text-black border-black dark:border-white' : '!bg-white dark:!bg-gray-700 !text-gray-800 dark:!text-gray-200 border-gray-200 dark:border-gray-600 hover:!bg-gray-50 dark:hover:!bg-gray-600'}`}
                                    onClick={() => seleccionarPeriodo('TRIMESTRE')}
                                >
                                    Trimestre
                                </Button>
                            </Tooltip>
                        </div>
                        {rangoFechas?.label && (
                            <div className="text-[11px] text-gray-600 dark:text-gray-400">{rangoFechas.label}</div>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <div className="mb-4 text-red-600">{error}</div>
            )}

            {/* Acciones rápidas - Touch-friendly en mobile */}
            <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
            >
                <Button
                    block
                    size="lg"
                    variant="plain"
                    icon={<FiFilePlus className="text-lg sm:text-base" />}
                    className="!bg-black hover:!bg-black/90 dark:!bg-white dark:hover:!bg-gray-100 !text-white dark:!text-black transition-colors shadow-sm hover:shadow-md active:shadow focus:!ring-2 focus:!ring-black dark:focus:!ring-white focus:!ring-offset-2 focus:!ring-offset-white dark:focus:!ring-offset-gray-900 !border-transparent !min-h-[52px] sm:!min-h-[44px] !py-3 sm:!py-2"
                    onClick={() => navigate('/presupuestos/new')}
                >
                    Nuevo Presupuesto
                </Button>
                <Button
                    block
                    size="lg"
                    variant="plain"
                    icon={<FiPlusCircle className="text-lg sm:text-base" />}
                    className="!bg-black hover:!bg-black/90 dark:!bg-white dark:hover:!bg-gray-100 !text-white dark:!text-black transition-colors shadow-sm hover:shadow-md active:shadow focus:!ring-2 focus:!ring-black dark:focus:!ring-white focus:!ring-offset-2 focus:!ring-offset-white dark:focus:!ring-offset-gray-900 !border-transparent !min-h-[52px] sm:!min-h-[44px] !py-3 sm:!py-2"
                    onClick={() => navigate('/gastos/new')}
                >
                    Nuevo Gasto
                </Button>
                <Button
                    block
                    size="lg"
                    variant="plain"
                    icon={<FiUserPlus className="text-lg sm:text-base" />}
                    className="!bg-black hover:!bg-black/90 dark:!bg-white dark:hover:!bg-gray-100 !text-white dark:!text-black transition-colors shadow-sm hover:shadow-md active:shadow focus:!ring-2 focus:!ring-black dark:focus:!ring-white focus:!ring-offset-2 focus:!ring-offset-white dark:focus:!ring-offset-gray-900 !border-transparent !min-h-[52px] sm:!min-h-[44px] !py-3 sm:!py-2"
                    onClick={() => navigate('/personas/cliente/new')}
                >
                    Nuevo Cliente
                </Button>
                <Button
                    block
                    size="lg"
                    variant="plain"
                    icon={<FiTruck className="text-lg sm:text-base" />}
                    className="!bg-black hover:!bg-black/90 dark:!bg-white dark:hover:!bg-gray-100 !text-white dark:!text-black transition-colors shadow-sm hover:shadow-md active:shadow focus:!ring-2 focus:!ring-black dark:focus:!ring-white focus:!ring-offset-2 focus:!ring-offset-white dark:focus:!ring-offset-gray-900 !border-transparent !min-h-[52px] sm:!min-h-[44px] !py-3 sm:!py-2"
                    onClick={() => navigate('/personas/proveedor/new')}
                >
                    Nuevo Proveedor
                </Button>
            </motion.div>

            {/* KPIs - Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop */}
                    <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6" initial="hidden" animate="show"
                        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                    >
                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                        <Card className="p-4 sm:p-5 border-misionary-200/60 dark:border-gray-700/60 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between gap-2">
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Cobrado y por cobrar ({labelPeriodoCorto})</div>
                                <Tooltip title="Cobrado: facturas pagadas del período. Por cobrar: facturas emitidas no pagadas en el período. Basado en fecha de factura.">
                                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help shrink-0 p-1 -mt-1" aria-label="Información">
                                        <FiInfo />
                                    </button>
                                </Tooltip>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <div>
                                    <div className="text-[11px] text-gray-600 dark:text-gray-500 mb-1">Cobrado</div>
                                    <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 dark:text-emerald-600">{Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(cobrosPeriodo?.totalCobrado || 0))}</div>
                                </div>
                                <div>
                                    <div className="text-[11px] text-gray-600 dark:text-gray-500 mb-1">Por cobrar</div>
                                    <div className="text-xl sm:text-2xl font-extrabold text-amber-700 dark:text-amber-600">{Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(cobrosPeriodo?.totalPorCobrar || 0))}</div>
                                </div>
                            </div>
                            <div className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">Facturado: {Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(cobrosPeriodo?.totalFacturado || 0))} · {cobrosPeriodo?.cantidadPagadas || 0} pagadas · {cobrosPeriodo?.cantidadEmitidas || 0} emitidas</div>
                            {Number(cobrosPeriodo?.totalCobradoDirecto || 0) > 0 && (
                                <div className="text-[11px] text-gray-500 dark:text-gray-400">Cobrado sin factura: {Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(cobrosPeriodo?.totalCobradoDirecto || 0))}</div>
                            )}
                            {kpisAdminMes && (
                                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-[13px] text-gray-700 dark:text-gray-300">
                                    <span className="text-xs text-gray-600 dark:text-gray-400 mr-1">Mi cobrado ({labelPeriodoCorto}):</span>
                                    <span className="font-semibold">{Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(kpisAdminMes.totalPagadoAdminUsuario || 0))}</span>
                                </div>
                            )}
                        </Card>
                        </motion.div>

                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                        <Card className="p-4 sm:p-5 border-misionary-200/60 dark:border-gray-700/60 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Clientes activos</div>
                        <Tooltip title="Cantidad de clientes con estado activo.">
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help shrink-0 p-1 -mt-1" aria-label="Información">
                                <FiInfo />
                            </button>
                        </Tooltip>
                    </div>
                    <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                        {loading ? '—' : clientesActivosCount}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total de clientes con estado activo</div>
                </Card>
                        </motion.div>

                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                        <Card className="p-4 sm:p-5 border-misionary-200/60 dark:border-gray-700/60 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Gastos {kpisAdminMes ? `(${labelPeriodoCorto})` : 'últimos 30 días'}
                        </div>
                        <Tooltip title={`Suma de gastos operativos ${kpisAdminMes ? `del ${labelPeriodoCorto}` : 'de los últimos 30 días'}, incluyendo proyecciones de gastos recurrentes.`}>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help shrink-0 p-1 -mt-1" aria-label="Información">
                                <FiInfo />
                            </button>
                        </Tooltip>
                    </div>
                    <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-rose-700 dark:text-rose-600">
                        {loading ? '—' : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totalGastos)}
                    </div>
                    
                    {/* Nuevo desglose visual */}
                    {!loading && totalGastosProyectados > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-1.5 text-xs">
                            <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Reales:</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totalGastosReales)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-gray-500 dark:text-gray-500">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <span className="w-2 h-2 rounded-full bg-rose-300 dark:bg-rose-500"></span>
                                    Proyectados:
                                </span>
                                <span className="font-semibold">
                                    {Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totalGastosProyectados)}
                                </span>
                            </div>
                        </div>
                    )}
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {totalGastosProyectados > 0 
                            ? 'Incluye gastos recurrentes proyectados' 
                            : 'Suma de gastos operativos (sin conversión FX)'}
                    </div>
                </Card>
                        </motion.div>
            </motion.div>

            {/* Secciones - Gráficos y datos complementarios */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4" initial="hidden" animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            >
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                <Card className="p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Gastos por categoría</div>
                    {gastosCat.loading && <div className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">Cargando…</div>}
                    {!gastosCat.loading && gastosCat.dataset.length === 0 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">Sin datos</div>
                    )}
                    {!gastosCat.loading && gastosCat.dataset.length > 0 && (
                        <Chart
                            type="donut"
                            height={typeof window !== 'undefined' && window.innerWidth < 640 ? 240 : 300}
                            series={gastosCat.dataset.map(d => d.total)}
                            customOptions={{
                                colors: ['#a7f3d0','#34d399','#059669','#065f46','#064e3b'],
                                labels: gastosCat.dataset.map(d => d.categoria),
                                plotOptions: { pie: { donut: { labels: { total: { label: 'Total' } } } } },
                                legend: { show: true, position: 'bottom' },
                            }}
                        />
                    )}
        </Card>
        </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
            <Card className="p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Empresas registradas</div>
                            <div className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">{loading ? '—' : empresasCount}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total de empresas activas y desactivadas</div>
                            
                            {tieneRolProveedor && (
                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Mis ingresos cobrados (30 días)</div>
                                    <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-600">{Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(ultimosIngresosProveedor30d)}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Suma de recibos registrados a tu nombre</div>
                                    <div className="mt-4">
                                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Últimos recibos</div>
                                        {recibosProveedor30d.length === 0 && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Sin recibos en los últimos 30 días</div>
                                        )}
                                        {recibosProveedor30d.length > 0 && (
                                            <ul className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                                                {recibosProveedor30d.slice(0, 6).map((r: any) => (
                                                    <li key={r.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                                        <span className="truncate">{new Date(r.fecha).toLocaleDateString()} · {r.concepto || 'Recibo'}</span>
                                                        <span className="font-semibold text-emerald-700 dark:text-emerald-600 sm:shrink-0">{Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(r.monto || 0))}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            {kpisAdminMes && (
                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                                            <div className="text-[11px] text-gray-600 dark:text-gray-400 mb-1">Ganancia agencia ({labelPeriodoCorto})</div>
                                            <div className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">{Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(kpisAdminMes.totalGananciaEmpresaPeriodo || 0))}</div>
                                        </div>
                                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                                            <div className="text-[11px] text-gray-600 dark:text-gray-400 mb-1">Pagado a admins ({labelPeriodoCorto})</div>
                                            <div className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">{Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(kpisAdminMes.totalPagadoAdminPeriodo || 0))}</div>
                                        </div>
                                        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                                            <div className="text-[11px] text-gray-600 dark:text-gray-400 mb-1">Disponible admin ({labelPeriodoCorto})</div>
                                            <div className="text-lg sm:text-xl font-extrabold text-emerald-700 dark:text-emerald-500">{Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(kpisAdminMes.disponibleAdminPeriodo || 0))}</div>
                                        </div>
                                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                                            <div className="text-[11px] text-gray-600 dark:text-gray-400 mb-1">Mi cobrado ({labelPeriodoCorto})</div>
                                            <div className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">{Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(kpisAdminMes.totalPagadoAdminUsuario || 0))}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {kpisAdminMes && (
                                <div className="mt-4">
                                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">{kpisAdminMes.cantidadPresupuestosPeriodo || 0} presupuestos en el período · Sin conversión FX</div>
                                    {kpisAdminMes.gananciaPorMoneda && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {Object.entries(kpisAdminMes.gananciaPorMoneda).map(([mon, val]: any) => (
                                                <Tag key={mon} className="!bg-gray-50 dark:!bg-gray-800 !text-gray-800 dark:!text-gray-200 !border-gray-200 dark:!border-gray-700 !text-xs">
                                                    <span className="font-medium mr-1">{mon}:</span>
                                                    {Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(val || 0))}
                                                </Tag>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>
            </motion.div>
        </motion.div>
        </div>
    )
}

export default Home
