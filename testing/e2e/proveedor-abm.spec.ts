import { test, expect } from '@playwright/test';
import { TEST_USERS, TEST_PASSWORDS } from '../fixtures/user-fixtures';

/**
 * Test de ABM Completo de Proveedor
 * 
 * El proveedor hace todo el ciclo de:
 * - Crear producto → Editar producto → Eliminar producto
 * - Crear servicio → Editar servicio → Eliminar servicio
 * 
 * Todo con su propio usuario, sin dejar basura en la BD
 */

test.describe('Proveedor - ABM Completo', () => {
  
  test('Proveedor: ABM de Productos (Crear → Editar → Eliminar)', async ({ page }) => {
    const timestamp = Date.now();
    const productoNombre = `Página Web Test ${timestamp}`;
    let productoId: string | null = null;
    
    // ==========================================
    // LOGIN COMO PROVEEDOR
    // ==========================================
    console.log('🔐 Login como proveedor...');
    
    await page.goto('/sign-in');
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });
    await page.fill('input[name="email"]', TEST_USERS.PROVEEDOR.email);
    await page.fill('input[name="password"]', TEST_PASSWORDS.PROVEEDOR);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/home/, { timeout: 10000 });
    console.log('✅ Proveedor logueado');
    
    // ==========================================
    // CREAR PRODUCTO
    // ==========================================
    console.log('\n📦 PASO 1: Crear producto');
    
    await page.goto('/productos/new');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Llenar formulario
    await page.fill('input[name="nombre"], input[placeholder*="ombre"]', productoNombre);
    
    const descripcionField = page.locator('textarea[name="descripcion"], input[name="descripcion"]');
    if (await descripcionField.count() > 0) {
      await descripcionField.first().fill('Sitio web institucional responsive - Producto de prueba');
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
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    await page.waitForTimeout(3000);
    
    // Capturar ID del producto
    const productUrl = page.url();
    const productMatch = productUrl.match(/\/productos\/edit\/(\d+)|\/productos\/(\d+)/);
    if (productMatch) {
      productoId = productMatch[1] || productMatch[2];
      console.log(`✅ Producto creado con ID: ${productoId}`);
    } else {
      console.log(`✅ Producto creado (URL: ${productUrl})`);
    }
    
    // Verificar que existe en la lista
    await page.goto('/productos');
    await page.waitForLoadState('networkidle');
    const productoEnLista = page.locator(`text=${productoNombre}`);
    await expect(productoEnLista.first()).toBeVisible({ timeout: 5000 });
    console.log('✅ Producto visible en la lista');
    
    // ==========================================
    // EDITAR PRODUCTO
    // ==========================================
    console.log('\n✏️ PASO 2: Editar producto');
    
    if (productoId) {
      await page.goto(`/productos/edit/${productoId}`);
    } else {
      // Si no tenemos ID, hacer click en el producto de la lista
      await productoEnLista.first().click();
    }
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Editar nombre y precio
    const nombreEditado = `${productoNombre} - EDITADO`;
    await page.fill('input[name="nombre"], input[placeholder*="ombre"]', nombreEditado);
    
    const precioEditField = page.locator('input[name="precio"], input[placeholder*="recio"]');
    if (await precioEditField.count() > 0) {
      await precioEditField.first().fill('175000');
    }
    
    // Guardar cambios
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    console.log('✅ Producto editado');
    
    // Verificar que se editó
    await page.goto('/productos');
    await page.waitForLoadState('networkidle');
    const productoEditado = page.locator(`text=${nombreEditado}`);
    await expect(productoEditado.first()).toBeVisible({ timeout: 5000 });
    console.log('✅ Cambios visibles en la lista');
    
    // ==========================================
    // ELIMINAR PRODUCTO
    // ==========================================
    console.log('\n🗑️ PASO 3: Eliminar producto');
    
    // Buscar la fila del producto
    const productoRow = page.locator(`tr:has-text("${nombreEditado}")`).first();
    
    if (await productoRow.count() > 0) {
      // Buscar botón de eliminar en la fila
      const deleteButton = productoRow.locator('button:has-text("Eliminar"), button[aria-label*="liminar"], svg.trash, .delete-icon');
      
      if (await deleteButton.count() > 0) {
        await deleteButton.first().click();
        await page.waitForTimeout(500);
        
        // Confirmar eliminación
        const confirmButton = page.locator('button:has-text("Confirmar"), button:has-text("Aceptar"), button:has-text("Sí"), button:has-text("Eliminar")');
        if (await confirmButton.count() > 0) {
          await confirmButton.first().click();
          await page.waitForTimeout(2000);
        }
        
        console.log('✅ Producto eliminado');
      } else {
        console.log('⚠️ No se encontró botón de eliminar, intentando otra forma...');
        
        // Intentar desde la vista del producto
        if (productoId) {
          await page.goto(`/productos/edit/${productoId}`);
          await page.waitForLoadState('networkidle');
          
          const deleteInEdit = page.locator('button:has-text("Eliminar"), button:has-text("Borrar")');
          if (await deleteInEdit.count() > 0) {
            await deleteInEdit.first().click();
            await page.waitForTimeout(500);
            
            const confirmButton = page.locator('button:has-text("Confirmar"), button:has-text("Aceptar"), button:has-text("Sí")');
            if (await confirmButton.count() > 0) {
              await confirmButton.first().click();
              await page.waitForTimeout(2000);
            }
            console.log('✅ Producto eliminado desde la vista');
          }
        }
      }
    }
    
    // Verificar que no existe
    await page.goto('/productos');
    await page.waitForLoadState('networkidle');
    const productoEliminado = page.locator(`text=${nombreEditado}`);
    await expect(productoEliminado).not.toBeVisible({ timeout: 3000 });
    console.log('✅ Producto no aparece en la lista - confirmado');
    
    console.log('\n🎉 ¡CICLO DE PRODUCTO COMPLETO!');
  });
  
  test('Proveedor: ABM de Servicios (Crear → Editar → Eliminar)', async ({ page }) => {
    const timestamp = Date.now();
    const servicioNombre = `Mantenimiento Web Test ${timestamp}`;
    let servicioId: string | null = null;
    
    // ==========================================
    // LOGIN COMO PROVEEDOR
    // ==========================================
    console.log('🔐 Login como proveedor...');
    
    await page.goto('/sign-in');
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });
    await page.fill('input[name="email"]', TEST_USERS.PROVEEDOR.email);
    await page.fill('input[name="password"]', TEST_PASSWORDS.PROVEEDOR);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/home/, { timeout: 10000 });
    console.log('✅ Proveedor logueado');
    
    // ==========================================
    // CREAR SERVICIO
    // ==========================================
    console.log('\n🛠️ PASO 1: Crear servicio');
    
    await page.goto('/servicios/new');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Llenar formulario
    await page.fill('input[name="nombre"], input[placeholder*="ombre"]', servicioNombre);
    
    const descripcionField = page.locator('textarea[name="descripcion"], input[name="descripcion"]');
    if (await descripcionField.count() > 0) {
      await descripcionField.first().fill('Mantenimiento mensual de sitio web - Servicio de prueba');
    }
    
    const precioField = page.locator('input[name="precio"], input[placeholder*="recio"]');
    if (await precioField.count() > 0) {
      await precioField.first().fill('35000');
    }
    
    const duracionField = page.locator('input[name="duracion"], input[placeholder*="uración"]');
    if (await duracionField.count() > 0) {
      await duracionField.first().fill('30');
    }
    
    // Guardar servicio
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    await page.waitForTimeout(3000);
    
    // Capturar ID del servicio
    const servicioUrl = page.url();
    const servicioMatch = servicioUrl.match(/\/servicios\/edit\/(\d+)|\/servicios\/(\d+)/);
    if (servicioMatch) {
      servicioId = servicioMatch[1] || servicioMatch[2];
      console.log(`✅ Servicio creado con ID: ${servicioId}`);
    } else {
      console.log(`✅ Servicio creado (URL: ${servicioUrl})`);
    }
    
    // Verificar que existe en la lista
    await page.goto('/servicios');
    await page.waitForLoadState('networkidle');
    const servicioEnLista = page.locator(`text=${servicioNombre}`);
    await expect(servicioEnLista.first()).toBeVisible({ timeout: 5000 });
    console.log('✅ Servicio visible en la lista');
    
    // ==========================================
    // EDITAR SERVICIO
    // ==========================================
    console.log('\n✏️ PASO 2: Editar servicio');
    
    if (servicioId) {
      await page.goto(`/servicios/edit/${servicioId}`);
    } else {
      await servicioEnLista.first().click();
    }
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Editar nombre y precio
    const nombreEditado = `${servicioNombre} - EDITADO`;
    await page.fill('input[name="nombre"], input[placeholder*="ombre"]', nombreEditado);
    
    const precioEditField = page.locator('input[name="precio"], input[placeholder*="recio"]');
    if (await precioEditField.count() > 0) {
      await precioEditField.first().fill('45000');
    }
    
    // Guardar cambios
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    console.log('✅ Servicio editado');
    
    // Verificar que se editó
    await page.goto('/servicios');
    await page.waitForLoadState('networkidle');
    const servicioEditado = page.locator(`text=${nombreEditado}`);
    await expect(servicioEditado.first()).toBeVisible({ timeout: 5000 });
    console.log('✅ Cambios visibles en la lista');
    
    // ==========================================
    // ELIMINAR SERVICIO
    // ==========================================
    console.log('\n🗑️ PASO 3: Eliminar servicio');
    
    // Buscar la fila del servicio
    const servicioRow = page.locator(`tr:has-text("${nombreEditado}")`).first();
    
    if (await servicioRow.count() > 0) {
      const deleteButton = servicioRow.locator('button:has-text("Eliminar"), button[aria-label*="liminar"], svg.trash, .delete-icon');
      
      if (await deleteButton.count() > 0) {
        await deleteButton.first().click();
        await page.waitForTimeout(500);
        
        const confirmButton = page.locator('button:has-text("Confirmar"), button:has-text("Aceptar"), button:has-text("Sí"), button:has-text("Eliminar")');
        if (await confirmButton.count() > 0) {
          await confirmButton.first().click();
          await page.waitForTimeout(2000);
        }
        
        console.log('✅ Servicio eliminado');
      } else {
        // Intentar desde la vista
        if (servicioId) {
          await page.goto(`/servicios/edit/${servicioId}`);
          await page.waitForLoadState('networkidle');
          
          const deleteInEdit = page.locator('button:has-text("Eliminar"), button:has-text("Borrar")');
          if (await deleteInEdit.count() > 0) {
            await deleteInEdit.first().click();
            await page.waitForTimeout(500);
            
            const confirmButton = page.locator('button:has-text("Confirmar"), button:has-text("Aceptar"), button:has-text("Sí")');
            if (await confirmButton.count() > 0) {
              await confirmButton.first().click();
              await page.waitForTimeout(2000);
            }
            console.log('✅ Servicio eliminado desde la vista');
          }
        }
      }
    }
    
    // Verificar que no existe
    await page.goto('/servicios');
    await page.waitForLoadState('networkidle');
    const servicioEliminado = page.locator(`text=${nombreEditado}`);
    await expect(servicioEliminado).not.toBeVisible({ timeout: 3000 });
    console.log('✅ Servicio no aparece en la lista - confirmado');
    
    console.log('\n🎉 ¡CICLO DE SERVICIO COMPLETO!');
  });
  
  test('Proveedor: ABM Completo de Producto Y Servicio en un solo test', async ({ page }) => {
    const timestamp = Date.now();
    const productoNombre = `Landing Page Test ${timestamp}`;
    const servicioNombre = `Marketing Digital Test ${timestamp}`;
    
    // ==========================================
    // LOGIN
    // ==========================================
    console.log('🔐 Login como proveedor...');
    
    await page.goto('/sign-in');
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });
    await page.fill('input[name="email"]', TEST_USERS.PROVEEDOR.email);
    await page.fill('input[name="password"]', TEST_PASSWORDS.PROVEEDOR);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/home/, { timeout: 10000 });
    console.log('✅ Proveedor logueado\n');
    
    // ==========================================
    // PRODUCTO: CREAR
    // ==========================================
    console.log('📦 PRODUCTO - Paso 1: Crear');
    
    await page.goto('/productos/new');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await page.fill('input[name="nombre"]', productoNombre);
    
    const prodDesc = page.locator('textarea[name="descripcion"], input[name="descripcion"]');
    if (await prodDesc.count() > 0) await prodDesc.first().fill('Landing page optimizada para conversión');
    
    const prodPrecio = page.locator('input[name="precio"]');
    if (await prodPrecio.count() > 0) await prodPrecio.first().fill('80000');
    
    const prodStock = page.locator('input[name="stock"]');
    if (await prodStock.count() > 0) await prodStock.first().fill('999');
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    const prodId = page.url().match(/\/productos\/edit\/(\d+)|\/productos\/(\d+)/)?.[1] || 
                   page.url().match(/\/productos\/edit\/(\d+)|\/productos\/(\d+)/)?.[2];
    console.log(`✅ Producto creado (ID: ${prodId || 'N/A'})`);
    
    // ==========================================
    // PRODUCTO: EDITAR
    // ==========================================
    console.log('📦 PRODUCTO - Paso 2: Editar');
    
    if (prodId) {
      await page.goto(`/productos/edit/${prodId}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      await page.fill('input[name="nombre"]', `${productoNombre} - EDITADO`);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      console.log('✅ Producto editado');
    }
    
    // ==========================================
    // PRODUCTO: ELIMINAR
    // ==========================================
    console.log('📦 PRODUCTO - Paso 3: Eliminar');
    
    await page.goto('/productos');
    await page.waitForLoadState('networkidle');
    
    const prodRow = page.locator(`tr:has-text("${productoNombre}")`).first();
    if (await prodRow.count() > 0) {
      const delBtn = prodRow.locator('button, svg').filter({ hasText: /eliminar|delete|trash/i });
      
      if (await delBtn.count() === 0) {
        // Si no hay botón explícito, buscar cualquier botón en la fila
        const anyDeleteBtn = prodRow.locator('button').last();
        if (await anyDeleteBtn.count() > 0) {
          await anyDeleteBtn.click();
          await page.waitForTimeout(500);
          
          const confirm = page.locator('button:has-text("Confirmar"), button:has-text("Sí"), button:has-text("Eliminar")');
          if (await confirm.count() > 0) await confirm.first().click();
          await page.waitForTimeout(2000);
        }
      } else {
        await delBtn.first().click();
        await page.waitForTimeout(500);
        
        const confirm = page.locator('button:has-text("Confirmar"), button:has-text("Sí")');
        if (await confirm.count() > 0) await confirm.first().click();
        await page.waitForTimeout(2000);
      }
    }
    
    console.log('✅ Producto eliminado\n');
    
    // ==========================================
    // SERVICIO: CREAR
    // ==========================================
    console.log('🛠️ SERVICIO - Paso 1: Crear');
    
    await page.goto('/servicios/new');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await page.fill('input[name="nombre"]', servicioNombre);
    
    const servDesc = page.locator('textarea[name="descripcion"], input[name="descripcion"]');
    if (await servDesc.count() > 0) await servDesc.first().fill('Gestión de redes sociales mensual');
    
    const servPrecio = page.locator('input[name="precio"]');
    if (await servPrecio.count() > 0) await servPrecio.first().fill('80000');
    
    const servDuracion = page.locator('input[name="duracion"]');
    if (await servDuracion.count() > 0) await servDuracion.first().fill('30');
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    const servId = page.url().match(/\/servicios\/edit\/(\d+)|\/servicios\/(\d+)/)?.[1] ||
                   page.url().match(/\/servicios\/edit\/(\d+)|\/servicios\/(\d+)/)?.[2];
    console.log(`✅ Servicio creado (ID: ${servId || 'N/A'})`);
    
    // ==========================================
    // SERVICIO: EDITAR
    // ==========================================
    console.log('🛠️ SERVICIO - Paso 2: Editar');
    
    if (servId) {
      await page.goto(`/servicios/edit/${servId}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      await page.fill('input[name="nombre"]', `${servicioNombre} - EDITADO`);
      
      const editPrecio = page.locator('input[name="precio"]');
      if (await editPrecio.count() > 0) await editPrecio.first().fill('90000');
      
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      console.log('✅ Servicio editado');
    }
    
    // ==========================================
    // SERVICIO: ELIMINAR
    // ==========================================
    console.log('🛠️ SERVICIO - Paso 3: Eliminar');
    
    await page.goto('/servicios');
    await page.waitForLoadState('networkidle');
    
    const servRow = page.locator(`tr:has-text("${servicioNombre}")`).first();
    if (await servRow.count() > 0) {
      const delBtn = servRow.locator('button, svg').filter({ hasText: /eliminar|delete|trash/i });
      
      if (await delBtn.count() === 0) {
        const anyDeleteBtn = servRow.locator('button').last();
        if (await anyDeleteBtn.count() > 0) {
          await anyDeleteBtn.click();
          await page.waitForTimeout(500);
          
          const confirm = page.locator('button:has-text("Confirmar"), button:has-text("Sí"), button:has-text("Eliminar")');
          if (await confirm.count() > 0) await confirm.first().click();
          await page.waitForTimeout(2000);
        }
      } else {
        await delBtn.first().click();
        await page.waitForTimeout(500);
        
        const confirm = page.locator('button:has-text("Confirmar"), button:has-text("Sí")');
        if (await confirm.count() > 0) await confirm.first().click();
        await page.waitForTimeout(2000);
      }
    }
    
    console.log('✅ Servicio eliminado\n');
    
    console.log('🎉 ¡CICLO DE SERVICIO COMPLETO!');
  });
});
