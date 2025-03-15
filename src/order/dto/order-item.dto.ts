import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderItemDto {
  @IsNotEmpty()
  @IsString()
  product_title: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
