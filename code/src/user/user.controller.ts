import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@ApiCookieAuth()
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
  ) {}

  @ApiTags('user')
  @Get('profile')
  async getProfile(@Req() req) {
    return this.userService.findOne(req.user.username);
  }
}
