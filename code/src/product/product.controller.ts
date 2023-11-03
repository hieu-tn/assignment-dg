import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import { Request } from 'express';

@ApiTags('product')
@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Req() request, @Body() dto: CreateProductDto) {
    return this.productService.createProduct(request.user.id, dto);
  }

  @Get()
  findAll(@Req() request) {
    return this.productService.findProducts(request.user.id);
  }

  @Get(':id')
  findOne(@Req() request, @Param('id') id: string) {
    return this.productService.findProduct(request.user.id, +id);
  }

  @Patch(':id')
  update(@Req() request, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.updateProduct(request.user.id, +id, dto);
  }

  @Delete(':id')
  remove(@Req() request, @Param('id') id: string) {
    return this.productService.removeProduct(request.user.id, +id);
  }
}
