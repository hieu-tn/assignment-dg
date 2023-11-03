import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductCreatedListener } from './listeners';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductCreatedListener],
})
export class ProductModule {}
