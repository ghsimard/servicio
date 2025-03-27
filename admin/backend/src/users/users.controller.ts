import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { Public } from '../auth/decorators/public.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Public()
  create(
    @Body() createUserDto: {
      email: string;
      password: string;
      firstname: string;
      lastname: string;
      username: string;
      preferred_language?: string;
      roles?: string[];
    },
    @Req() req: Request,
  ) {
    return this.usersService.create(createUserDto, req);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: {
      email?: string;
      password?: string;
      firstname?: string;
      lastname?: string;
      username?: string;
      preferred_language?: string;
      roles?: string[];
    },
    @Req() req: Request,
  ) {
    return this.usersService.update(id, updateUserDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.usersService.remove(id, req);
  }
} 