import { Controller, Delete, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Prisma } from '@prisma/client';

@Controller('api/services')
export class ServiceController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getAllServices() {
    try {
      console.log('Fetching all services...'); // Debug log
      const services = await this.prisma.services.findMany();
      console.log(`Found ${services.length} services`); // Debug log
      return services;
    } catch (error) {
      console.error('Error fetching services:', error); // Debug log
      throw new HttpException(
        'Failed to fetch services',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteService(@Param('id') id: string) {
    try {
      console.log(`Attempting to delete service with ID: ${id}`); // Debug log
      
      // First, check if the service exists
      const service = await this.prisma.services.findUnique({
        where: { service_id: id },
      });

      if (!service) {
        console.log(`Service with ID ${id} not found`); // Debug log
        throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
      }

      console.log(`Service found: ${service.name_en}`); // Debug log

      // Check if this service is referenced by other services
      const referencingServices = await this.prisma.services.findMany({
        where: { parent_service_id: id },
      });

      if (referencingServices.length > 0) {
        console.log(`Cannot delete service ${id} due to child services`); // Debug log
        throw new HttpException(
          {
            message: 'Cannot delete service with child services',
            details: {
              serviceId: id,
              serviceName: service.name_en,
              childServiceCount: referencingServices.length,
            },
          },
          HttpStatus.CONFLICT,
        );
      }

      // If no references exist, proceed with deletion
      await this.prisma.services.delete({
        where: { service_id: id },
      });
      console.log(`Service ${id} deleted successfully`); // Debug log

      return { message: 'Service deleted successfully' };
    } catch (error) {
      console.error('Error in deleteService:', error); // Debug log
      
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma errors
        if (error.code === 'P2025') {
          throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
        }
        if (error.code === 'P2003') {
          throw new HttpException(
            'Cannot delete service due to existing relationships',
            HttpStatus.CONFLICT,
          );
        }
      }

      throw new HttpException(
        'Failed to delete service',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 