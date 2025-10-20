import { Page, expect } from '@playwright/test';

/**
 * Utilidades y helpers para testing E2E de Misionary CRM/ERP
 * 
 * Este archivo contiene funciones auxiliares reutilizables para los tests,
 * optimizadas para el sistema Misionary con sus roles y funcionalidades específicas.
 */

// Tipos para el sistema Misionary
export interface MisionaryUser {
  id: number;
  email: string;
  nombre: string;
  tipo: 'CLIENTE' | 'PROVEEDOR' | 'INTERNO';
  roles: string[];
}

export interface MisionaryPresupuesto {
  id?: number;
  cliente: string;
  total: number;
  impuestos: number;
  fecha: string;
  estado: 'BORRADOR' | 'ENVIADO' | 'APROBADO' | 'RECHAZADO';
}

export interface MisionaryCliente {
  id?: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  tipo: 'PERSONA' | 'EMPRESA';
}

/**
 * Navega a una página específica del sistema Misionary
 */
export async function navigateToPage(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
}

/**
 * Espera a que aparezca un elemento específico con timeout personalizado
 */
export async function waitForElement(
  page: Page, 
  selector: string, 
  timeout: number = 10000
): Promise<void> {
  await page.waitForSelector(selector, { timeout });
}

/**
 * Verifica que el usuario esté autenticado correctamente
 */
export async function verifyAuthentication(page: Page): Promise<void> {
  // Verificar que no estemos en la página de login
  await expect(page).not.toHaveURL(/.*\/sign-in/);
  await expect(page).not.toHaveURL(/.*\/login/);
  
  // Verificar que exista algún indicador de usuario autenticado
  const userIndicator = page.locator('[data-testid="user-menu"], [data-testid="user-avatar"], .user-info');
  await expect(userIndicator.first()).toBeVisible();
}

/**
 * Verifica que el usuario tenga un rol específico
 */
export async function verifyUserRole(page: Page, expectedRoles: string[]): Promise<void> {
  // Verificar que el usuario pueda acceder a funcionalidades específicas del rol
  for (const role of expectedRoles) {
    switch (role) {
      case 'ADMIN':
        await expect(page.locator('[data-testid="admin-menu"]')).toBeVisible();
        break;
      case 'CONTADOR':
        await expect(page.locator('[data-testid="finanzas-menu"]')).toBeVisible();
        break;
      case 'PROVEEDOR':
        await expect(page.locator('[data-testid="productos-menu"]')).toBeVisible();
        break;
    }
  }
}

/**
 * Simula el login de un usuario específico
 */
export async function loginUser(
  page: Page, 
  email: string, 
  password: string
): Promise<void> {
  await page.goto('/sign-in');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  
  // Esperar a que el login sea exitoso
  await page.waitForURL(/.*\/home/);
  await verifyAuthentication(page);
}

/**
 * Simula el logout del usuario
 */
export async function logoutUser(page: Page): Promise<void> {
  // Buscar el botón de logout (puede estar en diferentes ubicaciones)
  const logoutButton = page.locator('[data-testid="logout-button"], .logout-btn, button:has-text("Cerrar Sesión")');
  await logoutButton.click();
  
  // Verificar que se redirija a la página de login
  await page.waitForURL(/.*\/sign-in/);
}

/**
 * Rellena un formulario de presupuesto
 */
export async function fillPresupuestoForm(
  page: Page, 
  presupuesto: Partial<MisionaryPresupuesto>
): Promise<void> {
  if (presupuesto.cliente) {
    await page.fill('input[name="cliente"], input[placeholder*="cliente"]', presupuesto.cliente);
  }
  
  if (presupuesto.total) {
    await page.fill('input[name="total"], input[placeholder*="total"]', presupuesto.total.toString());
  }
  
  if (presupuesto.fecha) {
    await page.fill('input[name="fecha"], input[type="date"]', presupuesto.fecha);
  }
}

/**
 * Rellena un formulario de cliente
 */
export async function fillClienteForm(
  page: Page, 
  cliente: Partial<MisionaryCliente>
): Promise<void> {
  if (cliente.nombre) {
    await page.fill('input[name="nombre"], input[placeholder*="nombre"]', cliente.nombre);
  }
  
  if (cliente.email) {
    await page.fill('input[name="email"], input[placeholder*="email"]', cliente.email);
  }
  
  if (cliente.telefono) {
    await page.fill('input[name="telefono"], input[placeholder*="teléfono"]', cliente.telefono);
  }
  
  if (cliente.direccion) {
    await page.fill('input[name="direccion"], textarea[placeholder*="dirección"]', cliente.direccion);
  }
}

/**
 * Verifica que aparezca un mensaje de éxito
 */
