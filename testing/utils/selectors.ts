/**
 * Selectores CSS personalizados para el sistema Misionary CRM/ERP
 * 
 * Este archivo centraliza todos los selectores utilizados en los tests,
 * facilitando el mantenimiento y la consistencia.
 */

export const SELECTORS = {
  // Autenticación
  AUTH: {
    LOGIN_FORM: 'form[data-testid="login-form"]',
    EMAIL_INPUT: 'input[name="email"]',
    PASSWORD_INPUT: 'input[name="password"]',
    LOGIN_BUTTON: 'button[type="submit"]',
    LOGOUT_BUTTON: '[data-testid="logout-button"]',
    USER_MENU: '[data-testid="user-menu"]',
    USER_AVATAR: '[data-testid="user-avatar"]',
  },

  // Navegación
  NAVIGATION: {
    SIDEBAR: '[data-testid="sidebar"]',
    MENU_TOGGLE: '[data-testid="menu-toggle"]',
    DASHBOARD_MENU: '[data-testid="menu-dashboard"]',
    CLIENTES_MENU: '[data-testid="menu-clientes"]',
    PRESUPUESTOS_MENU: '[data-testid="menu-presupuestos"]',
    PRODUCTOS_MENU: '[data-testid="menu-productos"]',
    SERVICIOS_MENU: '[data-testid="menu-servicios"]',
    FINANZAS_MENU: '[data-testid="menu-finanzas"]',
    ADMIN_MENU: '[data-testid="menu-admin"]',
  },

  // Dashboard
  DASHBOARD: {
    WELCOME_MESSAGE: '[data-testid="welcome-message"]',
    STATS_CARDS: '[data-testid="stats-card"]',
    RECENT_ACTIVITY: '[data-testid="recent-activity"]',
    QUICK_ACTIONS: '[data-testid="quick-actions"]',
  },

  // Clientes
  CLIENTES: {
    LIST_TABLE: '[data-testid="clientes-table"]',
    NEW_BUTTON: '[data-testid="new-cliente-button"]',
    EDIT_BUTTON: '[data-testid="edit-cliente-button"]',
    DELETE_BUTTON: '[data-testid="delete-cliente-button"]',
    SEARCH_INPUT: '[data-testid="clientes-search"]',
    FILTER_SELECT: '[data-testid="clientes-filter"]',
    
    // Formulario
    FORM: '[data-testid="cliente-form"]',
    NOMBRE_INPUT: 'input[name="nombre"]',
    EMAIL_INPUT: 'input[name="email"]',
    TELEFONO_INPUT: 'input[name="telefono"]',
    DIRECCION_INPUT: 'textarea[name="direccion"]',
    TIPO_SELECT: 'select[name="tipo"]',
    SAVE_BUTTON: 'button[type="submit"]',
    CANCEL_BUTTON: '[data-testid="cancel-button"]',
  },

  // Presupuestos
  PRESUPUESTOS: {
    LIST_TABLE: '[data-testid="presupuestos-table"]',
    NEW_BUTTON: '[data-testid="new-presupuesto-button"]',
    EDIT_BUTTON: '[data-testid="edit-presupuesto-button"]',
    DELETE_BUTTON: '[data-testid="delete-presupuesto-button"]',
    VIEW_BUTTON: '[data-testid="view-presupuesto-button"]',
    SEARCH_INPUT: '[data-testid="presupuestos-search"]',
    FILTER_SELECT: '[data-testid="presupuestos-filter"]',
    
    // Formulario
    FORM: '[data-testid="presupuesto-form"]',
    CLIENTE_INPUT: 'input[name="cliente"]',
    TOTAL_INPUT: 'input[name="total"]',
    FECHA_INPUT: 'input[name="fecha"]',
    ESTADO_SELECT: 'select[name="estado"]',
    IMPUESTOS_DISPLAY: '[data-testid="impuestos-display"]',
    SAVE_BUTTON: 'button[type="submit"]',
    CANCEL_BUTTON: '[data-testid="cancel-button"]',
  },

  // Productos
  PRODUCTOS: {
    LIST_TABLE: '[data-testid="productos-table"]',
    NEW_BUTTON: '[data-testid="new-producto-button"]',
    EDIT_BUTTON: '[data-testid="edit-producto-button"]',
    DELETE_BUTTON: '[data-testid="delete-producto-button"]',
    SEARCH_INPUT: '[data-testid="productos-search"]',
    FILTER_SELECT: '[data-testid="productos-filter"]',
    
    // Formulario
    FORM: '[data-testid="producto-form"]',
    NOMBRE_INPUT: 'input[name="nombre"]',
    DESCRIPCION_INPUT: 'textarea[name="descripcion"]',
    PRECIO_INPUT: 'input[name="precio"]',
    STOCK_INPUT: 'input[name="stock"]',
    CATEGORIA_SELECT: 'select[name="categoria"]',
    SAVE_BUTTON: 'button[type="submit"]',
    CANCEL_BUTTON: '[data-testid="cancel-button"]',
  },

  // Servicios
  SERVICIOS: {
    LIST_TABLE: '[data-testid="servicios-table"]',
    NEW_BUTTON: '[data-testid="new-servicio-button"]',
    EDIT_BUTTON: '[data-testid="edit-servicio-button"]',
    DELETE_BUTTON: '[data-testid="delete-servicio-button"]',
    SEARCH_INPUT: '[data-testid="servicios-search"]',
    FILTER_SELECT: '[data-testid="servicios-filter"]',
    
    // Formulario
    FORM: '[data-testid="servicio-form"]',
    NOMBRE_INPUT: 'input[name="nombre"]',
    DESCRIPCION_INPUT: 'textarea[name="descripcion"]',
    PRECIO_INPUT: 'input[name="precio"]',
    DURACION_INPUT: 'input[name="duracion"]',
    CATEGORIA_SELECT: 'select[name="categoria"]',
    SAVE_BUTTON: 'button[type="submit"]',
    CANCEL_BUTTON: '[data-testid="cancel-button"]',
  },

  // Finanzas
  FINANZAS: {
    SUMMARY_CARDS: '[data-testid="finanzas-summary"]',
    CHARTS_CONTAINER: '[data-testid="finanzas-charts"]',
    TRANSACTIONS_TABLE: '[data-testid="transactions-table"]',
    FILTER_DATE_RANGE: '[data-testid="date-range-filter"]',
    EXPORT_BUTTON: '[data-testid="export-button"]',
  },

  // Mensajes y Notificaciones
  MESSAGES: {
    SUCCESS_TOAST: '.toast-success, .alert-success',
    ERROR_TOAST: '.toast-error, .alert-error',
    INFO_TOAST: '.toast-info, .alert-info',
    WARNING_TOAST: '.toast-warning, .alert-warning',
    LOADING_SPINNER: '.loading, .spinner, [data-testid="loading"]',
  },

  // Modales
  MODALS: {
    CONFIRM_DELETE: '[data-testid="confirm-delete-modal"]',
    CONFIRM_BUTTON: '[data-testid="confirm-button"]',
    CANCEL_BUTTON: '[data-testid="cancel-button"]',
    CLOSE_BUTTON: '[data-testid="close-button"]',
  },

  // Tema
  THEME: {
    TOGGLE_BUTTON: '[data-testid="theme-toggle"]',
    DARK_MODE_CLASS: '.dark',
    LIGHT_MODE_CLASS: '.light',
  },

  // Responsive
  RESPONSIVE: {
    MOBILE_MENU: '[data-testid="mobile-menu"]',
    DESKTOP_SIDEBAR: '[data-testid="desktop-sidebar"]',
    COLLAPSIBLE_SIDEBAR: '[data-testid="collapsible-sidebar"]',
  },

  // Tablas
  TABLES: {
    HEADER: 'thead th',
    ROW: 'tbody tr',
    CELL: 'td',
    PAGINATION: '[data-testid="pagination"]',
    SORT_BUTTON: '[data-testid="sort-button"]',
    FILTER_INPUT: '[data-testid="filter-input"]',
  },

  // Formularios
  FORMS: {
    REQUIRED_FIELD: '[required]',
    VALIDATION_ERROR: '.error, .invalid, [data-testid="validation-error"]',
    SUBMIT_BUTTON: 'button[type="submit"]',
    RESET_BUTTON: 'button[type="reset"]',
  },

  // Roles y Permisos
  ROLES: {
    ADMIN_ONLY: '[data-testid="admin-only"]',
    CONTADOR_ONLY: '[data-testid="contador-only"]',
    PROVEEDOR_ONLY: '[data-testid="proveedor-only"]',
    CLIENTE_ONLY: '[data-testid="cliente-only"]',
  },
} as const;

