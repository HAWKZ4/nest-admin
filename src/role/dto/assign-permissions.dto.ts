import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class AssignPermissionsDto {
  @IsInt()
  @IsNotEmpty()
  roleId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  permissions: number[];
}
