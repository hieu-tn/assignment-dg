import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CredentialDto } from './dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signIn(dto: CredentialDto) {
    // find the user by username
    const user = await this.userService.findOne(dto.username);
    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    // compare password
    const pwMatches = await argon.verify(user.password, dto.password);
    // if password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    return this.generateToken(user.id, user.username);
  }

  async generateToken(userId: number, username: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      username,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwtService.signAsync(
      payload,
      {
        expiresIn: this.config.get('TOKEN_LIFETIME'),
        secret: secret,
      },
    );

    return {access_token: token};
  }
}
