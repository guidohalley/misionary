/**
 * Fixtures de usuarios para testing E2E de Misionary CRM/ERP
 * 
 * Este archivo contiene datos de prueba para diferentes roles y escenarios
 * del sistema Misionary, optimizados para testing automatizado.
 */

import { MisionaryUser } from '../utils/helpers';

/**
 * Usuarios de prueba para diferentes roles
 */
export const TEST_USERS: Record<string, MisionaryUser> = {
  ADMIN: {
    id: 1,
    email: 'admin@misionary.com',
    nombre: 'Administrador Sistema',
    tipo: 'INTERNO',
    roles: ['ADMIN']
  },
  
  CONTADOR: {
    id: 2,
    email: 'contador@misionary.com',
    nombre: 'Contador Principal',
    tipo: 'INTERNO',
    roles: ['CONTADOR']
  },
  
  PROVEEDOR: {
    id: 3,
    email: 'proveedor@misionary.com',
    nombre: 'Proveedor Test',
    tipo: 'PROVEEDOR',
    roles: ['PROVEEDOR']
  },
  
  CLIENTE: {
    id: 4,
    email: 'cliente@misionary.com',
    nombre: 'Cliente Test',
    tipo: 'CLIENTE',
    roles: ['CLIENTE']
  },
  
  // Usuario con múltiples roles
  ADMIN_CONTADOR: {
    id: 5,
    email: 'admin-contador@misionary.com',
    nombre: 'Admin Contador',
    tipo: 'INTERNO',
    roles: ['ADMIN', 'CONTADOR']
  },
  
  // Usuario sin permisos especiales
  USUARIO_BASICO: {
    id: 6,
    email: 'usuario@misionary.com',
    nombre: 'Usuario Básico',
    tipo: 'INTERNO',
    roles: []
  }
};

/**
 * Contraseñas de prueba (en un entorno real, estas serían diferentes)
 */
export const TEST_PASSWORDS = {
  DEFAULT: 'TestPassword123!',
  ADMIN: 'AdminPassword123!',
  CONTADOR: 'ContadorPassword123!',
  PROVEEDOR: 'ProveedorPassword123!',
  CLIENTE: 'ClientePassword123!'
};

/**
 * Datos de prueba para clientes
 */
export const TEST_CLIENTES = {
  PERSONA_FISICA: {
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    telefono: '+54 9 11 1234-5678',
    direccion: 'Av. Corrientes 1234, CABA',
    tipo: 'PERSONA' as const
  },
  
  EMPRESA: {
    nombre: 'Empresa Test S.A.',
    email: 'contacto@empresatest.com',
    telefono: '+54 11 4567-8901',
    direccion: 'Av. Santa Fe 5678, CABA',
    tipo: 'EMPRESA' as const
  },
  
  CLIENTE_INTERNACIONAL: {
    nombre: 'International Corp',
    email: 'info@international.com',
    telefono: '+1 555-0123',
    direccion: '123 Business St, New York, NY',
    tipo: 'EMPRESA' as const
  }
};

/**
 * Datos de prueba para presupuestos
 */
export const TEST_PRESUPUESTOS = {
  BASICO: {
    cliente: 'Juan Pérez',
    total: 10000,
    impuestos: 245, // 2.45%
    fecha: '2024-01-15',
    estado: 'BORRADOR' as const
  },
  
  ALTO_VALOR: {
    cliente: 'Empresa Test S.A.',
    total: 100000,
    impuestos: 2450, // 2.45%
    fecha: '2024-01-20',
    estado: 'ENVIADO' as const
  },
  
  CON_DESCUENTO: {
    cliente: 'Cliente Frecuente',
    total: 5000,
    impuestos: 122.5, // 2.45%
    fecha: '2024-01-25',
    estado: 'APROBADO' as const
  }
};

/**
 * Datos de prueba para productos
 */
