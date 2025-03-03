import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

export async function hashPassword(
  password: string,
  configService: ConfigService,
): Promise<string> {
  const saltRounds = parseInt(
    configService.get<string>('BCRYPT_SALT') ?? '10',
    10,
  );

  return bcrypt.hash(password, saltRounds);
}
