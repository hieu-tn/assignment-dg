import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
