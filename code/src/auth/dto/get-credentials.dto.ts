import { IsAlphanumeric, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CredentialDto {
  @ApiProperty({required: true})
  @IsNotEmpty()
  // @IsString()
  // @MinLength(6)
  // @MaxLength(20)
  username: string;

  @ApiProperty({required: true})
  @IsString()
  @IsNotEmpty()
  // @MaxLength(50)
  // @IsStrongPassword({
  //   minLength: 8,
  //   minLowercase: 1,
  //   minNumbers: 1,
  //   minSymbols: 1,
  //   minUppercase: 1
  // })
  password: string;
}
