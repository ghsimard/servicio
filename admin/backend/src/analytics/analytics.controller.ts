import { Body, Controller, Get, Param, Post, Query, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { TrackActionDto, CreateSessionDto, EndSessionDto } from './analytics.dto';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  @ApiOperation({ summary: 'Track admin user action' })
  async trackAction(@Body() data: TrackActionDto, @Request() req) {
    return this.analyticsService.trackAdminAction(
      req.user.sub,
      data.sessionId,
      data.pageVisited,
      data.actionType,
      data.actionData,
      data.source || 'admin-app'
    );
  }

  @Post('session')
  @ApiOperation({ summary: 'Create a new analytics session' })
  async createSession(@Body() data: CreateSessionDto, @Request() req) {
    return this.analyticsService.createSession(
      req.user.sub, 
      req, 
      data.source || 'admin-app'
    );
  }

  @Post('end-session')
  @ApiOperation({ summary: 'End an analytics session' })
  async endSession(@Body() data: EndSessionDto, @Request() req) {
    return this.analyticsService.endSession(
      req.user.sub, 
      data.sessionId,
      data.source || 'admin-app'
    );
  }

  @Get('sessions')
  @ApiOperation({ summary: 'Get all user sessions' })
  async getSessions(@Query('limit') limit: number = 100) {
    return this.analyticsService.getAllSessions(limit);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get analytics for a specific user' })
  async getUserAnalytics(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
  ) {
    return this.analyticsService.getUserAnalytics(userId, limit);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin analytics dashboard data' })
  async getAnalyticsDashboard() {
    return this.analyticsService.getAdminAnalyticsDashboard();
  }
} 