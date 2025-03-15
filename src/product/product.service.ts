import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { paginate } from 'src/utils/pagination';
import { Product } from './model/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getAllProducts(data: PaginationDto) {
    const { page = 1, limit = 10 } = data;

    return await paginate(this.productRepository, page, limit);
  }

  async getProduct(id: number): Promise<Product | null> {
    return this.productRepository.findOne({
      where: {
        id,
      },
    });
  }

  async createProduct(data: CreateProductDto): Promise<Product | null> {
    return this.productRepository.save(data);
  }

  async deleteProduct(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found!');
    }

    return this.productRepository.delete(id);
  }

  async updateProduct(id: number, data: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found!');
    }

    console.log('This is the product ', product);
    console.log('This is the data recived ', data);

    Object.assign(product, data);

    return this.productRepository.save(product);
  }

  async saveProductImage(
    productId: number,
    fileName: string,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found!');
    }

    // Saves the image filename in the database (not the full path, to avoid storage issues).
    product.image = fileName;

    return this.productRepository.save(product);
  }
}
