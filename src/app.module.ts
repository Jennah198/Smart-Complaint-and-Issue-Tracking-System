import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { ComplaintModule } from './complaint/complaint.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule],
  controllers: [AppController],
})
@Module({
  imports: [ComplaintModule],
})
export class AppModule {}
