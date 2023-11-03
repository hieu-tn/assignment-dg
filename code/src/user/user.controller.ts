import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import { UserService } from './user.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('user')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
  ) {}

  @UseInterceptors(CacheInterceptor)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req) {
    const user = await this.userService.findOne(req.user.username);
    delete user.password;
    return user;
  }
}
