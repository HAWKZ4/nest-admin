import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './model/user.entity';
import { Request } from 'express';

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  async all(): Promise<User[]> {
    return this.userService.all();
  }

  @Get('user')
  async getUser(@Req() request: Request): Promise<User | null> {
    const cookie = request.cookies['jwt'];

    const data = await this.userService.findOne({ id: cookie['id'] });

    return data
  }
}
