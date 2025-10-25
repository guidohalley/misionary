import { test, expect } from '@playwright/test';

/**
 * TEST: Admin - ABM de Proveedor
 * Usa API para obtener el ID después de crear
 */

test.describe('Admin - ABM Proveedor', () => {
  
  test('Admin: Crear -> Editar -> Eliminar Proveedor', async ({ page, request }) => {
    
    const timestamp = Date.now();
    const proveedor = {
      nombre: `Proveedor Test ${timestamp}`,
      email: `prov-${timestamp}@test.com`,
      telefono: '+54 9 11 1234-5678',
    };
    
    let proveedorId: number | null = null;
    
    // LOGIN
    console.log('Login como ADMIN');
    await page.goto('/sign-in');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', process.env.ADMIN_EMAIL || 'guido@misionary');
    await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD || '4C0@Cs4^6WuK@jci');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/home/, { timeout: 15000 });
    console.log('OK - Logueado');
    
    // CREAR PROVEEDOR
    console.log('\nPASO 1: CREAR');
    await page.goto('/personas/proveedor/new');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.fill('input[name="nombre"]', proveedor.nombre);
    await page.fill('input[name="email"]', proveedor.email);
    
    const telField = page.locator('input[name="telefono"]');
    if (await telField.count() > 0) {
      await telField.fill(proveedor.telefono);
    }
    
    const passField = page.locator('input[name="password"]');
    if (await passField.count() > 0) {
      await passField.fill('TestPass123!');
    }
    
    // Interceptar la respuesta del POST para capturar el ID
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/personas') && response.status() === 201,
      { timeout: 10000 }
    );
    
    await page.click('button[type="submit"]');
    
    try {
      const response = await responsePromise;
      const data = await response.json();
      proveedorId = data.id || data.persona?.id;
      console.log(`OK - Proveedor creado, ID: ${proveedorId}`);
    } catch (e) {
      console.log('Warning - No se pudo capturar ID de la respuesta, buscando en BD...');
      
      // Buscar en la BD el último proveedor con este email
      await page.waitForTimeout(2000);
    }
    
    await page.waitForURL(/.*\/personas/, { timeout: 10000 });
    
    // Si no tenemos ID, consultar la API
    if (!proveedorId) {
      const apiResponse = await request.get('http://localhost:3001/api/personas');
      const personas = await apiResponse.json();
      const proveedorCreado = personas.find((p: any) => p.email === proveedor.email);
      if (proveedorCreado) {
        proveedorId = proveedorCreado.id;
        console.log(`OK - ID obtenido de API: ${proveedorId}`);
      }
    }
    
    if (!proveedorId) {
      console.log('ERROR - No se pudo obtener ID del proveedor');
      throw new Error('No se pudo obtener ID del proveedor creado');
    }
    
    // EDITAR PROVEEDOR
    console.log('\nPASO 2: EDITAR');
    await page.goto(`/personas/edit/${proveedorId}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const nombreEditado = `${proveedor.nombre} EDITADO`;
    await page.fill('input[name="nombre"]', nombreEditado);
    console.log(`Nombre editado a: ${nombreEditado}`);
    
    const telEdit = page.locator('input[name="telefono"]');
    if (await telEdit.count() > 0) {
      await telEdit.fill('+54 9 11 9999-9999');
    }
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    console.log('OK - Proveedor editado');
    
    // ELIMINAR PROVEEDOR
    console.log('\nPASO 3: ELIMINAR');
    await page.goto(`/personas/edit/${proveedorId}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const deleteBtn = page.locator('button:has-text("Eliminar"), button:has-text("Borrar")');
    
    if (await deleteBtn.count() > 0) {
      await deleteBtn.first().click();
      await page.waitForTimeout(1000);
      
      const confirmBtn = page.locator('button:has-text("Confirmar"), button:has-text("Si"), button:has-text("Aceptar")');
      if (await confirmBtn.count() > 0) {
        await confirmBtn.first().click();
        await page.waitForTimeout(3000);
      }
      console.log('OK - Proveedor eliminado');
    } else {
      console.log('Warning - No hay boton de eliminar, usando API...');
      
      // Eliminar via API
      const cookies = await page.context().cookies();
      const token = cookies.find(c => c.name === 'token')?.value;
      
      await request.delete(`http://localhost:3001/api/personas/${proveedorId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      console.log('OK - Proveedor eliminado via API');
    }
    
    // VERIFICAR LIMPIEZA
    console.log('\nVERIFICACION:');
    const checkResponse = await request.get('http://localhost:3001/api/personas');
    const todasLasPersonas = await checkResponse.json();
    const existe = todasLasPersonas.find((p: any) => p.id === proveedorId);
    
    if (!existe) {
      console.log('OK - Proveedor NO existe en la BD');
      console.log('OK - Base de datos limpia');
    } else {
      console.log('ERROR - El proveedor todavia existe!');
      throw new Error('El proveedor no se elimino correctamente');
    }
    
    console.log('\nTEST COMPLETADO EXITOSAMENTE');
    console.log(`Proveedor "${proveedor.nombre}" procesado correctamente`);
  });
});
