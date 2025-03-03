import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/user/model/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { hashPassword } from 'src/utils/bcrypt.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(body: RegisterDto): Promise<User> {
    const { first_name, last_name, email, password, password_confirm } = body;

    if (password !== password_confirm) {
      throw new BadRequestException('Passwords do not match!');
    }

    const hashedPassword = await hashPassword(password, this.configService);

    return this.userService.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }
    return user;
  }

  async generateToken(userId: number) {
    return this.jwtService.signAsync({ id: userId });
  }

  setAuthCookie(response: Response, token: string) {
    response.cookie('jwt', token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
    });
  }

  clearAuthCookie(response: Response) {
    response.clearCookie('jwt');
  }
}
