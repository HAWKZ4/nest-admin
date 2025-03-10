import { ArrayNotEmpty, IsArray, IsInt, IsNumber } from 'class-validator';

export class AssignPermissionsDto {
  @IsNumber()
  roleCode: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  permissions: number[];
}
