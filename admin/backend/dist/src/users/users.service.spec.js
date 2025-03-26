"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const users_service_1 = require("./users.service");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
describe('UsersService', () => {
    let service;
    let prisma;
    const mockPrismaService = {
        user: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        user_roles: {
            deleteMany: jest.fn(),
        },
        database_logs: {
            create: jest.fn(),
        },
        $transaction: jest.fn((callback) => callback(mockPrismaService)),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                users_service_1.UsersService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();
        service = module.get(users_service_1.UsersService);
        prisma = module.get(prisma_service_1.PrismaService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('create', () => {
        const createUserDto = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@example.com',
            username: 'johndoe',
            password: 'password123',
            preferred_language: 'en',
            roles: [client_1.role_type.admin],
        };
        const mockCreatedUser = {
            userId: '123',
            email: 'john@example.com',
            firstname: 'John',
            lastname: 'Doe',
            username: 'johndoe',
            preferred_language: 'en',
            user_roles: [{ role: client_1.role_type.admin }],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        it('should create a user and log the operation', async () => {
            mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);
            const result = await service.create(createUserDto, 'admin123');
            expect(result).toEqual(mockCreatedUser);
            expect(mockPrismaService.user.create).toHaveBeenCalled();
            expect(mockPrismaService.database_logs.create).toHaveBeenCalledWith({
                data: {
                    user_id: 'admin123',
                    table_name: 'users',
                    action: 'insert',
                    record_id: '123',
                    details: {
                        email: 'john@example.com',
                        firstname: 'John',
                        lastname: 'Doe',
                        username: 'johndoe',
                        preferred_language: 'en',
                    },
                    operation_details: {
                        roles: [client_1.role_type.admin],
                    },
                },
            });
        });
    });
    describe('update', () => {
        const updateUserDto = {
            firstname: 'John Updated',
            lastname: 'Doe Updated',
            email: 'john.updated@example.com',
            username: 'johndoe.updated',
            password: 'newpassword123',
            preferred_language: 'fr',
            roles: [client_1.role_type.admin, client_1.role_type.helper],
        };
        const mockCurrentUser = {
            email: 'john@example.com',
            firstname: 'John',
            lastname: 'Doe',
            username: 'johndoe',
            preferred_language: 'en',
            user_roles: [{ role: client_1.role_type.admin }],
        };
        const mockUpdatedUser = {
            userId: '123',
            email: 'john.updated@example.com',
            firstname: 'John Updated',
            lastname: 'Doe Updated',
            username: 'johndoe.updated',
            preferred_language: 'fr',
            user_roles: [
                { role: client_1.role_type.admin },
                { role: client_1.role_type.helper },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        it('should update a user and log the operation', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(mockCurrentUser);
            mockPrismaService.user.update.mockResolvedValue(mockUpdatedUser);
            const result = await service.update('123', updateUserDto, 'admin123');
            expect(result).toEqual(mockUpdatedUser);
            expect(mockPrismaService.user.update).toHaveBeenCalled();
            expect(mockPrismaService.database_logs.create).toHaveBeenCalledWith({
                data: {
                    user_id: 'admin123',
                    table_name: 'users',
                    action: 'update',
                    record_id: '123',
                    details: {
                        email: 'john.updated@example.com',
                        firstname: 'John Updated',
                        lastname: 'Doe Updated',
                        username: 'johndoe.updated',
                        preferred_language: 'fr',
                    },
                    operation_details: {
                        previousData: mockCurrentUser,
                        newRoles: [client_1.role_type.admin, client_1.role_type.helper],
                        previousRoles: [client_1.role_type.admin],
                    },
                },
            });
        });
    });
    describe('remove', () => {
        const mockUser = {
            email: 'john@example.com',
            firstname: 'John',
            lastname: 'Doe',
            username: 'johndoe',
            preferred_language: 'en',
            user_roles: [{ role: client_1.role_type.admin }],
        };
        it('should delete a user and log the operation', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockPrismaService.user.delete.mockResolvedValue({});
            await service.remove('123', 'admin123');
            expect(mockPrismaService.user.delete).toHaveBeenCalled();
            expect(mockPrismaService.database_logs.create).toHaveBeenCalledWith({
                data: {
                    user_id: 'admin123',
                    table_name: 'users',
                    action: 'delete',
                    record_id: '123',
                    details: {
                        email: 'john@example.com',
                        firstname: 'John',
                        lastname: 'Doe',
                        username: 'johndoe',
                        preferred_language: 'en',
                    },
                    operation_details: {
                        deletedRoles: [client_1.role_type.admin],
                    },
                },
            });
        });
    });
});
//# sourceMappingURL=users.service.spec.js.map