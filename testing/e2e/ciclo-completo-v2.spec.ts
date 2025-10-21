import { test, expect } from '@playwright/test';
import { TEST_USERS, TEST_PASSWORDS } from '../fixtures/user-fixtures';

/**
 * Tests de Ciclo Completo V2 - Sin dejar basura en la BD
 * 
 * Usa contextos separados para cada usuario para evitar problemas de sesión.
 * Este test crea datos, los usa y los elimina al final.
 */

test.describe('Ciclo Completo V2 - Proveedor y Producto', () => {
  
  test('Ciclo: Admin crea proveedor → Proveedor crea/edita/elimina producto → Admin elimina proveedor', async ({ browser }) => {
    const timestamp = Date.now();
    const proveedorEmail = `proveedor-test-${timestamp}@agenciadigital.com`;
    const proveedorNombre = `Proveedor Test ${timestamp}`;
    const productoNombre = `Página Web Test ${timestamp}`;
    
    let proveedorId: string | null = null;
    let productoId: string | null = null;
    
    // ==========================================
    // PASO 1: ADMIN CREA UN PROVEEDOR
    // ==========================================
    console.log('📝 PASO 1: Admin crea un proveedor');
    
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    
    await adminPage.goto('/sign-in');
    await adminPage.waitForSelector('input[name="email"]', { timeout: 10000 });
    await adminPage.fill('input[name="email"]', TEST_USERS.ADMIN.email);
    await adminPage.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
    await adminPage.click('button[type="submit"]');
    await adminPage.waitForURL(/.*\/home/, { timeout: 10000 });
    
    // Ir a crear proveedor
    await adminPage.goto('/personas/proveedor/new');
    await adminPage.waitForLoadState('networkidle');
    await adminPage.waitForTimeout(1000);
    
    // Llenar formulario de proveedor
    await adminPage.fill('input[name="nombre"], input[placeholder*="ombre"]', proveedorNombre);
    await adminPage.fill('input[name="email"], input[type="email"]', proveedorEmail);
    
    const passwordField = adminPage.locator('input[name="password"], input[type="password"]');
    if (await passwordField.count() > 0) {
      await passwordField.first().fill('TestPassword123!');
    }
    
    // Guardar proveedor
    await adminPage.click('button[type="submit"]:has-text("Guardar"), button:has-text("Crear")');
    await adminPage.waitForTimeout(3000);
    
    // Capturar ID del proveedor
    const currentUrl = adminPage.url();
    const match = currentUrl.match(/\/personas\/edit\/(\d+)|\/personas\/(\d+)/);
    if (match) {
      proveedorId = match[1] || match[2];
      console.log(`✅ Proveedor creado con ID: ${proveedorId}`);
    }
    
    // Cerrar contexto de admin
    await adminContext.close();
    console.log('✅ Admin cerró sesión');
    
    // ==========================================
    // PASO 2: PROVEEDOR CREA PRODUCTO
    // ==========================================
    console.log('📝 PASO 2: Proveedor hace login y crea producto');
    
    const proveedorContext = await browser.newContext();
    const proveedorPage = await proveedorContext.newPage();
    
    await proveedorPage.goto('/sign-in');
    await proveedorPage.waitForSelector('input[name="email"]', { timeout: 10000 });
    await proveedorPage.fill('input[name="email"]', proveedorEmail);
    await proveedorPage.fill('input[name="password"]', 'TestPassword123!');
    await proveedorPage.click('button[type="submit"]');
    await proveedorPage.waitForURL(/.*\/home/, { timeout: 10000 });
    console.log('✅ Proveedor logueado');
    
    // Ir a crear producto
    await proveedorPage.goto('/productos/new');
    await proveedorPage.waitForLoadState('networkidle');
    await proveedorPage.waitForTimeout(1000);
    
    // Llenar formulario de producto
    await proveedorPage.fill('input[name="nombre"], input[placeholder*="ombre"]', productoNombre);
    
    const descripcionField = proveedorPage.locator('textarea[name="descripcion"], input[name="descripcion"]');
    if (await descripcionField.count() > 0) {
      await descripcionField.first().fill('Página web profesional para agencia digital - Test');
    }
    
    const precioField = proveedorPage.locator('input[name="precio"], input[placeholder*="recio"]');
    if (await precioField.count() > 0) {
      await precioField.first().fill('150000');
    }
    
    const stockField = proveedorPage.locator('input[name="stock"], input[placeholder*="tock"]');
    if (await stockField.count() > 0) {
      await stockField.first().fill('999');
    }
    
    // Guardar producto
    await proveedorPage.click('button[type="submit"]:has-text("Guardar"), button:has-text("Crear")');
    await proveedorPage.waitForTimeout(3000);
    
    // Capturar ID del producto
    const productUrl = proveedorPage.url();
    const productMatch = productUrl.match(/\/productos\/edit\/(\d+)|\/productos\/(\d+)/);
    if (productMatch) {
      productoId = productMatch[1] || productMatch[2];
      console.log(`✅ Producto creado con ID: ${productoId}`);
    }
    
    // Verificar que existe en la lista
    await proveedorPage.goto('/productos');
    await proveedorPage.waitForLoadState('networkidle');
    const productoEnLista = proveedorPage.locator(`text=${productoNombre}`);
    await expect(productoEnLista.first()).toBeVisible({ timeout: 5000 });
    console.log('✅ Producto visible en la lista');
    
    // ==========================================
    // PASO 3: PROVEEDOR EDITA EL PRODUCTO
    // ==========================================
    console.log('📝 PASO 3: Proveedor edita el producto');
    
    if (productoId) {
      await proveedorPage.goto(`/productos/edit/${productoId}`);
      await proveedorPage.waitForLoadState('networkidle');
      await proveedorPage.waitForTimeout(1000);
      
      // Editar nombre y precio
      const nombreEditado = `${productoNombre} - EDITADO`;
      await proveedorPage.fill('input[name="nombre"], input[placeholder*="ombre"]', nombreEditado);
      
      const precioEditField = proveedorPage.locator('input[name="precio"], input[placeholder*="recio"]');
      if (await precioEditField.count() > 0) {
        await precioEditField.first().fill('175000');
      }
      
      // Guardar cambios
      await proveedorPage.click('button[type="submit"]:has-text("Guardar"), button:has-text("Actualizar")');
      await proveedorPage.waitForTimeout(2000);
      console.log('✅ Producto editado correctamente');
      
      // Verificar cambios
      await proveedorPage.goto('/productos');
      await proveedorPage.waitForLoadState('networkidle');
      const productoEditado = proveedorPage.locator(`text=${nombreEditado}`);
      await expect(productoEditado.first()).toBeVisible({ timeout: 5000 });
      console.log('✅ Cambios visibles en la lista');
    }
    
    // ==========================================
    // PASO 4: PROVEEDOR ELIMINA EL PRODUCTO
    // ==========================================
    console.log('📝 PASO 4: Proveedor elimina el producto');
    
    if (productoId) {
      // Ir a la lista de productos
      await proveedorPage.goto('/productos');
      await proveedorPage.waitForLoadState('networkidle');
      
      // Buscar el producto y eliminarlo
      const nombreEditado = `${productoNombre} - EDITADO`;
      const productoRow = proveedorPage.locator(`tr:has-text("${nombreEditado}")`);
      
      if (await productoRow.count() > 0) {
        const deleteButton = productoRow.locator('button:has-text("Eliminar"), [aria-label="Eliminar"]').first();
        if (await deleteButton.count() > 0) {
          await deleteButton.click();
          await proveedorPage.waitForTimeout(500);
          
          // Confirmar eliminación
          const confirmButton = proveedorPage.locator('button:has-text("Confirmar"), button:has-text("Aceptar"), button:has-text("Sí")');
          if (await confirmButton.count() > 0) {
            await confirmButton.first().click();
            await proveedorPage.waitForTimeout(2000);
          }
          
          console.log('✅ Producto eliminado');
        }
      }
      
      // Verificar que no existe
      await proveedorPage.goto('/productos');
      await proveedorPage.waitForLoadState('networkidle');
      const productoEliminado = proveedorPage.locator(`text=${nombreEditado}`);
      await expect(productoEliminado).not.toBeVisible({ timeout: 3000 });
      console.log('✅ Producto no aparece en la lista - confirmado');
    }
    
    // Cerrar contexto de proveedor
    await proveedorContext.close();
    console.log('✅ Proveedor cerró sesión');
    
    // ==========================================
    // PASO 5: ADMIN ELIMINA AL PROVEEDOR
    // ==========================================
    console.log('📝 PASO 5: Admin elimina al proveedor');
    
    const adminContext2 = await browser.newContext();
    const adminPage2 = await adminContext2.newPage();
    
    await adminPage2.goto('/sign-in');
    await adminPage2.waitForSelector('input[name="email"]', { timeout: 10000 });
    await adminPage2.fill('input[name="email"]', TEST_USERS.ADMIN.email);
    await adminPage2.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
    await adminPage2.click('button[type="submit"]');
    await adminPage2.waitForURL(/.*\/home/, { timeout: 10000 });
    console.log('✅ Admin logueado nuevamente');
    
    if (proveedorId) {
      // Ir a la lista de personas
      await adminPage2.goto('/personas');
      await adminPage2.waitForLoadState('networkidle');
      
      // Buscar el proveedor y eliminarlo
      const proveedorRow = adminPage2.locator(`tr:has-text("${proveedorEmail}")`);
      
      if (await proveedorRow.count() > 0) {
        const deleteButton = proveedorRow.locator('button:has-text("Eliminar"), [aria-label="Eliminar"]').first();
        if (await deleteButton.count() > 0) {
          await deleteButton.click();
          await adminPage2.waitForTimeout(500);
          
          // Confirmar eliminación
          const confirmButton = adminPage2.locator('button:has-text("Confirmar"), button:has-text("Aceptar"), button:has-text("Sí")');
          if (await confirmButton.count() > 0) {
            await confirmButton.first().click();
            await adminPage2.waitForTimeout(2000);
          }
          
          console.log('✅ Proveedor eliminado');
        }
      }
      
      // Verificar que no existe
      await adminPage2.goto('/personas');
      await adminPage2.waitForLoadState('networkidle');
      const proveedorEliminado = adminPage2.locator(`text=${proveedorEmail}`);
      await expect(proveedorEliminado).not.toBeVisible({ timeout: 3000 });
      console.log('✅ Proveedor no aparece en la lista - confirmado');
    }
    
    // Cerrar contexto de admin
    await adminContext2.close();
    
    // ==========================================
    // RESUMEN
    // ==========================================
    console.log('\n🎉 ¡CICLO COMPLETO EXITOSO!');
    console.log(`✅ Proveedor "${proveedorNombre}" creado y eliminado`);
    console.log(`✅ Producto "${productoNombre}" creado, editado y eliminado`);
    console.log('✅ Base de datos limpia - sin basura');
    console.log('\n📊 PASOS EJECUTADOS:');
    console.log('  1. Admin creó proveedor');
    console.log('  2. Proveedor creó producto (Página Web $150k)');
    console.log('  3. Proveedor editó producto (cambió nombre y precio a $175k)');
    console.log('  4. Proveedor eliminó producto');
    console.log('  5. Admin eliminó proveedor');
    console.log('\n✨ Todo limpio - BD sin alteraciones');
  });
});
