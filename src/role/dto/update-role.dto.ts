import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsNotEmpty()
  code?: number;
}
