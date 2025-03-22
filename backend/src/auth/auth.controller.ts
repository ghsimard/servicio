import { 
  Controller, 
  Post, 
  Body, 
  Get,
  Query,
  BadRequestException,
  Logger
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsDateString } from 'class-validator';

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
  
  constructor(private readonly authService: AuthService) {}

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
} 