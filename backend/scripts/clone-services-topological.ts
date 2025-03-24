import { Pool } from 'pg';

// Source database (servicioadmin_dev)
const sourcePool = new Pool({
  connectionString: 'postgresql://ghsimard@localhost:5432/servicioadmin_dev',
});

// Destination database (servicio_dev)
const destPool = new Pool({
  connectionString: 'postgresql://postgres:postgres@localhost:5432/servicio_dev',
});

interface Service {
  service_id: string;
  parent_service_id: string | null;
  level: number;
  name_en: string | null;
  name_fr: string | null;
  name_es: string | null;
  is_active: boolean;
  metadata: any;
  created_at: Date;
  updated_at: Date;
}

async function main() {
  try {
    console.log('Starting to clone services from servicioadmin_dev to servicio_dev...');

    // Get all services from source database
    const sourceResult = await sourcePool.query('SELECT * FROM services');
    const sourceServices: Service[] = sourceResult.rows;
    console.log(`Found ${sourceServices.length} services in servicioadmin_dev`);

    // Create a map of services by ID for easy lookup
    const servicesMap = new Map<string, Service>();
    sourceServices.forEach(service => {
      servicesMap.set(service.service_id, service);
    });

    // Create a map to track which services have been inserted
    const insertedServices = new Set<string>();

    // Function to insert a service and its ancestors recursively
    async function insertServiceWithAncestors(serviceId: string): Promise<boolean> {
      // If already inserted, return true
      if (insertedServices.has(serviceId)) {
        return true;
      }

      const service = servicesMap.get(serviceId);
      if (!service) {
        console.error(`Service with ID ${serviceId} not found`);
        return false;
      }

      // If has parent, insert parent first
      if (service.parent_service_id) {
        const parentInserted = await insertServiceWithAncestors(service.parent_service_id);
        if (!parentInserted) {
          console.error(`Failed to insert parent service ${service.parent_service_id}`);
          return false;
        }
      }

      // Insert the service
      try {
        await destPool.query(
          `INSERT INTO services (
            service_id, 
            parent_service_id, 
            level, 
            name_en,
            name_fr,
            name_es, 
            is_active, 
            metadata, 
            created_at, 
            updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (service_id) DO NOTHING`,
          [
            service.service_id,
            service.parent_service_id,
            service.level,
            service.name_en || '',
            service.name_fr,
            service.name_es,
            service.is_active,
            service.metadata || {},
            service.created_at,
            service.updated_at,
          ],
        );
        insertedServices.add(service.service_id);
        console.log(`Inserted service ${service.service_id}`);
        return true;
      } catch (error) {
        console.error(`Error inserting service ${service.service_id}:`, error);
        return false;
      }
    }

    // Clear existing services in destination database
    await destPool.query('DELETE FROM services');
    console.log('Cleared existing services in servicio_dev');

    // Insert all services in topological order
    let successCount = 0;
    for (const service of sourceServices) {
      if (await insertServiceWithAncestors(service.service_id)) {
        successCount++;
      }
    }

    console.log(`Successfully cloned ${successCount} out of ${sourceServices.length} services`);
  } catch (error) {
    console.error('Error cloning services:', error);
  } finally {
    await sourcePool.end();
    await destPool.end();
  }
}

main().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
}); 