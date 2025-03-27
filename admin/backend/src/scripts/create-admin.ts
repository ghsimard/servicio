import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create the admin user
    const user = await prisma.user.create({
      data: {
        email,
        username: email.split('@')[0],
        passwordHash: hashedPassword,
        user_roles: {
          create: {
            role: 'admin'
          }
        }
      }
    });

    console.log('Admin user created successfully:', user);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 