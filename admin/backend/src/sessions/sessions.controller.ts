import { Controller, Get, UseGuards } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get('active')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all active sessions' })
  async getActiveSessions() {
    return this.sessionsService.getActiveSessions();
  }

  @Get('active/admin')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get active admin sessions' })
  async getActiveAdminSessions() {
    return this.sessionsService.getActiveSessions('admin');
  }

  @Get('active/main')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get active main app sessions' })
  async getActiveMainSessions() {
    return this.sessionsService.getActiveSessions('main');
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get overall session statistics' })
  async getSessionStats() {
    return this.sessionsService.getSessionStats();
  }

  @Get('stats/admin')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get admin session statistics' })
  async getAdminSessionStats() {
    return this.sessionsService.getSessionStats('admin');
  }

  @Get('stats/main')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get main app session statistics' })
  async getMainSessionStats() {
    return this.sessionsService.getSessionStats('main');
  }
} 