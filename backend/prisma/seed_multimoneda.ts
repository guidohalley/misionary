import { PrismaClient, CodigoMoneda } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMultiMoneda() {
  console.log('🏦 Iniciando seed de sistema multi-moneda...');

  try {
    // Crear monedas básicas
    const monedas = await Promise.all([
      prisma.moneda.upsert({
        where: { codigo: CodigoMoneda.ARS },
        update: {},
        create: {
          codigo: CodigoMoneda.ARS,
          nombre: 'Peso Argentino',
          simbolo: '$',
          activo: true,
        },
      }),
      prisma.moneda.upsert({
        where: { codigo: CodigoMoneda.USD },
        update: {},
        create: {
          codigo: CodigoMoneda.USD,
          nombre: 'Dólar Estadounidense',
          simbolo: 'USD',
          activo: true,
        },
      }),
      prisma.moneda.upsert({
        where: { codigo: CodigoMoneda.EUR },
        update: {},
        create: {
          codigo: CodigoMoneda.EUR,
          nombre: 'Euro',
          simbolo: '€',
          activo: true,
        },
      }),
    ]);

    console.log('✅ Monedas creadas:', monedas.map(m => `${m.codigo} - ${m.nombre}`));

    // Obtener las monedas creadas
    const arsMoneda = monedas.find(m => m.codigo === CodigoMoneda.ARS)!;
    const usdMoneda = monedas.find(m => m.codigo === CodigoMoneda.USD)!;
    const eurMoneda = monedas.find(m => m.codigo === CodigoMoneda.EUR)!;

    // Crear tipos de cambio iniciales (valores aproximados de ejemplo)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Inicio del día

    const tiposCambio = await Promise.all([
      // USD -> ARS (1 USD = 1200 ARS)
      prisma.tipoCambio.upsert({
        where: {
          monedaDesdeId_monedaHaciaId_fecha: {
            monedaDesdeId: usdMoneda.id,
            monedaHaciaId: arsMoneda.id,
            fecha: hoy,
          },
        },
        update: {},
        create: {
          monedaDesdeId: usdMoneda.id,
          monedaHaciaId: arsMoneda.id,
          valor: 1200.0000,
          fecha: hoy,
        },
      }),
      // ARS -> USD (1 ARS = 0.000833 USD)
      prisma.tipoCambio.upsert({
        where: {
          monedaDesdeId_monedaHaciaId_fecha: {
            monedaDesdeId: arsMoneda.id,
            monedaHaciaId: usdMoneda.id,
            fecha: hoy,
          },
        },
        update: {},
        create: {
          monedaDesdeId: arsMoneda.id,
          monedaHaciaId: usdMoneda.id,
          valor: 0.000833,
          fecha: hoy,
        },
      }),
      // EUR -> ARS (1 EUR = 1300 ARS)
      prisma.tipoCambio.upsert({
        where: {
          monedaDesdeId_monedaHaciaId_fecha: {
            monedaDesdeId: eurMoneda.id,
            monedaHaciaId: arsMoneda.id,
            fecha: hoy,
          },
        },
        update: {},
        create: {
          monedaDesdeId: eurMoneda.id,
          monedaHaciaId: arsMoneda.id,
          valor: 1300.0000,
          fecha: hoy,
        },
      }),
      // ARS -> EUR (1 ARS = 0.000769 EUR)
      prisma.tipoCambio.upsert({
        where: {
          monedaDesdeId_monedaHaciaId_fecha: {
            monedaDesdeId: arsMoneda.id,
            monedaHaciaId: eurMoneda.id,
            fecha: hoy,
          },
        },
        update: {},
        create: {
          monedaDesdeId: arsMoneda.id,
          monedaHaciaId: eurMoneda.id,
          valor: 0.000769,
          fecha: hoy,
        },
      }),
      // USD -> EUR (1 USD = 0.92 EUR)
      prisma.tipoCambio.upsert({
        where: {
          monedaDesdeId_monedaHaciaId_fecha: {
            monedaDesdeId: usdMoneda.id,
            monedaHaciaId: eurMoneda.id,
            fecha: hoy,
          },
        },
        update: {},
        create: {
          monedaDesdeId: usdMoneda.id,
          monedaHaciaId: eurMoneda.id,
          valor: 0.9200,
          fecha: hoy,
        },
      }),
      // EUR -> USD (1 EUR = 1.09 USD)
      prisma.tipoCambio.upsert({
        where: {
          monedaDesdeId_monedaHaciaId_fecha: {
            monedaDesdeId: eurMoneda.id,
            monedaHaciaId: usdMoneda.id,
            fecha: hoy,
          },
        },
        update: {},
        create: {
          monedaDesdeId: eurMoneda.id,
          monedaHaciaId: usdMoneda.id,
          valor: 1.0900,
          fecha: hoy,
        },
      }),
    ]);

    console.log('✅ Tipos de cambio creados:', tiposCambio.length);

    console.log('🎉 Seed de sistema multi-moneda completado exitosamente!');
    console.log('📊 Resumen:');
    console.log(`   - ${monedas.length} monedas creadas`);
    console.log(`   - ${tiposCambio.length} tipos de cambio iniciales`);
    console.log('   - ARS establecido como moneda por defecto (ID: 1)');

  } catch (error) {
    console.error('❌ Error durante el seed multi-moneda:', error);
    throw error;
  }
}

export { seedMultiMoneda };

// Si se ejecuta directamente
if (require.main === module) {
  seedMultiMoneda()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
