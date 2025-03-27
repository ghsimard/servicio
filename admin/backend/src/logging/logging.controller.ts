import { Controller, Get, Query, HttpException, HttpStatus, Logger, Param, Delete, UseGuards } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('logs')
@Controller('logs')
export class LoggingController {
  private readonly logger = new Logger(LoggingController.name);

  constructor(private readonly loggingService: LoggingService) {}

  @Get()
  @ApiOperation({ summary: 'Get recent logs' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of logs to return', type: Number })
  async getRecentLogs(@Query('limit') limit?: number) {
    try {
      return await this.loggingService.getRecentLogs(limit);
    } catch (error) {
      this.logger.error(`Error fetching logs: ${error.message}`);
      throw new HttpException(
        `Failed to fetch logs: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('by-table')
  @ApiOperation({ summary: 'Get logs by table name' })
  @ApiQuery({ name: 'tableName', required: true, description: 'Name of the table to get logs for' })
  async getLogsByTable(@Query('tableName') tableName: string) {
    try {
      return await this.loggingService.getLogsByTable(tableName);
    } catch (error) {
      this.logger.error(`Error fetching logs by table: ${error.message}`);
      throw new HttpException(
        `Failed to fetch logs by table: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get logs by user ID' })
  @ApiQuery({ name: 'userId', required: true, description: 'ID of the user to get logs for' })
  async getLogsByUser(@Param('userId') userId: string) {
    try {
      return await this.loggingService.getLogsByUser(userId);
    } catch (error) {
      this.logger.error(`Error fetching logs by user: ${error.message}`);
      throw new HttpException(
        `Failed to fetch logs by user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('all')
  @UseGuards(JwtAuthGuard)
  async deleteAllLogs() {
    return this.loggingService.deleteAllLogs();
  }
} 