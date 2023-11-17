import { Controller, Get, HttpCode, HttpStatus, Inject, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import { UserService } from './user.service';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheService } from '../common/cache.service';

@ApiTags('user')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private cacheService: CacheService,
  ) {}

  /**
   * Get user profile
   * @param req
   */
  // @UseInterceptors(CacheInterceptor)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req) {
    let cacheKey = this.cacheService.getUniqueKey({id: req.user.id});
    let user = await this.cacheManager.wrap(cacheKey, async () => {
      const user = await this.userService.findOne(req.user.username);
      // always hide password
      delete user.password;
      return user;
    });

    return user;
  }
}

// @Injectable()
// class HttpCacheInterceptor extends CacheInterceptor {
//   trackBy(context: ExecutionContext): string | undefined {
//     return 'key';
//   }
// }
