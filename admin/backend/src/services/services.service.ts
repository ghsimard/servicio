import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggingService } from '../logging/logging.service';
import { Request } from 'express';

@Injectable()
export class ServicesService {
  constructor(
    private prisma: PrismaService,
    private loggingService: LoggingService,
  ) {}

  async findAll() {
    return this.prisma.service.findMany();
  }

  async findOne(id: string) {
    return this.prisma.service.findUnique({
      where: { serviceId: id },
    });
  }

  async create(data: any, req?: Request) {
    const service = await this.prisma.service.create({
      data,
    });

    await this.loggingService.logDatabaseAction(
      'services',
      'insert',
      service.serviceId,
      service,
      undefined,
      (req?.user as any)?.sub,
    );

    return service;
  }

  async update(id: string, data: any, req?: Request) {
    const oldService = await this.findOne(id);
    
    const service = await this.prisma.service.update({
      where: { serviceId: id },
      data,
    });

    await this.loggingService.logDatabaseAction(
      'services',
      'update',
      service.serviceId,
      service,
      oldService,
      (req?.user as any)?.sub,
    );

    return service;
  }

  async remove(id: string, req?: Request) {
    const oldService = await this.findOne(id);
    
    const service = await this.prisma.service.delete({
      where: { serviceId: id },
    });

    await this.loggingService.logDatabaseAction(
      'services',
      'delete',
      id,
      undefined,
      oldService,
      (req?.user as any)?.sub,
    );

    return service;
  }
} 