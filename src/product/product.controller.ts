import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(@Query('page') paginationDto: PaginationDto) {
    return this.productService.getAllProducts(paginationDto);
  }

  @Get('/:id')
  async getProduct(@Param('id') id: number) {
    return this.productService.getProduct(id);
  }

  @Post()
  async createProduct(@Body() body: CreateProductDto) {
    return this.productService.createProduct(body);
  }
  
  @UseGuards(AuthGuard)
  @Patch('/:id')
  async updateProduct(
    @Param('id') id: number,
    @Body() body: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, body);
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }

}
