/**
 * CONFIGURACIÓN DE PERMISOS POR RUTA
 * Sistema Misionary ERP/CRM
 * 
 * Define qué roles tienen acceso a cada ruta del sistema.
 * 
 * ROLES:
 * - ADMIN: Acceso completo a todo el sistema
 * - CONTADOR: Gestión comercial, contable y financiera (sin configuración avanzada)
 * - PROVEEDOR: Solo acceso a sus propios productos/servicios
 * 
 * REGLAS:
 * - [] = ruta pública (solo rutas de autenticación)
 * - ['ADMIN'] = solo administradores
 * - ['ADMIN', 'CONTADOR'] = administradores y contadores
 * - ['ADMIN', 'CONTADOR', 'PROVEEDOR'] = todos los usuarios autenticados
 */

export type UserRole = 'ADMIN' | 'CONTADOR' | 'PROVEEDOR';

export interface RoutePermission {
  path: string;
  roles: UserRole[];
  description: string;
  restricted?: boolean; // Si true, redirige a /access-denied en vez de ocultar
}

/**
 * MATRIZ COMPLETA DE PERMISOS POR RUTA
 */
export const ROUTE_PERMISSIONS: Record<string, RoutePermission> = {
  
  // ========================================
  // DASHBOARD Y HOME
  // ========================================
  '/home': {
    path: '/home',
    roles: ['ADMIN', 'CONTADOR', 'PROVEEDOR'],
    description: 'Dashboard principal - Todos los usuarios autenticados',
  },

  '/dashboard/analytics': {
    path: '/dashboard/analytics',
    roles: ['ADMIN', 'CONTADOR'],
    description: 'Proyecciones y Analytics - Solo gestores',
    restricted: true,
  },

  // ========================================
  // GESTIÓN DE PERSONAS (Clientes, Proveedores, Internos)
  // ========================================
  '/personas': {
    path: '/personas',
    roles: ['ADMIN', 'CONTADOR'],
    description: 'Lista de todas las personas - Solo gestores',
    restricted: true,
  },

  '/personas/new': {
    path: '/personas/new',
    roles: ['ADMIN', 'CONTADOR'],
    description: 'Selector de tipo de persona a crear',
    restricted: true,
  },

  '/personas/cliente/new': {
    path: '/personas/cliente/new',
    roles: ['ADMIN', 'CONTADOR'],
    description: 'Crear nuevo cliente con empresa',
    restricted: true,
  },

  '/personas/proveedor/new': {
    path: '/personas/proveedor/new',
    roles: ['ADMIN', 'CONTADOR'],
    description: 'Crear nuevo proveedor - Solo gestores pueden invitar',
    restricted: true,
  },

  '/personas/interno/new': {
    path: '/personas/interno/new',
    roles: ['ADMIN'],
    description: 'Crear usuario interno - Solo administradores',
    restricted: true,
  },

  '/personas/new-legacy': {
    path: '/personas/new-legacy',
    roles: ['ADMIN', 'CONTADOR'],
    description: 'Formulario legacy de creación de persona',
    restricted: true,
  },

  '/personas/edit/:id': {
    path: '/personas/edit/:id',
    roles: ['ADMIN', 'CONTADOR'],
    description: 'Editar persona - Solo gestores',
    restricted: true,
  },

  // ========================================
  // PRODUCTOS
  // ========================================
  '/productos': {
    path: '/productos',
    roles: ['ADMIN', 'CONTADOR', 'PROVEEDOR'],
    description: 'Lista de productos - Todos los roles (filtrado por backend)',
  },

  '/productos/new': {
    path: '/productos/new',
    roles: ['ADMIN', 'CONTADOR', 'PROVEEDOR'],
    description: 'Crear producto - Todos pueden crear sus productos',
  },

  '/productos/edit/:id': {
    path: '/productos/edit/:id',
    roles: ['ADMIN', 'CONTADOR', 'PROVEEDOR'],
    description: 'Editar producto - Validación de propiedad en backend',
  },

  // ========================================
  // SERVICIOS
  // ========================================
  '/servicios': {
    path: '/servicios',
    roles: ['ADMIN', 'CONTADOR', 'PROVEEDOR'],
    description: 'Lista de servicios - Todos los roles (filtrado por backend)',
  },

  '/servicios/new': {
    path: '/servicios/new',
    roles: ['ADMIN', 'CONTADOR', 'PROVEEDOR'],
    description: 'Crear servicio - Todos pueden crear sus servicios',
  },

  '/servicios/edit/:id': {
    path: '/servicios/edit/:id',
    roles: ['ADMIN', 'CONTADOR', 'PROVEEDOR'],
    description: 'Editar servicio - Validación de propiedad en backend',
  },

  // ========================================
  // PRESUPUESTOS
  // ========================================
  '/presupuestos': {
    path: '/presupuestos',
    roles: ['ADMIN', 'CONTADOR', 'PROVEEDOR'],
    description: 'Lista de presupuestos - Proveedores ven solo los que incluyen sus productos',
  },

  '/presupuestos/new': {
    path: '/presupuestos/new',
    roles: ['ADMIN', 'CONTADOR'],
    description: 'Crear presupuesto - Solo gestores',
    restricted: true,
  },

  '/presupuestos/edit/:id': {
    path: '/presupuestos/edit/:id',
    roles: ['ADMIN', 'CONTADOR'],
    description: 'Editar presupuesto - Solo gestores',
    restricted: true,
  },

  '/presupuestos/view/:id': {
    path: '/presupuestos/view/:id',
    roles: ['ADMIN', 'CONTADOR', 'PROVEEDOR'],
    description: 'Ver detalle de presupuesto - Todos pueden ver (validación de inclusión en backend)',
  },

  // ========================================
  // EMPRESAS
  // ========================================
  '/empresas': {
    path: '/empresas',
    roles: ['ADMIN', 'CONTADOR'],
    description: 'Lista de empresas - Solo gestores',
    restricted: true,
  },

  '/empresas/new': {
    path: '/empresas/new',
    roles: ['ADMIN', 'CONTADOR'],
    description: 'Crear empresa - Solo gestores',
    restricted: true,
  },

  '/empresas/edit/:id': {
    path: '/empresas/edit/:id',
    roles: ['ADMIN', 'CONTADOR'],
    description: 'Editar empresa - Solo gestores',
    restricted: true,
  },

  // ========================================
  // FINANZAS (Módulo sensible)
  // ========================================
  '/finanzas': {
    path: '/finanzas',
    roles: ['ADMIN'],
    description: 'Resumen financiero completo - Solo administradores',
    restricted: true,
  },

  '/finanzas/:id': {
    path: '/finanzas/:id',
    roles: ['ADMIN'],
    description: 'Detalle financiero de presupuesto - Solo administradores',
    restricted: true,
  },

  // ========================================
  // GASTOS OPERATIVOS
  // ========================================
  '/gastos': {
    path: '/gastos',
    roles: ['ADMIN', 'CONTADOR'],
    description: 'Lista de gastos operativos - Solo gestores',
    restricted: true,
  },

  '/gastos/new': {
    path: '/gastos/new',
    roles: ['ADMIN', 'CONTADOR'],
    description: 'Crear gasto operativo - Solo gestores',
    restricted: true,
  },

  '/gastos/rentabilidad': {
    path: '/gastos/rentabilidad',
    roles: ['ADMIN'],
    description: 'Análisis de rentabilidad - Solo administradores',
    restricted: true,
  },

  // ========================================
  // RECIBOS (Pagos a proveedores)
  // ========================================
  '/recibos': {
    path: '/recibos',
    roles: ['ADMIN', 'CONTADOR'],
    description: 'Lista de recibos de pago - Solo gestores',
    restricted: true,
  },

  '/recibos/new': {
    path: '/recibos/new',
    roles: ['ADMIN', 'CONTADOR'],
    description: 'Crear recibo de pago - Solo gestores',
    restricted: true,
  },

  // ========================================
  // CONFIGURACIÓN (Solo administradores)
  // ========================================
  '/impuestos': {
    path: '/impuestos',
    roles: ['ADMIN'],
    description: 'Gestión de impuestos - Solo administradores',
    restricted: true,
  },

  '/impuestos/nuevo': {
    path: '/impuestos/nuevo',
    roles: ['ADMIN'],
    description: 'Crear impuesto - Solo administradores',
    restricted: true,
  },

  '/impuestos/editar/:id': {
    path: '/impuestos/editar/:id',
    roles: ['ADMIN'],
    description: 'Editar impuesto - Solo administradores',
    restricted: true,
  },

  '/monedas': {
    path: '/monedas',
    roles: ['ADMIN'],
    description: 'Gestión de monedas - Solo administradores',
    restricted: true,
  },

  // ========================================
  // HISTORIAL Y REPORTES
  // ========================================
  '/historial-precios': {
    path: '/historial-precios',
    roles: ['ADMIN', 'CONTADOR'],
    description: 'Historial de precios - Solo gestores',
    restricted: true,
  },
};

