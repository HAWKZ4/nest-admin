import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const access = this.reflector.get<string>('access', context.getHandler());

    if (!access) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request?.user?.id;

    if (!userId) return false;

    const user = await this.userService.findOne({ id: userId }, true);
    if (!user || !user.role) return false;

    return user?.role?.permissions.some((perm) => perm.name === access);
  }
}
