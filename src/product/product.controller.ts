import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateResult } from 'typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject('PRODUCTS_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Get()
  public all(): Promise<Product[]> {
    this.client.emit('hello', 'Hello from Rabbit MQ!');
    return this.productService.all();
  }

  @Post()
  public create(
    @Body('title') title: string,
    @Body('image') image: string,
  ): Promise<Product> {
    return this.productService.create({ title, image });
  }

  @Get(':id')
  public async getById(@Param('id') id: number): Promise<Product> {
    return this.productService.fetch(id);
  }

  @Patch(':id')
  public async updateById(
    @Param('id') id: number,
    @Body('title') title: string,
    @Body('image') image: string,
  ): Promise<Product | UpdateResult> {
    return this.productService.update(id, { title, image });
  }

  @Delete(':id')
  public async deleteProduct(@Param('id') id: number): Promise<boolean> {
    return this.productService.delete(id);
  }
}
