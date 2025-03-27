import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { Prisma } from '@prisma/client';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);

  constructor(private prisma: PrismaService) {}

  private getChangedValues(oldData: any, newData: any): any {
    const changes: any = {};
    const allKeys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]);

    for (const key of allKeys) {
      // Skip system fields
      if (key === 'createdAt' || key === 'updatedAt') {
        continue;
      }

      const oldValue = oldData?.[key];
      const newValue = newData?.[key];

      // Handle arrays (like roles)
      if (Array.isArray(oldValue) || Array.isArray(newValue)) {
        const oldArray = Array.isArray(oldValue) ? oldValue : [];
        const newArray = Array.isArray(newValue) ? newValue : [];
        
        // Compare arrays by their sorted stringified values to handle order differences
        const oldArrayStr = JSON.stringify([...oldArray].sort());
        const newArrayStr = JSON.stringify([...newArray].sort());
        
        if (oldArrayStr !== newArrayStr) {
          changes[key] = newArray;
        }
      }
      // Handle objects
      else if (typeof oldValue === 'object' && oldValue !== null && 
               typeof newValue === 'object' && newValue !== null) {
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          changes[key] = newValue;
        }
      }
      // Handle primitive values
      else if (oldValue !== newValue) {
        changes[key] = newValue;
      }
      // Handle deleted fields
      else if (key in oldData && !(key in newData)) {
        changes[key] = null;
      }
      // Handle new fields
      else if (!(key in oldData) && key in newData) {
        changes[key] = newValue;
      }
    }

    return Object.keys(changes).length > 0 ? changes : undefined;
  }

  async logDatabaseAction(
    table: string,
    action: 'insert' | 'update' | 'delete',
    recordId: string,
    details: any,
    operationDetails?: any,
    userId?: string,
  ) {
    try {
      let logDetails: any;

      this.logger.debug('Logging action received:', {
        table,
        action,
        recordId,
        details,
        operationDetails,
        userId
      });

      switch (action) {
        case 'insert':
          logDetails = details;
          break;
        case 'update':
          // For updates, we want to show all changed fields
          logDetails = {};
          const changes = this.getChangedValues(operationDetails, details);
          if (changes) {
            // Include all changed fields in the details
            for (const key in changes) {
              // Format array values as comma-separated strings
              if (Array.isArray(changes[key])) {
                logDetails[key] = changes[key].join(', ');
              } else {
                logDetails[key] = changes[key];
              }
            }
          }
          break;
        case 'delete':
          logDetails = operationDetails;
          break;
      }

      if (logDetails && Object.keys(logDetails).length > 0) {
        this.logger.debug(`Logging ${action} action for ${table} with ID ${recordId}`);
        this.logger.debug('Details:', logDetails);
        this.logger.debug('Operation Details:', operationDetails);

        // Format the details as a string without curly braces
        const formattedDetails = Object.entries(logDetails)
          .map(([key, value]) => {
            // Format field names
            let formattedKey = key;
            switch (key) {
              case 'firstname':
                formattedKey = 'FirstName';
                break;
              case 'lastname':
                formattedKey = 'LastName';
                break;
              case 'preferred_language':
                formattedKey = 'Language';
                break;
              case 'user_roles':
                formattedKey = 'Roles';
                break;
              default:
                // Convert snake_case to Title Case
                formattedKey = key
                  .split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
            }
            return `${formattedKey}: ${value}`;
          })
          .join(', ');

        const logEntry = await this.prisma.database_logs.create({
          data: {
            table_name: table,
            action: action,
            record_id: recordId,
            details: formattedDetails,
            operation_details: operationDetails,
            user_id: userId,
          },
        });

        this.logger.debug('Created log entry:', logEntry);
      } else {
        this.logger.debug(`No changes detected for ${action} action on ${table} with ID ${recordId}`);
      }
    } catch (error) {
      this.logger.error(`Error logging database action: ${error.message}`);
      this.logger.error('Error details:', error);
    }
  }

  async getRecentLogs(limit?: number) {
    try {
      const query: Prisma.database_logsFindManyArgs = {
        orderBy: {
          timestamp: 'desc' as const,
        },
        include: {
          users: {
            select: {
              username: true,
              email: true,
              user_roles: {
                select: {
                  role: true,
                },
              },
            },
          },
        },
      };

      if (limit) {
        query.take = limit;
      }

      return await this.prisma.database_logs.findMany(query);
    } catch (error) {
      this.logger.error(`Error fetching recent logs: ${error.message}`);
      throw error;
    }
  }

  async getLogsByTable(table: string) {
    try {
      return await this.prisma.database_logs.findMany({
        where: {
          table_name: table,
        },
        orderBy: {
          timestamp: 'desc' as const,
        },
        include: {
          users: {
            select: {
              username: true,
              email: true,
              user_roles: {
                select: {
                  role: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Error fetching logs by table: ${error.message}`);
      throw error;
    }
  }

  async getLogsByUser(userId: string) {
    try {
      return await this.prisma.database_logs.findMany({
        where: {
          user_id: userId,
        },
        orderBy: {
          timestamp: 'desc' as const,
        },
        include: {
          users: {
            select: {
              username: true,
              email: true,
              user_roles: {
                select: {
                  role: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Error fetching logs by user: ${error.message}`);
      throw error;
    }
  }

  async deleteAllLogs() {
    try {
      await this.prisma.database_logs.deleteMany({});
      this.logger.debug('All logs deleted successfully');
    } catch (error) {
      this.logger.error(`Error deleting all logs: ${error.message}`);
      throw error;
    }
  }
} 