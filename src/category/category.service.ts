import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './model/category.entity';
import { In, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Tag } from 'src/tag/model/tag.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find({
      relations: ['products', 'tags'],
    });
  }

  async getCategory(id: number): Promise<Category> {
    console.log("here's the id", id);
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
      relations: ['products', 'tags'],
    });

    if (!category) {
      throw new NotFoundException('Category not found!');
    }

    return category;
  }

  async createCategory(data: CreateCategoryDto) {
    const { name, tagIds } = data;

    const existingCategory = await this.categoryRepository.findOne({
      where: {
        name,
      },
    });

    if (existingCategory) {
      throw new BadRequestException('Category with this name already exists');
    }

    // Fetch tags based on IDs
    const tags = tagIds
      ? await this.tagRepository.findBy({
          id: In(tagIds),
        })
      : [];

    const category = this.categoryRepository.create({ name, tags });
    return await this.categoryRepository.save(category);
  }

  async deleteCategory(id: number) {
    const result = await this.categoryRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Category not found');
    }
  }

  async updateCategory(id: number, data: UpdateCategoryDto): Promise<Category> {
    const { name, tagIds } = data;

    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
      relations: ['tags'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name },
      });

      if (existingCategory && existingCategory.id !== id) {
        throw new BadRequestException('Category with this name already exists');
      }

      category.name = name;
    }

    if (tagIds) {
      category.tags = await this.tagRepository.findBy({ id: In(tagIds) });
    }

    return await this.categoryRepository.save(category);
  }
}
