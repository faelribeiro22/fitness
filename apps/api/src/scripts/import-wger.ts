import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

type WgerExercise = { id: number; name: string; category?: { name?: string }; muscles?: { name?: string }[]; muscles_secondary?: { name?: string }[]; equipment?: { name?: string }[]; images?: { image?: string }[]; videos?: { video?: string }[]; description?: string };
type WgerPage = { next?: string | null; results?: WgerExercise[] };

const client = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  let url: string | null = 'https://wger.de/api/v2/exerciseinfo/?language=2&limit=100';
  let imported = 0;
  while (url) {
    const page: WgerPage = await fetch(url).then((response) => {
      if (!response.ok) throw new Error(`wger respondeu ${response.status}`);
      return response.json() as Promise<WgerPage>;
    });
    for (const exercise of page.results ?? []) {
      if (!exercise.name) continue;
      await client.exercise.upsert({
        where: { source_sourceId: { source: 'wger', sourceId: String(exercise.id) } },
        create: { source: 'wger', sourceId: String(exercise.id), name: exercise.name, muscleGroup: exercise.category?.name ?? 'Outros', secondaryMuscles: exercise.muscles_secondary?.map((muscle) => muscle.name).filter((name): name is string => Boolean(name)) ?? [], equipment: exercise.equipment?.map((item) => item.name).filter((name): name is string => Boolean(name)).join(', ') || 'Peso corporal', difficulty: null, instructions: exercise.description ? [exercise.description.replace(/<[^>]+>/g, '').trim()] : [], image: exercise.images?.[0]?.image ?? null, video: exercise.videos?.[0]?.video ?? null },
        update: { name: exercise.name, muscleGroup: exercise.category?.name ?? 'Outros', secondaryMuscles: exercise.muscles_secondary?.map((muscle) => muscle.name).filter((name): name is string => Boolean(name)) ?? [], equipment: exercise.equipment?.map((item) => item.name).filter((name): name is string => Boolean(name)).join(', ') || 'Peso corporal', instructions: exercise.description ? [exercise.description.replace(/<[^>]+>/g, '').trim()] : [], image: exercise.images?.[0]?.image ?? null, video: exercise.videos?.[0]?.video ?? null },
      });
      imported++;
    }
    url = page.next ?? null;
  }
  console.log(`${imported} exercícios do wger importados.`);
}

main().finally(() => client.$disconnect());
