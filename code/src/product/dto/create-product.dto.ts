import { IsAscii, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({required: true})
  @IsNotEmpty()
  @IsAscii()
  name: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsAscii()
  upc: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsAscii()
  description: string;
}
