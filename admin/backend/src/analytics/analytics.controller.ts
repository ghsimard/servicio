import { Body, Controller, Get, Param, Post, Query, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

interface TrackActionDto {
  pageVisited: string;
  actionType: string;
  actionData?: any;
  sessionId: string;
}

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  @ApiOperation({ summary: 'Track admin user action' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pageVisited: { type: 'string' },
        actionType: { type: 'string' },
        actionData: { type: 'object' },
        sessionId: { type: 'string' },
      },
      required: ['pageVisited', 'actionType', 'sessionId'],
    },
  })
  async trackAction(@Body() data: TrackActionDto, @Request() req) {
    return this.analyticsService.trackAdminAction(
      req.user.sub,
      data.sessionId,
      data.pageVisited,
      data.actionType,
      data.actionData,
    );
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