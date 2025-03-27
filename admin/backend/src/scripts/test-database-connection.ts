import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();

  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connection successful');

    // Try to query the database_logs table
    const logs = await prisma.database_logs.findMany({
      take: 10,
      orderBy: {
        timestamp: 'desc',
      },
      include: {
        users: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });
    console.log('Logs:', JSON.stringify(logs, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 