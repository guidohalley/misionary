import { Card, Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import Chart from '@/components/shared/Chart'
import { useDashboardKpis, useGastosPorCategoria } from '@/modules/dashboard/hooks'

const Home = () => {
    const { loading, error, ingresosPorMoneda, clientesActivosCount, totalGastos, empresasCount, gananciaProveedor30d, tieneRolProveedor } = useDashboardKpis()
    const navigate = useNavigate()
    const gastosCat = useGastosPorCategoria()

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            {error && (
                <div className="mb-4 text-red-600">{error}</div>
            )}

            {/* Acciones rápidas */}
            <div className="flex flex-wrap gap-2 mb-4">
                <Button size="sm" className="bg-misionary-600 hover:bg-misionary-700 text-white" onClick={() => navigate('/presupuestos/new')}>Nuevo Presupuesto</Button>
                <Button size="sm" className="bg-misionary-600 hover:bg-misionary-700 text-white" onClick={() => navigate('/gastos/new')}>Nuevo Gasto</Button>
                <Button size="sm" className="bg-misionary-600 hover:bg-misionary-700 text-white" onClick={() => navigate('/personas/cliente/new')}>Nuevo Cliente</Button>
                <Button size="sm" className="bg-misionary-600 hover:bg-misionary-700 text-white" onClick={() => navigate('/personas/proveedor/new')}>Nuevo Proveedor</Button>
            </div>

            {/* KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="p-4 border-misionary-200/60">
                    <div className="text-sm text-gray-600">Ingresos últimos 30 días</div>
                            <div className="mt-2 text-3xl font-extrabold text-misionary-700">
                        {loading ? '—' : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Object.values(ingresosPorMoneda)[0]?.total || 0)}
                    </div>
                    <div className="text-xs text-gray-500">Sin conversión FX</div>
                </Card>

                        <Card className="p-4 border-misionary-200/60">
                    <div className="text-sm text-gray-600">Clientes activos</div>
                    <div className="mt-2 text-3xl font-extrabold text-gray-900">
                        {loading ? '—' : clientesActivosCount}
                    </div>
                    <div className="text-xs text-gray-500">Total de clientes con estado activo</div>
                </Card>

                        <Card className="p-4 border-misionary-200/60">
                    <div className="text-sm text-gray-600">Gastos últimos 30 días</div>
                    <div className="mt-2 text-3xl font-extrabold text-rose-700">
                        {loading ? '—' : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totalGastos)}
                    </div>
                    <div className="text-xs text-gray-500">Suma de gastos operativos (sin conversión FX)</div>
                </Card>
            </div>

            {/* Secciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
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

                        <Card className="p-4">
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
            </div>
        </div>
    )
}

export default Home
