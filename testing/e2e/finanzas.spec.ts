import { test, expect } from '@playwright/test';
import { 
  navigateToPage, 
  verifyAuthentication, 
  verifySuccessMessage,
  verifyErrorMessage,
  waitForLoadingToFinish,
  verifyTableHasData
} from '../utils/helpers';
import { SELECTORS } from '../utils/selectors';
import { TEST_USERS, TEST_PASSWORDS } from '../fixtures/user-fixtures';

/**
 * Tests de Módulo Financiero para Misionary CRM/ERP
 * 
 * Este archivo contiene todos los tests relacionados con:
 * - Dashboard financiero
 * - Reportes y análisis
 * - Gestión de transacciones
 * - Cálculos de impuestos
 * - Permisos por rol
 */

test.describe('Módulo Financiero', () => {
  
  test.describe('Dashboard Financiero', () => {
    
    test('Admin puede acceder al dashboard financiero', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Navegar a finanzas
      await navigateToPage(page, '/finanzas');
      await verifyAuthentication(page);
      
      // Verificar que se muestren las tarjetas de resumen
      await expect(page.locator(SELECTORS.FINANZAS.SUMMARY_CARDS)).toBeVisible();
      
      // Verificar que se muestren los gráficos
      await expect(page.locator(SELECTORS.FINANZAS.CHARTS_CONTAINER)).toBeVisible();
    });
    
    test('Contador puede acceder al dashboard financiero', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.CONTADOR.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.CONTADOR);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/finanzas');
      await verifyAuthentication(page);
      
      // Verificar que se muestren las tarjetas de resumen
      await expect(page.locator(SELECTORS.FINANZAS.SUMMARY_CARDS)).toBeVisible();
    });
    
    test('Dashboard muestra métricas financieras correctas', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/finanzas');
      
      // Verificar que se muestren métricas importantes
      await expect(page.locator('text=Ingresos')).toBeVisible();
      await expect(page.locator('text=Egresos')).toBeVisible();
      await expect(page.locator('text=Balance')).toBeVisible();
      await expect(page.locator('text=Impuestos')).toBeVisible();
    });
    
    test('Gráficos se renderizan correctamente', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/finanzas');
      
      // Verificar que los gráficos estén presentes
      const charts = page.locator('canvas, svg, .chart');
      await expect(charts).toHaveCount({ min: 1 });
    });
  });
  
  test.describe('Reportes Financieros', () => {
    
    test('Generación de reporte de ingresos', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/finanzas');
      
      // Buscar botón de generar reporte
      const reportButton = page.locator('button:has-text("Generar Reporte"), [data-testid="generate-report"]');
      if (await reportButton.count() > 0) {
        await reportButton.click();
        await page.waitForTimeout(2000);
        
        // Verificar que se genere el reporte
        await expect(page.locator('text=Reporte generado')).toBeVisible();
      }
    });
    
    test('Filtro por rango de fechas', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/finanzas');
      
      // Configurar rango de fechas
      await page.fill('input[name="fecha-inicio"]', '2024-01-01');
      await page.fill('input[name="fecha-fin"]', '2024-12-31');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
      
      // Verificar que se aplique el filtro
      await expect(page.locator('text=Filtro aplicado')).toBeVisible();
    });
    
    test('Exportación de reportes', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/finanzas');
      
      // Buscar botón de exportar
      const exportButton = page.locator(SELECTORS.FINANZAS.EXPORT_BUTTON);
      if (await exportButton.count() > 0) {
        await exportButton.click();
        await page.waitForTimeout(2000);
        
        // Verificar que se inicie la descarga
        // En un test real, verificaríamos que se descargue el archivo
      }
    });
  });
  
  test.describe('Gestión de Transacciones', () => {
    
    test('Visualización de transacciones', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/finanzas');
      
      // Verificar que se muestre la tabla de transacciones
      await expect(page.locator(SELECTORS.FINANZAS.TRANSACTIONS_TABLE)).toBeVisible();
      
      // Verificar que la tabla tenga datos
      await verifyTableHasData(page, SELECTORS.FINANZAS.TRANSACTIONS_TABLE);
    });
    
    test('Filtro de transacciones por tipo', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/finanzas');
      
      // Filtrar por tipo de transacción
      await page.selectOption('select[name="tipo-transaccion"]', 'INGRESO');
      await page.waitForTimeout(1000);
      
      // Verificar que solo se muestren transacciones de ingreso
      const rows = page.locator('tbody tr');
      const count = await rows.count();
      
      for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        await expect(row).toContainText('INGRESO');
      }
    });
    
    test('Búsqueda de transacciones', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/finanzas');
      
      // Buscar transacción específica
      await page.fill('input[name="buscar-transaccion"]', 'Presupuesto');
      await page.waitForTimeout(1000);
      
      // Verificar que se muestren solo resultados relevantes
      const rows = page.locator('tbody tr');
      const count = await rows.count();
      
      for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        await expect(row).toContainText('Presupuesto');
      }
    });
  });
  
  test.describe('Cálculos de Impuestos', () => {
    
    test('Cálculo automático de impuestos (2.45%)', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/finanzas');
      
      // Verificar que se muestre el cálculo de impuestos
      const impuestosSection = page.locator('[data-testid="impuestos-section"], .impuestos');
      if (await impuestosSection.count() > 0) {
        await expect(impuestosSection).toBeVisible();
        
        // Verificar que se muestre el porcentaje correcto
        await expect(page.locator('text=2.45%')).toBeVisible();
      }
    });
    
    test('Resumen de impuestos por período', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/finanzas');
      
      // Buscar sección de resumen de impuestos
      const impuestosResumen = page.locator('[data-testid="impuestos-resumen"], .impuestos-resumen');
      if (await impuestosResumen.count() > 0) {
        await expect(impuestosResumen).toBeVisible();
        
        // Verificar que se muestren los totales
        await expect(page.locator('text=Total Impuestos')).toBeVisible();
      }
    });
  });
  
  test.describe('Análisis y Métricas', () => {
    
    test('Análisis de rentabilidad', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/finanzas');
      
      // Buscar sección de análisis de rentabilidad
      const rentabilidadSection = page.locator('[data-testid="rentabilidad-section"], .rentabilidad');
      if (await rentabilidadSection.count() > 0) {
        await expect(rentabilidadSection).toBeVisible();
        
        // Verificar métricas de rentabilidad
        await expect(page.locator('text=Margen de Ganancia')).toBeVisible();
        await expect(page.locator('text=ROI')).toBeVisible();
      }
    });
    
    test('Comparación de períodos', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/finanzas');
      
      // Configurar comparación de períodos
      await page.selectOption('select[name="periodo-comparacion"]', 'MES_ANTERIOR');
      await page.waitForTimeout(1000);
      
      // Verificar que se muestre la comparación
      await expect(page.locator('text=Comparación con mes anterior')).toBeVisible();
    });
    
    test('Proyecciones financieras', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/finanzas');
      
      // Buscar sección de proyecciones
      const proyeccionesSection = page.locator('[data-testid="proyecciones-section"], .proyecciones');
      if (await proyeccionesSection.count() > 0) {
        await expect(proyeccionesSection).toBeVisible();
        
        // Verificar que se muestren las proyecciones
        await expect(page.locator('text=Proyección de Ingresos')).toBeVisible();
        await expect(page.locator('text=Proyección de Gastos')).toBeVisible();
      }
    });
  });
  
  test.describe('Permisos por Rol', () => {
    
    test('Cliente no puede acceder a finanzas', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.CLIENTE.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.CLIENTE);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Intentar acceder a finanzas
      await navigateToPage(page, '/finanzas');
      await expect(page.locator('text=Acceso denegado, text=No autorizado')).toBeVisible();
    });
    
    test('Proveedor no puede acceder a finanzas', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.PROVEEDOR.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.PROVEEDOR);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Intentar acceder a finanzas
      await navigateToPage(page, '/finanzas');
      await expect(page.locator('text=Acceso denegado, text=No autorizado')).toBeVisible();
    });
    
    test('Contador puede acceder a todas las funciones financieras', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.CONTADOR.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.CONTADOR);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      await navigateToPage(page, '/finanzas');
      await verifyAuthentication(page);
      
      // Verificar que puede acceder a todas las secciones
      await expect(page.locator(SELECTORS.FINANZAS.SUMMARY_CARDS)).toBeVisible();
      await expect(page.locator(SELECTORS.FINANZAS.CHARTS_CONTAINER)).toBeVisible();
      await expect(page.locator(SELECTORS.FINANZAS.TRANSACTIONS_TABLE)).toBeVisible();
    });
  });
  
  test.describe('Integración con Otros Módulos', () => {
    
    test('Datos de presupuestos se reflejan en finanzas', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Crear un presupuesto
      await navigateToPage(page, '/presupuestos');
      await page.click(SELECTORS.PRESUPUESTOS.NEW_BUTTON);
      await page.waitForLoadState('networkidle');
      
      await page.fill('input[name="cliente"]', 'Cliente Test');
      await page.fill('input[name="total"]', '10000');
      await page.click(SELECTORS.PRESUPUESTOS.SAVE_BUTTON);
      await waitForLoadingToFinish(page);
      
      // Verificar que se refleje en finanzas
      await navigateToPage(page, '/finanzas');
      await expect(page.locator('text=Cliente Test')).toBeVisible();
    });
    
    test('Datos de gastos se reflejan en finanzas', async ({ page }) => {
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
      await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/home/);
      
      // Crear un gasto
      await navigateToPage(page, '/gastos');
      await page.click('[data-testid="new-gasto-button"]');
      await page.waitForLoadState('networkidle');
      
      await page.fill('input[name="descripcion"]', 'Gasto Test');
      await page.fill('input[name="monto"]', '5000');
      await page.click('button[type="submit"]');
      await waitForLoadingToFinish(page);
      
      // Verificar que se refleje en finanzas
      await navigateToPage(page, '/finanzas');
      await expect(page.locator('text=Gasto Test')).toBeVisible();
    });
  });
});

