import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsDateString()
  created_at: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsArray()
  // Ensures each element in the array follows the validation rules of OrderItemDto
  @ValidateNested({ each: true })
  // Converts raw JSON data into an instance of OrderItemDto, helping with validation
  // (makes sure each object is converted correctly)
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}
