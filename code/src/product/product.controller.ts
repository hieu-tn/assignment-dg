import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ParseIntPipe, HttpStatus, HttpCode } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';

@ApiTags('product')
@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Req() request, @Body() dto: CreateProductDto) {
    for (let k of Object.keys(dto)) {
      dto[k] = dto[k].replace('\x00', '');
    }
    return this.productService.createProduct(request.user.id, dto);
  }

  @Get()
  async get(@Req() request, @Query('page', ParseIntPipe) page: number, @Query('itemsPerPage', ParseIntPipe) itemsPerPage: number) {
    return this.productService.findProducts(request.user.id, page, itemsPerPage);
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
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() request, @Param('id') id: string) {
    return this.productService.removeProduct(request.user.id, +id);
  }
}
