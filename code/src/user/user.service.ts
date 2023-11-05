import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CredentialDto } from '../auth/dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findOne(username: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  }

  async createUser(dto: CredentialDto) {
    const password = await argon.hash(dto.password);
    return this.prisma.user.create({
      data: {
        ...dto,
        password,
      },
    });
  }
}
