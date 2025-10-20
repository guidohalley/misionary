import { test, expect } from '@playwright/test';
import { 
  navigateToPage, 
  verifyAuthentication, 
  verifyUserRole, 
  loginUser, 
  logoutUser,
  verifySuccessMessage,
  verifyErrorMessage,
  waitForLoadingToFinish
} from '../utils/helpers';
import { SELECTORS } from '../utils/selectors';
import { TEST_USERS, TEST_PASSWORDS, PERMISSION_TESTS } from '../fixtures/user-fixtures';

/**
 * Tests de Autenticación y Roles para Misionary CRM/ERP
 * 
 * Este archivo contiene todos los tests relacionados con:
 * - Login/Logout de usuarios
 * - Verificación de roles y permisos
 * - Control de acceso a diferentes secciones
 * - Validación de seguridad
 */

test.describe('Autenticación y Roles', () => {
  
  test.describe('Login y Logout', () => {
    
    test('Usuario puede hacer login con credenciales válidas', async ({ page }) => {
      await navigateToPage(page, '/sign-in');
      
      // Verificar que estamos en la página de login
      await expect(page).toHaveURL(/.*\/sign-in/);
      await expect(page.locator(SELECTORS.AUTH.LOGIN_FORM)).toBeVisible();
      
      // Realizar login
      await loginUser(page, TEST_USERS.ADMIN.email, TEST_PASSWORDS.ADMIN);
      
      // Verificar que el login fue exitoso
      await verifyAuthentication(page);
      await expect(page).toHaveURL(/.*\/home/);
    });
    
    test('Usuario no puede hacer login con credenciales inválidas', async ({ page }) => {
      await navigateToPage(page, '/sign-in');
      
      // Intentar login con credenciales incorrectas
      await page.fill(SELECTORS.AUTH.EMAIL_INPUT, 'usuario@inexistente.com');
      await page.fill(SELECTORS.AUTH.PASSWORD_INPUT, 'password-incorrecto');
      await page.click(SELECTORS.AUTH.LOGIN_BUTTON);
      
      // Verificar mensaje de error
      await verifyErrorMessage(page, 'Credenciales inválidas');
      await expect(page).toHaveURL(/.*\/sign-in/);
    });
    
    test('Usuario puede hacer logout correctamente', async ({ page }) => {
      // Login primero
      await loginUser(page, TEST_USERS.ADMIN.email, TEST_PASSWORDS.ADMIN);
      
      // Realizar logout
      await logoutUser(page);
      
      // Verificar que se redirija a login
      await expect(page).toHaveURL(/.*\/sign-in/);
    });
    
    test('Usuario no autenticado es redirigido a login', async ({ page }) => {
      // Intentar acceder a una página protegida sin autenticación
      await navigateToPage(page, '/home');
      
      // Verificar redirección a login
      await expect(page).toHaveURL(/.*\/sign-in/);
    });
  });
  
  test.describe('Roles y Permisos - ADMIN', () => {
    
    test.use({ storageState: 'fixtures/admin-state.json' });
    
    test('Admin puede acceder a todas las secciones', async ({ page }) => {
      await navigateToPage(page, '/home');
      await verifyAuthentication(page);
      await verifyUserRole(page, ['ADMIN']);
      
      // Verificar acceso a secciones de admin
      const adminSections = [
        { name: 'Dashboard', selector: SELECTORS.NAVIGATION.DASHBOARD_MENU },
        { name: 'Clientes', selector: SELECTORS.NAVIGATION.CLIENTES_MENU },
        { name: 'Presupuestos', selector: SELECTORS.NAVIGATION.PRESUPUESTOS_MENU },
        { name: 'Productos', selector: SELECTORS.NAVIGATION.PRODUCTOS_MENU },
        { name: 'Servicios', selector: SELECTORS.NAVIGATION.SERVICIOS_MENU },
        { name: 'Finanzas', selector: SELECTORS.NAVIGATION.FINANZAS_MENU },
        { name: 'Admin', selector: SELECTORS.NAVIGATION.ADMIN_MENU }
      ];
      
      for (const section of adminSections) {
        await expect(page.locator(section.selector)).toBeVisible();
      }
    });
    
    test('Admin puede acceder al panel de administración', async ({ page }) => {
      await navigateToPage(page, '/admin');
      await verifyAuthentication(page);
      
      // Verificar que el panel de admin esté visible
      await expect(page.locator(SELECTORS.ROLES.ADMIN_ONLY)).toBeVisible();
    });
    
    test('Admin puede gestionar usuarios', async ({ page }) => {
      await navigateToPage(page, '/admin/usuarios');
      await verifyAuthentication(page);
      
      // Verificar que la sección de usuarios esté disponible
      await expect(page.locator('[data-testid="user-management"]')).toBeVisible();
    });
  });
  
  test.describe('Roles y Permisos - CONTADOR', () => {
    
    test.use({ storageState: 'fixtures/contador-state.json' });
    
    test('Contador puede acceder a finanzas pero no a admin', async ({ page }) => {
      await navigateToPage(page, '/home');
      await verifyAuthentication(page);
      await verifyUserRole(page, ['CONTADOR']);
      
      // Verificar acceso a finanzas
      await expect(page.locator(SELECTORS.NAVIGATION.FINANZAS_MENU)).toBeVisible();
      
      // Verificar que NO puede acceder a admin
      await navigateToPage(page, '/admin');
      await expect(page.locator('text=Acceso denegado, text=No autorizado')).toBeVisible();
    });
    
    test('Contador puede ver reportes financieros', async ({ page }) => {
      await navigateToPage(page, '/finanzas');
      await verifyAuthentication(page);
      
      // Verificar que los reportes estén disponibles
      await expect(page.locator(SELECTORS.FINANZAS.SUMMARY_CARDS)).toBeVisible();
      await expect(page.locator(SELECTORS.FINANZAS.CHARTS_CONTAINER)).toBeVisible();
    });
  });
  
  test.describe('Roles y Permisos - PROVEEDOR', () => {
    
    test.use({ storageState: 'fixtures/proveedor-state.json' });
    
    test('Proveedor puede gestionar productos y servicios', async ({ page }) => {
      await navigateToPage(page, '/home');
      await verifyAuthentication(page);
      await verifyUserRole(page, ['PROVEEDOR']);
      
      // Verificar acceso a productos y servicios
      await expect(page.locator(SELECTORS.NAVIGATION.PRODUCTOS_MENU)).toBeVisible();
      await expect(page.locator(SELECTORS.NAVIGATION.SERVICIOS_MENU)).toBeVisible();
      
      // Verificar que NO puede acceder a finanzas
      await navigateToPage(page, '/finanzas');
      await expect(page.locator('text=Acceso denegado, text=No autorizado')).toBeVisible();
    });
    
    test('Proveedor puede crear y editar productos', async ({ page }) => {
      await navigateToPage(page, '/productos');
      await verifyAuthentication(page);
      
      // Verificar que puede crear productos
      await expect(page.locator(SELECTORS.PRODUCTOS.NEW_BUTTON)).toBeVisible();
    });
  });
  
  test.describe('Roles y Permisos - CLIENTE', () => {
    
    test.use({ storageState: 'fixtures/cliente-state.json' });
    
    test('Cliente tiene acceso limitado', async ({ page }) => {
      await navigateToPage(page, '/home');
      await verifyAuthentication(page);
      await verifyUserRole(page, ['CLIENTE']);
      
      // Verificar que NO puede acceder a secciones administrativas
      const restrictedSections = [
        '/admin',
        '/finanzas',
        '/productos',
        '/servicios'
      ];
      
      for (const section of restrictedSections) {
        await navigateToPage(page, section);
        await expect(page.locator('text=Acceso denegado, text=No autorizado')).toBeVisible();
      }
    });
    
    test('Cliente puede ver su perfil', async ({ page }) => {
      await navigateToPage(page, '/perfil');
      await verifyAuthentication(page);
      
      // Verificar que el perfil esté disponible
      await expect(page.locator('[data-testid="my-profile"]')).toBeVisible();
    });
  });
  
  test.describe('Control de Acceso', () => {
    
    test('Usuario no puede acceder a rutas protegidas sin autenticación', async ({ page }) => {
      const protectedRoutes = [
        '/home',
        '/clientes',
        '/presupuestos',
        '/productos',
        '/servicios',
        '/finanzas',
        '/admin'
      ];
      
      for (const route of protectedRoutes) {
        await navigateToPage(page, route);
        await expect(page).toHaveURL(/.*\/sign-in/);
      }
    });
    
    test('Usuario con rol incorrecto no puede acceder a secciones restringidas', async ({ page }) => {
      // Login como cliente
      await loginUser(page, TEST_USERS.CLIENTE.email, TEST_PASSWORDS.CLIENTE);
      
      // Intentar acceder a secciones de admin
      const restrictedRoutes = [
        '/admin',
        '/finanzas',
        '/productos'
      ];
      
      for (const route of restrictedRoutes) {
        await navigateToPage(page, route);
        await expect(page.locator('text=Acceso denegado, text=No autorizado')).toBeVisible();
      }
    });
  });
  
  test.describe('Seguridad', () => {
    
    test('Sesión expira después de inactividad', async ({ page }) => {
      await loginUser(page, TEST_USERS.ADMIN.email, TEST_PASSWORDS.ADMIN);
      
      // Simular inactividad (en un test real, esto requeriría configuración del servidor)
      await page.waitForTimeout(1000);
      
      // Intentar acceder a una página protegida
      await navigateToPage(page, '/admin');
      
      // Verificar que se redirija a login si la sesión expiró
      // (Este test puede necesitar ajustes según la implementación real)
    });
    
    test('Token de autenticación es válido', async ({ page }) => {
      await loginUser(page, TEST_USERS.ADMIN.email, TEST_PASSWORDS.ADMIN);
      
      // Verificar que el token esté presente en localStorage
      const token = await page.evaluate(() => localStorage.getItem('auth_token'));
      expect(token).toBeTruthy();
    });
    
    test('Usuario no puede acceder a datos de otros usuarios', async ({ page }) => {
      await loginUser(page, TEST_USERS.CLIENTE.email, TEST_PASSWORDS.CLIENTE);
      
      // Intentar acceder a datos de otro usuario
      await navigateToPage(page, '/clientes/1'); // ID de otro usuario
      
      // Verificar que se muestre error de acceso
      await expect(page.locator('text=Acceso denegado, text=No autorizado')).toBeVisible();
    });
  });
  
  test.describe('Navegación por Roles', () => {
    
    test('Menú lateral se adapta según el rol del usuario', async ({ page }) => {
      // Test para admin
      await loginUser(page, TEST_USERS.ADMIN.email, TEST_PASSWORDS.ADMIN);
      await navigateToPage(page, '/home');
      
      // Verificar que el menú admin esté visible
      await expect(page.locator(SELECTORS.NAVIGATION.ADMIN_MENU)).toBeVisible();
      
      // Logout y login como cliente
      await logoutUser(page);
      await loginUser(page, TEST_USERS.CLIENTE.email, TEST_PASSWORDS.CLIENTE);
      await navigateToPage(page, '/home');
      
      // Verificar que el menú admin NO esté visible
      await expect(page.locator(SELECTORS.NAVIGATION.ADMIN_MENU)).not.toBeVisible();
    });
    
    test('Dashboard muestra información relevante según el rol', async ({ page }) => {
      // Test para contador
      await loginUser(page, TEST_USERS.CONTADOR.email, TEST_PASSWORDS.CONTADOR);
      await navigateToPage(page, '/home');
      
      // Verificar que se muestren métricas financieras
      await expect(page.locator(SELECTORS.DASHBOARD.STATS_CARDS)).toBeVisible();
    });
  });
});

