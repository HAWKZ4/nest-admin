import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  code: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  permissions: number[];
}
