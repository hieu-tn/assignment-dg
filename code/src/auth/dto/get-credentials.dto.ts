import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CredentialDto {
  @ApiProperty({required: false})
  @IsNotEmpty()
  username: string;

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  password: string;
}
