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

  // Crear clientes de prueba
  const cliente1 = await prisma.persona.upsert({
    where: { email: 'cliente1@empresa1.com' },
    update: {},
    create: {
      email: 'cliente1@empresa1.com',
      nombre: 'Juan Pérez',
      tipo: 'CLIENTE',
      telefono: '+54 11 2345-6789'
    }
  });

  const cliente2 = await prisma.persona.upsert({
    where: { email: 'cliente2@empresa2.com' },
    update: {},
    create: {
      email: 'cliente2@empresa2.com',
      nombre: 'María González',
      tipo: 'CLIENTE',
      telefono: '+54 11 3456-7890'
    }
  });

  console.log('Clientes de prueba creados');

  // Crear empresas de prueba
  const empresa1 = await prisma.empresa.upsert({
    where: { cuit: '20-12345678-9' },
    update: {},
    create: {
      nombre: 'TechSolutions S.A.',
      razonSocial: 'TechSolutions Sociedad Anónima',
      cuit: '20-12345678-9',
      telefono: '+54 11 4000-1234',
      email: 'contacto@techsolutions.com',
      direccion: 'Av. Corrientes 1234, CABA',
      clienteId: cliente1.id
    }
  });

  const empresa2 = await prisma.empresa.upsert({
    where: { cuit: '27-87654321-5' },
    update: {},
    create: {
      nombre: 'Innovación Digital',
      razonSocial: 'Innovación Digital S.R.L.',
      cuit: '27-87654321-5',
      telefono: '+54 11 5000-5678',
      email: 'info@innovaciondigital.com',
      direccion: 'Av. Santa Fe 5678, CABA',
      clienteId: cliente2.id
    }
  });

  console.log('Empresas de prueba creadas:', empresa1.nombre, empresa2.nombre);
  
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
