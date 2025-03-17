import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const testServices = [
    { name: 'House Cleaning' },
    { name: 'Lawn Maintenance' },
    { name: 'Window Washing' },
    { name: 'Carpet Cleaning' },
    { name: 'Pool Maintenance' },
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
  .finally(async () => {
    await prisma.$disconnect();
  }); 