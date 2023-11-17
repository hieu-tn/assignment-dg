import { IsAscii, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({required: true})
  @IsNotEmpty()
  @IsAscii()
  // @IsString()
  name: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsAscii()
  // @IsString()
  upc: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsAscii()
  // @IsString()
  description: string;
}
