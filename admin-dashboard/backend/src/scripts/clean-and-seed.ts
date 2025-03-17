import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanAndSeed() {
  try {
    // Clean up existing data
    console.log('Cleaning up existing data...');
    await prisma.translation.deleteMany();
    await prisma.service.deleteMany();
    
    // Add fresh test services
    console.log('\nAdding test services...');
    const testServices = [
      { name_en: 'House Cleaning' },
      { name_en: 'Lawn Maintenance' },
      { name_en: 'Window Washing' },
      { name_en: 'Carpet Cleaning' },
      { name_en: 'Pool Maintenance' },
    ];

    for (const service of testServices) {
      await prisma.service.create({
        data: service,
      });
    }

    console.log('Database cleaned and seeded successfully!');
    
    // Verify the services
    const services = await prisma.service.findMany();
    console.log(`\nVerification: ${services.length} services in database:`);
    services.forEach(service => console.log(`- ${service.name_en}`));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanAndSeed(); 