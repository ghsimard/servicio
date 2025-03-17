import { PrismaClient as SourcePrismaClient } from '@prisma/client';
import { PrismaClient as DestPrismaClient } from '@prisma/client';

// Source database (servicioadmin_dev)
const sourcePrisma = new SourcePrismaClient({
  datasources: {
    db: {
      url: 'postgresql://ghsimard@localhost:5432/servicioadmin_dev',
    },
  },
});

// Destination database (servicio_dev)
const destPrisma = new DestPrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:postgres@localhost:5432/servicio_dev',
    },
  },
});

// Type for the source services
interface SourceService {
  service_id: string;
  parent_service_id: string | null;
  level: number;
  is_active: boolean;
  metadata: any;
  name_en: string | null;
  name_fr: string | null;
  name_es: string | null;
  created_at: Date;
  updated_at: Date;
}

async function main() {
  try {
    console.log(
      'Starting to clone services from servicioadmin_dev to servicio_dev...',
    );

    // Get all services from source database
    const sourceServices = await sourcePrisma.services.findMany();
    console.log(`Found ${sourceServices.length} services in servicioadmin_dev`);

    // Clear existing services in destination database
    await destPrisma.services.deleteMany({});
    console.log('Cleared existing services in servicio_dev');

    // Insert services into destination database
    let successCount = 0;
    for (const service of sourceServices as unknown as SourceService[]) {
      try {
        // Create service with the same ID and data
        await destPrisma.services.create({
          data: {
            service_id: service.service_id,
            parent_service_id: service.parent_service_id,
            level: service.level,
            name_en: service.name_en || '',
            name_fr: service.name_fr || null,
            name_es: service.name_es || null,
            is_active: service.is_active,
            metadata: service.metadata || {},
            created_at: service.created_at,
            updated_at: service.updated_at,
          },
        });
        successCount++;
      } catch (error) {
        console.error(`Error inserting service ${service.service_id}:`, error);
      }
    }

    console.log(
      `Successfully cloned ${successCount} out of ${sourceServices.length} services`,
    );
  } catch (error) {
    console.error('Error cloning services:', error);
  } finally {
    await sourcePrisma.$disconnect();
    await destPrisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
}); 