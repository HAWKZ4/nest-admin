import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('')
export class AuthController {
  constructor(private readonly authSerAuthService: AuthService) {}

  @Post('register')
  async register(@Body() body) {
    return this.authSerAuthService.create(body);
  }
}
