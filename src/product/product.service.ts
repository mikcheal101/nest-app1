import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async all(): Promise<Product[]> {
    return this.productRepository.find();
  }

  public async create(payload: {
    title: string;
    image: string;
  }): Promise<Product> {
    return this.productRepository.save(payload);
  }

  private getById(id: number): Promise<Product> {
    return this.productRepository.findOne({ id });
  }

  public fetch(id: number): Promise<Product> {
    return this.getById(id);
  }

  public async update(
    id: number,
    payload: {
      title: string;
      image: string;
    },
  ): Promise<Product> {
    let product: Product = await this.getById(id);

    if (product) {
      product = {
        ...product,
        title: payload.title || product.title,
        image: payload.image || product.image,
      };
      await this.productRepository.update(id, product);
    }

    return product;
  }

  public async delete(id: number): Promise<boolean> {
    const product = this.getById(id);

    if (product) {
      this.productRepository.delete(id);
      return true;
    }
    return false;
  }
}
