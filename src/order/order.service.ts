import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './model/order.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { paginate } from 'src/utils/pagination';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItem } from './model/order-item.entity';
import { plainToInstance } from 'class-transformer';

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
    const { first_name, last_name, email, created_at, orderItems } = data;

    const order = this.orderRepository.create({
      first_name,
      last_name,
      email,
      created_at,
    });

    await this.orderRepository.save(order);

    // Save order items linked to this order
    const items = orderItems.map((item) => {
      return this.orderItemRepository.create({
        ...item,
        order, // To Attach order reference
      });
    });

    await this.orderItemRepository.save(items);

    // plainToInstance(Order, {...}) ensures NestJS correctly applies @Expose() and getters like total.
    return plainToInstance(Order, { ...order, orderItems: items });
  }
}
