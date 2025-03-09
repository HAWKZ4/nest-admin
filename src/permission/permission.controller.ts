import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllPermissions() {
    return this.permissionService.getAll();
  }

  @UseGuards(AuthGuard)
  @Post()
  async createPermission(@Body() body: CreatePermissionDto) {
    return this.permissionService.create(body);
  }
}
