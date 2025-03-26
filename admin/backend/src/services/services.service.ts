import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.service.findMany();
  }

  async findOne(serviceId: string) {
    return this.prisma.service.findUnique({
      where: { serviceId },
    });
  }

  async create(data: any) {
    return this.prisma.service.create({
      data,
    });
  }

  async update(serviceId: string, data: any) {
    return this.prisma.service.update({
      where: { serviceId },
      data,
    });
  }

  async remove(serviceId: string) {
    return this.prisma.service.delete({
      where: { serviceId },
    });
  }
} 