export const TEST_PRODUCTOS = {
  SOFTWARE: {
    nombre: 'Software CRM',
    descripcion: 'Sistema de gestión de relaciones con clientes',
    precio: 50000,
    stock: 10,
    categoria: 'SOFTWARE'
  },
  
  HARDWARE: {
    nombre: 'Servidor Dell',
    descripcion: 'Servidor para infraestructura',
    precio: 150000,
    stock: 5,
    categoria: 'HARDWARE'
  },
  
  CONSULTORIA: {
    nombre: 'Consultoría IT',
    descripcion: 'Servicios de consultoría en tecnología',
    precio: 80000,
    stock: 999, // Servicio ilimitado
    categoria: 'SERVICIOS'
  }
};

/**
 * Datos de prueba para servicios
 */
export const TEST_SERVICIOS = {
  DESARROLLO: {
    nombre: 'Desarrollo Web',
    descripcion: 'Desarrollo de aplicaciones web personalizadas',
    precio: 120000,
    duracion: 30, // días
    categoria: 'DESARROLLO'
  },
  
  MANTENIMIENTO: {
    nombre: 'Mantenimiento Mensual',
    descripcion: 'Mantenimiento y soporte técnico mensual',
    precio: 25000,
    duracion: 30,
    categoria: 'MANTENIMIENTO'
  },
  
  CONSULTORIA: {
    nombre: 'Consultoría Estratégica',
    descripcion: 'Consultoría en estrategia de negocio',
    precio: 150000,
    duracion: 60,
    categoria: 'CONSULTORIA'
  }
};

/**
 * Configuraciones de testing por entorno
 */
export const TEST_CONFIG = {
  DEVELOPMENT: {
    baseURL: 'http://localhost:5173',
    timeout: 30000,
    retries: 2
  },
  
  STAGING: {
    baseURL: 'https://staging.misionary.com',
    timeout: 45000,
    retries: 3
  },
  
  PRODUCTION: {
    baseURL: 'https://ad.misionary.com',
    timeout: 60000,
    retries: 5
  }
};

/**
 * Datos de prueba para testing de permisos
 */
export const PERMISSION_TESTS = {
  ADMIN_ACCESS: [
    '/admin',
    '/finanzas',
    '/usuarios',
    '/configuracion'
  ],
  
  CONTADOR_ACCESS: [
    '/finanzas',
    '/reportes',
    '/presupuestos'
  ],
  
  PROVEEDOR_ACCESS: [
    '/productos',
    '/servicios',
    '/catalogo'
  ],
  
  CLIENTE_ACCESS: [
    '/perfil',
    '/mis-presupuestos',
    '/mis-facturas'
  ],
  
  RESTRICTED_PATHS: [
    '/admin',
    '/usuarios',
    '/configuracion'
  ]
};

/**
 * Datos de prueba para testing de responsive
 */
export const RESPONSIVE_TESTS = {
  MOBILE: {
    width: 375,
    height: 667,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
  },
  
  TABLET: {
    width: 768,
    height: 1024,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)'
  },
  
  DESKTOP: {
    width: 1920,
    height: 1080,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
};

/**
 * Datos de prueba para testing de temas
 */
export const THEME_TESTS = {
  LIGHT_MODE: {
    theme: 'light',
    expectedClass: 'light',
    expectedColor: '#ffffff'
  },
  
  DARK_MODE: {
    theme: 'dark',
    expectedClass: 'dark',
    expectedColor: '#1a1a1a'
  }
};

/**
 * Datos de prueba para testing de internacionalización
 */
export const I18N_TESTS = {
  SPANISH: {
    locale: 'es-ES',
    expectedText: 'Bienvenido',
    currency: 'ARS',
    dateFormat: 'DD/MM/YYYY'
  },
  
  ENGLISH: {
    locale: 'en-US',
    expectedText: 'Welcome',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY'
  }
};

/**
 * Datos de prueba para testing de performance
 */
export const PERFORMANCE_TESTS = {
  LOAD_TIMES: {
    PAGE_LOAD: 3000, // 3 segundos
    API_RESPONSE: 2000, // 2 segundos
    RENDER_TIME: 1000 // 1 segundo
  },
  
  MEMORY_LIMITS: {
    HEAP_SIZE: 100 * 1024 * 1024, // 100MB
    DOM_NODES: 10000,
    EVENT_LISTENERS: 1000
  }
};

