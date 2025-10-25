import { test, expect } from '@playwright/test';

/**
 * TEST: Admin - ABM de Proveedor
 * Usa el buscador refactorizado para encontrar y gestionar proveedores
 */

test.describe('Admin - ABM Proveedor', () => {
  
  test('Admin: Crear - Editar - Eliminar Proveedor (sin basura)', async ({ page }) => {
    
    const timestamp = Date.now();
    const proveedor = {
      nombre: `Proveedor Test ${timestamp}`,
      email: `prov-${timestamp}@test.com`,
      telefono: '+54 9 11 1234-5678',
    };
    
    // LOGIN
    console.log('LOGIN como ADMIN');
    await page.goto('/sign-in');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', process.env.ADMIN_EMAIL || 'guido@misionary');
    await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD || '4C0@Cs4^6WuK@jci');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/home/, { timeout: 15000 });
    console.log('OK - Logueado');
    
    // PASO 1: CREAR PROVEEDOR
    console.log('\nPASO 1: CREAR');
    await page.goto('/personas/proveedor/new');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log(`  Nombre: ${proveedor.nombre}`);
    await page.fill('input[name="nombre"]', proveedor.nombre);
    
    console.log(`  Email: ${proveedor.email}`);
    await page.fill('input[name="email"]', proveedor.email);
    
    const telField = page.locator('input[name="telefono"]');
    if (await telField.count() > 0) {
      console.log(`  Telefono: ${proveedor.telefono}`);
      await telField.fill(proveedor.telefono);
    }
    
    const passField = page.locator('input[name="password"]');
    if (await passField.count() > 0) {
      await passField.fill('TestPass123!');
    }
    
    // Interceptar la respuesta para capturar el ID
    let proveedorId: number | null = null;
    
    page.on('response', async (response) => {
      if (response.url().includes('/api/personas') && response.status() === 201) {
        try {
          const data = await response.json();
          proveedorId = data.id || data.persona?.id;
        } catch (e) {
          // Ignorar errores de parsing
        }
      }
    });
    
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/personas/, { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    console.log(`OK - Proveedor creado, ID: ${proveedorId || 'capturando...'}`);
    
    // PASO 2: BUSCAR EL PROVEEDOR EN LA LISTA
    console.log('\nPASO 2: BUSCAR en lista');
    await page.goto('/personas');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Usar el buscador para encontrar el proveedor
    const searchInput = page.locator('input[placeholder*="Buscar"]');
    await searchInput.fill(proveedor.email);
    await page.waitForTimeout(1000);
    
    console.log(`  Buscando: ${proveedor.email}`);
    
    // Verificar que aparece en la tabla
    const proveedorRow = page.locator(`tr:has-text("${proveedor.email}")`).first();
    await expect(proveedorRow).toBeVisible({ timeout: 5000 });
    console.log('OK - Proveedor encontrado en la tabla');
    
    // Si no tenemos ID, capturarlo de la tabla
    if (!proveedorId) {
      const idCell = proveedorRow.locator('td').first();
      const idText = await idCell.textContent();
      if (idText) {
        proveedorId = parseInt(idText.trim());
        console.log(`OK - ID capturado: ${proveedorId}`);
      }
    }
    
    // PASO 3: EDITAR PROVEEDOR
    console.log('\nPASO 3: EDITAR');
    
    // Hacer click en el boton de editar
    const editButton = proveedorRow.locator('button').nth(1); // Segundo botón = editar
    await editButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const nombreEditado = `${proveedor.nombre} EDITADO`;
    console.log(`  Nuevo nombre: ${nombreEditado}`);
    await page.fill('input[name="nombre"]', nombreEditado);
    
    const telEdit = page.locator('input[name="telefono"]');
    if (await telEdit.count() > 0) {
      console.log(`  Nuevo telefono: +54 9 11 9999-9999`);
      await telEdit.fill('+54 9 11 9999-9999');
    }
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    console.log('OK - Proveedor editado');
    
    // PASO 4: ELIMINAR PROVEEDOR  
    console.log('\nPASO 4: ELIMINAR');
    
    // Volver a buscar el proveedor (ahora con nombre editado)
    await page.goto('/personas');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const searchInput2 = page.locator('input[placeholder*="Buscar"]');
    await searchInput2.fill(proveedor.email);
    await page.waitForTimeout(1000);
    
    const proveedorRow2 = page.locator(`tr:has-text("${proveedor.email}")`).first();
    await expect(proveedorRow2).toBeVisible({ timeout: 5000 });
    
    // Hacer click en el boton de eliminar (tercer botón)
    const deleteButton = proveedorRow2.locator('button').nth(2); // Tercer botón = eliminar
    await deleteButton.click();
    await page.waitForTimeout(1000);
    
    // Confirmar eliminación en el modal
    const confirmDeleteButton = page.locator('button:has-text("Eliminar")').last(); // El botón "Eliminar" del modal
    await confirmDeleteButton.click();
    await page.waitForTimeout(3000);
    
    console.log('OK - Proveedor eliminado');
    
    // PASO 5: VERIFICAR QUE NO EXISTE
    console.log('\nPASO 5: VERIFICAR LIMPIEZA');
    
    // Buscar de nuevo
    const searchInput3 = page.locator('input[placeholder*="Buscar"]');
    await searchInput3.fill(proveedor.email);
    await page.waitForTimeout(1000);
    
    // Verificar que NO aparece
    const proveedorEliminado = page.locator(`tr:has-text("${proveedor.email}")`);
    await expect(proveedorEliminado).not.toBeVisible({ timeout: 3000 });
    console.log('OK - Proveedor NO existe en la lista');
    
    // PASO 6: LOGOUT
    console.log('\nPASO 6: LOGOUT');
    
    // Buscar el menú de usuario o botón de logout
    const userMenu = page.locator('[data-testid="user-menu"], .user-dropdown, button:has-text("Cerrar")');
    
    if (await userMenu.count() > 0) {
      await userMenu.first().click();
      await page.waitForTimeout(500);
      
      const logoutOption = page.locator('button:has-text("Cerrar sesión"), a:has-text("Salir")');
      if (await logoutOption.count() > 0) {
        await logoutOption.first().click();
        await page.waitForURL(/.*\/sign-in/, { timeout: 5000 });
        console.log('OK - Sesion cerrada');
      }
    }
    
    // RESUMEN
    console.log('\nTEST COMPLETADO');
    console.log(`Proveedor "${proveedor.nombre}" - Ciclo completo OK`);
    console.log('Base de datos limpia');
  });
});
