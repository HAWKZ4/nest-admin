import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './model/order.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { paginate } from 'src/utils/pagination';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItem } from './model/order-item.entity';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { createObjectCsvStringifier } from 'csv-writer';
import { Readable } from 'stream';
import { format } from 'date-fns';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async getAllOrders(data: PaginationDto) {
    const { page, limit } = data;
    return await paginate(
      this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.orderItems', 'orderItem'),
      page,
      limit,
    );
  }

  async getOrder(id: number): Promise<Order | null> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems'],
    });

    if (!order) {
      throw new NotFoundException('Order not found!');
    }

    return order;
  }

  async createOrder(data: CreateOrderDto): Promise<Order> {
    const { first_name, last_name, email, orderItems } = data;

    const order = this.orderRepository.create({
      first_name,
      last_name,
      email,
    });

    await this.orderRepository.save(order);

    const items = orderItems.map((item) =>
      this.orderItemRepository.create({
        ...item,
        order, // Attach order reference
      }),
    );

    await this.orderItemRepository.save(items);

    const savedOrder = await this.orderRepository.findOne({
      where: { id: order.id },
      relations: ['orderItems'],
    });

    if (!savedOrder) {
      throw new Error('Order not found after saving.');
    }

    // Transform the order (ensuring @Expose() works)
    // This converts savedOrder into a full-fledged Order instance, enabling all class features like:
    // Decorators (@Expose())
    // Getters (get total())
    // Class methods (if any exist)
    const transformedOrder = plainToInstance(Order, savedOrder);

    return transformedOrder;
  }

  async exportOrders(response: Response): Promise<void> {
    const orders = await this.orderRepository.find({
      relations: ['orderItems'],
    });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'id', title: 'Order ID' },
        { id: 'first_name', title: 'First Name' },
        { id: 'last_name', title: 'Last Name' },
        { id: 'email', title: 'Email' },
        { id: 'created_at', title: 'Created At' },
        { id: 'orderItems', title: 'Order Items' },
      ],
    });

    const csvData = orders.map((order) => ({
      id: order.id,
      first_name: order.first_name,
      last_name: order.last_name,
      email: order.email,
      created_at: format(order.created_at, 'yyyy-MM-dd HH:mm:ss'),
      orderItems: order.orderItems
        .map(
          (orderItem) =>
            `${orderItem.product_title} (${orderItem.quantity} * ${orderItem.price})`,
        )
        .join(' | '),
    }));

    const csvStream = Readable.from([
      csvStringifier.getHeaderString(),
      csvStringifier.stringifyRecords(csvData),
    ]);

    response.setHeader('Content-Type', 'text/csv');
    response.setHeader(
      'Content-Disposition',
      'attachement; filename: orders.csv',
    );

    csvStream.pipe(response).on('finish', () => {
      console.log('Exported complete');
      response.end();
    });
  }
}
