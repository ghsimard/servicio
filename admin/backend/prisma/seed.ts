import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Delete data from all related tables in the correct order
    await prisma.$executeRaw`DELETE FROM verification_tokens`;
    await prisma.$executeRaw`DELETE FROM database_logs`;
    await prisma.$executeRaw`DELETE FROM users`;
    console.log('Data deleted from all related tables');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.$executeRaw`
      INSERT INTO users (
        user_id,
        firstname,
        lastname,
        username,
        email,
        password_hash,
        preferred_language,
        created_at,
        updated_at
      )
      VALUES (
        gen_random_uuid(),
        'Admin',
        'User',
        'admin',
        'admin@example.com',
        ${hashedPassword},
        'en',
        NOW(),
        NOW()
      )
    `;
    console.log('Admin user created successfully');
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