import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CredentialDto } from '../auth/dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
  ) {}

  /**
   * Look up user by username
   * @param username
   */
  async findOne(username: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  }

  /**
   * Create user
   * @param dto
   */
  async createUser(dto: CredentialDto) {
    // @TODO: validate credential data
    // hash password, so human cannot read it
    const password = await argon.hash(dto.password);
    return this.prisma.user.create({
      data: {
        ...dto,
        password,
      },
    });
  }
}
