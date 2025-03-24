import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './model/category.entity';
import { CategoryService } from './category.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  async getAllCategoies(): Promise<Category[]> {
    return await this.categoryService.getAllCategories();
  }
  @Post()
  async createCategory(@Body() body: CreateCategoryDto): Promise<Category> {
    return await this.categoryService.createCategory(body);
  }
  @Get('/:id')
  async getCategory(@Param('id') id: number): Promise<Category> {
    return await this.categoryService.getCategory(id);
  }
  @Delete('/:id')
  async deleteCategory(@Param('id') id: number): Promise<void> {
    return await this.categoryService.deleteCategory(id);
  }
  @Patch('/:id')
  async updateCategory(
    @Param('id') id: number,
    @Body() body: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, body);
  }
}
