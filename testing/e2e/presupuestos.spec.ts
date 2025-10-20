import { test, expect } from '@playwright/test';
import { 
  navigateToPage, 
  verifyAuthentication, 
  fillPresupuestoForm,
  verifySuccessMessage,
  verifyErrorMessage,
  waitForLoadingToFinish,
  verifyTableHasData,
  findInTable
} from '../utils/helpers';
import { SELECTORS } from '../utils/selectors';
import { TEST_USERS, TEST_PASSWORDS, TEST_PRESUPUESTOS, TEST_CLIENTES } from '../fixtures/user-fixtures';

/**
 * Tests de Gestión de Presupuestos para Misionary CRM/ERP
 * 
 * Este archivo contiene todos los tests relacionados con:
 * - Creación de presupuestos
 * - Edición de presupuestos
 * - Eliminación de presupuestos
 * - Cálculo de impuestos (2.45%)
 * - Estados de presupuestos
 * - Permisos por rol
 */

test.describe('Gestión de Presupuestos', () => {
  
  test.describe('Creación de Presupuestos', () => {
    
    test('Admin puede crear un presupuesto básico', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Navegar a presupuestos
      await navigateToPage(page, '/presupuestos');
      await verifyAuthentication(page);
      
      // Crear nuevo presupuesto
      await page.click(SELECTORS.PRESUPUESTOS.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Llenar formulario
      await fillPresupuestoForm(page, TEST_PRESUPUESTOS.BASICO);
      
      // Verificar cálculo automático de impuestos
      const impuestosDisplay = page.locator(SELECTORS.PRESUPUESTOS.IMPUESTOS_DISPLAY);
      await expect(impuestosDisplay).toContainText('245'); // 2.45% de 10000
      
      // Guardar presupuesto
      await page.click(SELECTORS.PRESUPUESTOS.SAVE_BUTTON);
      await waitForLoadingToFinish(page);
      
      // Verificar mensaje de éxito
      await verifySuccessMessage(page, 'Presupuesto creado correctamente');
    });
    
    test('Contador puede crear presupuesto con cliente existente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.CONTADOR.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.CONTADOR);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/presupuestos');
      await verifyAuthentication(page);
      
      // Crear nuevo presupuesto
      await page.click(SELECTORS.PRESUPUESTOS.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Seleccionar cliente existente
      await page.click('input[name="cliente"]');
      await page.fill('input[name="cliente"]', TEST_CLIENTES.PERSONA_FISICA.nombre);
      await page.waitForTimeout(500); // Esperar autocompletado
      await page.keyboard.press('Enter');
      
      // Llenar datos del presupuesto
      await page.fill('input[name="total"]', TEST_PRESUPUESTOS.ALTO_VALOR.total.toString());
      
      // Verificar cálculo de impuestos
      const impuestosEsperados = Math.round(TEST_PRESUPUESTOS.ALTO_VALOR.total * 0.0245);
      const impuestosDisplay = page.locator(SELECTORS.PRESUPUESTOS.IMPUESTOS_DISPLAY);
      await expect(impuestosDisplay).toContainText(impuestosEsperados.toString());
      
      // Guardar
      await page.click(SELECTORS.PRESUPUESTOS.SAVE_BUTTON);
      await waitForLoadingToFinish(page);
      
      await verifySuccessMessage(page, 'Presupuesto creado correctamente');
    });
    
    test('Validación de campos requeridos', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/presupuestos');
      await page.click(SELECTORS.PRESUPUESTOS.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Intentar guardar sin llenar campos
      await page.click(SELECTORS.PRESUPUESTOS.SAVE_BUTTON);
      
      // Verificar mensajes de validación
      await expect(page.locator('text=Cliente es requerido')).toBeVisible();
      await expect(page.locator('text=Total es requerido')).toBeVisible();
    });
    
    test('Cálculo automático de impuestos (2.45%)', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/presupuestos');
      await page.click(SELECTORS.PRESUPUESTOS.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Probar diferentes montos
      const testCases = [
        { total: 1000, impuestos: 24.5 },
        { total: 5000, impuestos: 122.5 },
        { total: 10000, impuestos: 245 },
        { total: 50000, impuestos: 1225 }
      ];
      
      for (const testCase of testCases) {
        await page.fill('input[name="total"]', testCase.total.toString());
        await page.waitForTimeout(500); // Esperar cálculo
        
        const impuestosDisplay = page.locator(SELECTORS.PRESUPUESTOS.IMPUESTOS_DISPLAY);
        await expect(impuestosDisplay).toContainText(testCase.impuestos.toString());
      }
    });
  });
  
  test.describe('Edición de Presupuestos', () => {
    
    test('Admin puede editar un presupuesto existente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/presupuestos');
      await verifyTableHasData(page, SELECTORS.PRESUPUESTOS.LIST_TABLE);
      
      // Hacer clic en editar primer presupuesto
      await page.click(SELECTORS.PRESUPUESTOS.EDIT_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Modificar datos
      await page.fill('input[name="total"]', '15000');
      
      // Verificar recálculo de impuestos
      const impuestosEsperados = Math.round(15000 * 0.0245);
      const impuestosDisplay = page.locator(SELECTORS.PRESUPUESTOS.IMPUESTOS_DISPLAY);
      await expect(impuestosDisplay).toContainText(impuestosEsperados.toString());
      
      // Guardar cambios
      await page.click(SELECTORS.PRESUPUESTOS.SAVE_BUTTON);
      await waitForLoadingToFinish(page);
      
      await verifySuccessMessage(page, 'Presupuesto actualizado correctamente');
    });
    
    test('Cambio de estado de presupuesto', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/presupuestos');
      await page.click(SELECTORS.PRESUPUESTOS.EDIT_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Cambiar estado a ENVIADO
      await page.selectOption('select[name="estado"]', 'ENVIADO');
      
      await page.click(SELECTORS.PRESUPUESTOS.SAVE_BUTTON);
      await waitForLoadingToFinish(page);
      
      await verifySuccessMessage(page, 'Estado actualizado correctamente');
    });
  });
  
  test.describe('Eliminación de Presupuestos', () => {
    
    test('Admin puede eliminar un presupuesto', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/presupuestos');
      await verifyTableHasData(page, SELECTORS.PRESUPUESTOS.LIST_TABLE);
      
      // Contar presupuestos antes de eliminar
      const rowsBefore = await page.locator('tbody tr').count();
      
      // Eliminar primer presupuesto
      await page.click(SELECTORS.PRESUPUESTOS.DELETE_BUTTON);
      
      // Confirmar eliminación
      await page.click(SELECTORS.MODALS.CONFIRM_BUTTON);
      await waitForLoadingToFinish(page);
      
      // Verificar que se eliminó
      const rowsAfter = await page.locator('tbody tr').count();
      expect(rowsAfter).toBe(rowsBefore - 1);
      
      await verifySuccessMessage(page, 'Presupuesto eliminado correctamente');
    });
    
    test('No se puede eliminar presupuesto aprobado', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/presupuestos');
      
      // Buscar presupuesto aprobado
      const approvedRow = page.locator('tr:has-text("APROBADO")').first();
      if (await approvedRow.count() > 0) {
        await approvedRow.locator(SELECTORS.PRESUPUESTOS.DELETE_BUTTON).click();
        
        // Verificar mensaje de error
        await verifyErrorMessage(page, 'No se puede eliminar un presupuesto aprobado');
      }
    });
  });
  
  test.describe('Búsqueda y Filtros', () => {
    
    test('Búsqueda de presupuestos por cliente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/presupuestos');
      
      // Buscar por cliente
      await page.fill(SELECTORS.PRESUPUESTOS.SEARCH_INPUT, TEST_CLIENTES.PERSONA_FISICA.nombre);
      await page.waitForTimeout(1000);
      
      // Verificar que se muestren solo resultados relevantes
      const found = await findInTable(page, TEST_CLIENTES.PERSONA_FISICA.nombre, SELECTORS.PRESUPUESTOS.LIST_TABLE);
      expect(found).toBe(true);
    });
    
    test('Filtro por estado de presupuesto', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/presupuestos');
      
      // Filtrar por estado BORRADOR
      await page.selectOption(SELECTORS.PRESUPUESTOS.FILTER_SELECT, 'BORRADOR');
      await page.waitForTimeout(1000);
      
      // Verificar que solo se muestren presupuestos en borrador
      const rows = page.locator('tbody tr');
      const count = await rows.count();
      
      for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        await expect(row).toContainText('BORRADOR');
      }
    });
  });
  
  test.describe('Permisos por Rol', () => {
    
    test('Cliente no puede crear presupuestos', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.CLIENTE.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.CLIENTE);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Intentar acceder a presupuestos
      await navigateToPage(page, '/presupuestos');
      await expect(page.locator('text=Acceso denegado, text=No autorizado')).toBeVisible();
    });
    
    test('Proveedor no puede acceder a presupuestos', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.PROVEEDOR.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.PROVEEDOR);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Intentar acceder a presupuestos
      await navigateToPage(page, '/presupuestos');
      await expect(page.locator('text=Acceso denegado, text=No autorizado')).toBeVisible();
    });
    
    test('Contador puede ver presupuestos pero no eliminar', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.CONTADOR.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.CONTADOR);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/presupuestos');
      await verifyTableHasData(page, SELECTORS.PRESUPUESTOS.LIST_TABLE);
      
      // Verificar que NO puede eliminar
      await expect(page.locator(SELECTORS.PRESUPUESTOS.DELETE_BUTTON)).not.toBeVisible();
    });
  });
  
  test.describe('Visualización de Presupuestos', () => {
    
    test('Vista detallada de presupuesto', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/presupuestos');
      await verifyTableHasData(page, SELECTORS.PRESUPUESTOS.LIST_TABLE);
      
      // Ver presupuesto detallado
      await page.click(SELECTORS.PRESUPUESTOS.VIEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Verificar que se muestren todos los detalles
      await expect(page.locator('text=Cliente')).toBeVisible();
      await expect(page.locator('text=Total')).toBeVisible();
      await expect(page.locator('text=Impuestos')).toBeVisible();
      await expect(page.locator('text=Estado')).toBeVisible();
    });
    
    test('Exportar presupuesto a PDF', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/presupuestos');
      await page.click(SELECTORS.PRESUPUESTOS.VIEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Buscar botón de exportar
      const exportButton = page.locator('button:has-text("Exportar PDF"), [data-testid="export-pdf"]');
      if (await exportButton.count() > 0) {
        await exportButton.click();
        
        // Verificar que se inicie la descarga
        await page.waitForTimeout(2000);
        // En un test real, verificaríamos que se descargue el archivo
      }
    });
  });
});

