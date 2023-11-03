import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({required: true})
  @IsNotEmpty()
  name: string;

  @ApiProperty({required: false})
  @IsOptional()
  upc: string;

  @ApiProperty({required: false})
  @IsOptional()
  description: string;
}
