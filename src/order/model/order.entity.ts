import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Expose } from 'class-transformer';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @CreateDateColumn()
  created_at: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @Expose()
  get total(): number {
    return this.orderItems.reduce((acc, oi) => acc + oi.price * oi.quantity, 0);
  }
}
