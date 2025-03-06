import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRequest } from './auth-request.interface';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: AuthRequest, res: any, next: () => void) {
    const jwt = req.cookies?.['jwt'];

    if (jwt) {
      try {
        req.user = await this.jwtService.verifyAsync(jwt);
      } catch (error) {
        req.user = null;
      }
    }

    next();
  }
}
