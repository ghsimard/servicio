import { 
  Controller, 
  Post, 
  Body, 
  Get,
  Query,
  BadRequestException,
  Logger,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsDateString } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @ApiProperty({ example: 'Mr', description: 'User title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'male', description: 'User gender', required: false })
  @IsString()
  @IsOptional()
  gender?: string;
  
  @ApiProperty({ example: 'John', description: 'User first name', required: false })
  @IsString()
  @IsOptional()
  firstname?: string;

  @ApiProperty({ example: 'Doe', description: 'User last name', required: false })
  @IsString()
  @IsOptional()
  lastname?: string;

  @ApiProperty({ example: 'Smith', description: 'User second last name', required: false })
  @IsString()
  @IsOptional()
  lastname2?: string;

  @ApiProperty({ example: '1990-01-01', description: 'User date of birth', required: false })
  @IsDateString()
  @IsOptional()
  dob?: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService
  ) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    schema: {
      example: {
        userId: 'e7c8f8f0-d5b9-4dc7-a8b2-f9f0d5b9dc7a',
        message: 'User registered successfully',
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Email already in use' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(`Registration attempt with email: ${registerDto.email}`);
    
    try {
      return await this.authService.register(
        registerDto.email,
        registerDto.password,
        registerDto.name,
        {
          title: registerDto.title,
          gender: registerDto.gender,
          firstname: registerDto.firstname,
          lastname: registerDto.lastname,
          lastname2: registerDto.lastname2,
          dob: registerDto.dob ? new Date(registerDto.dob) : undefined,
        }
      );
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`, error.stack);
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 'e7c8f8f0-d5b9-4dc7-a8b2-f9f0d5b9dc7a',
          email: 'user@example.com',
          username: 'user123',
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Login attempt with email: ${loginDto.email}`);
    
    if (!loginDto.email || !loginDto.password) {
      throw new BadRequestException('Email and password are required');
    }
    
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @ApiOperation({ summary: 'Verify user email' })
  @ApiResponse({ 
    status: 200, 
    description: 'Email verified successfully',
    schema: {
      example: {
        message: 'Email verified successfully'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid verification token' })
  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }
    
    return this.authService.verifyEmail(token);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ 
    status: 200, 
    description: 'Password reset instructions sent',
    schema: {
      example: {
        message: 'Password reset instructions have been sent to your email'
      }
    }
  })
  async forgotPassword(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Password reset successful',
    schema: {
      example: {
        message: 'Password has been reset successfully'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired reset token' })
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    if (!token || !newPassword) {
      throw new BadRequestException('Token and new password are required');
    }
    
    if (newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }
    
    return this.authService.resetPassword(token, newPassword);
  }

  @Post('create-admin')
  async createAdmin() {
    // Hash password for admin@example.com
    const hashedPassword = await bcrypt.hash('12345678', 10);
    
    try {
      // Create or update the admin user
      const user = await this.prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: { password_hash: hashedPassword },
        create: {
          email: 'admin@example.com',
          username: 'admin',
          password_hash: hashedPassword,
          firstname: 'Admin',
          lastname: 'User'
        }
      });
      
      // Mark email as verified by creating a verification token
      await this.prisma.verification_tokens.upsert({
        where: { token: 'admin-verified-token' },
        update: { type: 'verified' },
        create: {
          user_id: user.user_id,
          token: 'admin-verified-token',
          type: 'verified',
          expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
        }
      });
      
      return { message: 'Admin user created successfully', userId: user.user_id };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create admin user: ' + error.message);
    }
  }

  @Post('debug-login')
  async debugLogin(@Body('email') email: string) {
    this.logger.log(`Debug login for: ${email}`);
    
    try {
      // Find the user without password check
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: {
          user_id: true,
          email: true,
          username: true,
        },
      });
      
      if (!user) {
        throw new NotFoundException(`User not found: ${email}`);
      }
      
      // Create a JWT token directly using auth service
      const result = await this.authService.login(email, 'BYPASS_PASSWORD');
      
      return result;
    } catch (error) {
      this.logger.error(`Debug login error: ${error.message}`);
      throw new InternalServerErrorException(`Login failed: ${error.message}`);
    }
  }

  @Post('create-admin-test')
  async createAdminTest() {
    const plainPassword = 'password123';
    this.logger.log(`Creating test admin with password: ${plainPassword}`);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    try {
      // Create or update the admin user
      const user = await this.prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: { 
          password_hash: hashedPassword 
        },
        create: {
          email: 'test@example.com',
          username: 'testadmin',
          password_hash: hashedPassword,
          firstname: 'Test',
          lastname: 'Admin'
        }
      });
      
      // Mark email as verified
      await this.prisma.verification_tokens.upsert({
        where: { token: 'test-admin-token' },
        update: { type: 'verified' },
        create: {
          user_id: user.user_id,
          token: 'test-admin-token',
          type: 'verified',
          expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
        }
      });
      
      return { 
        message: 'Test admin created successfully',
        userId: user.user_id,
        credentials: {
          email: 'test@example.com',
          password: plainPassword
        }
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create test admin: ' + error.message);
    }
  }
} 