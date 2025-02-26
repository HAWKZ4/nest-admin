import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
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
}
