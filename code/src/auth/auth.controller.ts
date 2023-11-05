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

  /**
   * Sign up
   * @param dto
   */
  @ApiTags('auth')
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: CredentialDto) {
    return this.authService.signUp(dto);
  }

  /**
   * Sign in
   * @param dto
   * @param response
   */
  @ApiTags('auth')
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: CredentialDto, @Res({passthrough: true}) response: Response) {
    const {access_token} = await this.authService.signIn(dto);

    // set cookie to browser automatically
    // response access token (demo purpose)
    // should remove access_token in response in production
    response.cookie('access_token', access_token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + parseInt(this.config.get('TOKEN_LIFETIME_IN_SECONDS')) * 1000),
    }).send({
      access_token,
    });
  }
}
