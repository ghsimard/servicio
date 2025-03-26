import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        userId: true,
        firstname: true,
        lastname: true,
        email: true,
        username: true,
        preferred_language: true,
        createdAt: true,
        updatedAt: true,
        user_roles: {
          select: {
            role: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { userId: id },
      select: {
        userId: true,
        firstname: true,
        lastname: true,
        email: true,
        username: true,
        preferred_language: true,
        createdAt: true,
        updatedAt: true,
        user_roles: {
          select: {
            role: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        userId: true,
        firstname: true,
        lastname: true,
        email: true,
        username: true,
        passwordHash: true,
        preferred_language: true,
        createdAt: true,
        updatedAt: true,
        user_roles: {
          select: {
            role: true,
          },
        },
      },
    });
  }

  async create(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const { roles, ...userData } = data;

    const user = await this.prisma.user.create({
      data: {
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        username: userData.username,
        passwordHash: hashedPassword,
        preferred_language: userData.preferred_language,
        user_roles: {
          create: roles?.map((role: string) => ({
            role: role as any,
          })) || [],
        },
      },
      select: {
        userId: true,
        firstname: true,
        lastname: true,
        email: true,
        username: true,
        preferred_language: true,
        createdAt: true,
        updatedAt: true,
        user_roles: {
          select: {
            role: true,
          },
        },
      },
    });

    return user;
  }

  async update(id: string, data: any) {
    const { roles, ...userData } = data;
    
    if (userData.password) {
      userData.passwordHash = await bcrypt.hash(userData.password, 10);
      delete userData.password;
    }

    // First, delete existing roles
    await this.prisma.user_roles.deleteMany({
      where: { user_id: id },
    });

    // Then update user and create new roles
    const user = await this.prisma.user.update({
      where: { userId: id },
      data: {
        ...userData,
        user_roles: {
          create: roles?.map((role: string) => ({
            role: role as any,
          })) || [],
        },
      },
      select: {
        userId: true,
        firstname: true,
        lastname: true,
        email: true,
        username: true,
        preferred_language: true,
        createdAt: true,
        updatedAt: true,
        user_roles: {
          select: {
            role: true,
          },
        },
      },
    });

    return user;
  }

  async remove(id: string) {
    // Delete user roles first
    await this.prisma.user_roles.deleteMany({
      where: { user_id: id },
    });

    // Then delete the user
    return this.prisma.user.delete({
      where: { userId: id },
    });
  }
}