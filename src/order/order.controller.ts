
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { Response } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getAllOrders(@Query('page') paginationDto: PaginationDto) {
    return this.orderService.getAllOrders(paginationDto);
  }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get('/export')
  async exportOrders(@Res() response: Response) {
    return this.orderService.exportOrders(response);
  }

  @Get('/:id')
  async getOrder(@Param('id') id: number) {
    return this.orderService.getOrder(id);
  }
}
