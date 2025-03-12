import { Request } from 'express';

export interface AuthRequest extends Request {
  cookies: Record<string, string>;
  user?: any;
}
