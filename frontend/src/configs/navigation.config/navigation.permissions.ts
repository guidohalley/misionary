/**
 * CONFIGURACIÓN DE NAVEGACIÓN CON PERMISOS
 * Sistema Misionary ERP/CRM
 * 
 * Actualización del menú de navegación lateral con roles asignados correctamente.
 */

import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant';
import type { NavigationTree } from '@/@types/navigation';

/**
 * CONFIGURACIÓN DE NAVEGACIÓN CON ROLES CORRECTOS
 * 
 * Authority (roles permitidos):
 * - [] = visible para todos los usuarios autenticados
 * - ['ADMIN'] = solo administradores
 * - ['ADMIN', 'CONTADOR'] = administradores y contadores
 * - ['ADMIN', 'CONTADOR', 'PROVEEDOR'] = todos los roles
 */
const navigationConfigWithPermissions: NavigationTree[] = [
    // ========================================
    // DASHBOARD
    // ========================================
    {
        key: 'home',
        path: '/home',
        title: 'Dashboard',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['ADMIN', 'CONTADOR', 'PROVEEDOR'], // Todos los usuarios
        subMenu: [],
    },
    {
        key: 'analytics',
        path: '/dashboard/analytics',
        title: 'Proyecciones',
        translateKey: 'nav.analytics',
        icon: 'chartLine',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['ADMIN', 'CONTADOR'], // Solo gestores
        subMenu: [],
    },
    
    // ========================================
    // GESTIÓN DE CATÁLOGOS
    // ========================================
    {
        key: 'catalogos',
        path: '',
        title: 'Catálogos',
        translateKey: 'nav.catalogos.title',
        icon: 'database',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['ADMIN', 'CONTADOR', 'PROVEEDOR'], // Todos ven la sección
        subMenu: [
            {
                key: 'catalogos.productos',
                path: '/productos',
                title: 'Productos',
                translateKey: 'nav.catalogos.productos',
                icon: 'package',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN', 'CONTADOR', 'PROVEEDOR'], // Todos (filtrado en backend)
                subMenu: [],
            },
            {
                key: 'catalogos.servicios',
                path: '/servicios',
                title: 'Servicios',
                translateKey: 'nav.catalogos.servicios',
                icon: 'briefcase',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN', 'CONTADOR', 'PROVEEDOR'], // Todos (filtrado en backend)
                subMenu: [],
            },
            {
                key: 'catalogos.precios',
                path: '/historial-precios',
                title: 'Gestión de Precios',
                translateKey: 'nav.catalogos.precios',
                icon: 'chartBar',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN', 'CONTADOR'], // Solo gestores
                subMenu: [],
            },
        ],
    },

    // ========================================
    // GESTIÓN COMERCIAL
    // ========================================
    {
        key: 'comercial',
        path: '',
        title: 'Gestión Comercial',
        translateKey: 'nav.comercial.title',
        icon: 'briefcase',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['ADMIN', 'CONTADOR'], // Solo gestores ven esta sección
        subMenu: [
            {
                key: 'comercial.clientes',
                path: '/personas?tipo=CLIENTE',
                title: 'Clientes',
                translateKey: 'nav.comercial.clientes',
                icon: 'userGroup',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN', 'CONTADOR'],
                subMenu: [],
            },
            {
                key: 'comercial.empresas',
                path: '/empresas',
                title: 'Empresas',
                translateKey: 'nav.comercial.empresas',
                icon: 'building',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN', 'CONTADOR'],
                subMenu: [],
            },
            {
                key: 'comercial.proveedores',
                path: '/personas?tipo=PROVEEDOR',
                title: 'Proveedores',
                translateKey: 'nav.comercial.proveedores',
                icon: 'truck',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN', 'CONTADOR'],
                subMenu: [],
            },
            {
                key: 'comercial.presupuestos',
                path: '/presupuestos',
                title: 'Presupuestos',
                translateKey: 'nav.comercial.presupuestos',
                icon: 'calculator',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN', 'CONTADOR'],
                subMenu: [],
            },
        ],
    },

    // ========================================
    // SECCIÓN ESPECIAL PARA PROVEEDORES
    // ========================================
    {
        key: 'mis-presupuestos',
        path: '/presupuestos',
        title: 'Mis Presupuestos',
        translateKey: 'nav.presupuestos.mis',
        icon: 'calculator',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['PROVEEDOR'], // Solo proveedores ven esto
        subMenu: [],
    },

    // ========================================
    // OPERACIONES RÁPIDAS
    // ========================================
    {
        key: 'operaciones',
        path: '',
        title: 'Operaciones Rápidas',
        translateKey: 'nav.operaciones.title',
        icon: 'lightning',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['ADMIN', 'CONTADOR'], // Solo gestores
        subMenu: [
            {
                key: 'operaciones.nuevo-cliente',
                path: '/personas/cliente/new',
                title: 'Nuevo Cliente con Empresa',
                translateKey: 'nav.operaciones.nuevoClienteConEmpresa',
                icon: 'userAdd',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN', 'CONTADOR'],
                subMenu: [],
            },
            {
                key: 'operaciones.nuevo-proveedor',
                path: '/personas/proveedor/new',
                title: 'Nuevo Proveedor',
                translateKey: 'nav.operaciones.nuevoProveedor',
                icon: 'buildingAdd',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN', 'CONTADOR'],
                subMenu: [],
            },
            {
                key: 'operaciones.nuevo-presupuesto',
                path: '/presupuestos/new',
                title: 'Nuevo Presupuesto',
                translateKey: 'nav.operaciones.nuevoPresupuesto',
                icon: 'documentAdd',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN', 'CONTADOR'],
                subMenu: [],
            },
            {
                key: 'operaciones.nuevo-gasto',
                path: '/gastos/new',
                title: 'Nuevo Gasto',
                translateKey: 'nav.operaciones.nuevoGasto',
                icon: 'receiptAdd',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN', 'CONTADOR'],
                subMenu: [],
            },
            {
                key: 'operaciones.nuevo-usuario',
                path: '/personas/interno/new',
                title: 'Nuevo Usuario Interno',
                translateKey: 'nav.operaciones.nuevoUsuario',
                icon: 'userPlus',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'], // Solo admins
                subMenu: [],
            },
        ],
    },

    // ========================================
    // OPERACIONES RÁPIDAS PARA PROVEEDORES
    // ========================================
    {
        key: 'operaciones-proveedor',
        path: '',
        title: 'Mis Operaciones',
        translateKey: 'nav.operaciones.proveedor.title',
        icon: 'lightning',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['PROVEEDOR'], // Solo proveedores
        subMenu: [
            {
                key: 'operaciones-proveedor.nuevo-producto',
                path: '/productos/new',
                title: 'Nuevo Producto',
                translateKey: 'nav.operaciones.proveedor.nuevoProducto',
                icon: 'packageAdd',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['PROVEEDOR'],
                subMenu: [],
            },
            {
                key: 'operaciones-proveedor.nuevo-servicio',
                path: '/servicios/new',
                title: 'Nuevo Servicio',
                translateKey: 'nav.operaciones.proveedor.nuevoServicio',
                icon: 'briefcaseAdd',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['PROVEEDOR'],
                subMenu: [],
            },
        ],
    },
    
    // ========================================
    // FINANZAS Y CONTROL
    // ========================================
    {
        key: 'finanzas',
        path: '',
        title: 'Finanzas y Control',
        translateKey: 'nav.finanzas.title',
        icon: 'chartLine',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['ADMIN', 'CONTADOR'], // Solo gestores ven la sección
        subMenu: [
            {
                key: 'finanzas.resumen',
                path: '/finanzas',
                title: 'Resumen Financiero',
                translateKey: 'nav.finanzas.resumen',
                icon: 'chartLine',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'], // Solo admin ve finanzas completas
                subMenu: [],
            },
            {
                key: 'finanzas.gastos',
                path: '/gastos',
                title: 'Gastos Operativos',
                translateKey: 'nav.finanzas.gastos',
                icon: 'cash',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN', 'CONTADOR'], // Gestores
                subMenu: [],
            },
            {
                key: 'finanzas.rentabilidad',
                path: '/gastos/rentabilidad',
                title: 'Análisis de Rentabilidad',
                translateKey: 'nav.finanzas.rentabilidad',
                icon: 'trendingUp',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'], // Solo admin
                subMenu: [],
            },
            {
                key: 'finanzas.recibos',
                path: '/recibos',
                title: 'Recibos',
                translateKey: 'nav.finanzas.recibos',
                icon: 'receipt',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN', 'CONTADOR'], // Gestores
                subMenu: [],
            },
        ],
    },

    // ========================================
    // CONFIGURACIÓN
    // ========================================
    {
        key: 'configuracion',
        path: '',
        title: 'Configuración',
        translateKey: 'nav.configuracion.title',
        icon: 'cog',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['ADMIN'], // Solo admin ve configuración
        subMenu: [
            {
                key: 'configuracion.monedas',
                path: '/monedas',
                title: 'Monedas',
                translateKey: 'nav.configuracion.monedas',
                icon: 'currency',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: [],
            },
            {
                key: 'configuracion.impuestos',
                path: '/impuestos',
                title: 'Impuestos',
                translateKey: 'nav.configuracion.impuestos',
                icon: 'percentage',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: [],
            },
        ],
    },
];

/**
 * RESUMEN DE NAVEGACIÓN POR ROL
 */
export const NAVIGATION_SUMMARY = {
    ADMIN: {
        sections: [
            'Dashboard',
            'Proyecciones',
            'Catálogos (Productos, Servicios, Precios)',
            'Gestión Comercial (Clientes, Empresas, Proveedores, Presupuestos)',
            'Operaciones Rápidas (todos)',
            'Finanzas y Control (completo)',
            'Configuración',
        ],
        total_items: 23,
    },
    
    CONTADOR: {
        sections: [
            'Dashboard',
            'Proyecciones',
            'Catálogos (Productos, Servicios, Precios)',
            'Gestión Comercial (Clientes, Empresas, Proveedores, Presupuestos)',
            'Operaciones Rápidas (sin crear usuarios internos)',
            'Finanzas y Control (sin resumen financiero ni rentabilidad)',
        ],
        total_items: 17,
    },
    
    PROVEEDOR: {
        sections: [
            'Dashboard',
            'Catálogos (solo Productos y Servicios propios)',
            'Mis Presupuestos (filtrados)',
            'Mis Operaciones (Nuevo Producto, Nuevo Servicio)',
        ],
        total_items: 5,
    },
};

export default navigationConfigWithPermissions;


