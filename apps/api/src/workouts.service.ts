import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export type DayInput = { weekday: number; focus?: string[]; isRest?: boolean; exerciseIds?: string[] };
export type WorkoutInput = { name: string; days?: DayInput[] };

const workoutInclude = { days: { include: { exercises: { include: { exercise: true }, orderBy: { position: 'asc' as const } } }, orderBy: { weekday: 'asc' as const } } };

@Injectable()
export class WorkoutsService {
  constructor(private readonly prisma: PrismaService) {}

  list() { return this.prisma.workout.findMany({ include: workoutInclude, orderBy: { createdAt: 'desc' } }); }
  async get(id: string) {
    const workout = await this.prisma.workout.findUnique({ where: { id }, include: workoutInclude });
    if (!workout) throw new NotFoundException('Treino não encontrado');
    return workout;
  }
  create(input: WorkoutInput) {
    return this.prisma.workout.create({ data: { name: input.name, days: { create: (input.days ?? []).map((day) => ({ weekday: day.weekday, focus: day.focus ?? [], isRest: day.isRest ?? false, exercises: { create: (day.exerciseIds ?? []).map((exerciseId, position) => ({ exerciseId, position })) } })) } }, include: workoutInclude });
  }
  async update(id: string, input: WorkoutInput) {
    await this.get(id);
    return this.prisma.$transaction(async (tx) => {
      if (input.days) await tx.workoutDay.deleteMany({ where: { workoutId: id } });
      return tx.workout.update({ where: { id }, data: { name: input.name, ...(input.days ? { days: { create: input.days.map((day) => ({ weekday: day.weekday, focus: day.focus ?? [], isRest: day.isRest ?? false, exercises: { create: (day.exerciseIds ?? []).map((exerciseId, position) => ({ exerciseId, position })) } })) } } : {}) }, include: workoutInclude });
    });
  }
  async duplicate(id: string) {
    const workout = await this.get(id);
    return this.create({ name: `${workout.name} (cópia)`, days: workout.days.map((day) => ({ weekday: day.weekday, focus: day.focus, isRest: day.isRest, exerciseIds: day.exercises.map((item) => item.exerciseId) })) });
  }
  async remove(id: string) { await this.get(id); return this.prisma.workout.delete({ where: { id } }); }
  async reorderExercises(dayId: string, exerciseIds: string[]) {
    return this.prisma.$transaction(exerciseIds.map((id, position) => this.prisma.workoutExercise.update({ where: { id }, data: { position } })));
  }
}
