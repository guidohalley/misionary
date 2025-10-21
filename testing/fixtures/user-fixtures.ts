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
    email: process.env.ADMIN_EMAIL || 'guido@misionary',
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
  ADMIN: process.env.ADMIN_PASSWORD || '4C0@Cs4^6WuK@jci',
  CONTADOR: process.env.CONTADOR_PASSWORD || 'TestPassword123!',
  PROVEEDOR: process.env.PROVEEDOR_PASSWORD || 'TestPassword123!',
  CLIENTE: process.env.CLIENTE_PASSWORD || 'TestPassword123!'
};

/**
 * Datos de prueba para clientes (Agencia Digital)
 */
export const TEST_CLIENTES = {
  PERSONA_FISICA: {
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    telefono: '+54 9 11 1234-5678',
    direccion: 'Av. Corrientes 1234, CABA',
    tipo: 'PERSONA' as const
  },
  
  PYME: {
    nombre: 'RestaurantePyme S.R.L.',
    email: 'info@restaurantepyme.com',
    telefono: '+54 11 4567-8901',
    direccion: 'Av. Santa Fe 5678, CABA',
    tipo: 'EMPRESA' as const
  },
  
  STARTUP: {
    nombre: 'TechStartup Argentina',
    email: 'contacto@techstartup.com.ar',
    telefono: '+54 9 11 5555-6666',
    direccion: 'Distrito Tecnológico, Parque Patricios, CABA',
    tipo: 'EMPRESA' as const
  },
  
  EMPRENDEDOR: {
    nombre: 'María García - Consultora',
    email: 'maria@consultora.com',
    telefono: '+54 9 11 7777-8888',
    direccion: 'Palermo Soho, CABA',
    tipo: 'PERSONA' as const
  }
};

/**
 * Datos de prueba para presupuestos (Agencia Digital)
 */
export const TEST_PRESUPUESTOS = {
  PAGINA_WEB: {
    cliente: 'RestaurantePyme S.R.L.',
    total: 150000,
    impuestos: 3675, // 2.45%
    fecha: '2024-01-15',
    estado: 'BORRADOR' as const
  },
  
  ECOMMERCE_COMPLETO: {
    cliente: 'TechStartup Argentina',
    total: 500000,
    impuestos: 12250, // 2.45%
    fecha: '2024-01-20',
    estado: 'ENVIADO' as const
  },
  
  MANTENIMIENTO_ANUAL: {
    cliente: 'María García - Consultora',
    total: 420000, // 35000 x 12 meses
    impuestos: 10290, // 2.45%
    fecha: '2024-01-25',
    estado: 'APROBADO' as const
  },
  
  MARKETING_MENSUAL: {
    cliente: 'RestaurantePyme S.R.L.',
    total: 80000,
    impuestos: 1960, // 2.45%
    fecha: '2024-01-30',
    estado: 'BORRADOR' as const
  }
};

/**
 * Datos de prueba para productos (Agencia Digital)
 */
export const TEST_PRODUCTOS = {
  PAGINA_WEB_BASICA: {
    nombre: 'Página Web Básica',
    descripcion: 'Sitio web institucional con diseño responsive',
    precio: 150000,
    stock: 999,
    categoria: 'WEB'
  },
  
  ECOMMERCE: {
    nombre: 'Tienda Online E-commerce',
    descripcion: 'Plataforma de comercio electrónico completa',
    precio: 500000,
    stock: 999,
    categoria: 'WEB'
  },
  
  LANDING_PAGE: {
    nombre: 'Landing Page Conversión',
    descripcion: 'Página de aterrizaje optimizada para conversión',
    precio: 80000,
    stock: 999,
    categoria: 'WEB'
  }
};

/**
 * Datos de prueba para servicios (Agencia Digital)
 */
export const TEST_SERVICIOS = {
  MANTENIMIENTO_WEB: {
    nombre: 'Mantenimiento Web Mensual',
    descripcion: 'Mantenimiento y actualización de sitio web',
    precio: 35000,
    duracion: 30, // días
    categoria: 'MANTENIMIENTO'
  },
  
  MARKETING_DIGITAL: {
    nombre: 'Gestión Marketing Digital',
    descripcion: 'Gestión de redes sociales y campañas publicitarias',
    precio: 80000,
    duracion: 30,
    categoria: 'MARKETING'
  },
  
  PRODUCCION_AUDIOVISUAL: {
    nombre: 'Producción Audiovisual',
    descripcion: 'Video corporativo profesional con edición',
    precio: 150000,
    duracion: 15,
    categoria: 'AUDIOVISUAL'
  },
  
  SEO: {
    nombre: 'Optimización SEO',
    descripcion: 'Posicionamiento en buscadores - Plan mensual',
    precio: 60000,
    duracion: 30,
    categoria: 'MARKETING'
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

