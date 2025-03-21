import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async getAll() {
    return this.permissionRepository.find();
  }

  async create(data: CreatePermissionDto) {
    const permission = this.permissionRepository.create(data);
    return await this.permissionRepository.save(permission);
  }
}
