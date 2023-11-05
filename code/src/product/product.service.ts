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

  /**
   * Create product belongs to user
   * @param userId
   * @param dto
   */
  async createProduct(userId: number, dto: CreateProductDto) {
    for (let k of Object.keys(dto)) {
      // remove null character to avoid 0x00 issue
      dto[k] = dto[k].replace('\x00', '');
    }
    const product = await this.prisma.product.create({
      data: {
        userId,
        ...dto,
      },
    });

    // trigger product.created event
    const productCreatedEvent = new ProductCreatedEvent();
    productCreatedEvent.payload = product;
    this.eventEmitter.emit('product.created', productCreatedEvent);

    return product;
  }

  /**
   * Get products belong to user
   * @param userId
   * @param page
   * @param itemsPerPage
   */
  async findProducts(userId: number, page: number, itemsPerPage: number) {
    // return default
    if (itemsPerPage == 0 || itemsPerPage < -1 || page <= 0) {
      return {totalRecords: 0, results: []}
    }

    let countQuery = {
      where: {
        userId,
      },
    };
    let query = {...countQuery};
    // order from oldest to latest
    // should make this as a filter option
    query['orderBy'] = {
      createdAt: 'asc',
    };

    // if itemsPerPage == -1: get all
    // else filter
    if (itemsPerPage != -1) {
      query['skip'] = (page - 1) * itemsPerPage;
      query['take'] = itemsPerPage;
    }

    const [totalRecords, results] = await this.prisma.$transaction([
      this.prisma.product.count(countQuery),
      this.prisma.product.findMany(query),
    ]);

    return {totalRecords, results};
  }

  /**
   * Find product
   * @param userId
   * @param id
   */
  async findProduct(userId: number, id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
        userId,
      },
    });

    // check if user owns the product
    if (!product) throw new ForbiddenException('Access to resources denied');

    return product;
  }

  /**
   * Update product
   * @param userId
   * @param id
   * @param dto
   */
  async updateProduct(userId: number, id: number, dto: UpdateProductDto) {
    // get the product by id
    const product = await this.prisma.product.findUnique({
      where: {
        id,
        userId,
      },
    });

    // check if user owns the product
    if (!product) throw new ForbiddenException('Access to resources denied');

    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  /**
   * Remove product
   * @param userId
   * @param id
   */
  async removeProduct(userId: number, id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
        userId,
      },
    });

    // check if user owns the product
    if (!product) throw new ForbiddenException('Access to resources denied');

    await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
