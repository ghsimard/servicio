import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggingService } from '../logging/logging.service';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private loggingService: LoggingService,
  ) {}

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

  async create(data: any, req?: Request) {
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

    await this.loggingService.logDatabaseAction(
      'users',
      'insert',
      user.userId,
      { ...user, roles: roles || [] },
      undefined,
      (req?.user as any)?.sub,
    );

    return user;
  }

  async update(id: string, data: any, req?: Request) {
    const { roles, ...userData } = data;
    
    // Get the current user data for logging
    const oldUser = await this.findOne(id);
    const oldRoles = oldUser.user_roles.map(r => r.role);
    
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

    const newRoles = user.user_roles.map(r => r.role);

    // Prepare the data for logging
    const newData = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      username: user.username,
      preferred_language: user.preferred_language,
      roles: newRoles,
    };

    const oldData = {
      firstname: oldUser.firstname,
      lastname: oldUser.lastname,
      email: oldUser.email,
      username: oldUser.username,
      preferred_language: oldUser.preferred_language,
      roles: oldRoles,
    };

    // Log the changes
    await this.loggingService.logDatabaseAction(
      'users',
      'update',
      user.userId,
      oldData,
      newData,
      (req?.user as any)?.sub,
    );

    return user;
  }

  async remove(id: string, req?: Request) {
    // Get the current user data for logging
    const oldUser = await this.findOne(id);

    // Delete user roles first
    await this.prisma.user_roles.deleteMany({
      where: { user_id: id },
    });

    // Then delete the user
    const user = await this.prisma.user.delete({
      where: { userId: id },
    });

    await this.loggingService.logDatabaseAction(
      'users',
      'delete',
      id,
      undefined,
      { ...oldUser, roles: oldUser.user_roles.map(r => r.role) },
      (req?.user as any)?.sub,
    );

    return user;
  }
}