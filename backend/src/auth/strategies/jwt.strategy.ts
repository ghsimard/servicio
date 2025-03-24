import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  sub: string;
  email: string;
  roles?: string[];
}

@Injectable()
export class JwtStrategy {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates a JWT token
   * @param token JWT token to validate
   * @returns User data extracted from the token or null on validation failure
   */
  validate(token: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      
      return { 
        userId: payload.sub,
        email: payload.email,
      };
    } catch {
      return null;
    }
  }
} 