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
    console.log(
      'Starting to clone services from servicioadmin_dev to servicio_dev...',
    );

    // Get all services from source database
    const sourceResult = await sourcePool.query('SELECT * FROM services');
    const sourceServices: Service[] = sourceResult.rows;
    console.log(`Found ${sourceServices.length} services in servicioadmin_dev`);

    // Clear existing services in destination database
    await destPool.query('DELETE FROM services');
    console.log('Cleared existing services in servicio_dev');

    // Separate services into parent and child services
    const parentServices = sourceServices.filter(
      (service) => service.parent_service_id === null,
    );
    const childServices = sourceServices.filter(
      (service) => service.parent_service_id !== null,
    );

    console.log(
      `Found ${parentServices.length} parent services and ${childServices.length} child services`,
    );

    // Insert parent services first
    let parentSuccessCount = 0;
    for (const service of parentServices) {
      try {
        await destPool.query(
          `INSERT INTO services (
            service_id, 
            parent_service_id, 
            level, 
            name, 
            is_active, 
            metadata, 
            created_at, 
            updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            service.service_id,
            service.parent_service_id,
            service.level,
            service.name_en || '', // Use name_en as the name field
            service.is_active,
            JSON.stringify({
              name_fr: service.name_fr || '',
              name_es: service.name_es || '',
            }),
            service.created_at,
            service.updated_at,
          ],
        );
        parentSuccessCount++;
      } catch (error) {
        console.error(`Error inserting parent service ${service.service_id}:`, error);
      }
    }

    console.log(`Successfully inserted ${parentSuccessCount} parent services`);

    // Insert child services
    let childSuccessCount = 0;
    for (const service of childServices) {
      try {
        await destPool.query(
          `INSERT INTO services (
            service_id, 
            parent_service_id, 
            level, 
            name, 
            is_active, 
            metadata, 
            created_at, 
            updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            service.service_id,
            service.parent_service_id,
            service.level,
            service.name_en || '', // Use name_en as the name field
            service.is_active,
            JSON.stringify({
              name_fr: service.name_fr || '',
              name_es: service.name_es || '',
            }),
            service.created_at,
            service.updated_at,
          ],
        );
        childSuccessCount++;
      } catch (error) {
        console.error(`Error inserting child service ${service.service_id}:`, error);
      }
    }

    console.log(`Successfully inserted ${childSuccessCount} child services`);
    console.log(
      `Total: Successfully cloned ${
        parentSuccessCount + childSuccessCount
      } out of ${sourceServices.length} services`,
    );
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