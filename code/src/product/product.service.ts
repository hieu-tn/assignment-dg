import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto/';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProductCreatedEvent } from './events';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createProduct(userId: number, dto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        userId,
        ...dto,
      },
    });

    const productCreatedEvent = new ProductCreatedEvent();
    productCreatedEvent.payload = product;
    this.eventEmitter.emit('product.created', productCreatedEvent);

    return product;
  }

  findProducts(userId: number) {
    return this.prisma.product.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async findProduct(userId: number, id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
        userId,
      },
    });

    // check if user owns the product
    if (!product || product.userId !== userId) throw new ForbiddenException('Access to resources denied');

    return product;
  }

  async updateProduct(userId: number, id: number, dto: UpdateProductDto) {
    // get the product by id
    const product = await this.prisma.product.findUnique({
      where: {
        id,
        userId,
      },
    });

    // check if user owns the product
    if (!product || product.userId !== userId) throw new ForbiddenException('Access to resources denied');

    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async removeProduct(userId: number, id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
        userId,
      },
    });

    // check if user owns the product
    if (!product || product.userId !== userId) throw new ForbiddenException('Access to resources denied');

    await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
