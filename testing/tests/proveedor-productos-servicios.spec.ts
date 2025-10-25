import { test, expect } from '@playwright/test';

/**
 * TEST: Proveedor - Crear Productos y Servicios
 * 
 * El proveedor crea productos y servicios con datos random
 * NO los elimina - genera data realista para el sistema
 */

// Generar número random entre min y max
function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generar precio random para agencia digital
function randomPrecio(): string {
  const precios = [80000, 120000, 150000, 200000, 350000, 500000, 750000];
  return precios[randomNumber(0, precios.length - 1)].toString();
}

test.describe('Proveedor - Crear Productos y Servicios', () => {
  
  test('Proveedor: Crear Producto Web con datos random', async ({ page }) => {
    
    const timestamp = Date.now();
    const producto = {
      nombre: `Pagina Web ${randomNumber(1, 999)}`,
      descripcion: `Sitio web profesional para agencia digital - Test ${timestamp}`,
      precio: randomPrecio(),
      stock: '999',
    };
    
    // LOGIN COMO PROVEEDOR
    console.log('LOGIN como PROVEEDOR');
    await page.goto('/sign-in');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', process.env.PROVEEDOR_EMAIL || 'proveedor@misionary.com');
    await page.fill('input[name="password"]', process.env.PROVEEDOR_PASSWORD || 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/home/, { timeout: 15000 });
    console.log('OK - Logueado');
    
    // CREAR PRODUCTO
    console.log('\nCREAR PRODUCTO');
    await page.goto('/productos/new');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log(`  Nombre: ${producto.nombre}`);
    await page.fill('input[name="nombre"]', producto.nombre);
    
    const descField = page.locator('textarea[name="descripcion"], input[name="descripcion"]');
    if (await descField.count() > 0) {
      console.log(`  Descripcion: ${producto.descripcion}`);
      await descField.first().fill(producto.descripcion);
    }
    
    const precioField = page.locator('input[name="precio"]');
    if (await precioField.count() > 0) {
      console.log(`  Precio: $${producto.precio}`);
      await precioField.first().fill(producto.precio);
    }
    
    const stockField = page.locator('input[name="stock"]');
    if (await stockField.count() > 0) {
      console.log(`  Stock: ${producto.stock}`);
      await stockField.first().fill(producto.stock);
    }
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    const urlDespuesCrear = page.url();
    console.log('OK - Producto creado');
    console.log(`URL: ${urlDespuesCrear}`);
    
    // Capturar ID del producto
    let productoId: string | null = null;
    const matchId = urlDespuesCrear.match(/\/productos\/edit\/(\d+)/);
    if (matchId) {
      productoId = matchId[1];
      console.log(`ID: ${productoId}`);
    }
    
    // EDITAR PRODUCTO
    console.log('\nEDITAR PRODUCTO');
    
    if (productoId) {
      await page.goto(`/productos/edit/${productoId}`);
    } else {
      // Si no tenemos ID, buscar en la lista
      await page.goto('/productos');
      await page.waitForLoadState('networkidle');
      const row = page.locator(`tr:has-text("${producto.nombre}")`).first();
      const editBtn = row.locator('button').nth(1);
      await editBtn.click();
    }
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Cambiar precio
    const nuevoPrecio = randomPrecio();
    const precioEdit = page.locator('input[name="precio"]');
    if (await precioEdit.count() > 0) {
      console.log(`  Nuevo precio: $${nuevoPrecio} (antes: $${producto.precio})`);
      await precioEdit.first().fill(nuevoPrecio);
    }
    
    // Cambiar descripción
    const descEdit = page.locator('textarea[name="descripcion"], input[name="descripcion"]');
    if (await descEdit.count() > 0) {
      console.log(`  Descripcion actualizada`);
      await descEdit.first().fill(`${producto.descripcion} - EDITADO`);
    }
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    console.log('OK - Producto editado');
    
    // Verificar en la lista
    await page.goto('/productos');
    await page.waitForLoadState('networkidle');
    
    const productoEnLista = page.locator(`text=${producto.nombre}`);
    await expect(productoEnLista.first()).toBeVisible({ timeout: 5000 });
    console.log('OK - Producto visible en la lista');
    
    console.log('\nPRODUCTO CREADO Y EDITADO');
    console.log('(Queda en el sistema)');
  });
  
  test('Proveedor: Crear Servicio con datos random', async ({ page }) => {
    
    const timestamp = Date.now();
    const servicios = [
      'Mantenimiento Web',
      'Marketing Digital',
      'Produccion Audiovisual',
      'Diseno Grafico',
      'SEO',
      'Community Manager',
      'Edicion de Video',
    ];
    
    const servicio = {
      nombre: `${servicios[randomNumber(0, servicios.length - 1)]} ${randomNumber(100, 999)}`,
      descripcion: `Servicio profesional para agencia digital - Test ${timestamp}`,
      precio: randomNumber(30000, 150000).toString(),
      duracion: randomNumber(15, 90).toString(),
    };
    
    // LOGIN COMO PROVEEDOR
    console.log('LOGIN como PROVEEDOR');
    await page.goto('/sign-in');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', process.env.PROVEEDOR_EMAIL || 'proveedor@misionary.com');
    await page.fill('input[name="password"]', process.env.PROVEEDOR_PASSWORD || 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/home/, { timeout: 15000 });
    console.log('OK - Logueado');
    
    // CREAR SERVICIO
    console.log('\nCREAR SERVICIO');
    await page.goto('/servicios/new');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log(`  Nombre: ${servicio.nombre}`);
    await page.fill('input[name="nombre"]', servicio.nombre);
    
    const descField = page.locator('textarea[name="descripcion"], input[name="descripcion"]');
    if (await descField.count() > 0) {
      console.log(`  Descripcion: ${servicio.descripcion}`);
      await descField.first().fill(servicio.descripcion);
    }
    
    const precioField = page.locator('input[name="precio"]');
    if (await precioField.count() > 0) {
      console.log(`  Precio: $${servicio.precio}`);
      await precioField.first().fill(servicio.precio);
    }
    
    const duracionField = page.locator('input[name="duracion"]');
    if (await duracionField.count() > 0) {
      console.log(`  Duracion: ${servicio.duracion} dias`);
      await duracionField.first().fill(servicio.duracion);
    }
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    const urlDespuesCrear = page.url();
    console.log('OK - Servicio creado');
    console.log(`URL: ${urlDespuesCrear}`);
    
    // Capturar ID del servicio
    let servicioId: string | null = null;
    const matchId = urlDespuesCrear.match(/\/servicios\/edit\/(\d+)/);
    if (matchId) {
      servicioId = matchId[1];
      console.log(`ID: ${servicioId}`);
    }
    
    // EDITAR SERVICIO
    console.log('\nEDITAR SERVICIO');
    
    if (servicioId) {
      await page.goto(`/servicios/edit/${servicioId}`);
    } else {
      // Si no tenemos ID, buscar en la lista
      await page.goto('/servicios');
      await page.waitForLoadState('networkidle');
      const row = page.locator(`tr:has-text("${servicio.nombre}")`).first();
      const editBtn = row.locator('button').nth(1);
      await editBtn.click();
    }
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Cambiar precio y duración
    const nuevoPrecio = randomNumber(30000, 150000).toString();
    const nuevaDuracion = randomNumber(15, 90).toString();
    
    const precioEdit = page.locator('input[name="precio"]');
    if (await precioEdit.count() > 0) {
      console.log(`  Nuevo precio: $${nuevoPrecio} (antes: $${servicio.precio})`);
      await precioEdit.first().fill(nuevoPrecio);
    }
    
    const duracionEdit = page.locator('input[name="duracion"]');
    if (await duracionEdit.count() > 0) {
      console.log(`  Nueva duracion: ${nuevaDuracion} dias (antes: ${servicio.duracion})`);
      await duracionEdit.first().fill(nuevaDuracion);
    }
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    console.log('OK - Servicio editado');
    
    // Verificar en la lista
    await page.goto('/servicios');
    await page.waitForLoadState('networkidle');
    
    const servicioEnLista = page.locator(`text=${servicio.nombre}`);
    await expect(servicioEnLista.first()).toBeVisible({ timeout: 5000 });
    console.log('OK - Servicio visible en la lista');
    
    console.log('\nSERVICIO CREADO Y EDITADO');
    console.log('(Queda en el sistema)');
  });
  
  test('Proveedor: Crear 3 Productos random', async ({ page }) => {
    
    // LOGIN
    console.log('LOGIN como PROVEEDOR');
    await page.goto('/sign-in');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', process.env.PROVEEDOR_EMAIL || 'proveedor@misionary.com');
    await page.fill('input[name="password"]', process.env.PROVEEDOR_PASSWORD || 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/home/, { timeout: 15000 });
    console.log('OK - Logueado\n');
    
    // CREAR Y EDITAR 3 PRODUCTOS
    for (let i = 1; i <= 3; i++) {
      const tipos = ['Landing Page', 'E-commerce', 'Blog', 'Portfolio', 'Web App'];
      
      const producto = {
        nombre: `${tipos[randomNumber(0, tipos.length - 1)]} ${randomNumber(100, 999)}`,
        descripcion: `Producto web profesional #${i}`,
        precio: randomPrecio(),
      };
      
      console.log(`PRODUCTO ${i}/3 - CREAR`);
      await page.goto('/productos/new');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);
      
      console.log(`  ${producto.nombre} - $${producto.precio}`);
      
      await page.fill('input[name="nombre"]', producto.nombre);
      
      const desc = page.locator('textarea[name="descripcion"], input[name="descripcion"]');
      if (await desc.count() > 0) await desc.first().fill(producto.descripcion);
      
      const precio = page.locator('input[name="precio"]');
      if (await precio.count() > 0) await precio.first().fill(producto.precio);
      
      const stock = page.locator('input[name="stock"]');
      if (await stock.count() > 0) await stock.first().fill('999');
      
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      
      const url = page.url();
      const idMatch = url.match(/\/productos\/edit\/(\d+)/);
      const prodId = idMatch ? idMatch[1] : null;
      
      console.log(`  OK - Producto ${i} creado (ID: ${prodId})`);
      
      // EDITAR INMEDIATAMENTE
      if (prodId) {
        console.log(`PRODUCTO ${i}/3 - EDITAR`);
        await page.goto(`/productos/edit/${prodId}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1500);
        
        const nuevoPrecio = randomPrecio();
        const precioEdit = page.locator('input[name="precio"]');
        if (await precioEdit.count() > 0) {
          console.log(`  Nuevo precio: $${nuevoPrecio}`);
          await precioEdit.first().fill(nuevoPrecio);
        }
        
        await page.click('button[type="submit"]');
        await page.waitForTimeout(2000);
        console.log(`  OK - Producto ${i} editado\n`);
      }
    }
    
    console.log('3 PRODUCTOS CREADOS Y EDITADOS');
    console.log('(Quedan en el sistema)');
  });
});
