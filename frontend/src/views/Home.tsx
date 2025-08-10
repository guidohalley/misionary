import { Card, Button, Tooltip, Tag } from '@/components/ui'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiFilePlus, FiPlusCircle, FiUserPlus, FiTruck, FiCalendar, FiInfo } from 'react-icons/fi'
import Chart from '@/components/shared/Chart'
import { useDashboardKpis, useGastosPorCategoria } from '@/modules/dashboard/hooks'

const Home = () => {
    const { loading, error, ingresosPorMoneda, clientesActivosCount, totalGastos, empresasCount, gananciaProveedor30d, tieneRolProveedor, ultimosIngresosProveedor30d, recibosProveedor30d, kpisAdminMes, periodoSeleccionado, rangoFechas, seleccionarPeriodo, cobrosPeriodo } = useDashboardKpis()
    const navigate = useNavigate()
    const gastosCat = useGastosPorCategoria()

    const labelPeriodoCorto = periodoSeleccionado === '30D' ? 'últimos 30 días' : periodoSeleccionado === 'TRIMESTRE' ? 'trimestre' : 'mes'

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-msgray-950">Dashboard</h1>
                    <p className="text-sm text-msgray-500">Resumen operativo y atajos a tus acciones frecuentes</p>
                </div>
                {/* Selector de período para KPIs de Finanzas */}
                {kpisAdminMes && (
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-xs text-msgray-600">
                            <FiCalendar className="opacity-80" />
                            <span>Período</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Tooltip title="Últimos 30 días">
                                <Button
                                    size="sm"
                                    variant="plain"
                                    className={`!px-3 !py-1.5 rounded-full border ${periodoSeleccionado === '30D' ? '!bg-black !text-white border-black' : '!bg-white !text-gray-800 border-gray-200 hover:!bg-gray-50'}`}
                                    onClick={() => seleccionarPeriodo('30D')}
                                >
                                    30 días
                                </Button>
                            </Tooltip>
                            <Tooltip title="Desde el 1 al último día del mes actual">
                                <Button
                                    size="sm"
                                    variant="plain"
                                    className={`!px-3 !py-1.5 rounded-full border ${periodoSeleccionado === 'MES' ? '!bg-black !text-white border-black' : '!bg-white !text-gray-800 border-gray-200 hover:!bg-gray-50'}`}
                                    onClick={() => seleccionarPeriodo('MES')}
                                >
                                    Este mes
                                </Button>
                            </Tooltip>
                            <Tooltip title="Mes actual + dos anteriores">
                                <Button
                                    size="sm"
                                    variant="plain"
                                    className={`!px-3 !py-1.5 rounded-full border ${periodoSeleccionado === 'TRIMESTRE' ? '!bg-black !text-white border-black' : '!bg-white !text-gray-800 border-gray-200 hover:!bg-gray-50'}`}
                                    onClick={() => seleccionarPeriodo('TRIMESTRE')}
                                >
                                    Trimestre
                                </Button>
                            </Tooltip>
                        </div>
                        {rangoFechas?.label && (
                            <div className="text-[11px] text-msgray-500">{rangoFechas.label}</div>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <div className="mb-4 text-red-600">{error}</div>
            )}

            {/* Acciones rápidas */}
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
                    icon={<FiFilePlus />}
                    className="!bg-black hover:!bg-black/90 !text-white transition-colors shadow-sm hover:shadow focus:!ring-2 focus:!ring-black focus:!ring-offset-2 focus:!ring-offset-white !border-transparent"
                    onClick={() => navigate('/presupuestos/new')}
                >
                    Nuevo Presupuesto
                </Button>
                <Button
                    block
                    size="lg"
                    variant="plain"
                    icon={<FiPlusCircle />}
                    className="!bg-black hover:!bg-black/90 !text-white transition-colors shadow-sm hover:shadow focus:!ring-2 focus:!ring-black focus:!ring-offset-2 focus:!ring-offset-white !border-transparent"
                    onClick={() => navigate('/gastos/new')}
                >
                    Nuevo Gasto
                </Button>
                <Button
                    block
                    size="lg"
                    variant="plain"
                    icon={<FiUserPlus />}
                    className="!bg-black hover:!bg-black/90 !text-white transition-colors shadow-sm hover:shadow focus:!ring-2 focus:!ring-black focus:!ring-offset-2 focus:!ring-offset-white !border-transparent"
                    onClick={() => navigate('/personas/cliente/new')}
                >
                    Nuevo Cliente
                </Button>
                <Button
                    block
                    size="lg"
                    variant="plain"
                    icon={<FiTruck />}
                    className="!bg-black hover:!bg-black/90 !text-white transition-colors shadow-sm hover:shadow focus:!ring-2 focus:!ring-black focus:!ring-offset-2 focus:!ring-offset-white !border-transparent"
                    onClick={() => navigate('/personas/proveedor/new')}
                >
                    Nuevo Proveedor
                </Button>
            </motion.div>

            {/* KPIs */}
                    <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" initial="hidden" animate="show"
                        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                    >
                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                        <Card className="p-4 border-misionary-200/60 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">Cobrado y por cobrar ({labelPeriodoCorto})</div>
                                <Tooltip title="Cobrado: facturas pagadas del período. Por cobrar: facturas emitidas no pagadas en el período. Basado en fecha de factura.">
                                    <span className="text-gray-400 hover:text-gray-600 cursor-help"><FiInfo /></span>
                                </Tooltip>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-3">
                                <div>
                                    <div className="text-[11px] text-gray-600">Cobrado</div>
                                    <div className="text-2xl font-extrabold text-emerald-700">{Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(cobrosPeriodo?.totalCobrado || 0))}</div>
                                </div>
                                <div>
                                    <div className="text-[11px] text-gray-600">Por cobrar</div>
                                    <div className="text-2xl font-extrabold text-amber-700">{Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(cobrosPeriodo?.totalPorCobrar || 0))}</div>
                                </div>
                            </div>
                            <div className="mt-1 text-[11px] text-gray-500">Facturado: {Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(cobrosPeriodo?.totalFacturado || 0))} · {cobrosPeriodo?.cantidadPagadas || 0} pagadas · {cobrosPeriodo?.cantidadEmitidas || 0} emitidas</div>
                            {Number(cobrosPeriodo?.totalCobradoDirecto || 0) > 0 && (
                                <div className="text-[11px] text-gray-500">Cobrado sin factura: {Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(cobrosPeriodo?.totalCobradoDirecto || 0))}</div>
                            )}
                            {kpisAdminMes && (
                                <div className="mt-2 text-[13px] text-gray-700">
                                    <span className="text-xs text-gray-600 mr-1">Mi cobrado ({labelPeriodoCorto}):</span>
                                    <span className="font-semibold">{Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(kpisAdminMes.totalPagadoAdminUsuario || 0))}</span>
                                </div>
                            )}
                        </Card>
                        </motion.div>

                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                        <Card className="p-4 border-misionary-200/60 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">Clientes activos</div>
                        <Tooltip title="Cantidad de clientes con estado activo.">
                            <span className="text-gray-400 hover:text-gray-600 cursor-help"><FiInfo /></span>
                        </Tooltip>
                    </div>
                    <div className="mt-2 text-3xl font-extrabold text-gray-900">
                        {loading ? '—' : clientesActivosCount}
                    </div>
                    <div className="text-xs text-gray-500">Total de clientes con estado activo</div>
                </Card>
                        </motion.div>

                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                        <Card className="p-4 border-misionary-200/60 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">Gastos últimos 30 días</div>
                        <Tooltip title="Suma de gastos operativos de los últimos 30 días. Sin conversión FX.">
                            <span className="text-gray-400 hover:text-gray-600 cursor-help"><FiInfo /></span>
                        </Tooltip>
                    </div>
                    <div className="mt-2 text-3xl font-extrabold text-rose-700">
                        {loading ? '—' : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totalGastos)}
                    </div>
                    <div className="text-xs text-gray-500">Suma de gastos operativos (sin conversión FX)</div>
                </Card>
                        </motion.div>
            </motion.div>

            {/* Secciones */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" initial="hidden" animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            >
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                <Card className="p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm font-semibold mb-2">Gastos por categoría</div>
                    {gastosCat.loading && <div>Cargando…</div>}
                    {!gastosCat.loading && gastosCat.dataset.length === 0 && (
                        <div className="text-sm text-gray-500">Sin datos</div>
                    )}
                    {!gastosCat.loading && gastosCat.dataset.length > 0 && (
                        <Chart
                            type="donut"
                            height={300}
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
            <Card className="p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-sm font-semibold mb-2">Empresas registradas</div>
                            <div className="text-4xl font-black text-gray-900">{loading ? '—' : empresasCount}</div>
                            <div className="text-xs text-gray-500 mt-1">Total de empresas activas y desactivadas</div>
                            {tieneRolProveedor && (
                                <div className="mt-6">
                                    <div className="text-sm font-semibold mb-1">Mis ingresos cobrados (30 días)</div>
                                    <div className="text-2xl font-extrabold text-emerald-700">{Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(ultimosIngresosProveedor30d)}</div>
                                    <div className="text-xs text-gray-500">Suma de recibos registrados a tu nombre</div>
                                    <div className="mt-4">
                                        <div className="text-xs font-semibold text-gray-700 mb-1">Últimos recibos</div>
                                        {recibosProveedor30d.length === 0 && (
                                            <div className="text-xs text-gray-500">Sin recibos en los últimos 30 días</div>
                                        )}
                                        {recibosProveedor30d.length > 0 && (
                                            <ul className="space-y-1 max-h-40 overflow-y-auto pr-1">
                                                {recibosProveedor30d.slice(0, 6).map((r: any) => (
                                                    <li key={r.id} className="flex items-center justify-between text-xs text-gray-700">
                                                        <span className="truncate mr-2">{new Date(r.fecha).toLocaleDateString()} · {r.concepto || 'Recibo'}</span>
                                                        <span className="font-semibold">{Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(r.monto || 0))}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}
                            {kpisAdminMes && (
                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <div className="text-xs text-gray-600">Ganancia agencia ({labelPeriodoCorto})</div>
                                        <div className="text-xl font-extrabold text-gray-900">{Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(kpisAdminMes.totalGananciaEmpresaPeriodo || 0))}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-600">Pagado a admins ({labelPeriodoCorto})</div>
                                        <div className="text-xl font-extrabold text-gray-900">{Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(kpisAdminMes.totalPagadoAdminPeriodo || 0))}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-600">Disponible admin ({labelPeriodoCorto})</div>
                                        <div className="text-xl font-extrabold text-emerald-700">{Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(kpisAdminMes.disponibleAdminPeriodo || 0))}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-600">Mi cobrado ({labelPeriodoCorto})</div>
                                        <div className="text-xl font-extrabold text-gray-900">{Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(kpisAdminMes.totalPagadoAdminUsuario || 0))}</div>
                                    </div>
                                </div>
                            )}
                            {kpisAdminMes && (
                                <div className="mt-3">
                                    <div className="text-[11px] text-gray-500 mb-1">{kpisAdminMes.cantidadPresupuestosPeriodo || 0} presupuestos en el período · Sin conversión FX</div>
                                    {kpisAdminMes.gananciaPorMoneda && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {Object.entries(kpisAdminMes.gananciaPorMoneda).map(([mon, val]: any) => (
                                                <Tag key={mon} className="!bg-gray-50 !text-gray-800 !border-gray-200">
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
