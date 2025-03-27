import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Request, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { Request as ExpressRequest } from 'express';
import { LoginDto } from './dto/login.dto';

interface RequestUser {
  userId: string;
  email: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: ExpressRequest) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user, req);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: Request & { user: RequestUser }) {
    const sessionId = req.headers['x-session-id'] as string;
    if (sessionId) {
      await this.authService.logout(req.user.userId, sessionId);
    }
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    const user = await this.usersService.findOne(req.user.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
} 