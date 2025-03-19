import { Controller, Get, UseGuards, Req, Put, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

interface RequestWithUser {
  user: {
    sub: string;
    email: string;
  };
}

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Get dashboard data for the current user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Dashboard data retrieved successfully' 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getDashboard(@Req() req: RequestWithUser) {
    return this.dashboardService.getDashboardData(req.user.sub);
  }

  @ApiOperation({ summary: 'Get user profile information' })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile data retrieved successfully',
    schema: {
      example: {
        id: 'e7c8f8f0-d5b9-4dc7-a8b2-f9f0d5b9dc7a',
        username: 'johndoe',
        email: 'john@example.com',
        preferredLanguage: 'en',
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: RequestWithUser) {
    return this.dashboardService.getUserProfile(req.user.sub);
  }

  @ApiOperation({ summary: 'Update user profile information' })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile updated successfully',
    schema: {
      example: {
        id: 'e7c8f8f0-d5b9-4dc7-a8b2-f9f0d5b9dc7a',
        username: 'johndoe',
        email: 'john@example.com',
        name: 'John Doe',
        preferredLanguage: 'en',
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Req() req: RequestWithUser, @Body() updateData: any) {
    return this.dashboardService.updateUserProfile(req.user.sub, updateData);
  }
} 