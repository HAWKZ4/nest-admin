import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './model/category.entity';
import { Product } from 'src/product/model/product.entity';
import { Tag } from 'src/tag/model/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product, Tag])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
