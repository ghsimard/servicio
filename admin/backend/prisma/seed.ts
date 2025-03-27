import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Delete data from all related tables in the correct order
    await prisma.$executeRaw`DELETE FROM verification_tokens`;
    await prisma.$executeRaw`DELETE FROM database_logs`;
    await prisma.$executeRaw`DELETE FROM user_sessions`;
    await prisma.$executeRaw`DELETE FROM user_roles`;
    await prisma.$executeRaw`DELETE FROM users`;
    console.log('Data deleted from all related tables');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        username: 'admin',
        firstname: 'Admin',
        lastname: 'User',
        passwordHash: hashedPassword,
        user_roles: {
          create: {
            role: 'admin'
          }
        }
      },
    });

    console.log({ adminUser });
  } catch (error) {
    console.error('Error:', error);
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