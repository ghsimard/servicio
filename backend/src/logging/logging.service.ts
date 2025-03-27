import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { Prisma } from '@prisma/client';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);
  private readonly APP_SOURCE = 'main-app';

  constructor(private prisma: PrismaService) {}

  private getChangedValues(oldData: any, newData: any): any {
    const changes: any = {};
    const allKeys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]);

    for (const key of allKeys) {
      // Skip system fields
      if (key === 'createdAt' || key === 'updatedAt' || key === 'created_at' || key === 'updated_at') {
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

        await this.prisma.database_logs.create({
          data: {
            table_name: table,
            action: action,
            record_id: recordId,
            details: formattedDetails,
            operation_details: operationDetails,
            user_id: userId,
            source: this.APP_SOURCE,
          },
        });
      } else {
        this.logger.debug(`No changes detected for ${action} action on ${table} with ID ${recordId}`);
      }
    } catch (error) {
      this.logger.error(`Error logging database action: ${error.message}`);
      this.logger.error('Error details:', error);
    }
  }

  async trackUserAction(
    userId: string,
    sessionId: string,
    pageVisited: string,
    actionType: string,
    actionData?: any,
    source?: string
  ) {
    try {
      // Verify that the session exists
      const session = await this.prisma.user_sessions.findUnique({
        where: {
          session_id: sessionId
        }
      });

      // If session doesn't exist, log error and return without tracking
      if (!session) {
        this.logger.warn(`Session ${sessionId} does not exist for user ${userId}, cannot track action`);
        return;
      }

      // Track the action
      await this.prisma.user_analytics.create({
        data: {
          user_id: userId,
          session_id: sessionId,
          page_visited: pageVisited,
          action_type: actionType,
          action_data: actionData || {},
          source: source || this.APP_SOURCE,
        },
      });

      this.logger.debug(
        `Tracked action: ${actionType} by user ${userId} on page ${pageVisited} from source ${source || this.APP_SOURCE}`
      );
    } catch (error) {
      this.logger.error(
        `Error tracking user action: ${error.message}`,
        error.stack
      );
      // Don't rethrow - analytics should never break the application
    }
  }

  async createUserSession(userId: string, req: Request, sessionType: string, source?: string) {
    try {
      // Validate userId is present
      if (!userId) {
        this.logger.error('Invalid user ID provided for session creation');
        throw new Error('User ID is required to create a session');
      }
      
      const sourceValue = source || this.APP_SOURCE;
      this.logger.debug(`Creating session for user ID: ${userId} with type: ${sessionType} and source: ${sourceValue}`);
      
      const userAgent = req.headers['user-agent'];
      const ip = req.ip || req.socket.remoteAddress;
      
      // Parse user agent to get device, browser and OS info
      let deviceType = 'unknown';
      let browser = 'unknown';
      let os = 'unknown';
      
      if (userAgent) {
        // Simple parsing - in production, consider using a proper library like ua-parser-js
        if (userAgent.includes('Mobile')) {
          deviceType = 'mobile';
        } else if (userAgent.includes('Tablet')) {
          deviceType = 'tablet';
        } else {
          deviceType = 'desktop';
        }
        
        // Crude browser detection
        if (userAgent.includes('Chrome')) {
          browser = 'Chrome';
        } else if (userAgent.includes('Firefox')) {
          browser = 'Firefox';
        } else if (userAgent.includes('Safari')) {
          browser = 'Safari';
        } else if (userAgent.includes('Edge')) {
          browser = 'Edge';
        }
        
        // Crude OS detection
        if (userAgent.includes('Windows')) {
          os = 'Windows';
        } else if (userAgent.includes('Mac')) {
          os = 'MacOS';
        } else if (userAgent.includes('Linux')) {
          os = 'Linux';
        } else if (userAgent.includes('Android')) {
          os = 'Android';
        } else if (userAgent.includes('iOS')) {
          os = 'iOS';
        }
      }
      
      // Check if the user already has an active session
      const existingSession = await this.prisma.user_sessions.findFirst({
        where: {
          user_id: userId,
          is_active: true
        }
      });
      
      if (existingSession) {
        this.logger.debug(`User ${userId} already has an active session ${existingSession.session_id}, reusing it`);
        return {
          sessionId: existingSession.session_id,
          loginTime: existingSession.login_time
        };
      }
      
      // Create the session with proper user relation
      const sessionData = {
        user_id: userId,
        ip_address: ip,
        device_type: deviceType,
        browser,
        os,
        user_agent: userAgent,
        is_active: true,
        session_type: sessionType,
        source: sourceValue,
      };
      
      this.logger.debug(`Creating new session with data:`, sessionData);
      
      try {
        const session = await this.prisma.user_sessions.create({
          data: sessionData,
        });
        
        this.logger.debug(`Successfully created session ${session.session_id} for user ${userId} with source ${sourceValue}`);
        
        return {
          sessionId: session.session_id,
          loginTime: session.login_time
        };
      } catch (dbError) {
        this.logger.error(`Database error creating session: ${dbError.message}`, dbError.stack);
        // Create simplified session data if the first attempt failed
        const simplifiedSession = await this.prisma.user_sessions.create({
          data: {
            user_id: userId,
            session_type: sessionType,
            source: sourceValue,
          },
        });
        
        this.logger.debug(`Created simplified session ${simplifiedSession.session_id} as fallback with source ${sourceValue}`);
        
        return {
          sessionId: simplifiedSession.session_id,
          loginTime: simplifiedSession.login_time
        };
      }
    } catch (error) {
      this.logger.error(`Error creating user session: ${error.message}`, error.stack);
      throw error;
    }
  }

  async endUserSession(userId: string, sessionId: string) {
    try {
      const session = await this.prisma.user_sessions.findFirst({
        where: {
          session_id: sessionId,
          user_id: userId,
        },
      });
      
      if (session) {
        // Calculate session duration in seconds
        const loginTime = new Date(session.login_time);
        const logoutTime = new Date();
        const durationMs = logoutTime.getTime() - loginTime.getTime();
        const durationSec = Math.floor(durationMs / 1000);
        
        await this.prisma.user_sessions.update({
          where: {
            session_id: sessionId,
          },
          data: {
            is_active: false,
            logout_time: logoutTime,
            duration: durationSec,
          },
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      this.logger.error(`Error ending user session: ${error.message}`);
      throw error;
    }
  }
} 