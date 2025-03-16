import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getAllOrders(@Query('page') paginationDto: PaginationDto) {
    return this.orderService.getAllOrders(paginationDto);
  }

  @Get('/:id')
  async getOrder(@Param('id') id: number) {
    return this.orderService.getOrder(id);
  }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }
}
