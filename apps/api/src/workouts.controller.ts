import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import type { WorkoutInput } from './workouts.service';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workouts: WorkoutsService) {}
  @Get() list() { return this.workouts.list(); }
  @Get(':id') get(@Param('id') id: string) { return this.workouts.get(id); }
  @Post() create(@Body() body: WorkoutInput) { return this.workouts.create(body); }
  @Patch(':id') update(@Param('id') id: string, @Body() body: WorkoutInput) { return this.workouts.update(id, body); }
  @Post(':id/duplicate') duplicate(@Param('id') id: string) { return this.workouts.duplicate(id); }
  @Delete(':id') remove(@Param('id') id: string) { return this.workouts.remove(id); }
  @Patch('days/:id/reorder') reorder(@Param('id') id: string, @Body() body: { exerciseIds: string[] }) { return this.workouts.reorderExercises(id, body.exerciseIds); }
}
