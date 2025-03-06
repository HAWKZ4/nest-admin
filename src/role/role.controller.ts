import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './model/role.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllRoles() {
    return this.roleService.getAll();
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getRole(@Param('id') id: number): Promise<Role | null> {
    return this.roleService.findOne({ id });
  }

  @UseGuards(AuthGuard)
  @Get('roles/:id')
  async getRoleById(@Param('id') id: number): Promise<Role | null> {
    return this.roleService.findOne({ id });
  }

  @UseGuards(AuthGuard)
  @Post('')
  async createRole(@Body() body: CreateRoleDto) {
    return this.roleService.create(body);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async updateRole(@Param('id') id: number, @Body() body: UpdateRoleDto) {
    return this.roleService.update(id, body);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteRole(@Param('id') id: number) {
    return this.roleService.delete(id);
  }
}
