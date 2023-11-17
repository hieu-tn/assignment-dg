import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      session: true,
    }),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({}),
    //   inject: [ConfigService],
    // }),
    JwtModule.register({}), // import configs
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
  ],
})
export class AuthModule {}
