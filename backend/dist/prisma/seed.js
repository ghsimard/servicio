"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    try {
        await prisma.services.deleteMany({});
        const services = [
            {
                name_en: 'House Cleaning',
                description: 'Professional house cleaning services',
                level: 1,
                is_active: true,
                metadata: {},
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name_en: 'Gardening',
                description: 'Garden maintenance and landscaping',
                level: 1,
                is_active: true,
                metadata: {},
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name_en: 'Plumbing',
                description: 'Professional plumbing services',
                level: 1,
                is_active: true,
                metadata: {},
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name_en: 'Electrical Work',
                description: 'Electrical installation and repairs',
                level: 1,
                is_active: true,
                metadata: {},
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name_en: 'Painting',
                description: 'Interior and exterior painting services',
                level: 1,
                is_active: true,
                metadata: {},
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];
        for (const service of services) {
            await prisma.services.create({
                data: service,
            });
        }
        console.log('Seed data created successfully');
    }
    catch (error) {
        console.error('Error seeding data:', error);
        throw error;
    }
}
main()
    .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
})
    .finally(() => {
    prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map