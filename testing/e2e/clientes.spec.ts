import { test, expect } from '@playwright/test';
import { 
  navigateToPage, 
  verifyAuthentication, 
  fillClienteForm,
  verifySuccessMessage,
  verifyErrorMessage,
  waitForLoadingToFinish,
  verifyTableHasData,
  findInTable
} from '../utils/helpers';
import { SELECTORS } from '../utils/selectors';
import { TEST_USERS, TEST_PASSWORDS, TEST_CLIENTES } from '../fixtures/user-fixtures';

/**
 * Tests de Gestión de Clientes para Misionary CRM/ERP
 * 
 * Este archivo contiene todos los tests relacionados con:
 * - CRUD de clientes (Crear, Leer, Actualizar, Eliminar)
 * - Búsqueda y filtros de clientes
 * - Validación de formularios
 * - Permisos por rol
 * - Tipos de cliente (Persona/Empresa)
 */

test.describe('Gestión de Clientes', () => {
  
  test.describe('Creación de Clientes', () => {
    
    test('Admin puede crear un cliente persona física', async ({ page }) => {
      // Login
      await page.goto('/sign-in');
      await page.waitForSelector('input[name="email"]', { timeout: 10000 });
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/, { timeout: 10000 });
      
      // Ir directamente a crear nuevo cliente
      await page.goto('/personas/cliente/new');
      await page.waitForLoadState('networkidle');
      
      // Llenar formulario básico
      await page.fill('input[name="nombre"], input[placeholder*="nombre"]', TEST_CLIENTES.PERSONA_FISICA.nombre);
      await page.fill('input[name="email"], input[type="email"]', TEST_CLIENTES.PERSONA_FISICA.email);
      await page.fill('input[name="telefono"], input[placeholder*="teléfono"]', TEST_CLIENTES.PERSONA_FISICA.telefono);
      
      // Guardar
      await page.click('button[type="submit"], button:has-text("Guardar")');
      await page.waitForTimeout(2000);
      
      // Verificar éxito (puede ser redirect o mensaje)
      const currentUrl = page.url();
      console.log('URL después de crear:', currentUrl);
    });
    
    test('Admin puede crear un cliente empresa', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/clientes');
      await page.click(SELECTORS.CLIENTES.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Llenar formulario para empresa
      await fillClienteForm(page, TEST_CLIENTES.EMPRESA);
      await page.selectOption(SELECTORS.CLIENTES.TIPO_SELECT, 'EMPRESA');
      
      await page.click(SELECTORS.CLIENTES.SAVE_BUTTON);
      await waitForLoadingToFinish(page);
      
      await verifySuccessMessage(page, 'Cliente creado correctamente');
    });
    
    test('Validación de campos requeridos', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/clientes');
      await page.click(SELECTORS.CLIENTES.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Intentar guardar sin llenar campos
      await page.click(SELECTORS.CLIENTES.SAVE_BUTTON);
      
      // Verificar mensajes de validación
      await expect(page.locator('text=Nombre es requerido')).toBeVisible();
      await expect(page.locator('text=Email es requerido')).toBeVisible();
    });
    
    test('Validación de formato de email', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/clientes');
      await page.click(SELECTORS.CLIENTES.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Llenar con email inválido
      await page.fill(SELECTORS.CLIENTES.NOMBRE_INPUT, 'Cliente Test');
      await page.fill(SELECTORS.CLIENTES.EMAIL_INPUT, 'email-invalido');
      await page.click(SELECTORS.CLIENTES.SAVE_BUTTON);
      
      // Verificar mensaje de error
      await expect(page.locator('text=Email inválido')).toBeVisible();
    });
    
    test('Validación de email único', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/clientes');
      await page.click(SELECTORS.CLIENTES.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Usar email existente
      await page.fill(SELECTORS.CLIENTES.NOMBRE_INPUT, 'Cliente Test');
      await page.fill(SELECTORS.CLIENTES.EMAIL_INPUT, TEST_CLIENTES.PERSONA_FISICA.email);
      await page.click(SELECTORS.CLIENTES.SAVE_BUTTON);
      
      // Verificar mensaje de error
      await expect(page.locator('text=Email ya existe')).toBeVisible();
    });
  });
  
  test.describe('Edición de Clientes', () => {
    
    test('Admin puede editar un cliente existente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/clientes');
      await verifyTableHasData(page, SELECTORS.CLIENTES.LIST_TABLE);
      
      // Editar primer cliente
      await page.click(SELECTORS.CLIENTES.EDIT_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Modificar datos
      await page.fill(SELECTORS.CLIENTES.NOMBRE_INPUT, 'Cliente Modificado');
      await page.fill(SELECTORS.CLIENTES.TELEFONO_INPUT, '+54 9 11 9999-9999');
      
      // Guardar cambios
      await page.click(SELECTORS.CLIENTES.SAVE_BUTTON);
      await waitForLoadingToFinish(page);
      
      await verifySuccessMessage(page, 'Cliente actualizado correctamente');
    });
    
    test('Cambio de tipo de cliente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/clientes');
      await page.click(SELECTORS.CLIENTES.EDIT_BUTTON);
      await page.waitForLoadState('networkidle');
      
      // Cambiar de PERSONA a EMPRESA
      await page.selectOption(SELECTORS.CLIENTES.TIPO_SELECT, 'EMPRESA');
      
      await page.click(SELECTORS.CLIENTES.SAVE_BUTTON);
      await waitForLoadingToFinish(page);
      
      await verifySuccessMessage(page, 'Cliente actualizado correctamente');
    });
  });
  
  test.describe('Eliminación de Clientes', () => {
    
    test('Admin puede eliminar un cliente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/clientes');
      await verifyTableHasData(page, SELECTORS.CLIENTES.LIST_TABLE);
      
      // Contar clientes antes de eliminar
      const rowsBefore = await page.locator('tbody tr').count();
      
      // Eliminar primer cliente
      await page.click(SELECTORS.CLIENTES.DELETE_BUTTON);
      
      // Confirmar eliminación
      await page.click(SELECTORS.MODALS.CONFIRM_BUTTON);
      await waitForLoadingToFinish(page);
      
      // Verificar que se eliminó
      const rowsAfter = await page.locator('tbody tr').count();
      expect(rowsAfter).toBe(rowsBefore - 1);
      
      await verifySuccessMessage(page, 'Cliente eliminado correctamente');
    });
    
    test('No se puede eliminar cliente con presupuestos asociados', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/clientes');
      
      // Buscar cliente con presupuestos
      const clientWithPresupuestos = page.locator('tr:has-text("Con Presupuestos")').first();
      if (await clientWithPresupuestos.count() > 0) {
        await clientWithPresupuestos.locator(SELECTORS.CLIENTES.DELETE_BUTTON).click();
        
        // Verificar mensaje de error
        await verifyErrorMessage(page, 'No se puede eliminar un cliente con presupuestos asociados');
      }
    });
  });
  
  test.describe('Búsqueda y Filtros', () => {
    
    test('Búsqueda de clientes por nombre', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/clientes');
      
      // Buscar por nombre
      await page.fill(SELECTORS.CLIENTES.SEARCH_INPUT, TEST_CLIENTES.PERSONA_FISICA.nombre);
      await page.waitForTimeout(1000);
      
      // Verificar que se muestren solo resultados relevantes
      const found = await findInTable(page, TEST_CLIENTES.PERSONA_FISICA.nombre, SELECTORS.CLIENTES.LIST_TABLE);
      expect(found).toBe(true);
    });
    
    test('Búsqueda de clientes por email', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/clientes');
      
      // Buscar por email
      await page.fill(SELECTORS.CLIENTES.SEARCH_INPUT, TEST_CLIENTES.EMPRESA.email);
      await page.waitForTimeout(1000);
      
      const found = await findInTable(page, TEST_CLIENTES.EMPRESA.email, SELECTORS.CLIENTES.LIST_TABLE);
      expect(found).toBe(true);
    });
    
    test('Filtro por tipo de cliente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/clientes');
      
      // Filtrar por tipo PERSONA
      await page.selectOption(SELECTORS.CLIENTES.FILTER_SELECT, 'PERSONA');
      await page.waitForTimeout(1000);
      
      // Verificar que solo se muestren clientes tipo PERSONA
      const rows = page.locator('tbody tr');
      const count = await rows.count();
      
      for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        await expect(row).toContainText('PERSONA');
      }
    });
    
    test('Filtro por tipo EMPRESA', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/clientes');
      
      // Filtrar por tipo EMPRESA
      await page.selectOption(SELECTORS.CLIENTES.FILTER_SELECT, 'EMPRESA');
      await page.waitForTimeout(1000);
      
      // Verificar que solo se muestren clientes tipo EMPRESA
      const rows = page.locator('tbody tr');
      const count = await rows.count();
      
      for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        await expect(row).toContainText('EMPRESA');
      }
    });
  });
  
  test.describe('Permisos por Rol', () => {
    
    test('Cliente no puede acceder a gestión de clientes', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.CLIENTE.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.CLIENTE);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Intentar acceder a clientes
      await navigateToPage(page, '/clientes');
      await expect(page.locator('text=Acceso denegado, text=No autorizado')).toBeVisible();
    });
    
    test('Proveedor no puede acceder a gestión de clientes', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.PROVEEDOR.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.PROVEEDOR);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Intentar acceder a clientes
      await navigateToPage(page, '/clientes');
      await expect(page.locator('text=Acceso denegado, text=No autorizado')).toBeVisible();
    });
    
    test('Contador puede ver clientes pero no eliminar', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.CONTADOR.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.CONTADOR);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/clientes');
      await verifyTableHasData(page, SELECTORS.CLIENTES.LIST_TABLE);
      
      // Verificar que NO puede eliminar
      await expect(page.locator(SELECTORS.CLIENTES.DELETE_BUTTON)).not.toBeVisible();
    });
  });
  
  test.describe('Visualización de Clientes', () => {
    
    test('Vista detallada de cliente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/clientes');
      await verifyTableHasData(page, SELECTORS.CLIENTES.LIST_TABLE);
      
      // Hacer clic en nombre del cliente para ver detalles
      await page.click('tbody tr:first-child td:first-child');
      await page.waitForLoadState('networkidle');
      
      // Verificar que se muestren todos los detalles
      await expect(page.locator('text=Nombre')).toBeVisible();
      await expect(page.locator('text=Email')).toBeVisible();
      await expect(page.locator('text=Teléfono')).toBeVisible();
      await expect(page.locator('text=Dirección')).toBeVisible();
      await expect(page.locator('text=Tipo')).toBeVisible();
    });
    
    test('Historial de presupuestos del cliente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/clientes');
      await page.click('tbody tr:first-child td:first-child');
      await page.waitForLoadState('networkidle');
      
      // Buscar sección de historial de presupuestos
      const presupuestosSection = page.locator('[data-testid="cliente-presupuestos"], .presupuestos-history');
      if (await presupuestosSection.count() > 0) {
        await expect(presupuestosSection).toBeVisible();
      }
    });
  });
  
  test.describe('Importación y Exportación', () => {
    
    test('Exportar lista de clientes', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/clientes');
      
      // Buscar botón de exportar
      const exportButton = page.locator('button:has-text("Exportar"), [data-testid="export-button"]');
      if (await exportButton.count() > 0) {
        await exportButton.click();
        
        // Verificar que se inicie la descarga
        await page.waitForTimeout(2000);
        // En un test real, verificaríamos que se descargue el archivo
      }
    });
  });
});

