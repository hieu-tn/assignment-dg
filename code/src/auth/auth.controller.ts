import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CredentialDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private config: ConfigService,
    private authService: AuthService,
  ) {}

  @ApiTags('auth')
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: CredentialDto, @Res({passthrough: true}) response: Response) {
    const {access_token} = await this.authService.signIn(dto);

    response.cookie('access_token', access_token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + parseInt(this.config.get('TOKEN_LIFETIME_IN_SECONDS')) * 1000),
    }).send();
  }
}
