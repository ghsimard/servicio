import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkServices() {
  try {
    const services = await prisma.service.findMany({
      include: {
        translations: true
      }
    });

    console.log('\nServices in database:');
    console.log('-------------------');
    for (const service of services) {
      console.log(`ID: ${service.id}`);
      console.log(`Name: "${service.name}"`);
      console.log(`Name length: ${service.name.length}`);
      console.log(`Translations: ${service.translations.length}`);
      console.log('-------------------');
    }

    console.log(`\nTotal services: ${services.length}`);
  } catch (error) {
    console.error('Error checking services:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkServices(); 