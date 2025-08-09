import { PrismaClient, CodigoMoneda, RolUsuario, TipoPersona } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el proceso de seed...');
  
  // 1) Monedas básicas
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
  
  // 2) Usuario administrador único
  const emailAdmin = 'guido@misionary.com';
  const nombreAdmin = 'Guido';
  const passwordPlano = '4C0@Cs4^6WuK@jci';
  const hashedPassword = await bcrypt.hash(passwordPlano, 10);

  const admin = await prisma.persona.upsert({
    where: { email: emailAdmin },
    update: {
      nombre: nombreAdmin,
      tipo: TipoPersona.INTERNO,
      roles: [RolUsuario.ADMIN],
      esUsuario: true,
      activo: true,
      password: hashedPassword,
    },
    create: {
      email: emailAdmin,
      nombre: nombreAdmin,
      tipo: TipoPersona.INTERNO,
      roles: [RolUsuario.ADMIN],
      esUsuario: true,
      activo: true,
      password: hashedPassword,
    }
  });

  console.log('Usuario administrador listo:', { id: admin.id, email: admin.email });
  
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
