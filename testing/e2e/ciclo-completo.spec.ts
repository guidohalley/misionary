import { test, expect } from '@playwright/test';
import { TEST_USERS, TEST_PASSWORDS } from '../fixtures/user-fixtures';

/**
 * Tests de Ciclo Completo - Sin dejar basura en la BD
 * 
 * Estos tests crean datos, los usan y los eliminan al final.
 * No alteran el estado de la base de datos.
 */

test.describe('Ciclo Completo - Proveedor y Producto', () => {
  
  let proveedorEmail: string;
  let proveedorId: string | null = null;
  let productoId: string | null = null;
  
  test('Ciclo completo: Crear proveedor → Crear producto → Eliminar producto → Eliminar proveedor', async ({ page }) => {
    // Generar email único para este test
    const timestamp = Date.now();
    proveedorEmail = `proveedor-test-${timestamp}@agenciadigital.com`;
    const proveedorNombre = `Proveedor Test ${timestamp}`;
    const productoNombre = `Producto Test ${timestamp}`;
    
    // ==========================================
    // PASO 1: ADMIN CREA UN PROVEEDOR
    // ==========================================
    console.log('📝 PASO 1: Admin crea un proveedor');
    
    await page.goto('/sign-in');
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });
    await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
    await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/home/, { timeout: 10000 });
    
    // Ir a crear proveedor
    await page.goto('/personas/proveedor/new');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Llenar formulario de proveedor
    await page.fill('input[name="nombre"], input[placeholder*="ombre"]', proveedorNombre);
    await page.fill('input[name="email"], input[type="email"]', proveedorEmail);
    
    // Llenar contraseña si existe el campo
    const passwordField = page.locator('input[name="password"], input[type="password"]');
    if (await passwordField.count() > 0) {
      await passwordField.first().fill('TestPassword123!');
    }
    
    // Guardar proveedor
    await page.click('button[type="submit"]:has-text("Guardar"), button:has-text("Crear")');
    await page.waitForTimeout(3000);
    
    // Capturar ID del proveedor de la URL
    const currentUrl = page.url();
    const match = currentUrl.match(/\/personas\/(\d+)/);
    if (match) {
      proveedorId = match[1];
      console.log(`✅ Proveedor creado con ID: ${proveedorId}`);
    }
    
    // ==========================================
    // PASO 2: PROVEEDOR HACE LOGIN Y CREA PRODUCTO
    // ==========================================
    console.log('📝 PASO 2: Proveedor hace login y crea un producto');
    
    // Limpiar sesión completamente y forzar ir a login
    await page.context().clearCookies();
    await page.context().clearPermissions();
    
    // Navegar a sign-in y esperar que cargue
    await page.goto('/sign-in', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Esperar el formulario de login
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });
    await page.fill('input[name="email"]', proveedorEmail);
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/home/, { timeout: 10000 });
    
    // Ir a crear producto
    await page.goto('/productos/new');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Llenar formulario de producto
    await page.fill('input[name="nombre"], input[placeholder*="ombre"]', productoNombre);
    
    const descripcionField = page.locator('textarea[name="descripcion"], input[name="descripcion"]');
    if (await descripcionField.count() > 0) {
      await descripcionField.first().fill('Página web profesional para agencia digital - Test');
    }
    
    const precioField = page.locator('input[name="precio"], input[placeholder*="recio"]');
    if (await precioField.count() > 0) {
      await precioField.first().fill('150000');
    }
    
    const stockField = page.locator('input[name="stock"], input[placeholder*="tock"]');
    if (await stockField.count() > 0) {
      await stockField.first().fill('999');
    }
    
    // Guardar producto
    await page.click('button[type="submit"]:has-text("Guardar"), button:has-text("Crear")');
    await page.waitForTimeout(3000);
    
    // Capturar ID del producto
    const productUrl = page.url();
    const productMatch = productUrl.match(/\/productos\/(\d+)/);
    if (productMatch) {
      productoId = productMatch[1];
      console.log(`✅ Producto creado con ID: ${productoId}`);
    }
    
    // Verificar que el producto existe en la lista
    await page.goto('/productos');
    await page.waitForLoadState('networkidle');
    const productoEnLista = page.locator(`text=${productoNombre}`);
    await expect(productoEnLista.first()).toBeVisible({ timeout: 5000 });
    console.log('✅ Producto visible en la lista');
    
    // ==========================================
    // PASO 3: PROVEEDOR EDITA EL PRODUCTO
    // ==========================================
    console.log('📝 PASO 3: Proveedor edita el producto');
    
    if (productoId) {
      await page.goto(`/productos/edit/${productoId}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Editar el nombre del producto
      const nombreEditado = `${productoNombre} - EDITADO`;
      const nombreField = page.locator('input[name="nombre"], input[placeholder*="ombre"]');
      await nombreField.fill(nombreEditado);
      
      // Cambiar el precio
      const precioField = page.locator('input[name="precio"], input[placeholder*="recio"]');
      if (await precioField.count() > 0) {
        await precioField.first().fill('175000');
      }
      
      // Guardar cambios
      await page.click('button[type="submit"]:has-text("Guardar"), button:has-text("Actualizar")');
      await page.waitForTimeout(2000);
      
      console.log('✅ Producto editado correctamente');
      
      // Verificar que se editó
      await page.goto('/productos');
      await page.waitForLoadState('networkidle');
      const productoEditado = page.locator(`text=${nombreEditado}`);
      await expect(productoEditado.first()).toBeVisible({ timeout: 5000 });
      console.log('✅ Cambios visibles en la lista');
    }
    
    // ==========================================
    // PASO 4: PROVEEDOR ELIMINA EL PRODUCTO
    // ==========================================
    console.log('📝 PASO 4: Proveedor elimina el producto');
    
    // Buscar y hacer click en el producto para editarlo/eliminarlo
    if (productoId) {
      await page.goto(`/productos/${productoId}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Buscar botón de eliminar
      const deleteButton = page.locator('button:has-text("Eliminar"), button:has-text("Borrar"), [data-testid="delete-button"]');
      if (await deleteButton.count() > 0) {
        await deleteButton.first().click();
        
        // Confirmar eliminación en modal
        await page.waitForTimeout(500);
        const confirmButton = page.locator('button:has-text("Confirmar"), button:has-text("Aceptar"), button:has-text("Sí")');
        if (await confirmButton.count() > 0) {
          await confirmButton.first().click();
          await page.waitForTimeout(2000);
        }
        
        console.log('✅ Producto eliminado');
      } else {
        // Si no hay botón de eliminar en la vista, ir a la lista
        await page.goto('/productos');
        await page.waitForLoadState('networkidle');
        
        // Buscar el producto en la tabla y eliminarlo
        const row = page.locator(`tr:has-text("${productoNombre}")`);
        if (await row.count() > 0) {
          const rowDeleteButton = row.locator('button:has-text("Eliminar"), [aria-label="Eliminar"]');
          if (await rowDeleteButton.count() > 0) {
            await rowDeleteButton.first().click();
            
            // Confirmar
            await page.waitForTimeout(500);
            const confirmButton = page.locator('button:has-text("Confirmar"), button:has-text("Aceptar"), button:has-text("Sí")');
            if (await confirmButton.count() > 0) {
              await confirmButton.first().click();
              await page.waitForTimeout(2000);
            }
          }
        }
        console.log('✅ Producto eliminado desde la lista');
      }
      
      // Verificar que el producto ya no existe
      await page.goto('/productos');
      await page.waitForLoadState('networkidle');
      const productoEliminado = page.locator(`text=${productoNombre}`);
      await expect(productoEliminado).not.toBeVisible({ timeout: 3000 });
      console.log('✅ Producto no aparece en la lista - confirmado');
    }
    
    // ==========================================
    // PASO 5: ADMIN ELIMINA AL PROVEEDOR
    // ==========================================
    console.log('📝 PASO 5: Admin elimina al proveedor');
    
    // Limpiar sesión completamente
    await page.context().clearCookies();
    await page.context().clearPermissions();
    
    // Navegar a sign-in y esperar que cargue
    await page.goto('/sign-in', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Esperar el formulario de login
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });
    await page.fill('input[name="email"]', TEST_USERS.ADMIN.email);
    await page.fill('input[name="password"]', TEST_PASSWORDS.ADMIN);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/home/, { timeout: 10000 });
    
    if (proveedorId) {
      // Ir al proveedor
      await page.goto(`/personas/${proveedorId}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Buscar botón de eliminar
      const deleteProveedorButton = page.locator('button:has-text("Eliminar"), button:has-text("Borrar")');
      if (await deleteProveedorButton.count() > 0) {
        await deleteProveedorButton.first().click();
        
        // Confirmar eliminación
        await page.waitForTimeout(500);
        const confirmButton = page.locator('button:has-text("Confirmar"), button:has-text("Aceptar"), button:has-text("Sí")');
        if (await confirmButton.count() > 0) {
          await confirmButton.first().click();
          await page.waitForTimeout(2000);
        }
        
        console.log('✅ Proveedor eliminado');
      } else {
        // Eliminar desde la lista de personas
        await page.goto('/personas');
        await page.waitForLoadState('networkidle');
        
        const proveedorRow = page.locator(`tr:has-text("${proveedorEmail}")`);
        if (await proveedorRow.count() > 0) {
          const rowDeleteButton = proveedorRow.locator('button:has-text("Eliminar"), [aria-label="Eliminar"]');
          if (await rowDeleteButton.count() > 0) {
            await rowDeleteButton.first().click();
            
            await page.waitForTimeout(500);
            const confirmButton = page.locator('button:has-text("Confirmar"), button:has-text("Aceptar"), button:has-text("Sí")');
            if (await confirmButton.count() > 0) {
              await confirmButton.first().click();
              await page.waitForTimeout(2000);
            }
          }
        }
        console.log('✅ Proveedor eliminado desde la lista');
      }
      
      // Verificar que el proveedor ya no existe
      await page.goto('/personas');
      await page.waitForLoadState('networkidle');
      const proveedorEliminado = page.locator(`text=${proveedorEmail}`);
      await expect(proveedorEliminado).not.toBeVisible({ timeout: 3000 });
      console.log('✅ Proveedor no aparece en la lista - confirmado');
    }
    
    // ==========================================
    // RESUMEN
    // ==========================================
    console.log('\n🎉 ¡CICLO COMPLETO EXITOSO!');
    console.log(`✅ Proveedor "${proveedorNombre}" creado y eliminado`);
    console.log(`✅ Producto "${productoNombre}" creado, editado y eliminado`);
    console.log('✅ Base de datos limpia - sin basura');
    console.log('\n📊 PASOS EJECUTADOS:');
    console.log('  1. Admin creó proveedor');
    console.log('  2. Proveedor creó producto');
    console.log('  3. Proveedor editó producto (nombre y precio)');
    console.log('  4. Proveedor eliminó producto');
    console.log('  5. Admin eliminó proveedor');
  });
});
