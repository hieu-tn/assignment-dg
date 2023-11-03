import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CredentialDto {
  @ApiProperty({required: true})
  @IsNotEmpty()
  username: string;

  @ApiProperty({required: true})
  @IsString()
  @IsNotEmpty()
  password: string;
}
