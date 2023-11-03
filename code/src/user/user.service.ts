import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findOne(username: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    delete user.password
    return user
  }
}
