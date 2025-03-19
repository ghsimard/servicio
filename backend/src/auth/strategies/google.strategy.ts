import { Injectable, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');
    
    // Check if we have the required configurations
    if (!clientID || !clientSecret) {
      // Provide dummy values when not configured to prevent startup errors
      super({
        clientID: 'dummy-id',
        clientSecret: 'dummy-secret',
        callbackURL: callbackURL || 'http://localhost:3005/auth/google/callback',
        scope: ['email', 'profile']
      });
    } else {
      super({
        clientID,
        clientSecret,
        callbackURL,
        scope: ['email', 'profile']
      });
    }
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { name, emails, photos } = profile || { name: {}, emails: [], photos: [] };
    
    return {
      email: emails && emails.length > 0 ? emails[0].value : '',
      firstName: name?.givenName || '',
      lastName: name?.familyName || '',
      picture: photos && photos.length > 0 ? photos[0].value : '',
      accessToken
    };
  }
} 