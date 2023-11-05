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

  /**
   * Create a product
   * @param request
   * @param dto
   */
  @Post()
  create(@Req() request, @Body() dto: CreateProductDto) {
    return this.productService.createProduct(request.user.id, dto);
  }

  /**
   * Get products belong to user
   * @param request
   * @param page
   * @param itemsPerPage
   */
  @Get()
  async get(@Req() request, @Query('page', ParseIntPipe) page: number, @Query('itemsPerPage', ParseIntPipe) itemsPerPage: number) {
    return this.productService.findProducts(request.user.id, page, itemsPerPage);
  }

  /**
   * Get product details
   * @param request
   * @param id
   */
  @Get(':id')
  findOne(@Req() request, @Param('id') id: string) {
    return this.productService.findProduct(request.user.id, +id);
  }

  /**
   * Update product details
   * @param request
   * @param id
   * @param dto
   */
  @Patch(':id')
  update(@Req() request, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.updateProduct(request.user.id, +id, dto);
  }

  /**
   * Remove a product
   * @param request
   * @param id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() request, @Param('id') id: string) {
    return this.productService.removeProduct(request.user.id, +id);
  }
}
