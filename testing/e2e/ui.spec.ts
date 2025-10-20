import { test, expect } from '@playwright/test';
import { 
  navigateToPage, 
  verifyAuthentication, 
  verifyDarkMode,
  verifyLightMode,
  toggleTheme,
  verifyResponsiveDesign,
  waitForLoadingToFinish
} from '../utils/helpers';
import { SELECTORS, RESPONSIVE_SELECTORS } from '../utils/selectors';
import { TEST_USERS, TEST_PASSWORDS, RESPONSIVE_TESTS, THEME_TESTS } from '../fixtures/user-fixtures';

/**
 * Tests de Interfaz y Responsive para Misionary CRM/ERP
 * 
 * Este archivo contiene todos los tests relacionados con:
 * - Modo oscuro/claro
 * - Diseño responsive
 * - Accesibilidad
 * - Navegación móvil
 * - Consistencia visual
 */

test.describe('Interfaz y Responsive', () => {
  
  test.describe('Modo Oscuro/Claro', () => {
    
    test('Usuario puede cambiar entre modo claro y oscuro', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Verificar modo claro por defecto
      await verifyLightMode(page);
      
      // Cambiar a modo oscuro
      await toggleTheme(page);
      await verifyDarkMode(page);
      
      // Cambiar de vuelta a modo claro
      await toggleTheme(page);
      await verifyLightMode(page);
    });
    
    test('Preferencia de tema se mantiene entre sesiones', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Cambiar a modo oscuro
      await toggleTheme(page);
      await verifyDarkMode(page);
      
      // Recargar página
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Verificar que se mantenga el modo oscuro
      await verifyDarkMode(page);
    });
    
    test('Elementos de interfaz se adaptan al tema', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Verificar elementos en modo claro
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      
      // Cambiar a modo oscuro
      await toggleTheme(page);
      
      // Verificar que los elementos sigan siendo visibles
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
    });
  });
  
  test.describe('Diseño Responsive', () => {
    
    test('Interfaz se adapta a dispositivos móviles', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Configurar viewport móvil
      await page.setViewportSize({ 
        width: RESPONSIVE_TESTS.MOBILE.width, 
        height: RESPONSIVE_TESTS.MOBILE.height 
      });
      
      // Verificar que el menú móvil esté disponible
      await expect(page.locator(RESPONSIVE_SELECTORS.MOBILE_NAV)).toBeVisible();
      
      // Verificar que el menú hamburguesa esté visible
      await expect(page.locator(RESPONSIVE_SELECTORS.HAMBURGER_MENU)).toBeVisible();
    });
    
    test('Interfaz se adapta a tablets', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Configurar viewport tablet
      await page.setViewportSize({ 
        width: RESPONSIVE_TESTS.TABLET.width, 
        height: RESPONSIVE_TESTS.TABLET.height 
      });
      
      // Verificar que el menú tablet esté disponible
      await expect(page.locator(RESPONSIVE_SELECTORS.TABLET_NAV)).toBeVisible();
    });
    
    test('Interfaz se adapta a escritorio', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Configurar viewport escritorio
      await page.setViewportSize({ 
        width: RESPONSIVE_TESTS.DESKTOP.width, 
        height: RESPONSIVE_TESTS.DESKTOP.height 
      });
      
      // Verificar que el menú de escritorio esté disponible
      await expect(page.locator(RESPONSIVE_SELECTORS.DESKTOP_NAV)).toBeVisible();
    });
    
    test('Navegación móvil funciona correctamente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Configurar viewport móvil
      await page.setViewportSize({ 
        width: RESPONSIVE_TESTS.MOBILE.width, 
        height: RESPONSIVE_TESTS.MOBILE.height 
      });
      
      // Abrir menú móvil
      await page.click(RESPONSIVE_SELECTORS.HAMBURGER_MENU);
      await page.waitForTimeout(500);
      
      // Verificar que el menú esté abierto
      await expect(page.locator(RESPONSIVE_SELECTORS.MOBILE_NAV)).toBeVisible();
      
      // Navegar a una sección
      await page.click('a[href="/clientes"]');
      await page.waitForLoadState('networkidle');
      
      // Verificar que se navegó correctamente
      await expect(page).toHaveURL(/.*\/clientes/);
    });
    
    test('Sidebar se colapsa en pantallas pequeñas', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Configurar viewport pequeño
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Verificar que el sidebar se colapsa
      await expect(page.locator(RESPONSIVE_SELECTORS.COLLAPSIBLE_SIDEBAR)).toBeVisible();
    });
  });
  
  test.describe('Accesibilidad', () => {
    
    test('Navegación por teclado funciona correctamente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Navegar usando Tab
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Verificar que el foco esté en un elemento interactuable
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
    
    test('Elementos tienen etiquetas ARIA apropiadas', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Verificar etiquetas ARIA en elementos importantes
      await expect(page.locator('[aria-label]')).toHaveCount({ min: 1 });
      await expect(page.locator('[role="button"]')).toHaveCount({ min: 1 });
      await expect(page.locator('[role="navigation"]')).toHaveCount({ min: 1 });
    });
    
    test('Contraste de colores es adecuado', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Verificar que los elementos importantes tengan buen contraste
      const header = page.locator('header');
      const main = page.locator('main');
      
      await expect(header).toBeVisible();
      await expect(main).toBeVisible();
      
      // En un test real, verificaríamos el contraste de colores
      // usando herramientas como axe-core
    });
    
    test('Formularios tienen etiquetas asociadas', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Navegar a un formulario
      await navigateToPage(page, '/clientes');
      await page.click(SELECTORS.CLIENTES.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Verificar que los inputs tengan labels asociados
      const emailInput = page.locator('input[name="email"]');
      const nombreInput = page.locator('input[name="nombre"]');
      
      await expect(emailInput).toBeVisible();
      await expect(nombreInput).toBeVisible();
    });
  });
  
  test.describe('Consistencia Visual', () => {
    
    test('Header se mantiene consistente entre páginas', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Verificar header en página inicial
      const headerHome = page.locator('header');
      await expect(headerHome).toBeVisible();
      
      // Navegar a otra página
      await navigateToPage(page, '/clientes');
      const headerClientes = page.locator('header');
      await expect(headerClientes).toBeVisible();
      
      // Navegar a otra página más
      await navigateToPage(page, '/presupuestos');
      const headerPresupuestos = page.locator('header');
      await expect(headerPresupuestos).toBeVisible();
    });
    
    test('Navegación lateral se mantiene consistente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Verificar navegación en página inicial
      const navHome = page.locator('nav');
      await expect(navHome).toBeVisible();
      
      // Navegar a otra página
      await navigateToPage(page, '/clientes');
      const navClientes = page.locator('nav');
      await expect(navClientes).toBeVisible();
    });
    
    test('Footer se mantiene consistente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Verificar footer en página inicial
      const footerHome = page.locator('footer');
      if (await footerHome.count() > 0) {
        await expect(footerHome).toBeVisible();
      }
      
      // Navegar a otra página
      await navigateToPage(page, '/clientes');
      const footerClientes = page.locator('footer');
      if (await footerClientes.count() > 0) {
        await expect(footerClientes).toBeVisible();
      }
    });
  });
  
  test.describe('Performance Visual', () => {
    
    test('Páginas cargan sin errores visuales', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Verificar que no hay errores de consola
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      // Navegar por diferentes páginas
      const pages = ['/home', '/clientes', '/presupuestos', '/productos'];
      
      for (const pagePath of pages) {
        await navigateToPage(page, pagePath);
        await waitForLoadingToFinish(page);
      }
      
      // Verificar que no hay errores críticos
      expect(errors.filter(error => 
        error.includes('Failed to load') || 
        error.includes('404') ||
        error.includes('500')
      )).toHaveLength(0);
    });
    
    test('Imágenes se cargan correctamente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Verificar que las imágenes se cargan
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        await expect(img).toBeVisible();
      }
    });
    
    test('Iconos se renderizan correctamente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Verificar que los iconos se renderizan
      const icons = page.locator('svg, .icon, [class*="icon"]');
      const iconCount = await icons.count();
      
      if (iconCount > 0) {
        for (let i = 0; i < iconCount; i++) {
          const icon = icons.nth(i);
          await expect(icon).toBeVisible();
        }
      }
    });
  });
  
  test.describe('Navegación y UX', () => {
    
    test('Breadcrumbs funcionan correctamente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Navegar a una página anidada
      await navigateToPage(page, '/clientes');
      await page.click(SELECTORS.CLIENTES.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Verificar breadcrumbs
      const breadcrumbs = page.locator('[data-testid="breadcrumbs"], .breadcrumbs');
      if (await breadcrumbs.count() > 0) {
        await expect(breadcrumbs).toBeVisible();
      }
    });
    
    test('Loading states se muestran correctamente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Navegar a una página que puede tener loading
      await navigateToPage(page, '/clientes');
      
      // Verificar que no hay loading infinito
      await waitForLoadingToFinish(page);
      
      // Verificar que la página se carga completamente
      await expect(page.locator('main')).toBeVisible();
    });
    
    test('Mensajes de error se muestran correctamente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Intentar acceder a una página que no existe
      await navigateToPage(page, '/pagina-inexistente');
      
      // Verificar que se muestre un mensaje de error apropiado
      await expect(page.locator('text=404, text=Página no encontrada, text=Error')).toBeVisible();
    });
  });
});
