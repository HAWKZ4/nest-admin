import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  Res,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserService } from './../user/user.service';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const { first_name, last_name, email, password, password_confirm } = body;

    if (password !== password_confirm) {
      throw new BadRequestException('Passwords do not match!');
    }

    const salt = parseInt(
      this.configService.get<string>('BCRYPT_SALT') ?? '10',
      10,
    );
    const hashedPassword = await bcrypt.hash(password, salt);
    return this.authService.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });
  }

  @Post('login')
  async login(@Body() body, @Res() response: Response) {
    const { email, password } = body;
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });
    response.cookie('jwt', jwt, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
    });

    return user;
  }
}
