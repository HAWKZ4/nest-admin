import { Product } from 'src/product/model/product.entity';
import { Tag } from 'src/tag/model/tag.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @OneToMany(() => Product, (product) => product.category, { cascade: true })
  products: Product[];

  @ManyToMany(() => Tag, (tag) => tag.categories, { cascade: true })
  @JoinTable({ name: 'categories_tags' })
  tags: Tag[];
}
