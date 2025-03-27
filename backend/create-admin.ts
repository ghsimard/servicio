import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function main() {
  const prisma = new PrismaClient();
  
  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('12345678', 10);
    
    const user = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {
        password_hash: hashedPassword
      },
      create: {
        email: 'admin@example.com',
        username: 'admin',
        password_hash: hashedPassword,
        firstname: 'Admin',
        lastname: 'User'
      }
    });
    
    console.log('Created user:', user);
    
    // Add a verification token for this user
    const token = await prisma.verification_tokens.upsert({
      where: { 
        token: 'admin-verified-token'
      },
      update: {
        type: 'verified'
      },
      create: {
        user_id: user.user_id,
        token: 'admin-verified-token',
        type: 'verified',
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours
      }
    });
    
    console.log('Added verification token:', token);
    
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 