export async function verifySuccessMessage(page: Page, expectedMessage?: string): Promise<void> {
  const successSelector = '.toast-success, .alert-success, [data-testid="success-message"]';
  await expect(page.locator(successSelector)).toBeVisible();
  
  if (expectedMessage) {
    await expect(page.locator(successSelector)).toContainText(expectedMessage);
  }
}

/**
 * Verifica que aparezca un mensaje de error
 */
export async function verifyErrorMessage(page: Page, expectedMessage?: string): Promise<void> {
  const errorSelector = '.toast-error, .alert-error, [data-testid="error-message"]';
  await expect(page.locator(errorSelector)).toBeVisible();
  
  if (expectedMessage) {
    await expect(page.locator(errorSelector)).toContainText(expectedMessage);
  }
}

/**
 * Espera a que termine una operación de carga
 */
export async function waitForLoadingToFinish(page: Page): Promise<void> {
  // Esperar a que desaparezcan los indicadores de carga
  await page.waitForSelector('.loading, .spinner, [data-testid="loading"]', { 
    state: 'hidden',
    timeout: 10000 
  });
  
  // Esperar a que termine la carga de la red
  await page.waitForLoadState('networkidle');
}

/**
 * Verifica que un elemento esté visible y sea interactuable
 */
export async function verifyElementIsInteractable(
  page: Page, 
  selector: string
): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toBeVisible();
  await expect(element).toBeEnabled();
}

/**
 * Simula la navegación por el menú lateral
 */
export async function navigateToMenuSection(
  page: Page, 
  sectionName: string
): Promise<void> {
  const menuItem = page.locator(`[data-testid="menu-${sectionName}"], a:has-text("${sectionName}")`);
  await menuItem.click();
  await waitForLoadingToFinish(page);
}

/**
 * Verifica que el tema oscuro esté activo
 */
export async function verifyDarkMode(page: Page): Promise<void> {
  const body = page.locator('body');
  await expect(body).toHaveClass(/dark/);
}

/**
 * Verifica que el tema claro esté activo
 */
export async function verifyLightMode(page: Page): Promise<void> {
  const body = page.locator('body');
  await expect(body).not.toHaveClass(/dark/);
}

/**
 * Cambia el tema de la aplicación
 */
export async function toggleTheme(page: Page): Promise<void> {
  const themeToggle = page.locator('[data-testid="theme-toggle"], .theme-switch');
  await themeToggle.click();
  await page.waitForTimeout(500); // Esperar a que se aplique el cambio
}

/**
 * Verifica que una tabla tenga datos
 */
export async function verifyTableHasData(page: Page, tableSelector: string = 'table'): Promise<void> {
  const table = page.locator(tableSelector);
  await expect(table).toBeVisible();
  
  const rows = table.locator('tbody tr');
  await expect(rows).toHaveCount({ min: 1 });
}

/**
 * Busca un elemento en una tabla
 */
export async function findInTable(
  page: Page, 
  searchTerm: string, 
  tableSelector: string = 'table'
): Promise<boolean> {
  const table = page.locator(tableSelector);
  const cells = table.locator('td');
  
  for (let i = 0; i < await cells.count(); i++) {
    const cellText = await cells.nth(i).textContent();
    if (cellText?.includes(searchTerm)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Simula el scroll hasta un elemento
 */
export async function scrollToElement(page: Page, selector: string): Promise<void> {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
}

/**
 * Verifica que una página sea responsive
 */
export async function verifyResponsiveDesign(page: Page, width: number, height: number): Promise<void> {
  await page.setViewportSize({ width, height });
  await page.waitForTimeout(1000);
  
  // Verificar que los elementos principales sean visibles
  await expect(page.locator('header, nav, main')).toBeVisible();
}

/**
 * Genera datos de prueba para presupuestos
 */
export function generatePresupuestoData(): MisionaryPresupuesto {
  const total = Math.floor(Math.random() * 100000) + 1000;
  const impuestos = total * 0.0245; // 2.45% según el sistema
  
  return {
    cliente: `Cliente Test ${Date.now()}`,
    total,
    impuestos,
    fecha: new Date().toISOString().split('T')[0],
    estado: 'BORRADOR'
  };
}

/**
 * Genera datos de prueba para clientes
 */
export function generateClienteData(): MisionaryCliente {
  const timestamp = Date.now();
  
  return {
    nombre: `Cliente Test ${timestamp}`,
    email: `cliente${timestamp}@test.com`,
    telefono: `+54 9 11 ${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
    direccion: `Calle Test ${Math.floor(Math.random() * 1000) + 1}, Buenos Aires`,
    tipo: 'PERSONA'
  };
}

