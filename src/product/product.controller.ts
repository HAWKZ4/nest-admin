import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { Response } from 'express';

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
  async updateProduct(@Param('id') id: number, @Body() body: UpdateProductDto) {
    return this.productService.updateProduct(id, body);
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }

  @UseGuards(AuthGuard)
  @Post('/upload/:id')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async uploadImage(
    @Param('id') productId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // file.filename name after it's processed by multer config
    return this.productService.saveProductImage(productId, file.filename);
  }

  @Get('/image/:filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(filename, {
      root: './uploads/products',
    });
  }
}
