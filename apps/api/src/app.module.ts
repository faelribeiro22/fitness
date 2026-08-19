import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';

@Module({
  imports: [],
  controllers: [AppController, WorkoutsController],
  providers: [AppService, PrismaService, WorkoutsService],
})
export class AppModule {}
