import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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

  console.log('Added test services successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding the database:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  }); 