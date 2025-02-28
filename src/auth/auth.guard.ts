import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const jwt = request.cookies['jwt'];

      if (!jwt) {
        throw new UnauthorizedException('No authentication token found');
      }

      const payload = await this.jwtService.verifyAsync(jwt);
      // Attach the user data to the request for later use
      request.user = payload;

      return true;
    } catch (error) {
      return false;
    }
  }
}
