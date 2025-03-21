import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './model/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Permission } from 'src/permission/permission.entity';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async getAll(): Promise<Role[]> {
    return this.roleRepository.find({ relations: ['permissions'] });
  }

  async findOne(condition: object): Promise<Role | null> {
    return await this.roleRepository.findOne({
      where: condition,
    });
  }

  async create(data: CreateRoleDto): Promise<Role> {
    const { name, permissions } = data;
    const permissionEntities = await this.permissionRepository.findBy({
      id: In(permissions),
    });
    const role = this.roleRepository.create({
      name,
      permissions: permissionEntities, // Assign the fetched permission entities
    });

    return await this.roleRepository.save(role);
  }

  async update(id: number, data: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne({ id });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Merge new data into the role object
    Object.assign(role, data);

    return this.roleRepository.save(role);
  }

  async assignPermissionsToRole(data: AssignPermissionsDto) {
    const { roleId, permissions } = data;
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permissionEntites = await this.permissionRepository.find({
      where: {
        id: In(data.permissions),
      }, // In() operator to find permissions whose id matches any of the IDs in the data.permissions array
    });

    if (!permissions.length) {
      throw new NotFoundException('Permissions not found');
    }

    role.permissions = permissionEntites;
    return this.roleRepository.save(role);
  }

  async delete(id: number) {
    const role = await this.findOne({ id });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return this.roleRepository.delete(id);
  }
}
