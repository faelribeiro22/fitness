import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [AuthModule],
  controllers: [AppController, WorkoutsController, AuthController],
  providers: [AppService, PrismaService, WorkoutsService],
})
export class AppModule {}
