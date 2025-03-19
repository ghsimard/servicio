import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(
    email: string, 
    password: string, 
    name: string,
    profileData?: {
      title?: string;
      gender?: string;
      firstname?: string;
      lastname?: string;
      lastname2?: string;
      dob?: Date;
    }
  ) {
    this.logger.log(`Registering user with email: ${email}, name: ${name}`);

    // Check if user already exists
    const existingUser = await this.prisma.users.findUnique({
      where: { email },
      select: {
        email: true,
        user_id: true,
        username: true,
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate a username from email
    const usernameBase = email.split('@')[0];
    let username = usernameBase;
    let counter = 1;
    
    // Check if username exists and generate a new one if needed
    while (
      await this.prisma.users.findFirst({
        where: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
        select: {
          username: true,
        },
      })
    ) {
      username = `${usernameBase}${counter}`;
      counter++;
    }

    try {
      // Create user
      const user = await this.prisma.users.create({
        data: {
          email,
          username,
          password_hash: hashedPassword,
          title: profileData?.title,
          gender: profileData?.gender,
          firstname: profileData?.firstname,
          lastname: profileData?.lastname,
          lastname2: profileData?.lastname2,
          dob: profileData?.dob,
        },
        select: {
          user_id: true,
          email: true,
          username: true,
        },
      });

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      
      // Set token to expire in 24 hours
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      // Store token using Prisma model
      await this.prisma.verification_tokens.create({
        data: {
          user_id: user.user_id,
          token: verificationToken,
          type: 'email_verification',
          expires_at: expiresAt,
        },
      });

      this.logger.log(
        `User registered with ID: ${user.user_id}, verification token generated`,
      );

      // Return the verification token for development/testing
      // In production, you would send this by email and not return it
      return {
        userId: user.user_id,
        username: user.username,
        message: 'User registered successfully. Please verify your email.',
        verificationToken, // Remove this in production
      };
    } catch (error) {
      this.logger.error('Error creating user:', error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new BadRequestException('Failed to create user: ' + errorMessage);
    }
  }

  async login(email: string, password: string) {
    this.logger.log(`Login attempt for user with email: ${email}`);

    const user = await this.prisma.users.findUnique({
      where: { email },
      select: {
        user_id: true,
        email: true,
        username: true,
        password_hash: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash || '',
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user's email is verified
    const isVerified = await this.isEmailVerified(user.user_id);
    if (!isVerified) {
      throw new UnauthorizedException(
        'Email not verified. Please verify your email before logging in.',
      );
    }

    const payload = {
      sub: user.user_id,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.user_id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async verifyEmail(token: string) {
    this.logger.log(`Verifying email with token: ${token}`);
    
    // Find verification token in the database
    const verificationToken = await this.prisma.verification_tokens.findUnique({
      where: { token },
    });
    
    if (!verificationToken) {
      throw new NotFoundException('Invalid verification token');
    }

    // Check if token has expired
    if (verificationToken.expires_at < new Date()) {
      // Delete the expired token
      await this.prisma.verification_tokens.delete({
        where: { token_id: verificationToken.token_id },
      });
      throw new BadRequestException('Verification token has expired');
    }

    // Mark token as verified by changing its type
    await this.prisma.verification_tokens.update({
      where: { token_id: verificationToken.token_id },
      data: { type: 'email_verified' },
    });

    return {
      message: 'Email verified successfully. You can now log in.',
      userId: verificationToken.user_id,
    };
  }

  // Helper method to check if a user's email is verified
  private async isEmailVerified(userId: string): Promise<boolean> {
    const verifiedToken = await this.prisma.verification_tokens.findFirst({
      where: {
        user_id: userId,
        type: 'email_verified',
      },
    });
    
    return !!verifiedToken;
  }

  // Method for OAuth authentication
  validateOAuthUser(email: string, name: string, provider: string) {
    // Create a simple username from the email
    const username = email.split('@')[0];
    
    // Return the user structure without database operations
    // In a real implementation, this would find or create the user
    return {
      accessToken: this.jwtService.sign({
        sub: 'temp-user-id',
        email,
        provider,
      }),
      user: {
        id: 'temp-user-id',
        email,
        username,
      },
    };
  }
} 