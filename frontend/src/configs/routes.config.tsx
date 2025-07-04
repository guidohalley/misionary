import { lazy } from 'react';
import { HOME_PREFIX_PATH } from '@/constants/route.constant';

const Home = lazy(() => import('@/views/Home'));
const LoginView = lazy(() => import('@/views/auth/LoginView'));
const PersonasView = lazy(() => import('@/views/personas'));
const PersonaNew = lazy(() => import('@/views/personas/PersonaNew'));
const PersonaEdit = lazy(() => import('@/views/personas/PersonaEdit'));
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

const publicRoutes = [
  {
    key: 'login',
    path: '/login',
    component: LoginView,
  }
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
    key: 'persona-new',
    path: '/personas/new',
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
  }
];

const routes = [...publicRoutes, ...protectedRoutes];

export { publicRoutes, protectedRoutes };
export default routes;
