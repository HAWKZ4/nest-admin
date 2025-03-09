import {
  BadRequestException,
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
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { paginate } from 'src/utils/pagination';
import { Role } from 'src/role/model/role.entity';
import { RoleEnum } from 'src/common/enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly configService: ConfigService,
  ) {}

  async getAll(data: PaginationDto) {
    const { page = 1, limit = 10 } = data;
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role');
    return await paginate(queryBuilder, page, limit);
  }

  async findOne(condition: object): Promise<User | null> {
    return await this.userRepository.findOne({
      where: condition,
    });
  }

  async createUserWithDefaultPassword(body: CreateUserDTO): Promise<User> {
    const { first_name, last_name, email } = body;
    const defaultPassword = this.configService.get<string>('NEW_USER_PASS');

    if (!defaultPassword) {
      throw new InternalServerErrorException(
        'NEW_USER_PASS is not set in the environement variable',
      );
    }

    const hashedPassword = await hashPassword(
      defaultPassword,
      this.configService,
    );

    const userRole = await this.roleRepository.findOne({
      where: {
        code: RoleEnum.USER,
      },
    });

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

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const user = await this.findOne({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (data.roleCode) {
      const role = await this.roleRepository.findOne({
        where: {
          code: data.roleCode,
        },
      });

      if (!role) {
        throw new BadRequestException('Invalid role code');
      }

      // It's necessary
      // TypeORM needs to update the foreign key column in the user table to point to the new role
      user.role = role;
    }

    // Merge new data into the user object
    Object.assign(user, data);

    return this.userRepository.save(user);
  }

  async delete(id: number) {
    const user = await this.findOne({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.delete(id);
  }
}
