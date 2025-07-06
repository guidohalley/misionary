import { PrismaClient, CodigoMoneda } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el proceso de seed...');
  
  // Crear monedas básicas
  const monedas = [
    { codigo: CodigoMoneda.ARS, nombre: 'Peso Argentino', simbolo: '$' },
    { codigo: CodigoMoneda.USD, nombre: 'Dólar Estadounidense', simbolo: 'US$' },
    { codigo: CodigoMoneda.EUR, nombre: 'Euro', simbolo: '€' }
  ];

  for (const monedaData of monedas) {
    await prisma.moneda.upsert({
      where: { codigo: monedaData.codigo },
      update: {},
      create: monedaData
    });
  }

  console.log('Monedas básicas creadas');
  
  // Crear usuario administrador
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.persona.upsert({
    where: { email: 'admin@misionary.com' },
    update: {},
    create: {
      email: 'admin@misionary.com',
      password: hashedPassword,
      nombre: 'Administrador',
      tipo: 'INTERNO',
      roles: ['ADMIN']
    }
  });

  console.log('Usuario administrador creado:', admin);

  // Crear proveedor de prueba
  const proveedorTest = await prisma.persona.upsert({
    where: { email: 'proveedor@test.com' },
    update: {},
    create: {
      email: 'proveedor@test.com',
      nombre: 'Proveedor de Prueba',
      tipo: 'PROVEEDOR',
      roles: ['PROVEEDOR'],
      telefono: '+54 11 1234-5678'
    }
  });

  console.log('Proveedor de prueba creado:', proveedorTest.nombre);
  console.log('Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
