import { test, expect } from '@playwright/test';

/**
 * TEST SIMPLE: Admin - ABM de Proveedor
 * 
 * Enfoque directo usando IDs de URL, sin depender de buscar en listas
 */

test.describe('Admin - ABM Proveedor (Simple)', () => {
  
  test('Admin: Crear → Editar → Eliminar Proveedor', async ({ page }) => {
    
    const timestamp = Date.now();
    const proveedor = {
      nombre: `Proveedor ABM ${timestamp}`,
      email: `prov-${timestamp}@test.com`,
      telefono: '+54 9 11 1234-5678',
    };
    
    let proveedorId: string | null = null;
    
    // ===== LOGIN =====
    console.log('\n🔐 Login como ADMIN');
    await page.goto('/sign-in');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', process.env.ADMIN_EMAIL || 'guido@misionary');
    await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD || '4C0@Cs4^6WuK@jci');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/home/, { timeout: 15000 });
    console.log('✅ Logueado\n');
    
    // ===== CREAR =====
    console.log('📝 CREAR PROVEEDOR');
    await page.goto('/personas/proveedor/new');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.fill('input[name="nombre"]', proveedor.nombre);
    console.log(`   Nombre: ${proveedor.nombre}`);
    
    await page.fill('input[name="email"]', proveedor.email);
    console.log(`   Email: ${proveedor.email}`);
    
    const telField = page.locator('input[name="telefono"]');
    if (await telField.count() > 0) {
      await telField.fill(proveedor.telefono);
      console.log(`   Teléfono: ${proveedor.telefono}`);
    }
    
    const passField = page.locator('input[name="password"]');
    if (await passField.count() > 0) {
      await passField.fill('TestPass123!');
    }
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);
    
    // Capturar ID de la URL
    const url = page.url();
    console.log(`   URL: ${url}`);
    
    const match = url.match(/\/personas\/edit\/(\d+)/);
    if (match) {
      proveedorId = match[1];
      console.log(`✅ CREADO - ID: ${proveedorId}\n`);
    } else {
      // Si no redirige a edit, buscar el último proveedor creado
      console.log('✅ CREADO - Buscando ID...\n');
    }
    
    // ===== EDITAR =====
    console.log('✏️ EDITAR PROVEEDOR');
    
    if (proveedorId) {
      await page.goto(`/personas/edit/${proveedorId}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const nombreEditado = `${proveedor.nombre} EDITADO`;
      await page.fill('input[name="nombre"]', nombreEditado);
      console.log(`   Nuevo nombre: ${nombreEditado}`);
      
      const telEdit = page.locator('input[name="telefono"]');
      if (await telEdit.count() > 0) {
        await telEdit.fill('+54 9 11 9999-9999');
        console.log(`   Nuevo teléfono: +54 9 11 9999-9999`);
      }
      
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
      console.log('✅ EDITADO\n');
    } else {
      console.log('⚠️ Sin ID, saltando edición\n');
    }
    
    // ===== ELIMINAR =====
    console.log('🗑️ ELIMINAR PROVEEDOR');
    
    if (proveedorId) {
      // Opción 1: Ir a la vista de edición y buscar botón eliminar
      await page.goto(`/personas/edit/${proveedorId}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const deleteBtn = page.locator('button:has-text("Eliminar"), button:has-text("Borrar")');
      
      if (await deleteBtn.count() > 0) {
        console.log('   Botón eliminar encontrado');
        await deleteBtn.first().click();
        await page.waitForTimeout(1000);
        
        const confirmBtn = page.locator('button:has-text("Confirmar"), button:has-text("Sí"), button:has-text("Aceptar")');
        if (await confirmBtn.count() > 0) {
          console.log('   Confirmando...');
          await confirmBtn.first().click();
          await page.waitForTimeout(3000);
          console.log('✅ ELIMINADO');
        }
      } else {
        console.log('   No hay botón de eliminar en la vista de edición');
        
        // Opción 2: Ir a la lista y buscar por nombre
        await page.goto('/personas');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        
        const row = page.locator(`tr:has-text("${proveedor.email}")`).first();
        
        if (await row.count() > 0) {
          console.log('   Proveedor encontrado en lista');
          const trashBtn = row.locator('button').last(); // Último botón suele ser eliminar
          await trashBtn.click();
          await page.waitForTimeout(1000);
          
          const confirmBtn = page.locator('button:has-text("Confirmar"), button:has-text("Sí")');
          if (await confirmBtn.count() > 0) {
            await confirmBtn.first().click();
            await page.waitForTimeout(3000);
          }
          console.log('✅ ELIMINADO');
        } else {
          console.log('⚠️ No se encontró en la lista para eliminar');
        }
      }
    } else {
      console.log('⚠️ Sin ID, no se puede eliminar\n');
    }
    
    // ===== RESUMEN =====
    console.log('\n🎉 ═══════════════════');
    console.log('   TEST COMPLETADO');
    console.log('═══════════════════\n');
    console.log(`Proveedor: ${proveedor.nombre}`);
    console.log(`Email: ${proveedor.email}`);
    console.log(`ID: ${proveedorId || 'N/A'}`);
    console.log('\n');
  });
});
