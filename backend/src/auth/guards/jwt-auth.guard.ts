import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtStrategy: JwtStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers.authorization;
    
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization token');
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    const user = this.jwtStrategy.validate(token);
    
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    
    // Add user to request object
    request.user = user;
    return true;
  }
} 