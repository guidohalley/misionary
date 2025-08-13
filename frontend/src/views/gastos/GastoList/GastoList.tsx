import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiOutlinePlus } from 'react-icons/hi';
import { Button, Badge, Tooltip, Card, Input, Select, DatePicker } from '@/components/ui';
import DataTable from '@/components/shared/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { GastoOperativo, CategoriaGasto, categoriasGastoOptions } from '../types';
import { useNavigate } from 'react-router-dom';
import { MonedaService } from '@/modules/moneda/service';
import { CodigoMoneda, TipoCotizacion } from '@/modules/moneda/types';

interface GastoListProps {
  gastos: GastoOperativo[];
  loading: boolean;
  error: string | null;
  onEdit: (gasto: GastoOperativo) => void;
  onDelete: (id: number) => void;
  onView: (gasto: GastoOperativo) => void;
  onAsignar: (gasto: GastoOperativo) => void;
}

const GastoList: React.FC<GastoListProps> = ({
  gastos,
  loading,
  error,
  onEdit,
  onDelete,
  onView,
  onAsignar,
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [fechaDesde, setFechaDesde] = useState<Date | null>(startOfMonth(new Date()));
  const [fechaHasta, setFechaHasta] = useState<Date | null>(new Date());
  const [categoria, setCategoria] = useState<string | undefined>(undefined);
  const [moneda, setMoneda] = useState<CodigoMoneda | 'ALL'>('ALL');
  const [cotizacion, setCotizacion] = useState<TipoCotizacion>(TipoCotizacion.TARJETA);
  const [rates, setRates] = useState<{ USD?: number; EUR?: number }>({});
  const [publicRates, setPublicRates] = useState<{ blue?: number; tarjeta?: number; oficial?: number; eur?: number }>({});
  const [totalesPorCodigo, setTotalesPorCodigo] = useState<Record<string, number>>({});

  function startOfMonth(d: Date) { const x = new Date(d); x.setDate(1); x.setHours(0,0,0,0); return x; }

  useEffect(() => {
    // Cargar tipos de cambio a ARS según cotización seleccionada, con fallback a API pública
    async function fetchPublicUSD(tipo: TipoCotizacion): Promise<number | undefined> {
      try {
        const casa = tipo === TipoCotizacion.BLUE ? 'blue' : tipo === TipoCotizacion.TARJETA ? 'tarjeta' : 'oficial';
        const resp = await fetch(`https://dolarapi.com/v1/dolares/${casa}`);
        if (!resp.ok) return undefined;
        const data = await resp.json();
        return Number(data?.venta);
      } catch { return undefined; }
    }
    async function fetchPublicEUR(): Promise<number | undefined> {
      try {
        const resp = await fetch('https://dolarapi.com/v1/cotizaciones/eur');
        if (!resp.ok) return undefined;
        const data = await resp.json();
        return Number(data?.venta);
      } catch { return undefined; }
    }

    async function loadRates() {
      let usdRate: number | undefined;
      let eurRate: number | undefined;

      // 1) Intento backend
      try {
        const usd = await MonedaService.fetchTipoCambioActual(CodigoMoneda.USD, CodigoMoneda.ARS, cotizacion);
        usdRate = Number((usd as any).valor ?? usd.valor);
      } catch {}
      try {
        const eur = await MonedaService.fetchTipoCambioActual(CodigoMoneda.EUR, CodigoMoneda.ARS, cotizacion);
        eurRate = Number((eur as any).valor ?? eur.valor);
      } catch {}

      // 2) Fallback a API pública si falta alguno
      if (!usdRate) usdRate = await fetchPublicUSD(cotizacion);
      if (!eurRate) eurRate = await fetchPublicEUR();

      setRates({ USD: usdRate, EUR: eurRate });
    }
    loadRates();
  }, [cotizacion]);

  // Cotizaciones públicas (independientes del selector)
  useEffect(() => {
    async function loadPublicRates() {
      try {
        const [blue, tarjeta, oficial, eur] = await Promise.all([
          fetch('https://dolarapi.com/v1/dolares/blue').then(r=>r.ok?r.json():null).catch(()=>null),
          fetch('https://dolarapi.com/v1/dolares/tarjeta').then(r=>r.ok?r.json():null).catch(()=>null),
          fetch('https://dolarapi.com/v1/dolares/oficial').then(r=>r.ok?r.json():null).catch(()=>null),
          fetch('https://dolarapi.com/v1/cotizaciones/eur').then(r=>r.ok?r.json():null).catch(()=>null),
        ]);
        setPublicRates({
          blue: Number(blue?.venta) || undefined,
          tarjeta: Number(tarjeta?.venta) || undefined,
          oficial: Number(oficial?.venta) || undefined,
          eur: Number(eur?.venta) || undefined,
        });
      } catch {
        setPublicRates({});
      }
    }
    loadPublicRates();
  }, []);

  // Lista filtrada en cliente (búsqueda, fechas, moneda, categoría)
  const filteredGastos = useMemo(() => {
    return gastos.filter(g => {
      const okSearch = search ? `${g.concepto} ${g.descripcion || ''}`.toLowerCase().includes(search.toLowerCase()) : true;
      const okCat = categoria ? g.categoria === categoria : true;
      const f = new Date(g.fecha);
      const okDesde = fechaDesde ? f >= fechaDesde : true;
      const okHasta = fechaHasta ? f <= fechaHasta : true;
      const okMon = moneda === 'ALL' ? true : g.moneda?.codigo === moneda;
      return okSearch && okCat && okDesde && okHasta && okMon;
    });
  }, [gastos, search, categoria, fechaDesde, fechaHasta, moneda]);

  // Totales por código de moneda (sobre lista filtrada)
  useEffect(() => {
    const totals: Record<string, number> = {};
    for (const g of filteredGastos) {
      const code = g.moneda?.codigo || 'ARS';
      totals[code] = (totals[code] || 0) + Number(g.monto);
    }
    setTotalesPorCodigo(totals);
  }, [filteredGastos]);

  const totalEquivalenteARS = useMemo(() => {
    const ars = Number(totalesPorCodigo.ARS || 0);
    const usd = Number(totalesPorCodigo.USD || 0) * Number(rates.USD || 0);
    const eur = Number(totalesPorCodigo.EUR || 0) * Number(rates.EUR || 0);
    return ars + usd + eur;
  }, [totalesPorCodigo, rates]);

  // Subtotales por categoría y equivalentes ARS
  const subtotalesPorCategoria = useMemo(() => {
    const map: Record<string, { ARS: number; USD: number; EUR: number }> = {};
    for (const g of filteredGastos) {
      const cat = g.categoria;
      const code = (g.moneda?.codigo || 'ARS') as 'ARS' | 'USD' | 'EUR';
      if (!map[cat]) map[cat] = { ARS: 0, USD: 0, EUR: 0 };
      map[cat][code] += Number(g.monto);
    }
    return map;
  }, [filteredGastos]);

  // Helpers proyección recurrentes
  const factorMensualDesdeFrecuencia = (f?: string | null) => {
    if (!f) return 1; // por defecto mensual
    const v = f.toUpperCase();
    if (v.includes('ANUAL')) return 1 / 12;
    if (v.includes('SEMEST')) return 1 / 6; // semestral
    if (v.includes('TRIM')) return 1 / 3;   // trimestral
    if (v.includes('MENS')) return 1;       // mensual
    if (v.includes('SEMAN')) return 4;      // semanal aprox 4 por mes
    return 1;
  };

  const recurrentesMensualPorCodigo = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const g of filteredGastos) {
      if (g.esRecurrente) {
        const code = g.moneda?.codigo || 'ARS';
        const factor = factorMensualDesdeFrecuencia(g.frecuencia);
        totals[code] = (totals[code] || 0) + Number(g.monto) * factor;
      }
    }
    return totals;
  }, [filteredGastos]);

  const recurrenteMensualARS = useMemo(() => {
    const ars = Number(recurrentesMensualPorCodigo.ARS || 0);
    const usd = Number(recurrentesMensualPorCodigo.USD || 0) * Number(rates.USD || 0);
    const eur = Number(recurrentesMensualPorCodigo.EUR || 0) * Number(rates.EUR || 0);
    return ars + usd + eur;
  }, [recurrentesMensualPorCodigo, rates]);

  const columns = useMemo<ColumnDef<GastoOperativo>[]>(() => [
    {
      header: 'ID',
      accessorKey: 'id',
      size: 70,
    },
    {
      header: 'Concepto',
      accessorKey: 'concepto',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {row.original.concepto}
          </div>
          {row.original.descripcion && (
            <div className="text-xs text-gray-500 truncate max-w-xs">
              {row.original.descripcion}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Monto',
      accessorKey: 'monto',
      cell: ({ row }) => (
        <div className="text-right">
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {row.original.moneda?.simbolo} {row.original.monto.toLocaleString('es-AR', { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </div>
          <div className="text-xs text-gray-500">
            {row.original.moneda?.codigo}
          </div>
        </div>
      ),
    },
    {
      header: '≈ ARS',
      id: 'aproxArs',
      cell: ({ row }) => {
        const code = row.original.moneda?.codigo;
        const monto = Number(row.original.monto || 0);
        let equiv: number | null = null;
        if (code === 'USD' && rates.USD) equiv = monto * Number(rates.USD);
        if (code === 'EUR' && rates.EUR) equiv = monto * Number(rates.EUR);
        return (
          <div className="text-right text-sm text-gray-600 dark:text-gray-300">
            {code === 'ARS' ? '—' : (equiv ? `$ ${equiv.toLocaleString('es-AR', { minimumFractionDigits: 2 })}` : '—')}
          </div>
        );
      },
    },
    {
      header: 'Categoría',
      accessorKey: 'categoria',
      cell: ({ row }) => {
        const categoria = categoriasGastoOptions.find(c => c.value === row.original.categoria);
        return (
          <Tooltip title={categoria?.description || ''}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{categoria?.icon}</span>
              <Badge
                className={getBadgeColorByCategoria(row.original.categoria)}
              >
                {categoria?.label || row.original.categoria}
              </Badge>
            </div>
          </Tooltip>
        );
      },
    },
    {
      header: 'Tipo',
      accessorKey: 'tipo',
      cell: ({ row }) => (
        row.original.tipo ? (
          <span className="text-sm">
            <span className="inline-block w-2 h-2 rounded-full mr-2" style={{backgroundColor: row.original.tipo.color || '#94a3b8'}} />
            {row.original.tipo.nombre}
          </span>
        ) : <span className="text-gray-400">—</span>
      ),
    },
    {
      header: 'Fecha',
      accessorKey: 'fecha',
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.original.fecha).toLocaleDateString('es-AR')}
        </div>
      ),
    },
    {
      header: 'Proveedor',
      accessorKey: 'proveedor',
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.proveedor?.nombre || 'Sin proveedor'}
        </div>
      ),
    },
    {
      header: 'Recurrente',
      accessorKey: 'esRecurrente',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.esRecurrente ? (
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {row.original.frecuencia || 'Sí'}
            </Badge>
          ) : (
            <span className="text-gray-400">No</span>
          )}
        </div>
      ),
    },
    {
      header: 'Estado',
      accessorKey: 'activo',
      cell: ({ row }) => (
        <Badge
          className={row.original.activo 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }
        >
          {row.original.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      header: 'Acciones',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Ver detalles">
            <Button
              size="xs"
              variant="plain"
              icon={<HiOutlineEye />}
              onClick={() => onView(row.original)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              size="xs"
              variant="plain"
              icon={<HiOutlinePencil />}
              onClick={() => onEdit(row.original)}
            />
          </Tooltip>
          <Tooltip title="Asignar a proyectos">
            <Button
              size="xs"
              variant="plain"
              className="text-blue-600 hover:text-blue-800"
              onClick={() => onAsignar(row.original)}
            >
              Asignar
            </Button>
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button
              size="xs"
              variant="plain"
              icon={<HiOutlineTrash />}
              className="text-red-600 hover:text-red-800"
              onClick={() => onDelete(row.original.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ], [onEdit, onDelete, onView, onAsignar]);

  const getBadgeColorByCategoria = (categoria: string): string => {
    switch (categoria) {
      case CategoriaGasto.OFICINA:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case CategoriaGasto.PERSONAL:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case CategoriaGasto.MARKETING:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case CategoriaGasto.TECNOLOGIA:
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case CategoriaGasto.SERVICIOS:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case CategoriaGasto.TRANSPORTE:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case CategoriaGasto.COMUNICACION:
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      case CategoriaGasto.OTROS:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Cotizaciones públicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Dólar Blue</div>
          <div className="text-2xl font-bold">$ {publicRates.blue ? publicRates.blue.toLocaleString('es-AR', { minimumFractionDigits: 2 }) : '—'}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Dólar Tarjeta</div>
          <div className="text-2xl font-bold">$ {publicRates.tarjeta ? publicRates.tarjeta.toLocaleString('es-AR', { minimumFractionDigits: 2 }) : '—'}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Dólar Oficial</div>
          <div className="text-2xl font-bold">$ {publicRates.oficial ? publicRates.oficial.toLocaleString('es-AR', { minimumFractionDigits: 2 }) : '—'}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Euro (ARS)</div>
          <div className="text-2xl font-bold">$ {publicRates.eur ? publicRates.eur.toLocaleString('es-AR', { minimumFractionDigits: 2 }) : '—'}</div>
        </Card>
      </div>

      {/* Cards resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Gastos en ARS (filtrado)</div>
          <div className="text-2xl font-bold">$ {Number(totalesPorCodigo.ARS || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Gastos en USD (filtrado)</div>
          <div className="text-2xl font-bold">US$ {Number(totalesPorCodigo.USD || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-gray-500 mt-1">≈ $ {(Number(totalesPorCodigo.USD || 0) * Number(rates.USD || 0)).toLocaleString('es-AR', { minimumFractionDigits: 2 })} ARS</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Gastos en EUR (filtrado)</div>
          <div className="text-2xl font-bold">€ {Number(totalesPorCodigo.EUR || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-gray-500 mt-1">≈ $ {(Number(totalesPorCodigo.EUR || 0) * Number(rates.EUR || 0)).toLocaleString('es-AR', { minimumFractionDigits: 2 })} ARS</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Total equivalente ARS</div>
            <div className="w-36">
              <Select
                options={[
                  { value: TipoCotizacion.OFICIAL, label: 'Oficial' },
                  { value: TipoCotizacion.BLUE, label: 'Blue' },
                  { value: TipoCotizacion.TARJETA, label: 'Tarjeta' },
                ]}
                value={{ value: cotizacion, label: cotizacion === 'OFICIAL' ? 'Oficial' : cotizacion === 'BLUE' ? 'Blue' : 'Tarjeta' }}
                onChange={(o: any) => setCotizacion(o?.value || TipoCotizacion.TARJETA)}
              />
            </div>
          </div>
          <div className="text-2xl font-bold mt-1">$ {totalEquivalenteARS.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-gray-500">Cotización {cotizacion}</div>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <Input placeholder="Buscar concepto/descr." value={search} onChange={e=>setSearch(e.target.value)} />
          <Select
            options={[{value:'ALL',label:'Todas las monedas'},{value:'ARS',label:'ARS'},{value:'USD',label:'USD'},{value:'EUR',label:'EUR'}]}
            value={{ value: moneda, label: moneda==='ALL' ? 'Todas las monedas' : moneda }}
            onChange={(o:any)=>setMoneda(o?.value || 'ALL')}
          />
          <Select
            options={[{value:undefined,label:'Todas las categorías'}, ...categoriasGastoOptions.map(c=>({value:c.value,label:c.label}))]}
            value={{ value: categoria, label: categoria ? (categoriasGastoOptions.find(c=>c.value===categoria)?.label||categoria) : 'Todas las categorías' }}
            onChange={(o:any)=>setCategoria(o?.value)}
          />
          <DatePicker value={fechaDesde} onChange={d=>setFechaDesde(d)} placeholder="Desde" />
          <DatePicker value={fechaHasta} onChange={d=>setFechaHasta(d)} placeholder="Hasta" />
          <Select
            options={[
              { value: TipoCotizacion.OFICIAL, label: 'Oficial' },
              { value: TipoCotizacion.BLUE, label: 'Blue' },
              { value: TipoCotizacion.TARJETA, label: 'Tarjeta' },
            ]}
            value={{ value: cotizacion, label: cotizacion === 'OFICIAL' ? 'Oficial' : cotizacion === 'BLUE' ? 'Blue' : 'Tarjeta' }}
            onChange={(o:any)=>setCotizacion(o?.value || TipoCotizacion.TARJETA)}
          />
          <div>
            <Button variant="twoTone" onClick={()=>{ setFechaDesde(startOfMonth(new Date())); setFechaHasta(new Date()); }}>Este mes</Button>
          </div>
        </div>
      </Card>

      {/* Subtotales por categoría */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">Subtotales por categoría</div>
          <div className="text-xs text-gray-500">Equivalente en ARS usando {cotizacion}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {Object.entries(subtotalesPorCategoria).map(([cat, vals]) => {
            const categoriaInfo = categoriasGastoOptions.find(c => c.value === cat);
            const equivArs = Number(vals.ARS || 0) + Number(vals.USD || 0) * Number(rates.USD || 0) + Number(vals.EUR || 0) * Number(rates.EUR || 0);
            return (
              <div key={cat} className="border rounded-lg p-3 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{categoriaInfo?.icon}</span>
                  <span className="font-medium">{categoriaInfo?.label || cat}</span>
                </div>
                <div className="text-xs text-gray-500">ARS: $ {Number(vals.ARS || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
                <div className="text-xs text-gray-500">USD: US$ {Number(vals.USD || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })} (≈ $ {(Number(vals.USD || 0) * Number(rates.USD || 0)).toLocaleString('es-AR', { minimumFractionDigits: 2 })})</div>
                <div className="text-xs text-gray-500">EUR: € {Number(vals.EUR || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })} (≈ $ {(Number(vals.EUR || 0) * Number(rates.EUR || 0)).toLocaleString('es-AR', { minimumFractionDigits: 2 })})</div>
                <div className="mt-1 text-sm font-semibold">Total ≈ $ {equivArs.toLocaleString('es-AR', { minimumFractionDigits: 2 })} ARS</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Proyección de gastos recurrentes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Recurrente mensual (equiv. ARS)</div>
          <div className="text-2xl font-bold">$ {recurrenteMensualARS.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Recurrente anual (equiv. ARS)</div>
          <div className="text-2xl font-bold">$ {(recurrenteMensualARS * 12).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Recurrente mensual por moneda</div>
          <div className="text-xs text-gray-600">ARS: $ {Number(recurrentesMensualPorCodigo.ARS || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-gray-600">USD: US$ {Number(recurrentesMensualPorCodigo.USD || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })} (≈ $ {(Number(recurrentesMensualPorCodigo.USD || 0) * Number(rates.USD || 0)).toLocaleString('es-AR', { minimumFractionDigits: 2 })})</div>
          <div className="text-xs text-gray-600">EUR: € {Number(recurrentesMensualPorCodigo.EUR || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })} (≈ $ {(Number(recurrentesMensualPorCodigo.EUR || 0) * Number(rates.EUR || 0)).toLocaleString('es-AR', { minimumFractionDigits: 2 })})</div>
        </Card>
      </div>
      {/* Header con acciones */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Gastos Operativos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestión de costos operativos de la empresa
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="solid"
            icon={<HiOutlinePlus />}
            onClick={() => navigate('/gastos/new')}
          >
            Nuevo Gasto
          </Button>
        </div>
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <p className="text-red-600">Error: {error}</p>
        </motion.div>
      )}

      {/* Tabla de datos */}
      <DataTable
        columns={columns}
        data={filteredGastos}
        loading={loading}
        skeletonAvatarColumns={[1]}
        pagingData={{
          total: filteredGastos.length,
          pageIndex: 0,
          pageSize: 10,
        }}
      />
    </motion.div>
  );
};

export default GastoList;
