import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();

  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connection successful');

    // Check if database_logs table exists
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Available tables:', tables);

    // Check database_logs table structure
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'database_logs'
    `;
    console.log('database_logs columns:', columns);

    // Check if there are any records
    const count = await prisma.database_logs.count();
    console.log('Number of log records:', count);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 