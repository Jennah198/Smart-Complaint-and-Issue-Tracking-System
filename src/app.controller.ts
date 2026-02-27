import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private prisma: PrismaService,
    private readonly appService: AppService,
  ) {}

  @Get('health')
  async healthCheck() {
    const result = await this.prisma.$queryRaw`SELECT 1 as status`;
    return {
      status: 'ok',
      database: result,
    };
  }

  @Get('users-test')
  async usersTest() {
    const users = await this.prisma.user.findMany();
    return {
      count: users.length,
      users,
    };
  }

  @Get()
  getRoot() {
    return this.appService.getHello();
  }
}
