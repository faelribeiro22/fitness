import type { SQLiteDatabase } from 'expo-sqlite';

import { initialWorkout, type WorkoutPlan } from '@/data/workouts';

type WorkoutRow = { id: string; name: string; days: string };
const DATABASE_VERSION = 1;

function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }

export async function migrateDatabase(db: SQLiteDatabase) {
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  if ((result?.user_version ?? 0) >= DATABASE_VERSION) return;
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS workouts (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      days TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  const count = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) AS count FROM workouts');
  if ((count?.count ?? 0) === 0) await saveWorkout(db, clone(initialWorkout));
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export async function getWorkouts(db: SQLiteDatabase): Promise<WorkoutPlan[]> {
  const rows = await db.getAllAsync<WorkoutRow>('SELECT id, name, days FROM workouts ORDER BY updated_at DESC');
  return rows.map((row) => ({ id: row.id, name: row.name, days: JSON.parse(row.days) as WorkoutPlan['days'] }));
}

export async function saveWorkout(db: SQLiteDatabase, workout: WorkoutPlan) {
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT INTO workouts (id, name, days, created_at, updated_at) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET name = excluded.name, days = excluded.days, updated_at = excluded.updated_at`,
    workout.id, workout.name.trim() || 'Treino sem nome', JSON.stringify(workout.days), now, now,
  );
}

export async function deleteWorkout(db: SQLiteDatabase, id: string) { await db.runAsync('DELETE FROM workouts WHERE id = ?', id); }

export function createEmptyWorkout(): WorkoutPlan {
  const id = Date.now();
  return { id: `workout-${id}`, name: 'Novo treino', days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map((weekday) => ({ id: `${weekday}-${id}`, weekday, focus: [], isRest: false, exercises: [] })) };
}

export function duplicateWorkout(workout: WorkoutPlan): WorkoutPlan {
  const copy = clone(workout); const id = Date.now();
  return { ...copy, id: `workout-${id}`, name: `${copy.name} (cópia)`, days: copy.days.map((day, dayIndex) => ({ ...day, id: `${day.id}-${id}-${dayIndex}`, exercises: day.exercises.map((item, index) => ({ ...item, id: `${item.id}-${id}-${index}` })) })) };
}
