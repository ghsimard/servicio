import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  
  try {
    // Get total count of users
    const count = await prisma.users.count();
    console.log('Total number of users:', count);
    
    // Get a sample of users
    const users = await prisma.users.findMany({
      take: 5,
      select: {
        user_id: true,
        firstname: true,
        lastname: true,
        email: true,
        username: true,
        created_at: true,
        user_roles: {
          select: {
            role: true
          }
        }
      }
    });
    
    console.log('\nSample users:');
    users.forEach(user => {
      console.log('\n-------------------');
      console.log(`ID: ${user.user_id}`);
      console.log(`Name: ${user.firstname} ${user.lastname}`);
      console.log(`Email: ${user.email}`);
      console.log(`Username: ${user.username}`);
      console.log(`Created: ${user.created_at}`);
      console.log(`Roles: ${user.user_roles.map(r => r.role).join(', ') || 'No roles'}`);
    });
    
    // Get role distribution
    const roleDistribution = await prisma.user_roles.groupBy({
      by: ['role'],
      _count: true
    });
    
    console.log('\nRole distribution:');
    console.log(roleDistribution);
    
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 