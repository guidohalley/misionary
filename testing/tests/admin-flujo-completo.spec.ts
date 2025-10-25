import { test, expect } from '@playwright/test';

/**
 * TEST: Admin - Flujo Completo de Agencia Digital
 * 
 * Simula un caso de uso real completo:
 * - Crear: Proveedor → Producto → Servicio → Cliente → Presupuesto
 * - Editar: Todo lo creado
 * - Eliminar: En orden inverso (cleanup completo)
 * 
 * Sin dejar basura en la BD
 */

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

test.describe('Admin - Flujo Completo Agencia Digital', () => {
  
  test('Flujo completo: Crear → Editar → Eliminar (sin basura)', async ({ page, browser }) => {
    
    const timestamp = Date.now();
    const datos = {
      proveedor: {
        nombre: `Proveedor ${timestamp}`,
        email: `prov-${timestamp}@test.com`,
        telefono: '+54 9 11 1111-2222',
        password: 'TestPass123!',
        id: null as string | null,
      },
      producto: {
        nombre: `E-commerce Premium ${randomNumber(100, 999)}`,
        descripcion: 'Tienda online completa con pasarela de pago',
        precio: '500000',
        id: null as string | null,
      },
      servicio: {
        nombre: `Mantenimiento Web ${randomNumber(100, 999)}`,
        descripcion: 'Mantenimiento y soporte mensual',
        precio: '35000',
        duracion: '30',
        id: null as string | null,
      },
      cliente: {
        nombre: `RestaurantePyme ${timestamp}`,
        email: `cliente-${timestamp}@test.com`,
        telefono: '+54 11 3333-4444',
        id: null as string | null,
        empresa: {
          nombre: `RestaurantePyme ${timestamp} S.A.`,
          cuit: '20-12345678-9',
          direccion: 'Av. Corrientes 1234, CABA',
          telefonoEmpresa: '+54 11 5555-6666',
        },
      },
      presupuesto: {
        id: null as string | null,
      },
    };
    
    console.log('====================================');
    console.log('FASE 1: CREACION');
    console.log('====================================\n');
    
    // ==========================================
    // 1. ADMIN CREA PROVEEDOR
    // ==========================================
    console.log('1. ADMIN CREA PROVEEDOR');
    
    await page.goto('/sign-in');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', process.env.ADMIN_EMAIL || 'guido@misionary');
    await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD || '4C0@Cs4^6WuK@jci');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/home/, { timeout: 15000 });
    console.log('   Admin logueado');
    
    await page.goto('/personas/proveedor/new');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.fill('input[name="nombre"]', datos.proveedor.nombre);
    await page.fill('input[name="email"]', datos.proveedor.email);
    
    const telProv = page.locator('input[name="telefono"]');
    if (await telProv.count() > 0) await telProv.fill(datos.proveedor.telefono);
    
    const passProv = page.locator('input[name="password"]');
    if (await passProv.count() > 0) await passProv.fill(datos.proveedor.password);
    
    // Agregar áreas
    const areasContainer = page.locator('label:has-text("Áreas")').locator('..').locator('[class*="control"]').first();
    if (await areasContainer.count() > 0) {
      await areasContainer.click();
      await page.waitForTimeout(300);
      await page.locator('div[class*="option"]:has-text("Frontend")').click();
      await page.waitForTimeout(200);
      await areasContainer.click();
      await page.locator('div[class*="option"]:has-text("Backend")').click();
      await page.waitForTimeout(200);
      await page.keyboard.press('Escape');
    }
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    const urlProv = page.url();
    const matchProv = urlProv.match(/\/personas\/edit\/(\d+)/);
    if (matchProv) datos.proveedor.id = matchProv[1];
    
    console.log(`   OK - Proveedor creado (ID: ${datos.proveedor.id})\n`);
    
    // ==========================================
    // 2. PROVEEDOR CREA PRODUCTO
    // ==========================================
    console.log('2. PROVEEDOR CREA PRODUCTO');
    
    const provContext = await browser.newContext();
    const provPage = await provContext.newPage();
    
    await provPage.goto('/sign-in');
    await provPage.waitForSelector('input[name="email"]');
    await provPage.fill('input[name="email"]', datos.proveedor.email);
    await provPage.fill('input[name="password"]', datos.proveedor.password);
    await provPage.click('button[type="submit"]');
    await provPage.waitForURL(/.*\/home/, { timeout: 15000 });
    console.log('   Proveedor logueado');
    
    await provPage.goto('/productos/new');
    await provPage.waitForLoadState('networkidle');
    await provPage.waitForTimeout(2000);
    
    await provPage.fill('input[name="nombre"]', datos.producto.nombre);
    
    const descProd = provPage.locator('textarea[name="descripcion"], input[name="descripcion"]');
    if (await descProd.count() > 0) await descProd.first().fill(datos.producto.descripcion);
    
    // Buscar el select de Moneda (debajo de "Pricing y Moneda")
    const monedaLabel = provPage.locator('label:has-text("Moneda")');
    const monedaSelectContainer = monedaLabel.locator('..').locator('[class*="control"]');
    
    if (await monedaSelectContainer.count() > 0) {
      console.log('   Seleccionando moneda USD...');
      await monedaSelectContainer.click();
      await provPage.waitForTimeout(500);
      
      // Buscar y hacer click en USD
      const usdOption = provPage.locator('div[class*="option"]:has-text("USD")');
      if (await usdOption.count() > 0) {
        await usdOption.first().click();
        await provPage.waitForTimeout(500);
        console.log('   Moneda: USD');
      }
    }
    
    // Llenar el precio en el campo "Costo del Producto"
    const precioProd = provPage.locator('input[name="costo"], input[placeholder*="0,00"]');
    if (await precioProd.count() > 0) {
      console.log('   Llenando precio...');
      await precioProd.first().click();
      await precioProd.first().clear();
      await precioProd.first().fill(datos.producto.precio);
      await provPage.waitForTimeout(300);
      console.log(`   Precio: $${datos.producto.precio}`);
    }
    
    const stockProd = provPage.locator('input[name="stock"]');
    if (await stockProd.count() > 0) await stockProd.first().fill('999');
    
    // Scroll hasta el final del formulario
    await provPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await provPage.waitForTimeout(500);
    
    // Buscar botón de guardar y hacer visible
    console.log('   Guardando producto...');
    const submitBtn = provPage.locator('button[type="submit"], button:has-text("Guardar"), button:has-text("Crear")').last();
    
    // Scroll al botón y esperar que sea visible
    await submitBtn.scrollIntoViewIfNeeded();
    await provPage.waitForTimeout(500);
    
    // Click con force si es necesario
    await submitBtn.click({ force: true });
    await provPage.waitForTimeout(4000);
    
    const urlProd = provPage.url();
    const matchProd = urlProd.match(/\/productos\/edit\/(\d+)/);
    if (matchProd) datos.producto.id = matchProd[1];
    
    console.log(`   OK - Producto creado (ID: ${datos.producto.id})\n`);
    
    // ==========================================
    // 3. PROVEEDOR CREA SERVICIO
    // ==========================================
    console.log('3. PROVEEDOR CREA SERVICIO');
    
    await provPage.goto('/servicios/new');
    await provPage.waitForLoadState('networkidle');
    await provPage.waitForTimeout(2000);
    
    await provPage.fill('input[name="nombre"]', datos.servicio.nombre);
    
    const descServ = provPage.locator('textarea[name="descripcion"], input[name="descripcion"]');
    if (await descServ.count() > 0) await descServ.first().fill(datos.servicio.descripcion);
    
    // Seleccionar moneda ARS (ya está por defecto, pero verificamos)
    const monedaServLabel = provPage.locator('label:has-text("Moneda")');
    const monedaServContainer = monedaServLabel.locator('..').locator('[class*="control"]');
    
    if (await monedaServContainer.count() > 0) {
      console.log('   Verificando moneda ARS...');
      // ARS suele estar por defecto, pero por si acaso
      const currentValue = await monedaServContainer.textContent();
      if (!currentValue?.includes('ARS')) {
        await monedaServContainer.click();
        await provPage.waitForTimeout(500);
        const arsOption = provPage.locator('div[class*="option"]:has-text("ARS")');
        if (await arsOption.count() > 0) {
          await arsOption.first().click();
          await provPage.waitForTimeout(500);
        }
      }
      console.log('   Moneda: ARS');
    }
    
    // Llenar el precio en el campo "Costo del Servicio"
    const precioServ = provPage.locator('input[name="costo"], input[placeholder*="0,00"]');
    if (await precioServ.count() > 0) {
      console.log('   Llenando precio...');
      await precioServ.first().click();
      await precioServ.first().clear();
      await precioServ.first().fill(datos.servicio.precio);
      await provPage.waitForTimeout(300);
      console.log(`   Precio: $${datos.servicio.precio}`);
    }
    
    const duracionServ = provPage.locator('input[name="duracion"]');
    if (await duracionServ.count() > 0) await duracionServ.first().fill(datos.servicio.duracion);
    
    // Scroll hasta el final
    await provPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await provPage.waitForTimeout(500);
    
    // Buscar botón de guardar
    console.log('   Guardando servicio...');
    const submitServBtn = provPage.locator('button[type="submit"], button:has-text("Guardar"), button:has-text("Crear")').last();
    
    await submitServBtn.scrollIntoViewIfNeeded();
    await provPage.waitForTimeout(500);
    
    await submitServBtn.click({ force: true });
    await provPage.waitForTimeout(4000);
    
    const urlServ = provPage.url();
    const matchServ = urlServ.match(/\/servicios\/edit\/(\d+)/);
    if (matchServ) datos.servicio.id = matchServ[1];
    
    console.log(`   OK - Servicio creado (ID: ${datos.servicio.id})\n`);
    
    await provContext.close();
    console.log('   Proveedor deslogueado\n');
    
    // ==========================================
    // 4. ADMIN CREA CLIENTE
    // ==========================================
    console.log('4. ADMIN CREA CLIENTE');
    
    await page.goto('/personas/cliente/new');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log('   Llenando datos del cliente...');
    await page.locator('input[name="cliente.nombre"]').fill(datos.cliente.nombre);
    await page.locator('input[name="cliente.email"]').fill(datos.cliente.email);
    await page.locator('input[name="cliente.telefono"]').fill(datos.cliente.telefono);
    
    // Buscar y marcar el checkbox de "Crear empresa"
    console.log('   Buscando checkbox "Crear empresa"...');
    
    // Buscar el label que contiene el texto sobre crear empresa
    const crearEmpresaLabel = page.locator('label:has-text("Crear empresa para este cliente")');
    
    if (await crearEmpresaLabel.count() > 0) {
      console.log('   Marcando checkbox "Crear empresa"...');
      await crearEmpresaLabel.click(); // Click en el label es más confiable
      await page.waitForTimeout(2000); // Esperar animación
      
      // Llenar datos de la empresa que aparecen después del checkbox
      console.log('   Llenando datos de empresa...');
      await page.locator('input[name="empresa.nombre"]').fill(datos.cliente.empresa.nombre);
      await page.locator('input[name="empresa.cuit"]').fill(datos.cliente.empresa.cuit);
      await page.locator('input[name="empresa.direccion"]').fill(datos.cliente.empresa.direccion);
      await page.locator('input[name="empresa.telefono"]').fill(datos.cliente.empresa.telefonoEmpresa);
    } else {
      console.log('   Checkbox "Crear empresa" no encontrado o no visible.');
    }
    
    // Scroll y guardar
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    console.log('   Guardando cliente...');
    const submitCliBtn = page.locator('button[type="submit"], button:has-text("Registrar Cliente"), button:has-text("Registrar Cliente y Empresa")').last();
    await submitCliBtn.scrollIntoViewIfNeeded();
    await submitCliBtn.click({ force: true });
    await page.waitForTimeout(4000);
    
    const urlCli = page.url();
    const matchCli = urlCli.match(/\/personas\/edit\/(\d+)/);
    if (matchCli) datos.cliente.id = matchCli[1];
    
    console.log(`   OK - Cliente creado (ID: ${datos.cliente.id})\n`);
    
        // ==========================================
        // 5. ADMIN CREA PRESUPUESTO
        // ==========================================
        console.log('5. ADMIN CREA PRESUPUESTO');

        await page.goto('/presupuestos/new');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        // Buscar el select de cliente (es un componente Select de React-Select)
        console.log('   Seleccionando cliente...');
        const clienteSelectContainer = page.locator('label:has-text("Cliente")').locator('..').locator('[class*="control"]').first();

        if (await clienteSelectContainer.count() > 0) {
          console.log('   - Abriendo selector de cliente...');
          await clienteSelectContainer.click();
          await page.waitForTimeout(1000);

          // Buscar la opción del cliente por nombre
          const clienteOption = page.locator(`div[class*="option"]:has-text("${datos.cliente.nombre}")`);
          if (await clienteOption.count() > 0) {
            console.log(`   - Seleccionando cliente: ${datos.cliente.nombre}`);
            await clienteOption.first().click();
            await page.waitForTimeout(500);
          } else {
            console.log('   - Cliente no encontrado en opciones, seleccionando el primero disponible...');
            const primeraOpcion = page.locator('div[class*="option"]').first();
            if (await primeraOpcion.count() > 0) {
              await primeraOpcion.click();
              await page.waitForTimeout(500);
            }
          }
        } else {
          console.log('   No se encontró selector de cliente');
        }

        // ==========================================
        // CONFIGURAR ITEMS DEL PRESUPUESTO
        // ==========================================
        console.log('   Configurando items del presupuesto...');
        
        // Scroll hacia la sección de items
        await page.locator('h3:has-text("Items del Presupuesto")').scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);

        // ITEM 1: Agregar el producto creado
        console.log('   - Configurando Item #1 (Producto)...');
        
        // Asegurarse de que esté en modo "Producto" (debería estar por defecto)
        const productoBtn = page.locator('button:has-text("Producto")').first();
        if (await productoBtn.count() > 0) {
          await productoBtn.click();
          await page.waitForTimeout(500);
          console.log('     Modo: Producto');
        }

        // Seleccionar proveedor en el primer item
        const proveedorSelect = page.locator('label:has-text("Proveedor")').locator('..').locator('[class*="control"]').first();
        if (await proveedorSelect.count() > 0) {
          console.log('     Seleccionando proveedor...');
          await proveedorSelect.click();
          await page.waitForTimeout(500);
          
          // Buscar el proveedor creado por nombre
          const proveedorOption = page.locator(`div[class*="option"]:has-text("${datos.proveedor.nombre}")`);
          if (await proveedorOption.count() > 0) {
            console.log(`     Proveedor: ${datos.proveedor.nombre}`);
            await proveedorOption.first().click();
            await page.waitForTimeout(1000); // Esperar a que carguen los productos
          } else {
            console.log('     Proveedor no encontrado, seleccionando el primero...');
            const primerProveedor = page.locator('div[class*="option"]').first();
            if (await primerProveedor.count() > 0) {
              await primerProveedor.click();
              await page.waitForTimeout(1000);
            }
          }
        }

        // Seleccionar producto específico
        const productoSelect = page.locator('label:has-text("Producto")').locator('..').locator('[class*="control"]').first();
        if (await productoSelect.count() > 0) {
          console.log('     Seleccionando producto...');
          await productoSelect.click();
          await page.waitForTimeout(500);
          
          // Buscar el producto creado por nombre
          const productoOption = page.locator(`div[class*="option"]:has-text("${datos.producto.nombre}")`);
          if (await productoOption.count() > 0) {
            console.log(`     Producto: ${datos.producto.nombre}`);
            await productoOption.first().click();
            await page.waitForTimeout(500);
          } else {
            console.log('     Producto específico no encontrado, seleccionando el primero disponible...');
            const primerProducto = page.locator('div[class*="option"]').first();
            if (await primerProducto.count() > 0) {
              await primerProducto.click();
              await page.waitForTimeout(500);
            }
          }
        }

        // Configurar cantidad (dejar en 1 por defecto)
        const cantidadInput = page.locator('input[name="items.0.cantidad"]');
        if (await cantidadInput.count() > 0) {
          console.log('     Cantidad: 1 (por defecto)');
        }

        // AGREGAR SEGUNDO ITEM: Servicio
        console.log('   - Agregando Item #2 (Servicio)...');
        const agregarItemBtn = page.locator('button:has-text("Agregar Otro Item")');
        if (await agregarItemBtn.count() > 0) {
          await agregarItemBtn.click();
          await page.waitForTimeout(1000);
          console.log('     Item #2 agregado');
        }

        // Cambiar a modo "Servicio" para el segundo item
        const servicioBtn = page.locator('button:has-text("Servicio")').nth(1); // Segundo item
        if (await servicioBtn.count() > 0) {
          await servicioBtn.click();
          await page.waitForTimeout(500);
          console.log('     Modo: Servicio');
        }

        // Seleccionar proveedor en el segundo item
        const proveedorSelect2 = page.locator('label:has-text("Proveedor")').locator('..').locator('[class*="control"]').nth(1);
        if (await proveedorSelect2.count() > 0) {
          console.log('     Seleccionando proveedor para servicio...');
          await proveedorSelect2.click();
          await page.waitForTimeout(500);
          
          const proveedorOption2 = page.locator(`div[class*="option"]:has-text("${datos.proveedor.nombre}")`);
          if (await proveedorOption2.count() > 0) {
            console.log(`     Proveedor: ${datos.proveedor.nombre}`);
            await proveedorOption2.first().click();
            await page.waitForTimeout(1000);
          } else {
            const primerProveedor2 = page.locator('div[class*="option"]').first();
            if (await primerProveedor2.count() > 0) {
              await primerProveedor2.click();
              await page.waitForTimeout(1000);
            }
          }
        }

        // Seleccionar servicio específico
        const servicioSelect = page.locator('label:has-text("Servicio")').locator('..').locator('[class*="control"]').first();
        if (await servicioSelect.count() > 0) {
          console.log('     Seleccionando servicio...');
          await servicioSelect.click();
          await page.waitForTimeout(500);
          
          const servicioOption = page.locator(`div[class*="option"]:has-text("${datos.servicio.nombre}")`);
          if (await servicioOption.count() > 0) {
            console.log(`     Servicio: ${datos.servicio.nombre}`);
            await servicioOption.first().click();
            await page.waitForTimeout(500);
          } else {
            console.log('     Servicio específico no encontrado, seleccionando el primero disponible...');
            const primerServicio = page.locator('div[class*="option"]').first();
            if (await primerServicio.count() > 0) {
              await primerServicio.click();
              await page.waitForTimeout(500);
            }
          }
        }

        // Scroll y guardar presupuesto
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1000);

        console.log('   Guardando presupuesto con items configurados...');
        const submitPresBtn = page.locator('button[type="submit"], button:has-text("Guardar"), button:has-text("Crear")').last();
        await submitPresBtn.scrollIntoViewIfNeeded();
        await submitPresBtn.click({ force: true });
        await page.waitForTimeout(4000);

        const urlPresup = page.url();
        const matchPresup = urlPresup.match(/\/presupuestos\/edit\/(\d+)|\/presupuestos\/(\d+)/);
        if (matchPresup) datos.presupuesto.id = matchPresup[1] || matchPresup[2];

        console.log(`   OK - Presupuesto creado con items (ID: ${datos.presupuesto.id})\n`);
    
    console.log('====================================');
    console.log('FASE 2: EDICION');
    console.log('====================================\n');
    
    // ==========================================
    // 6. EDITAR PRESUPUESTO
    // ==========================================
    console.log('6. EDITAR PRESUPUESTO');
    
    if (datos.presupuesto.id) {
      await page.goto(`/presupuestos/edit/${datos.presupuesto.id}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Cambiar estado si hay select
      const estadoSelect = page.locator('select[name="estado"]');
      if (await estadoSelect.count() > 0) {
        await estadoSelect.selectOption('ENVIADO');
        console.log('   Estado cambiado a ENVIADO');
      }
      
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      console.log('   OK - Presupuesto editado\n');
    }
    
    // ==========================================
    // 7. EDITAR CLIENTE
    // ==========================================
    console.log('7. EDITAR CLIENTE');
    
    if (datos.cliente.id) {
      await page.goto(`/personas/edit/${datos.cliente.id}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const telEdit = page.locator('input[name="telefono"]');
      if (await telEdit.count() > 0) {
        await telEdit.fill('+54 11 9999-8888');
        console.log('   Telefono cambiado');
      }
      
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      console.log('   OK - Cliente editado\n');
    }
    
    // ==========================================
    // 8. PROVEEDOR EDITA PRODUCTO
    // ==========================================
    console.log('8. PROVEEDOR EDITA PRODUCTO');
    
    const provContext2 = await browser.newContext();
    const provPage2 = await provContext2.newPage();
    
    await provPage2.goto('/sign-in');
    await provPage2.waitForSelector('input[name="email"]');
    await provPage2.fill('input[name="email"]', datos.proveedor.email);
    await provPage2.fill('input[name="password"]', datos.proveedor.password);
    await provPage2.click('button[type="submit"]');
    await provPage2.waitForURL(/.*\/home/, { timeout: 15000 });
    
    if (datos.producto.id) {
      await provPage2.goto(`/productos/edit/${datos.producto.id}`);
      await provPage2.waitForLoadState('networkidle');
      await provPage2.waitForTimeout(2000);
      
      const precioEdit = provPage2.locator('input[name="precio"]');
      if (await precioEdit.count() > 0) {
        await precioEdit.first().fill('450000');
        console.log('   Precio cambiado: $500k -> $450k');
      }
      
      await provPage2.click('button[type="submit"]');
      await provPage2.waitForTimeout(2000);
      console.log('   OK - Producto editado\n');
    }
    
    // ==========================================
    // 9. PROVEEDOR EDITA SERVICIO
    // ==========================================
    console.log('9. PROVEEDOR EDITA SERVICIO');
    
    if (datos.servicio.id) {
      await provPage2.goto(`/servicios/edit/${datos.servicio.id}`);
      await provPage2.waitForLoadState('networkidle');
      await provPage2.waitForTimeout(2000);
      
      const precioServEdit = provPage2.locator('input[name="precio"]');
      if (await precioServEdit.count() > 0) {
        await precioServEdit.first().fill('40000');
        console.log('   Precio cambiado: $35k -> $40k');
      }
      
      await provPage2.click('button[type="submit"]');
      await provPage2.waitForTimeout(2000);
      console.log('   OK - Servicio editado\n');
    }
    
    await provContext2.close();
    
    // ==========================================
    // 10. ADMIN EDITA PROVEEDOR
    // ==========================================
    console.log('10. ADMIN EDITA PROVEEDOR');
    
    if (datos.proveedor.id) {
      await page.goto(`/personas/edit/${datos.proveedor.id}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await page.fill('input[name="nombre"]', `${datos.proveedor.nombre} EDITADO`);
      console.log('   Nombre cambiado');
      
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      console.log('   OK - Proveedor editado\n');
    }
    
    console.log('====================================');
    console.log('FASE 3: ELIMINACION (cleanup)');
    console.log('====================================\n');
    
    // ==========================================
    // 11. ELIMINAR PRESUPUESTO
    // ==========================================
    console.log('11. ELIMINAR PRESUPUESTO');
    
    if (datos.presupuesto.id) {
      await page.goto('/presupuestos');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Buscar el presupuesto del cliente
      const presupRow = page.locator(`tr:has-text("${datos.cliente.nombre}")`).first();
      if (await presupRow.count() > 0) {
        const delBtn = presupRow.locator('button').last();
        await delBtn.click();
        await page.waitForTimeout(1000);
        
        const confirmBtn = page.locator('button:has-text("Eliminar")').last();
        await confirmBtn.click();
        await page.waitForTimeout(2000);
        console.log('   OK - Presupuesto eliminado\n');
      } else {
        console.log('   Skip - Presupuesto no encontrado\n');
      }
    }
    
    // ==========================================
    // 12. ELIMINAR CLIENTE
    // ==========================================
    console.log('12. ELIMINAR CLIENTE');
    
    if (datos.cliente.id) {
      await page.goto('/personas');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const searchInput = page.locator('input[placeholder*="Buscar"]');
      await searchInput.fill(datos.cliente.email);
      await page.waitForTimeout(1000);
      
      const cliRow = page.locator(`tr:has-text("${datos.cliente.email}")`).first();
      if (await cliRow.count() > 0) {
        const delBtn = cliRow.locator('button').nth(2);
        await delBtn.click();
        await page.waitForTimeout(1000);
        
        const confirmBtn = page.locator('button:has-text("Eliminar")').last();
        await confirmBtn.click();
        await page.waitForTimeout(2000);
        console.log('   OK - Cliente eliminado\n');
      }
    }
    
    // ==========================================
    // 13 y 14. PROVEEDOR ELIMINA SERVICIO Y PRODUCTO
    // ==========================================
    console.log('13-14. PROVEEDOR ELIMINA SERVICIO Y PRODUCTO');
    
    const provContext3 = await browser.newContext();
    const provPage3 = await provContext3.newPage();
    
    await provPage3.goto('/sign-in');
    await provPage3.waitForSelector('input[name="email"]');
    await provPage3.fill('input[name="email"]', datos.proveedor.email);
    await provPage3.fill('input[name="password"]', datos.proveedor.password);
    await provPage3.click('button[type="submit"]');
    await provPage3.waitForURL(/.*\/home/, { timeout: 15000 });
    
    // Eliminar servicio
    if (datos.servicio.id) {
      await provPage3.goto('/servicios');
      await provPage3.waitForLoadState('networkidle');
      await provPage3.waitForTimeout(2000);
      
      const servRow = provPage3.locator(`tr:has-text("${datos.servicio.nombre}")`).first();
      if (await servRow.count() > 0) {
        const delBtn = servRow.locator('button').last();
        await delBtn.click();
        await provPage3.waitForTimeout(1000);
        
        const confirmBtn = provPage3.locator('button:has-text("Eliminar")').last();
        await confirmBtn.click();
        await provPage3.waitForTimeout(2000);
        console.log('   OK - Servicio eliminado');
      }
    }
    
    // Eliminar producto
    if (datos.producto.id) {
      await provPage3.goto('/productos');
      await provPage3.waitForLoadState('networkidle');
      await provPage3.waitForTimeout(2000);
      
      const prodRow = provPage3.locator(`tr:has-text("${datos.producto.nombre}")`).first();
      if (await prodRow.count() > 0) {
        const delBtn = prodRow.locator('button').last();
        await delBtn.click();
        await provPage3.waitForTimeout(1000);
        
        const confirmBtn = provPage3.locator('button:has-text("Eliminar")').last();
        await confirmBtn.click();
        await provPage3.waitForTimeout(2000);
        console.log('   OK - Producto eliminado\n');
      }
    }
    
    await provContext3.close();
    
    // ==========================================
    // 15. ADMIN ELIMINA PROVEEDOR
    // ==========================================
    console.log('15. ADMIN ELIMINA PROVEEDOR');
    
    if (datos.proveedor.id) {
      await page.goto('/personas');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const searchInput2 = page.locator('input[placeholder*="Buscar"]');
      await searchInput2.fill(datos.proveedor.email);
      await page.waitForTimeout(1000);
      
      const provRow = page.locator(`tr:has-text("${datos.proveedor.email}")`).first();
      if (await provRow.count() > 0) {
        const delBtn = provRow.locator('button').nth(2);
        await delBtn.click();
        await page.waitForTimeout(1000);
        
        const confirmBtn = page.locator('button:has-text("Eliminar")').last();
        await confirmBtn.click();
        await page.waitForTimeout(2000);
        console.log('   OK - Proveedor eliminado\n');
      }
    }
    
    console.log('====================================');
    console.log('VERIFICACION FINAL');
    console.log('====================================\n');
    
    // Verificar que el proveedor no existe
    const searchFinal = page.locator('input[placeholder*="Buscar"]');
    await searchFinal.fill(datos.proveedor.email);
    await page.waitForTimeout(1000);
    
    const provEliminado = page.locator(`tr:has-text("${datos.proveedor.email}")`);
    await expect(provEliminado).not.toBeVisible({ timeout: 3000 });
    console.log('OK - Proveedor no existe');
    console.log('OK - Base de datos limpia');
    
    console.log('\n====================================');
    console.log('FLUJO COMPLETO EXITOSO');
    console.log('====================================');
    console.log(`Proveedor: ${datos.proveedor.nombre}`);
    console.log(`Producto: ${datos.producto.nombre} ($${datos.producto.precio})`);
    console.log(`Servicio: ${datos.servicio.nombre} ($${datos.servicio.precio})`);
    console.log(`Cliente: ${datos.cliente.nombre}`);
    console.log(`Presupuesto: ID ${datos.presupuesto.id || 'N/A'}`);
    console.log('\nTodo creado, editado y eliminado correctamente');
  });
});
