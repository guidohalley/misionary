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
import { TEST_USERS, TEST_PASSWORDS, TEST_PRODUCTOS } from '../fixtures/user-fixtures';

/**
 * Tests de Gestión de Productos para Misionary CRM/ERP
 * 
 * Este archivo contiene todos los tests relacionados con:
 * - CRUD de productos
 * - Gestión de stock
 * - Categorías de productos
 * - Precios y descuentos
 * - Permisos por rol
 */

test.describe('Gestión de Productos', () => {
  
  test.describe('Creación de Productos', () => {
    
    test('Admin puede crear un producto básico', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Navegar a productos
      await navigateToPage(page, '/productos');
      await verifyAuthentication(page);
      
      // Crear nuevo producto
      await page.click(SELECTORS.PRODUCTOS.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Llenar formulario
      await page.fill(SELECTORS.PRODUCTOS.NOMBRE_INPUT, TEST_PRODUCTOS.SOFTWARE.nombre);
      await page.fill(SELECTORS.PRODUCTOS.DESCRIPCION_INPUT, TEST_PRODUCTOS.SOFTWARE.descripcion);
      await page.fill(SELECTORS.PRODUCTOS.PRECIO_INPUT, TEST_PRODUCTOS.SOFTWARE.precio.toString());
      await page.fill(SELECTORS.PRODUCTOS.STOCK_INPUT, TEST_PRODUCTOS.SOFTWARE.stock.toString());
      await page.selectOption(SELECTORS.PRODUCTOS.CATEGORIA_SELECT, TEST_PRODUCTOS.SOFTWARE.categoria);
      
      // Guardar producto
      await page.click(SELECTORS.PRODUCTOS.SAVE_BUTTON);
      await waitForLoadingToFinish(page);
      
      // Verificar mensaje de éxito
      await verifySuccessMessage(page, 'Producto creado correctamente');
    });
    
    test('Proveedor puede crear un producto', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.PROVEEDOR.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.PROVEEDOR);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/productos');
      await verifyAuthentication(page);
      
      // Crear nuevo producto
      await page.click(SELECTORS.PRODUCTOS.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Llenar formulario
      await page.fill(SELECTORS.PRODUCTOS.NOMBRE_INPUT, TEST_PRODUCTOS.HARDWARE.nombre);
      await page.fill(SELECTORS.PRODUCTOS.DESCRIPCION_INPUT, TEST_PRODUCTOS.HARDWARE.descripcion);
      await page.fill(SELECTORS.PRODUCTOS.PRECIO_INPUT, TEST_PRODUCTOS.HARDWARE.precio.toString());
      await page.fill(SELECTORS.PRODUCTOS.STOCK_INPUT, TEST_PRODUCTOS.HARDWARE.stock.toString());
      await page.selectOption(SELECTORS.PRODUCTOS.CATEGORIA_SELECT, TEST_PRODUCTOS.HARDWARE.categoria);
      
      await page.click(SELECTORS.PRODUCTOS.SAVE_BUTTON);
      await waitForLoadingToFinish(page);
      
      await verifySuccessMessage(page, 'Producto creado correctamente');
    });
    
    test('Validación de campos requeridos', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/productos');
      await page.click(SELECTORS.PRODUCTOS.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Intentar guardar sin llenar campos
      await page.click(SELECTORS.PRODUCTOS.SAVE_BUTTON);
      
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
      
      await navigateToPage(page, '/productos');
      await page.click(SELECTORS.PRODUCTOS.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Llenar con precio negativo
      await page.fill(SELECTORS.PRODUCTOS.NOMBRE_INPUT, 'Producto Test');
      await page.fill(SELECTORS.PRODUCTOS.PRECIO_INPUT, '-100');
      await page.click(SELECTORS.PRODUCTOS.SAVE_BUTTON);
      
      // Verificar mensaje de error
      await expect(page.locator('text=Precio debe ser positivo')).toBeVisible();
    });
    
    test('Validación de stock no negativo', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/productos');
      await page.click(SELECTORS.PRODUCTOS.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Llenar con stock negativo
      await page.fill(SELECTORS.PRODUCTOS.NOMBRE_INPUT, 'Producto Test');
      await page.fill(SELECTORS.PRODUCTOS.PRECIO_INPUT, '100');
      await page.fill(SELECTORS.PRODUCTOS.STOCK_INPUT, '-10');
      await page.click(SELECTORS.PRODUCTOS.SAVE_BUTTON);
      
      // Verificar mensaje de error
      await expect(page.locator('text=Stock no puede ser negativo')).toBeVisible();
    });
  });
  
  test.describe('Edición de Productos', () => {
    
    test('Admin puede editar un producto existente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/productos');
      await verifyTableHasData(page, SELECTORS.PRODUCTOS.LIST_TABLE);
      
      // Editar primer producto
      await page.click(SELECTORS.PRODUCTOS.EDIT_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Modificar datos
      await page.fill(SELECTORS.PRODUCTOS.NOMBRE_INPUT, 'Producto Modificado');
      await page.fill(SELECTORS.PRODUCTOS.PRECIO_INPUT, '75000');
      
      // Guardar cambios
      await page.click(SELECTORS.PRODUCTOS.SAVE_BUTTON);
      await waitForLoadingToFinish(page);
      
      await verifySuccessMessage(page, 'Producto actualizado correctamente');
    });
    
    test('Actualización de stock', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/productos');
      await page.click(SELECTORS.PRODUCTOS.EDIT_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Actualizar stock
      await page.fill(SELECTORS.PRODUCTOS.STOCK_INPUT, '25');
      
      await page.click(SELECTORS.PRODUCTOS.SAVE_BUTTON);
      await waitForLoadingToFinish(page);
      
      await verifySuccessMessage(page, 'Stock actualizado correctamente');
    });
    
    test('Cambio de categoría', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/productos');
      await page.click(SELECTORS.PRODUCTOS.EDIT_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Cambiar categoría
      await page.selectOption(SELECTORS.PRODUCTOS.CATEGORIA_SELECT, 'HARDWARE');
      
      await page.click(SELECTORS.PRODUCTOS.SAVE_BUTTON);
      await waitForLoadingToFinish(page);
      
      await verifySuccessMessage(page, 'Categoría actualizada correctamente');
    });
  });
  
  test.describe('Eliminación de Productos', () => {
    
    test('Admin puede eliminar un producto', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/productos');
      await verifyTableHasData(page, SELECTORS.PRODUCTOS.LIST_TABLE);
      
      // Contar productos antes de eliminar
      const rowsBefore = await page.locator('tbody tr').count();
      
      // Eliminar primer producto
      await page.click(SELECTORS.PRODUCTOS.DELETE_BUTTON);
      
      // Confirmar eliminación
      await page.click(SELECTORS.MODALS.CONFIRM_BUTTON);
      await waitForLoadingToFinish(page);
      
      // Verificar que se eliminó
      const rowsAfter = await page.locator('tbody tr').count();
      expect(rowsAfter).toBe(rowsBefore - 1);
      
      await verifySuccessMessage(page, 'Producto eliminado correctamente');
    });
    
    test('No se puede eliminar producto con stock en uso', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/productos');
      
      // Buscar producto con stock en uso
      const productInUse = page.locator('tr:has-text("En Uso")').first();
      if (await productInUse.count() > 0) {
        await productInUse.locator(SELECTORS.PRODUCTOS.DELETE_BUTTON).click();
        
        // Verificar mensaje de error
        await verifyErrorMessage(page, 'No se puede eliminar un producto con stock en uso');
      }
    });
  });
  
  test.describe('Búsqueda y Filtros', () => {
    
    test('Búsqueda de productos por nombre', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/productos');
      
      // Buscar por nombre
      await page.fill(SELECTORS.PRODUCTOS.SEARCH_INPUT, TEST_PRODUCTOS.SOFTWARE.nombre);
      await page.waitForTimeout(1000);
      
      // Verificar que se muestren solo resultados relevantes
      const found = await findInTable(page, TEST_PRODUCTOS.SOFTWARE.nombre, SELECTORS.PRODUCTOS.LIST_TABLE);
      expect(found).toBe(true);
    });
    
    test('Filtro por categoría', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/productos');
      
      // Filtrar por categoría SOFTWARE
      await page.selectOption(SELECTORS.PRODUCTOS.FILTER_SELECT, 'SOFTWARE');
      await page.waitForTimeout(1000);
      
      // Verificar que solo se muestren productos de software
      const rows = page.locator('tbody tr');
      const count = await rows.count();
      
      for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        await expect(row).toContainText('SOFTWARE');
      }
    });
    
    test('Filtro por rango de precio', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/productos');
      
      // Filtrar por rango de precio
      await page.fill('input[name="precio-min"]', '10000');
      await page.fill('input[name="precio-max"]', '100000');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
      
      // Verificar que solo se muestren productos en el rango
      const rows = page.locator('tbody tr');
      const count = await rows.count();
      
      for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        const precioText = await row.locator('td:nth-child(3)').textContent();
        const precio = parseFloat(precioText?.replace(/[^0-9.]/g, '') || '0');
        expect(precio).toBeGreaterThanOrEqual(10000);
        expect(precio).toBeLessThanOrEqual(100000);
      }
    });
  });
  
  test.describe('Gestión de Stock', () => {
    
    test('Actualización de stock desde la lista', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/productos');
      
      // Buscar campo de stock en la tabla
      const stockInput = page.locator('input[name="stock"]').first();
      if (await stockInput.count() > 0) {
        await stockInput.fill('15');
        await stockInput.press('Enter');
        await page.waitForTimeout(1000);
        
        await verifySuccessMessage(page, 'Stock actualizado correctamente');
      }
    });
    
    test('Alerta de stock bajo', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/productos');
      
      // Buscar producto con stock bajo
      const lowStockProduct = page.locator('tr:has-text("Stock Bajo")').first();
      if (await lowStockProduct.count() > 0) {
        await expect(lowStockProduct).toHaveClass(/low-stock/);
      }
    });
  });
  
  test.describe('Permisos por Rol', () => {
    
    test('Cliente no puede acceder a gestión de productos', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.CLIENTE.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.CLIENTE);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Intentar acceder a productos
      await navigateToPage(page, '/productos');
      await expect(page.locator('text=Acceso denegado, text=No autorizado')).toBeVisible();
    });
    
    test('Contador no puede crear productos', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.CONTADOR.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.CONTADOR);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Intentar acceder a productos
      await navigateToPage(page, '/productos');
      await expect(page.locator('text=Acceso denegado, text=No autorizado')).toBeVisible();
    });
    
    test('Proveedor puede gestionar sus productos', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.PROVEEDOR.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.PROVEEDOR);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/productos');
      await verifyTableHasData(page, SELECTORS.PRODUCTOS.LIST_TABLE);
      
      // Verificar que puede crear productos
      await expect(page.locator(SELECTORS.PRODUCTOS.NEW_BUTTON)).toBeVisible();
    });
  });
  
  test.describe('Visualización de Productos', () => {
    
    test('Vista detallada de producto', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/productos');
      await verifyTableHasData(page, SELECTORS.PRODUCTOS.LIST_TABLE);
      
      // Hacer clic en nombre del producto para ver detalles
      await page.click('tbody tr:first-child td:first-child');
      await page.waitForLoadState('networkidle');
      
      // Verificar que se muestren todos los detalles
      await expect(page.locator('text=Nombre')).toBeVisible();
      await expect(page.locator('text=Descripción')).toBeVisible();
      await expect(page.locator('text=Precio')).toBeVisible();
      await expect(page.locator('text=Stock')).toBeVisible();
      await expect(page.locator('text=Categoría')).toBeVisible();
    });
    
    test('Historial de precios del producto', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/productos');
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

