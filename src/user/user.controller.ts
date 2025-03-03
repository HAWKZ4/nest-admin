import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './model/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthRequest } from 'src/auth/auth-request.interface';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  async all(): Promise<User[]> {
    return this.userService.all();
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async getUser(@Req() request: AuthRequest): Promise<User | null> {
    return this.userService.findOne({ id: request.user.id });
  }

  @UseGuards(AuthGuard)
  @Get('users/:id')
  async getUserById(@Param('id') id: number): Promise<User | null> {
    return this.userService.findOne({ id });
  }

  // Adjust guard later to restrict access
  @UseGuards(AuthGuard)
  async createUser(@Body() body: CreateUserDTO) {
    return this.userService.create(body);
  }
}
