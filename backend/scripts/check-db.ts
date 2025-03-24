import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  
  try {
    // Check services
    const servicesCount = await prisma.services.count();
    console.log('Number of services:', servicesCount);
    
    if (servicesCount > 0) {
      const services = await prisma.services.findMany({
        take: 5,
        select: {
          service_id: true,
          name_en: true,
          level: true
        }
      });
      console.log('Sample services:', services);
    }
    
    // Check database logs for deletions
    const deletionLogs = await prisma.database_logs.findMany({
      where: {
        action: 'delete',
        table_name: 'services'
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 5
    });
    
    if (deletionLogs.length > 0) {
      console.log('Recent deletion logs:', deletionLogs);
    } else {
      console.log('No recent deletion logs found');
    }
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 