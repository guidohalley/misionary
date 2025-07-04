import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el proceso de seed...');
  
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
