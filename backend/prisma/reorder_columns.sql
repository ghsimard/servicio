-- Reorder columns in the services table to move name_fr and name_es next to name_en
-- PostgreSQL doesn't have a direct ALTER TABLE statement to reorder columns, so we need to recreate the table

BEGIN;

-- Create a new table with the desired column order
CREATE TABLE services_new (
  service_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_service_id UUID,
  level             INT NOT NULL,
  name_en           VARCHAR(100) NOT NULL,
  name_fr           VARCHAR(100),
  name_es           VARCHAR(100),
  is_active         BOOLEAN DEFAULT TRUE NOT NULL,
  metadata          JSONB,
  created_at        TIMESTAMP(6) DEFAULT NOW(),
  updated_at        TIMESTAMP(6) DEFAULT NOW()
);

-- Copy data from the original table to the new table
INSERT INTO services_new (
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
)
SELECT
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
FROM services;

-- Drop original table constraints and relations
ALTER TABLE helper_services DROP CONSTRAINT IF EXISTS helper_services_service_id_fkey;
ALTER TABLE rfps DROP CONSTRAINT IF EXISTS rfps_service_id_fkey;
ALTER TABLE services DROP CONSTRAINT IF EXISTS services_parent_service_id_fkey;

-- Replace the original table with the new one
DROP TABLE services;
ALTER TABLE services_new RENAME TO services;

-- Re-create the index
CREATE INDEX idx_services_parent_service_id ON services(parent_service_id);

-- Re-create the foreign key relationships
ALTER TABLE services ADD CONSTRAINT services_parent_service_id_fkey
  FOREIGN KEY (parent_service_id) REFERENCES services(service_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE helper_services ADD CONSTRAINT helper_services_service_id_fkey
  FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE rfps ADD CONSTRAINT rfps_service_id_fkey
  FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT;

-- Run the following command to execute this script:
-- psql postgresql://postgres:postgres@localhost:5432/servicio_dev -f prisma/reorder_columns.sql 