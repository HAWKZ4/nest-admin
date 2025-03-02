import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './model/user.entity';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDTO } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Get('users')
  async all(): Promise<User[]> {
    return this.userService.all();
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async getUser(@Req() request: Request): Promise<User | null> {
    const cookie = request.cookies['jwt'];

    const data = await this.userService.findOne({ id: cookie['id'] });

    return data;
  }

  // Role-based guard will added later
  @UseGuards(AuthGuard)
  @Get('/users/:id')
  async getUserById(@Param('id') id: number): Promise<User | null> {
    return this.userService.findOne({ id });
  }

  @UseGuards()
  @Post('/users')
  async createUser(@Body() body: CreateUserDTO) {
    const { first_name, last_name, email } = body;
    const defaultPassword = this.configService.get<string>('NEW_USER_PASS');

    if (!defaultPassword) {
      throw new InternalServerErrorException(
        'NEW_USER_PASS is not set in the environment variable',
      );
    }
    const salt = parseInt(
      this.configService.get<string>('BCRYPT_SALT') ?? '10',
      10,
    );

    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    return this.userService.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });
  }
}
