import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData(userId: string) {
    // Get user info
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId }
    });

    if (!user) {
      return { message: 'User not found' };
    }
    
    // Basic welcome message
    return {
      message: `Welcome to your Servicio dashboard`,
      userName: user.username
    };
  }

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Return user profile data
    return {
      id: user.user_id,
      username: user.username,
      email: user.email,
      preferredLanguage: user.preferred_language,
      profilePhotoUrl: user.profile_photo_url
    };
  }

  async updateUserProfile(userId: string, updateData: any) {
    // Verify user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { user_id: userId }
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Check if username already exists (if username is being updated)
    if (updateData.username && updateData.username !== existingUser.username) {
      const usernameExists = await this.prisma.user.findFirst({
        where: {
          username: {
            equals: updateData.username,
            mode: 'insensitive'
          },
          user_id: {
            not: userId
          }
        }
      });

      if (usernameExists) {
        throw new BadRequestException('Username already taken');
      }
    }

    // Update user profile
    try {
      const updatedUser = await this.prisma.user.update({
        where: { user_id: userId },
        data: {
          username: updateData.username,
          preferred_language: updateData.preferredLanguage,
          profile_photo_url: updateData.profilePhotoUrl
        }
      });

      return {
        id: updatedUser.user_id,
        username: updatedUser.username,
        email: updatedUser.email,
        preferredLanguage: updatedUser.preferred_language,
        profilePhotoUrl: updatedUser.profile_photo_url
      };
    } catch (error) {
      throw new BadRequestException('Failed to update profile: ' + error.message);
    }
  }
} 