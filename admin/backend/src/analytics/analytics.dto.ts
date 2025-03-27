import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class TrackActionDto {
  @ApiProperty({ description: 'Session ID for the current user session' })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({ description: 'Current page being visited' })
  @IsString()
  @IsNotEmpty()
  pageVisited: string;

  @ApiProperty({ description: 'Type of action being performed' })
  @IsString()
  @IsNotEmpty()
  actionType: string;

  @ApiProperty({ 
    description: 'Additional data about the action',
    required: false 
  })
  @IsObject()
  @IsOptional()
  actionData?: Record<string, any>;

  @ApiProperty({ 
    description: 'Source of the action (main-app or admin-app)',
    example: 'admin-app',
    default: 'admin-app' 
  })
  @IsString()
  @IsOptional()
  source?: string;
}

export class CreateSessionDto {
  @ApiProperty({ 
    description: 'Source of the session (main-app or admin-app)',
    example: 'admin-app',
    default: 'admin-app' 
  })
  @IsString()
  @IsOptional()
  source?: string;
}

export class EndSessionDto {
  @ApiProperty({ description: 'Session ID to end' })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({ 
    description: 'Source of the session (main-app or admin-app)',
    example: 'admin-app',
    default: 'admin-app' 
  })
  @IsString()
  @IsOptional()
  source?: string;
} 