/**
 * Selectores específicos por rol
 */
export const ROLE_SELECTORS = {
  ADMIN: {
    ...SELECTORS,
    ADMIN_PANEL: '[data-testid="admin-panel"]',
    USER_MANAGEMENT: '[data-testid="user-management"]',
    SYSTEM_SETTINGS: '[data-testid="system-settings"]',
  },
  
  CONTADOR: {
    ...SELECTORS,
    FINANCIAL_REPORTS: '[data-testid="financial-reports"]',
    TAX_CALCULATIONS: '[data-testid="tax-calculations"]',
    BUDGET_ANALYSIS: '[data-testid="budget-analysis"]',
  },
  
  PROVEEDOR: {
    ...SELECTORS,
    PRODUCT_CATALOG: '[data-testid="product-catalog"]',
    SERVICE_CATALOG: '[data-testid="service-catalog"]',
    PRICE_MANAGEMENT: '[data-testid="price-management"]',
  },
  
  CLIENTE: {
    ...SELECTORS,
    MY_PROFILE: '[data-testid="my-profile"]',
    MY_ORDERS: '[data-testid="my-orders"]',
    MY_QUOTES: '[data-testid="my-quotes"]',
  },
} as const;

/**
 * Selectores para testing de accesibilidad
 */
export const ACCESSIBILITY_SELECTORS = {
  ARIA_LABELS: '[aria-label]',
  ARIA_DESCRIBEDBY: '[aria-describedby]',
  ARIA_EXPANDED: '[aria-expanded]',
  ARIA_SELECTED: '[aria-selected]',
  ARIA_DISABLED: '[aria-disabled]',
  ROLE_BUTTON: '[role="button"]',
  ROLE_LINK: '[role="link"]',
  ROLE_TAB: '[role="tab"]',
  ROLE_TABPANEL: '[role="tabpanel"]',
  FOCUSABLE: 'button, input, select, textarea, a[href], [tabindex]',
} as const;

/**
 * Selectores para testing de responsive
 */
export const RESPONSIVE_SELECTORS = {
  MOBILE_NAV: '[data-testid="mobile-navigation"]',
  DESKTOP_NAV: '[data-testid="desktop-navigation"]',
  TABLET_NAV: '[data-testid="tablet-navigation"]',
  COLLAPSIBLE_CONTENT: '[data-testid="collapsible-content"]',
  HAMBURGER_MENU: '[data-testid="hamburger-menu"]',
} as const;

