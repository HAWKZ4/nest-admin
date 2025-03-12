import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  password_confirm: string;
}
