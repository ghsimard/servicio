import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { Prisma } from '@prisma/client';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);

  constructor(private prisma: PrismaService) {}

  private getChangedValues(oldData: any, newData: any): any {
    if (!oldData || !newData) return newData;

    const changes: any = {};
    
    // Log all fields from newData that are different from oldData
    for (const key in newData) {
      // Skip only system fields
      if (key === 'createdAt' || key === 'updatedAt') {
        continue;
      }

      const oldValue = oldData[key];
      const newValue = newData[key];

      // Handle arrays (like roles)
      if (Array.isArray(newValue)) {
        const oldArray = oldValue || [];
        if (JSON.stringify(oldArray) !== JSON.stringify(newValue)) {
          changes[key] = newValue;
          this.logger.debug(`Array field ${key} changed:`, {
            old: oldArray,
            new: newValue
          });
        }
        continue;
      }
      
      // Handle objects
      if (typeof newValue === 'object' && newValue !== null) {
        const oldObject = oldValue || {};
        if (JSON.stringify(oldObject) !== JSON.stringify(newValue)) {
          changes[key] = newValue;
          this.logger.debug(`Object field ${key} changed:`, {
            old: oldObject,
            new: newValue
          });
        }
        continue;
      }

      // Handle primitive values
      if (oldValue !== newValue) {
        changes[key] = newValue;
        this.logger.debug(`Primitive field ${key} changed:`, {
          old: oldValue,
          new: newValue
        });
      }
    }

    // Also check for deleted fields
    for (const key in oldData) {
      if (!(key in newData) && key !== 'createdAt' && key !== 'updatedAt') {
        changes[key] = null;
        this.logger.debug(`Field ${key} was deleted`);
      }
    }

    this.logger.debug('Final changes object:', changes);
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
              logDetails[key] = changes[key];
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

        const logEntry = await this.prisma.database_logs.create({
          data: {
            table_name: table,
            action: action,
            record_id: recordId,
            details: logDetails,
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
} 