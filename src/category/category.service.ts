import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './model/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find({
      relations: ['products'],
    });
  }

  async getCategory(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException('Category not found!');
    }

    return category;
  }

  async createCategory(data: CreateCategoryDto) {
    const { name } = data;

    const existingCategory = await this.categoryRepository.findOne({
      where: {
        name,
      },
    });

    if (existingCategory) {
      throw new BadRequestException('Category with this name already exists');
    }

    const category = this.categoryRepository.create({ name });
    return await this.categoryRepository.save(category);
  }

  async deleteCategory(id: number) {
    const result = await this.categoryRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Category not found');
    }
  }

  async updateCategory(id: number, data: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (data.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: data.name },
      });

      if (existingCategory && existingCategory.id !== id) {
        throw new BadRequestException('Category with this name already exists');
      }

      category.name = data.name;
    }

    return await this.categoryRepository.save(category);
  }
}
