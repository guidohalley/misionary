import { test, expect } from '@playwright/test';
import { TEST_USERS, TEST_PASSWORDS } from '../fixtures/user-fixtures';

/**
 * Smoke Tests - Tests rápidos de funcionalidad básica
 * Estos tests validan que las funciones principales del sistema funcionan
 */

test.describe('Smoke Tests - Funcionalidad Básica', () => {
  
  test('Login y navegación básica', async ({ page }) => {
    // Login
    await page.goto('/sign-in');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
    await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/home/, { timeout: 10000 });
    
    console.log('✅ Login exitoso');
    
    // Verificar que cargó el home
    await expect(page).toHaveURL(/.*\/home/);
    console.log('✅ Home cargado');
  });
  
  test('Navegación a módulos principales', async ({ page }) => {
    // Login
    await page.goto('/sign-in');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
    await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/home/, { timeout: 10000 });
    
    // Navegar a personas
    await page.goto('/personas');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/personas/);
    console.log('✅ Módulo Personas cargado');
    
    // Navegar a productos
    await page.goto('/productos');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/productos/);
    console.log('✅ Módulo Productos cargado');
    
    // Navegar a presupuestos
    await page.goto('/presupuestos');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/presupuestos/);
    console.log('✅ Módulo Presupuestos cargado');
  });
  
  test('Proveedor puede acceder a productos', async ({ page }) => {
    // Login como proveedor
    await page.goto('/sign-in');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', TEST_USERS.PROVEEDOR.email);
    await page.fill('input[name="password"]', TEST_PASSWORDS.PROVEEDOR);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/home/, { timeout: 10000 });
    
    console.log('✅ Proveedor logueado');
    
    // Ir a productos
    await page.goto('/productos');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/productos/);
    console.log('✅ Proveedor puede ver productos');
  });
  
  test('Contador puede acceder a finanzas', async ({ page }) => {
    // Login como contador
    await page.goto('/sign-in');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', TEST_USERS.CONTADOR.email);
    await page.fill('input[name="password"]', TEST_PASSWORDS.CONTADOR);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/home/, { timeout: 10000 });
    
    console.log('✅ Contador logueado');
    
    // Ir a finanzas
    await page.goto('/finanzas');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/finanzas/);
    console.log('✅ Contador puede ver finanzas');
  });
});
