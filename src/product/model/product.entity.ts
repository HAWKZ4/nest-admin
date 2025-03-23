import { Category } from 'src/category/model/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  price: number;

  @ManyToOne(() => Category, (category) => category.products, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  category: Category;
}
