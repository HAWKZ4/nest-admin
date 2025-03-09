import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'src/user/model/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { hashPassword } from 'src/utils/bcrypt.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/role/model/role.entity';
import { RoleEnum } from 'src/common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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

    const userRole = await this.roleRepository.findOne({
      where: {
        code: RoleEnum.USER,
      },
    });

    if (!userRole) {
      throw new InternalServerErrorException('Role not found');
    }

    if (!userRole) {
      throw new InternalServerErrorException('Role not found');
    }

    const newUser = this.userRepository.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    return this.userRepository.save(newUser);
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
