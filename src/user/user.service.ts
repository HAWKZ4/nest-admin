import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './model/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { hashPassword } from 'src/utils/bcrypt.helper';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async all(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(condition: object): Promise<User | null> {
    return await this.userRepository.findOne({
      where: condition,
    });
  }

  async create(data: CreateUserDTO): Promise<User> {
    return this.userRepository.save(data);
  }

  async createUserWithDefaultPassword(body: CreateUserDTO): Promise<User> {
    const { first_name, last_name, email } = body;
    const defaultPassword = this.configService.get<string>('NEW_USER_PASS');

    if (!defaultPassword) {
      throw new InternalServerErrorException(
        'NEW_PASS is not set in the environement variable',
      );
    }

    const hashedPassword = await hashPassword(
      defaultPassword,
      this.configService,
    );

    return this.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const user = await this.findOne({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Merge new data into the user object
    Object.assign(user, data);

    return this.userRepository.save(user);
  }
}
