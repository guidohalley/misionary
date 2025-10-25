import { PrismaClient, CodigoMoneda, RolUsuario, TipoPersona, TipoCotizacion } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed básico del sistema...');

  // 1. Configuración inicial de monedas
  const monedas = [
    { codigo: CodigoMoneda.ARS, nombre: 'Peso Argentino', simbolo: '$' },
    { codigo: CodigoMoneda.USD, nombre: 'Dólar Estadounidense', simbolo: 'US$' },
    { codigo: CodigoMoneda.EUR, nombre: 'Euro', simbolo: '€' }
  ];

  for (const monedaData of monedas) {
    await prisma.moneda.upsert({
      where: { codigo: monedaData.codigo },
      update: {},
      create: {
        ...monedaData,
        activo: true
      }
    });
  }

  // Configurar tipos de cambio iniciales
  const [arsMoneda, usdMoneda] = await Promise.all([
    prisma.moneda.findUnique({ where: { codigo: CodigoMoneda.ARS } }),
    prisma.moneda.findUnique({ where: { codigo: CodigoMoneda.USD } })
  ]);

  if (!arsMoneda || !usdMoneda) {
    throw new Error('No se pudieron crear las monedas base');
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Tipo de cambio USD -> ARS (necesario para el funcionamiento básico)
  await prisma.tipoCambio.upsert({
    where: {
      monedaDesdeId_monedaHaciaId_tipo_fecha: {
        monedaDesdeId: usdMoneda.id,
        monedaHaciaId: arsMoneda.id,
        tipo: TipoCotizacion.OFICIAL,
        fecha: hoy
      }
    },
    update: { valor: new Decimal('1200.00') },
    create: {
      monedaDesdeId: usdMoneda.id,
      monedaHaciaId: arsMoneda.id,
      valor: new Decimal('1200.00'),
      fecha: hoy,
      tipo: TipoCotizacion.OFICIAL
    }
  });

  console.log('Sistema de monedas configurado');

  // 2. Usuario administrador principal (requerido para acceder al sistema)
  const emailAdmin = 'guido@misionary.com';
  const passwordAdmin = '4C0@Cs4^6WuK@jci'; // Cambiar en producción
  const hashedPassword = await bcrypt.hash(passwordAdmin, 10);

  const admin = await prisma.persona.upsert({
    where: { email: emailAdmin },
    update: {
      nombre: 'Guido',
      tipo: TipoPersona.INTERNO,
      roles: [RolUsuario.ADMIN],
      esUsuario: true,
      activo: true,
      password: hashedPassword,
    },
    create: {
      email: emailAdmin,
      nombre: 'Guido',
      tipo: TipoPersona.INTERNO,
      roles: [RolUsuario.ADMIN],
      esUsuario: true,
      activo: true,
      password: hashedPassword,
    }
  });

  console.log('Usuario administrador creado:', { email: admin.email });

  // 3. Impuestos básicos necesarios
  const impuestos = [
    { nombre: 'IVA 21%', porcentaje: new Decimal('21.00'), descripcion: 'Impuesto al Valor Agregado' }
  ];

  for (const imp of impuestos) {
    await prisma.impuesto.upsert({
      where: { nombre: imp.nombre },
      update: {
        porcentaje: imp.porcentaje,
        descripcion: imp.descripcion,
        activo: true
      },
      create: {
        nombre: imp.nombre,
        porcentaje: imp.porcentaje,
        descripcion: imp.descripcion,
        activo: true
      }
    });
  }

  console.log('Seed básico completado exitosamente');
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
