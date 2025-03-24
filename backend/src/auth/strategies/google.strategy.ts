import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get('GOOGLE_CLIENT_ID') || 'dummy-id';
    const clientSecret = configService.get('GOOGLE_CLIENT_SECRET') || 'dummy-secret';
    const callbackURL = configService.get('GOOGLE_CALLBACK_URL') || 'http://localhost:3001/auth/google/callback';
    
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile']
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { name, emails, photos } = profile;
    
    return {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken
    };
  }
} 