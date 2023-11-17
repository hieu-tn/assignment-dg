import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { CacheModule } from '@nestjs/cache-manager';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 30 * 1000, // milliseconds
      max: 10, // maximum number of items in cache
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    PrismaModule,
    ProductModule,
    CommonModule,
  ],
})
export class AppModule {}
