import { Card, Button } from '@/components/ui'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiFilePlus, FiPlusCircle, FiUserPlus, FiTruck } from 'react-icons/fi'
import Chart from '@/components/shared/Chart'
import { useDashboardKpis, useGastosPorCategoria } from '@/modules/dashboard/hooks'

const Home = () => {
    const { loading, error, ingresosPorMoneda, clientesActivosCount, totalGastos, empresasCount, gananciaProveedor30d, tieneRolProveedor } = useDashboardKpis()
    const navigate = useNavigate()
    const gastosCat = useGastosPorCategoria()

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-5">
                <h1 className="text-2xl font-extrabold tracking-tight text-msgray-950">Dashboard</h1>
                <p className="text-sm text-msgray-500">Resumen operativo y atajos a tus acciones frecuentes</p>
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
                    <div className="text-sm text-gray-600">Ingresos últimos 30 días</div>
                            <div className="mt-2 text-3xl font-extrabold text-misionary-700">
                        {loading ? '—' : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Object.values(ingresosPorMoneda)[0]?.total || 0)}
                    </div>
                    <div className="text-xs text-gray-500">Sin conversión FX</div>
                </Card>
                        </motion.div>

                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                        <Card className="p-4 border-misionary-200/60 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm text-gray-600">Clientes activos</div>
                    <div className="mt-2 text-3xl font-extrabold text-gray-900">
                        {loading ? '—' : clientesActivosCount}
                    </div>
                    <div className="text-xs text-gray-500">Total de clientes con estado activo</div>
                </Card>
                        </motion.div>

                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                        <Card className="p-4 border-misionary-200/60 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm text-gray-600">Gastos últimos 30 días</div>
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
                                    <div className="text-sm font-semibold mb-1">Mi ganancia estimada (30 días)</div>
                                    <div className="text-2xl font-extrabold text-emerald-700">{Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(gananciaProveedor30d)}</div>
                                    <div className="text-xs text-gray-500">Basado en (precio - costo proveedor) x cantidad</div>
                                </div>
                            )}
                        </Card>
            </motion.div>
        </motion.div>
        </div>
    )
}

export default Home
