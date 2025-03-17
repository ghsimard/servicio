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
                name_fr: 'Nettoyage de maison',
                name_es: 'Limpieza de casa',
                level: 1,
                is_active: true,
                metadata: {},
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name_en: 'Gardening',
                name_fr: 'Jardinage',
                name_es: 'Jardinería',
                level: 1,
                is_active: true,
                metadata: {},
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name_en: 'Plumbing',
                name_fr: 'Plomberie',
                name_es: 'Fontanería',
                level: 1,
                is_active: true,
                metadata: {},
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name_en: 'Electrical Work',
                name_fr: 'Travaux électriques',
                name_es: 'Trabajo eléctrico',
                level: 1,
                is_active: true,
                metadata: {},
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name_en: 'Painting',
                name_fr: 'Peinture',
                name_es: 'Pintura',
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