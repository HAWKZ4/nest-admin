import { Injectable } from '@nestjs/common';
import { User } from 'src/user/model/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(data): Promise<User> {
    return this.userRepository.save(data);
  }
}
