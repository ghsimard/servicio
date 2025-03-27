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
    const existingUser = await this.prisma.user.findUnique({
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
      await this.prisma.user.findFirst({
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
      const user = await this.prisma.user.create({
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

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        user_id: true,
        email: true,
        username: true,
        password_hash: true,
      },
    });

    if (!user) {
      this.logger.error(`User not found: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User found: ${user.user_id}, hash: ${user.password_hash ? 'exists' : 'missing'}`);

    try {
      // Special bypass for debug login
      let isPasswordValid = false;
      
      if (password === 'BYPASS_PASSWORD') {
        this.logger.log('Using debug password bypass');
        isPasswordValid = true;
      } else {
        isPasswordValid = await bcrypt.compare(
          password,
          user.password_hash || '',
        );
        this.logger.log(`Password validation result: ${isPasswordValid}`);
      }

      if (!isPasswordValid) {
        this.logger.error(`Invalid password for user: ${user.user_id}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      // TEMPORARILY BYPASS EMAIL VERIFICATION FOR TESTING
      // const isVerified = await this.isEmailVerified(user.user_id);
      // if (!isVerified) {
      //   throw new UnauthorizedException(
      //     'Email not verified. Please verify your email before logging in.',
      //   );
      // }

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
    } catch (error) {
      this.logger.error(`Error during password validation: ${error.message}`);
      throw new UnauthorizedException('Invalid credentials');
    }
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
        where: { token },
      });
      throw new BadRequestException('Verification token has expired');
    }

    // Get the user associated with the token
    const user = await this.prisma.user.findUnique({
      where: { user_id: verificationToken.user_id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Mark the user as verified by updating the token type
    await this.prisma.verification_tokens.update({
      where: { token },
      data: {
        type: 'verified',
      },
    });

    return {
      message: 'Email verified successfully',
      userId: user.user_id,
    };
  }

  private async isEmailVerified(userId: string): Promise<boolean> {
    const token = await this.prisma.verification_tokens.findFirst({
      where: {
        user_id: userId,
        type: 'verified',
      },
    });
    return !!token;
  }

  validateOAuthUser(email: string, name: string, provider: string) {
    // Handle OAuth authentication
    // This would typically check if the user exists,
    // create them if they don't, and generate a JWT token
    
    return {
      email,
      name,
      provider,
    };
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        user_id: true,
        email: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Set token to expire in 1 hour
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    
    // Store token in database 
    // NOTE: This assumes you have a password_reset_tokens table/model
    // You may need to adjust this code based on your actual schema
    await this.prisma.verification_tokens.create({
      data: {
        user_id: user.user_id,
        token: resetToken,
        type: 'password_reset',
        expires_at: expiresAt,
      },
    });
    
    this.logger.log(`Password reset requested for user ${user.user_id}`);

    // Return the reset token for development/testing
    // In production, you would send this by email and not return it
    return {
      message: 'Password reset token generated',
      resetToken, // Remove this in production
    };
  }

  async resetPassword(token: string, newPassword: string) {
    // Find reset token in the database
    const resetToken = await this.prisma.verification_tokens.findFirst({
      where: {
        token,
        type: 'password_reset',
      },
    });
    
    if (!resetToken) {
      throw new NotFoundException('Invalid reset token');
    }
    
    // Check if token has expired
    if (resetToken.expires_at < new Date()) {
      // Delete the expired token
      await this.prisma.verification_tokens.delete({
        where: { token_id: resetToken.token_id },
      });
      throw new BadRequestException('Reset token has expired');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user password and mark token as used - transaction to ensure both operations succeed or fail together
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { user_id: resetToken.user_id },
        data: { password_hash: hashedPassword },
      }),
      this.prisma.verification_tokens.update({
        where: { token_id: resetToken.token_id },
        data: { type: 'used' },
      }),
    ]);
    
    this.logger.log(`Password reset for user ${resetToken.user_id}`);
    
    return {
      message: 'Password reset successful',
    };
  }
} 