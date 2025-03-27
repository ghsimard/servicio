import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();

  try {
    // Create a test log entry
    const log = await prisma.database_logs.create({
      data: {
        table_name: 'test',
        action: 'insert',
        record_id: '00000000-0000-0000-0000-000000000000',
        details: { test: 'data' },
        operation_details: { test: 'operation' },
      },
    });
    console.log('Created test log:', log);

    // Verify the log was created
    const count = await prisma.database_logs.count();
    console.log('Total number of logs:', count);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 