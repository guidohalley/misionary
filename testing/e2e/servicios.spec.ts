import { test, expect } from '@playwright/test';
import { 
  navigateToPage, 
  verifyAuthentication, 
  verifySuccessMessage,
  verifyErrorMessage,
  waitForLoadingToFinish,
  verifyTableHasData,
  findInTable
} from '../utils/helpers';
import { SELECTORS } from '../utils/selectors';
import { TEST_USERS, TEST_PASSWORDS, TEST_SERVICIOS } from '../fixtures/user-fixtures';

/**
 * Tests de Gestión de Servicios para Misionary CRM/ERP
 * 
 * Este archivo contiene todos los tests relacionados con:
 * - CRUD de servicios
 * - Gestión de duración
 * - Categorías de servicios
 * - Precios y tarifas
 * - Permisos por rol
 */

test.describe('Gestión de Servicios', () => {
  
  test.describe('Creación de Servicios', () => {
    
    test('Admin puede crear un servicio básico', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Navegar a servicios
      await navigateToPage(page, '/servicios');
      await verifyAuthentication(page);
      
      // Crear nuevo servicio
      await page.click(SELECTORS.SERVICIOS.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Llenar formulario
      await page.fill(SELECTORS.SERVICIOS.NOMBRE_INPUT, TEST_SERVICIOS.DESARROLLO.nombre);
      await page.fill(SELECTORS.SERVICIOS.DESCRIPCION_INPUT, TEST_SERVICIOS.DESARROLLO.descripcion);
      await page.fill(SELECTORS.SERVICIOS.PRECIO_INPUT, TEST_SERVICIOS.DESARROLLO.precio.toString());
      await page.fill(SELECTORS.SERVICIOS.DURACION_INPUT, TEST_SERVICIOS.DESARROLLO.duracion.toString());
      await page.selectOption(SELECTORS.SERVICIOS.CATEGORIA_SELECT, TEST_SERVICIOS.DESARROLLO.categoria);
      
      // Guardar servicio
      await page.click(SELECTORS.SERVICIOS.SAVE_BUTTON);
      await waitForLoadingToFinish(page);
      
      // Verificar mensaje de éxito
      await verifySuccessMessage(page, 'Servicio creado correctamente');
    });
    
    test('Proveedor puede crear un servicio', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.PROVEEDOR.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.PROVEEDOR);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/servicios');
      await verifyAuthentication(page);
      
      // Crear nuevo servicio
      await page.click(SELECTORS.SERVICIOS.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Llenar formulario
      await page.fill(SELECTORS.SERVICIOS.NOMBRE_INPUT, TEST_SERVICIOS.MANTENIMIENTO.nombre);
      await page.fill(SELECTORS.SERVICIOS.DESCRIPCION_INPUT, TEST_SERVICIOS.MANTENIMIENTO.descripcion);
      await page.fill(SELECTORS.SERVICIOS.PRECIO_INPUT, TEST_SERVICIOS.MANTENIMIENTO.precio.toString());
      await page.fill(SELECTORS.SERVICIOS.DURACION_INPUT, TEST_SERVICIOS.MANTENIMIENTO.duracion.toString());
      await page.selectOption(SELECTORS.SERVICIOS.CATEGORIA_SELECT, TEST_SERVICIOS.MANTENIMIENTO.categoria);
      
      await page.click(SELECTORS.SERVICIOS.SAVE_BUTTON);
      await waitForLoadingToFinish(page);
      
      await verifySuccessMessage(page, 'Servicio creado correctamente');
    });
    
    test('Validación de campos requeridos', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/servicios');
      await page.click(SELECTORS.SERVICIOS.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Intentar guardar sin llenar campos
      await page.click(SELECTORS.SERVICIOS.SAVE_BUTTON);
      
      // Verificar mensajes de validación
      await expect(page.locator('text=Nombre es requerido')).toBeVisible();
      await expect(page.locator('text=Precio es requerido')).toBeVisible();
    });
    
    test('Validación de precio positivo', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/servicios');
      await page.click(SELECTORS.SERVICIOS.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Llenar con precio negativo
      await page.fill(SELECTORS.SERVICIOS.NOMBRE_INPUT, 'Servicio Test');
      await page.fill(SELECTORS.SERVICIOS.PRECIO_INPUT, '-100');
      await page.click(SELECTORS.SERVICIOS.SAVE_BUTTON);
      
      // Verificar mensaje de error
      await expect(page.locator('text=Precio debe ser positivo')).toBeVisible();
    });
    
    test('Validación de duración positiva', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/servicios');
      await page.click(SELECTORS.SERVICIOS.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Llenar con duración negativa
      await page.fill(SELECTORS.SERVICIOS.NOMBRE_INPUT, 'Servicio Test');
      await page.fill(SELECTORS.SERVICIOS.PRECIO_INPUT, '100');
      await page.fill(SELECTORS.SERVICIOS.DURACION_INPUT, '-10');
      await page.click(SELECTORS.SERVICIOS.SAVE_BUTTON);
      
      // Verificar mensaje de error
      await expect(page.locator('text=Duración debe ser positiva')).toBeVisible();
    });
  });
  
  test.describe('Edición de Servicios', () => {
    
    test('Admin puede editar un servicio existente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/servicios');
      await verifyTableHasData(page, SELECTORS.SERVICIOS.LIST_TABLE);
      
      // Editar primer servicio
      await page.click(SELECTORS.SERVICIOS.EDIT_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Modificar datos
      await page.fill(SELECTORS.SERVICIOS.NOMBRE_INPUT, 'Servicio Modificado');
      await page.fill(SELECTORS.SERVICIOS.PRECIO_INPUT, '150000');
      
      // Guardar cambios
      await page.click(SELECTORS.SERVICIOS.SAVE_BUTTON);
      await waitForLoadingToFinish(page);
      
      await verifySuccessMessage(page, 'Servicio actualizado correctamente');
    });
    
    test('Actualización de duración', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/servicios');
      await page.click(SELECTORS.SERVICIOS.EDIT_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Actualizar duración
      await page.fill(SELECTORS.SERVICIOS.DURACION_INPUT, '45');
      
      await page.click(SELECTORS.SERVICIOS.SAVE_BUTTON);
      await waitForLoadingToFinish(page);
      
      await verifySuccessMessage(page, 'Duración actualizada correctamente');
    });
    
    test('Cambio de categoría', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/servicios');
      await page.click(SELECTORS.SERVICIOS.EDIT_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Cambiar categoría
      await page.selectOption(SELECTORS.SERVICIOS.CATEGORIA_SELECT, 'CONSULTORIA');
      
      await page.click(SELECTORS.SERVICIOS.SAVE_BUTTON);
      await waitForLoadingToFinish(page);
      
      await verifySuccessMessage(page, 'Categoría actualizada correctamente');
    });
  });
  
  test.describe('Eliminación de Servicios', () => {
    
    test('Admin puede eliminar un servicio', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/servicios');
      await verifyTableHasData(page, SELECTORS.SERVICIOS.LIST_TABLE);
      
      // Contar servicios antes de eliminar
      const rowsBefore = await page.locator('tbody tr').count();
      
      // Eliminar primer servicio
      await page.click(SELECTORS.SERVICIOS.DELETE_BUTTON);
      
      // Confirmar eliminación
      await page.click(SELECTORS.MODALS.CONFIRM_BUTTON);
      await waitForLoadingToFinish(page);
      
      // Verificar que se eliminó
      const rowsAfter = await page.locator('tbody tr').count();
      expect(rowsAfter).toBe(rowsBefore - 1);
      
      await verifySuccessMessage(page, 'Servicio eliminado correctamente');
    });
    
    test('No se puede eliminar servicio en uso', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/servicios');
      
      // Buscar servicio en uso
      const serviceInUse = page.locator('tr:has-text("En Uso")').first();
      if (await serviceInUse.count() > 0) {
        await serviceInUse.locator(SELECTORS.SERVICIOS.DELETE_BUTTON).click();
        
        // Verificar mensaje de error
        await verifyErrorMessage(page, 'No se puede eliminar un servicio en uso');
      }
    });
  });
  
  test.describe('Búsqueda y Filtros', () => {
    
    test('Búsqueda de servicios por nombre', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/servicios');
      
      // Buscar por nombre
      await page.fill(SELECTORS.SERVICIOS.SEARCH_INPUT, TEST_SERVICIOS.DESARROLLO.nombre);
      await page.waitForTimeout(1000);
      
      // Verificar que se muestren solo resultados relevantes
      const found = await findInTable(page, TEST_SERVICIOS.DESARROLLO.nombre, SELECTORS.SERVICIOS.LIST_TABLE);
      expect(found).toBe(true);
    });
    
    test('Filtro por categoría', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/servicios');
      
      // Filtrar por categoría DESARROLLO
      await page.selectOption(SELECTORS.SERVICIOS.FILTER_SELECT, 'DESARROLLO');
      await page.waitForTimeout(1000);
      
      // Verificar que solo se muestren servicios de desarrollo
      const rows = page.locator('tbody tr');
      const count = await rows.count();
      
      for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        await expect(row).toContainText('DESARROLLO');
      }
    });
    
    test('Filtro por rango de precio', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/servicios');
      
      // Filtrar por rango de precio
      await page.fill('input[name="precio-min"]', '50000');
      await page.fill('input[name="precio-max"]', '200000');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
      
      // Verificar que solo se muestren servicios en el rango
      const rows = page.locator('tbody tr');
      const count = await rows.count();
      
      for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        const precioText = await row.locator('td:nth-child(3)').textContent();
        const precio = parseFloat(precioText?.replace(/[^0-9.]/g, '') || '0');
        expect(precio).toBeGreaterThanOrEqual(50000);
        expect(precio).toBeLessThanOrEqual(200000);
      }
    });
    
    test('Filtro por duración', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/servicios');
      
      // Filtrar por duración
      await page.selectOption('select[name="duracion-filter"]', '30');
      await page.waitForTimeout(1000);
      
      // Verificar que solo se muestren servicios de 30 días
      const rows = page.locator('tbody tr');
      const count = await rows.count();
      
      for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        await expect(row).toContainText('30');
      }
    });
  });
  
  test.describe('Gestión de Tarifas', () => {
    
    test('Configuración de tarifas por hora', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/servicios');
      await page.click(SELECTORS.SERVICIOS.EDIT_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Configurar tarifa por hora
      await page.check('input[name="tarifa-por-hora"]');
      await page.fill('input[name="precio-por-hora"]', '5000');
      
      await page.click(SELECTORS.SERVICIOS.SAVE_BUTTON);
      await waitForLoadingToFinish(page);
      
      await verifySuccessMessage(page, 'Tarifa configurada correctamente');
    });
    
    test('Configuración de tarifas por proyecto', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/servicios');
      await page.click(SELECTORS.SERVICIOS.EDIT_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Configurar tarifa por proyecto
      await page.check('input[name="tarifa-por-proyecto"]');
      await page.fill('input[name="precio-proyecto"]', '150000');
      
      await page.click(SELECTORS.SERVICIOS.SAVE_BUTTON);
      await waitForLoadingToFinish(page);
      
      await verifySuccessMessage(page, 'Tarifa configurada correctamente');
    });
  });
  
  test.describe('Permisos por Rol', () => {
    
    test('Cliente no puede acceder a gestión de servicios', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.CLIENTE.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.CLIENTE);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Intentar acceder a servicios
      await navigateToPage(page, '/servicios');
      await expect(page.locator('text=Acceso denegado, text=No autorizado')).toBeVisible();
    });
    
    test('Contador no puede crear servicios', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.CONTADOR.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.CONTADOR);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Intentar acceder a servicios
      await navigateToPage(page, '/servicios');
      await expect(page.locator('text=Acceso denegado, text=No autorizado')).toBeVisible();
    });
    
    test('Proveedor puede gestionar sus servicios', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.PROVEEDOR.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.PROVEEDOR);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/servicios');
      await verifyTableHasData(page, SELECTORS.SERVICIOS.LIST_TABLE);
      
      // Verificar que puede crear servicios
      await expect(page.locator(SELECTORS.SERVICIOS.NEW_BUTTON)).toBeVisible();
    });
  });
  
  test.describe('Visualización de Servicios', () => {
    
    test('Vista detallada de servicio', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/servicios');
      await verifyTableHasData(page, SELECTORS.SERVICIOS.LIST_TABLE);
      
      // Hacer clic en nombre del servicio para ver detalles
      await page.click('tbody tr:first-child td:first-child');
      await page.waitForLoadState('networkidle');
      
      // Verificar que se muestren todos los detalles
      await expect(page.locator('text=Nombre')).toBeVisible();
      await expect(page.locator('text=Descripción')).toBeVisible();
      await expect(page.locator('text=Precio')).toBeVisible();
      await expect(page.locator('text=Duración')).toBeVisible();
      await expect(page.locator('text=Categoría')).toBeVisible();
    });
    
    test('Historial de precios del servicio', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/servicios');
      await page.click('tbody tr:first-child td:first-child');
      await page.waitForLoadState('networkidle');
      
      // Buscar sección de historial de precios
      const priceHistory = page.locator('[data-testid="price-history"], .price-history');
      if (await priceHistory.count() > 0) {
        await expect(priceHistory).toBeVisible();
      }
    });
  });
});

