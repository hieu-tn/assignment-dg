import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import { UserService } from './user.service';

@ApiTags('user')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
  ) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req) {
    const user = await this.userService.findOne(req.user.username);
    delete user.password;
    return user;
  }
}
