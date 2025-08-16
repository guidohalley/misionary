import { lazy } from 'react';
import { HOME_PREFIX_PATH } from '@/constants/route.constant';

const Home = lazy(() => import('@/views/Home'));
const LoginView = lazy(() => import('@/views/auth/LoginView'));
const PersonasView = lazy(() => import('@/views/personas'));
const PersonaNew = lazy(() => import('@/views/personas/PersonaNew'));
const PersonaEdit = lazy(() => import('@/views/personas/PersonaEdit'));
const PersonaTypeSelector = lazy(() => import('@/views/personas/PersonaTypeSelector'));
const ClienteNew = lazy(() => import('@/views/personas/ClienteNew'));
const ClienteConEmpresaNew = lazy(() => import('@/views/personas/ClienteConEmpresaNew'));
const ProveedorNew = lazy(() => import('@/views/personas/ProveedorNew'));
const InternoNew = lazy(() => import('@/views/personas/InternoNew'));
const ProductosView = lazy(() => import('@/views/productos'));
const ProductoNew = lazy(() => import('@/views/productos/ProductoNew'));
const ProductoEdit = lazy(() => import('@/views/productos/ProductoEdit'));
const ServiciosView = lazy(() => import('@/views/servicios'));
const ServicioNew = lazy(() => import('@/views/servicios/ServicioNew'));
const ServicioEdit = lazy(() => import('@/views/servicios/ServicioEdit'));
const ImpuestosView = lazy(() => import('@/views/impuestos/ImpuestoMain'));
const ImpuestoNew = lazy(() => import('@/views/impuestos/ImpuestoNew/ImpuestoNew'));
const ImpuestoEdit = lazy(() => import('@/views/impuestos/ImpuestoEdit/ImpuestoEdit'));
const PresupuestosView = lazy(() => import('@/views/presupuestos/PresupuestosView'));
const PresupuestoNew = lazy(() => import('@/views/presupuestos/PresupuestoNew'));
const PresupuestoEdit = lazy(() => import('@/views/presupuestos/PresupuestoEdit'));
const PresupuestoView = lazy(() => import('@/views/presupuestos/PresupuestoView'));
const PresupuestoAnalytics = lazy(() => import('@/views/dashboard/PresupuestoAnalytics'));
const MonedaView = lazy(() => import('@/views/moneda'));
const GastosView = lazy(() => import('@/views/gastos'));
const GastoNew = lazy(() => import('@/views/gastos/GastoNew'));
const HistorialPrecioView = lazy(() => import('@/views/historialPrecio'));
const EmpresasView = lazy(() => import('@/views/empresas'));
const EmpresaNew = lazy(() => import('@/views/empresas/EmpresaNew'));
const EmpresaEdit = lazy(() => import('@/views/empresas/EmpresaEdit'));
const FinanzasList = lazy(() => import('@/views/finanzas/FinanzasList'));
const FinanzasResumen = lazy(() => import('@/views/finanzas/FinanzasResumen'));
const RecibosView = lazy(() => import('@/views/recibos'));
const ReciboNew = lazy(() => import('@/views/recibos/ReciboNew'));
const RentabilidadMain = lazy(() => import('@/views/rentabilidad/RentabilidadMain'));

const publicRoutes = [
  {
    key: 'login',
    path: '/login',
    component: LoginView,
  },
  {
    key: 'acceptInvite',
    path: '/accept-invite',
    component: lazy(() => import('@/views/auth/AcceptInvite')),
  },
  {
    key: 'completeProviderRegistration',
    path: '/complete-provider-registration',
    component: lazy(() => import('@/views/auth/CompleteProviderRegistration')),
  },
  {
    key: 'providerRegistrationSuccess',
    path: '/provider-registration-success',
    component: lazy(() => import('@/views/auth/ProviderRegistrationSuccess')),
  },
];

const protectedRoutes = [
  {
    key: 'home',
    path: HOME_PREFIX_PATH,
    component: Home,
  },
  {
    key: 'personas',
    path: '/personas',
    component: PersonasView,
  },
  {
    key: 'persona-type-selector',
    path: '/personas/new',
    component: PersonaTypeSelector,
  },
  {
    key: 'cliente-new',
    path: '/personas/cliente/new',
    component: ClienteConEmpresaNew,
  },
  {
    key: 'proveedor-new',
    path: '/personas/proveedor/new',
    component: ProveedorNew,
  },
  {
    key: 'interno-new',
    path: '/personas/interno/new',
    component: InternoNew,
  },
  {
    key: 'persona-new-legacy',
    path: '/personas/new-legacy',
    component: PersonaNew,
  },
  {
    key: 'persona-edit',
    path: '/personas/edit/:id',
    component: PersonaEdit,
  },
  {
    key: 'productos',
    path: '/productos',
    component: ProductosView,
  },
  {
    key: 'producto-new',
    path: '/productos/new',
    component: ProductoNew,
  },
  {
    key: 'producto-edit',
    path: '/productos/edit/:id',
    component: ProductoEdit,
  },
  {
    key: 'servicios',
    path: '/servicios',
    component: ServiciosView,
  },
  {
    key: 'servicio-new',
    path: '/servicios/new',
    component: ServicioNew,
  },
  {
    key: 'servicio-edit',
    path: '/servicios/edit/:id',
    component: ServicioEdit,
  },
  {
    key: 'impuestos',
    path: '/impuestos',
    component: ImpuestosView,
  },
  {
    key: 'impuesto-new',
    path: '/impuestos/nuevo',
    component: ImpuestoNew,
  },
  {
    key: 'impuesto-edit',
    path: '/impuestos/editar/:id',
    component: ImpuestoEdit,
  },
  {
    key: 'presupuestos',
    path: '/presupuestos',
    component: PresupuestosView,
  },
  {
    key: 'presupuesto-new',
    path: '/presupuestos/new',
    component: PresupuestoNew,
  },
  {
    key: 'presupuesto-edit',
    path: '/presupuestos/edit/:id',
    component: PresupuestoEdit,
  },
  {
    key: 'presupuesto-view',
    path: '/presupuestos/view/:id',
    component: PresupuestoView,
  },
  {
    key: 'presupuesto-analytics',
    path: '/dashboard/analytics',
    component: PresupuestoAnalytics,
  },
  {
    key: 'monedas',
    path: '/monedas',
    component: MonedaView,
  },
  {
    key: 'gastos',
    path: '/gastos',
    component: GastosView,
  },
  {
    key: 'rentabilidad',
    path: '/gastos/rentabilidad',
    component: RentabilidadMain,
  },
  {
    key: 'gasto-new',
    path: '/gastos/new',
    component: GastoNew,
  },
  {
    key: 'recibo-new',
    path: '/recibos/new',
    component: ReciboNew,
  },
  {
    key: 'historial-precios',
    path: '/historial-precios',
    component: HistorialPrecioView,
  },
  {
    key: 'empresas',
    path: '/empresas',
    component: EmpresasView,
  },
  {
    key: 'empresa-new',
    path: '/empresas/new',
    component: EmpresaNew,
  },
  {
    key: 'empresa-edit',
    path: '/empresas/edit/:id',
    component: EmpresaEdit,
  }
  ,
  {
    key: 'finanzas',
    path: '/finanzas',
    component: FinanzasList,
  },
  {
    key: 'finanzas-detalle',
    path: '/finanzas/:id',
    component: FinanzasResumen,
  },
  {
    key: 'recibos',
    path: '/recibos',
    component: RecibosView,
  }
];

const routes = [...publicRoutes, ...protectedRoutes];

export { publicRoutes, protectedRoutes };
export default routes;
