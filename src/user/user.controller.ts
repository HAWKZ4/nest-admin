import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { PaginationDto } from 'src/utils/dto/pagination.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  // We didn't specify a type because ts infers it from paginate()
  async getAllUsers(@Query() paginationDto: PaginationDto) {
    return this.userService.getAll(paginationDto);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  async getMe(@Req() request: AuthRequest): Promise<User | null> {
    return this.userService.findOne({ id: request.user.id });
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getUserById(@Param('id') id: number): Promise<User | null> {
    return this.userService.findOne({ id });
  }

  // Adjust guard later to restrict access
  @UseGuards(AuthGuard)
  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    return this.userService.createUserWithDefaultPassword(body);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}
