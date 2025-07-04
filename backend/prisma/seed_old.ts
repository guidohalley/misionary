import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  // Leer y ejecutar el archivo seed.sql
  const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
  const commands = seedSQL.split(';').filter(cmd => cmd.trim());
  
  for (const command of commands) {
    if (command.trim()) {
      try {
        await prisma.$executeRawUnsafe(command + ';');
      } catch (error) {
        console.error('Error ejecutando comando SQL:', error);
        throw error;
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
