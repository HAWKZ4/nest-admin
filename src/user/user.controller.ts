import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './model/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthRequest } from 'src/auth/auth-request.interface';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @UseGuards(AuthGuard)
  @Patch('/users/:id')
  async updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }

  @Delete('/users/:id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}
