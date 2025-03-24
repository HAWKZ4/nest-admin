import { IsNotEmpty, IsString } from 'class-validator';

export class updateTagDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  categories?: number[]
}