/**
 * Verifica si un usuario tiene acceso a una ruta específica
 */
export function hasRouteAccess(
  userRoles: UserRole[],
  routePath: string
): boolean {
  const permission = ROUTE_PERMISSIONS[routePath];
  
  if (!permission) {
    // Si no está configurada, permitir acceso por defecto (puede ser peligroso)
    console.warn(`⚠️ Ruta sin configuración de permisos: ${routePath}`);
    return true;
  }

  // Verificar si el usuario tiene al menos uno de los roles requeridos
  return permission.roles.some(role => userRoles.includes(role));
}

/**
 * Filtra rutas según los roles del usuario
 */
export function getAccessibleRoutes(
  userRoles: UserRole[],
  allRoutes: string[]
): string[] {
  return allRoutes.filter(route => hasRouteAccess(userRoles, route));
}

/**
 * RESUMEN DE PERMISOS POR ROL
 */
export const ROLE_SUMMARY = {
  ADMIN: {
    name: 'Administrador',
    description: 'Acceso completo a todo el sistema',
    modules: [
      'Dashboard y Analytics',
      'Gestión de Personas (Clientes, Proveedores, Internos)',
      'Productos y Servicios (todos)',
      'Presupuestos (crear, editar, eliminar)',
      'Empresas',
      'Finanzas completas (ganancia, pagos a admins)',
      'Gastos operativos',
      'Recibos',
      'Configuración (Impuestos, Monedas)',
      'Análisis de rentabilidad',
      'Historial de precios',
    ],
  },
  
  CONTADOR: {
    name: 'Contador',
    description: 'Gestión comercial y contable',
    modules: [
      'Dashboard y Analytics',
      'Gestión de Clientes',
      'Gestión de Proveedores (invitar)',
      'Productos y Servicios (todos)',
      'Presupuestos (crear, editar BORRADOR)',
      'Empresas',
      'Gastos operativos',
      'Recibos',
      'Historial de precios',
    ],
    restrictions: [
      '❌ No puede ver finanzas completas (ganancia, pagos a admins)',
      '❌ No puede gestionar impuestos ni monedas',
      '❌ No puede editar presupuestos ENVIADOS o APROBADOS',
      '❌ No puede eliminar presupuestos',
      '❌ No puede ver análisis de rentabilidad',
      '❌ No puede crear usuarios internos',
    ],
  },
  
  PROVEEDOR: {
    name: 'Proveedor',
    description: 'Acceso limitado a sus productos y servicios',
    modules: [
      'Dashboard (vista limitada)',
      'Productos propios (crear, editar, ver)',
      'Servicios propios (crear, editar, ver)',
      'Presupuestos que incluyen sus productos (solo lectura)',
    ],
    restrictions: [
      '❌ No puede ver clientes ni empresas',
      '❌ No puede crear presupuestos',
      '❌ No puede ver finanzas',
      '❌ No puede ver gastos operativos',
      '❌ No puede ver recibos',
      '❌ No puede acceder a configuración',
      '❌ No puede ver productos/servicios de otros proveedores',
      '❌ No puede invitar o gestionar otros usuarios',
    ],
  },
} as const;

export default ROUTE_PERMISSIONS;


