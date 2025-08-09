import { Card } from '@/components/ui'
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
                <Card className="p-4">
                    <div className="text-sm text-gray-600">Ingresos últimos 30 días</div>
                    <div className="mt-2 text-2xl font-semibold">
                        {loading ? '—' : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Object.values(ingresosPorMoneda)[0]?.total || 0)}
                    </div>
                    <div className="text-xs text-gray-500">Sin conversión FX</div>
                </Card>

                <Card className="p-4">
                    <div className="text-sm text-gray-600">Presupuestos por estado</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {loading ? (
                            <span>—</span>
                        ) : (
                            Object.entries(pipeline).map(([estado, count]) => (
                                <span key={estado} className="inline-flex items-center rounded-full bg-msgray-100 text-msgray-800 px-2 py-0.5 text-xs font-medium ring-1 ring-msgray-200">
                                    {estado}: {count}
                                </span>
                            ))
                        )}
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="text-sm text-gray-600">Gastos del mes</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {loading ? (
                            <span>—</span>
                        ) : (
                            Object.entries(gastosMesPorMoneda).map(([moneda, total]) => (
                                <span key={moneda} className="inline-flex items-center rounded-full bg-rose-100 text-rose-800 px-2 py-0.5 text-xs font-medium ring-1 ring-rose-200">
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
                    <div className="space-y-2">
                        {gastosCat.dataset.map((r) => (
                            <div key={r.categoria} className="flex justify-between text-sm">
                                <span>{r.categoria}</span>
                                <span className="font-medium">{Intl.NumberFormat('es-AR').format(r.total)}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Home
