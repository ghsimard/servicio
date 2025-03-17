-- Rename "name" column to "name_en"
ALTER TABLE IF EXISTS "services" RENAME COLUMN "name" TO "name_en";

-- Run the following command to execute this script:
-- psql postgresql://postgres:postgres@localhost:5432/servicio_dev -f prisma/rename_name_to_name_en.sql 