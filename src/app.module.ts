import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { ComplaintModule } from './complaint/complaint.module';
import { AppService } from './app.service';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ComplaintModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
