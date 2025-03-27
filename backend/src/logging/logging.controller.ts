import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Logger
} from '@nestjs/common';
import { LoggingService } from './logging.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

interface TrackActionDto {
  pageVisited: string;
  actionType: string;
  actionData?: any;
  sessionId: string;
  source?: string;
}

interface CreateSessionDto {
  source?: string;
}

interface EndSessionDto {
  sessionId: string;
  source?: string;
}

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    roles: string[];
  }
}

@Controller('logging')
export class LoggingController {
  private readonly logger = new Logger(LoggingController.name);

  constructor(private readonly loggingService: LoggingService) {}

  @Post('track-action')
  @UseGuards(JwtAuthGuard)
  async trackAction(@Body() data: TrackActionDto, @Req() req: RequestWithUser) {
    this.logger.debug(`Tracking action: ${data.actionType} on page ${data.pageVisited} for session ${data.sessionId}`);
    
    return this.loggingService.trackUserAction(
      req.user.userId,
      data.sessionId,
      data.pageVisited,
      data.actionType,
      data.actionData,
      data.source
    );
  }

  @Post('create-session')
  @UseGuards(JwtAuthGuard)
  async createSession(@Body() data: CreateSessionDto, @Req() req: RequestWithUser) {
    const userId = req.user.userId;
    
    // Debug the user object and token
    this.logger.debug('JWT user payload:', req.user);
    this.logger.debug(`Creating session for user ID: ${userId} with source: ${data.source || 'not specified'}`);
    
    const sessionType = 'web';
    return this.loggingService.createUserSession(
      userId, 
      req, 
      sessionType,
      data.source
    );
  }

  @Post('end-session')
  @UseGuards(JwtAuthGuard)
  async endSession(@Body() data: EndSessionDto, @Req() req: RequestWithUser) {
    const userId = req.user.userId;
    this.logger.debug(`Ending session ${data.sessionId} for user ${userId}`);
    return this.loggingService.endUserSession(userId, data.sessionId);
  }
} 