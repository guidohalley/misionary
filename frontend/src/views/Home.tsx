import { Card } from '@/components/ui'
import Chart from '@/components/shared/Chart'
import { useDashboardKpis, useGastosPorCategoria } from '@/modules/dashboard/hooks'

const Home = () => {
    const { loading, error, ingresosPorMoneda, pipeline, gastosMesPorMoneda } = useDashboardKpis()
    const gastosCat = useGastosPorCategoria()

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            {error && (
                <div className="mb-4 text-red-600">{error}</div>
            )}

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
                    <div className="text-sm text-gray-600">Presupuestos por estado</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {loading ? (
                            <span>—</span>
                        ) : (
                            Object.entries(pipeline).map(([estado, count]) => (
                                        <span key={estado} className="inline-flex items-center rounded-full bg-misionary-100 text-misionary-800 px-2.5 py-0.5 text-xs font-semibold ring-1 ring-misionary-200">
                                    {estado}: {count}
                                </span>
                            ))
                        )}
                    </div>
                </Card>

                        <Card className="p-4 border-misionary-200/60">
                    <div className="text-sm text-gray-600">Gastos del mes</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {loading ? (
                            <span>—</span>
                        ) : (
                            Object.entries(gastosMesPorMoneda).map(([moneda, total]) => (
                                        <span key={moneda} className="inline-flex items-center rounded-full bg-rose-100 text-rose-800 px-2.5 py-0.5 text-xs font-semibold ring-1 ring-rose-200">
                                    {moneda}: {Intl.NumberFormat('es-AR').format(total)}
                                </span>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            {/* Secciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                    <div className="text-sm font-semibold mb-2">Pipeline de Presupuestos</div>
                    <div className="space-y-2">
                        {loading && <div>Cargando…</div>}
                        {!loading && Object.entries(pipeline).length === 0 && (
                            <div className="text-sm text-gray-500">Sin presupuestos</div>
                        )}
                        {!loading && Object.entries(pipeline).map(([estado, count]) => (
                            <div key={estado} className="flex justify-between text-sm">
                                <span>{estado}</span>
                                <span className="font-medium">{count}</span>
                            </div>
                        ))}
                    </div>
                </Card>

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
            </div>
        </div>
    )
}

export default Home
