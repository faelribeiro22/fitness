import type { SQLiteDatabase } from 'expo-sqlite';

import { initialWorkout, type WorkoutPlan } from '@/data/workouts';

type WorkoutRow = { id: string; name: string; days: string };
type SetLogRow = { weight: string; reps: string; rpe: string; duration_seconds: number; note: string; set_number: number; completed_at: string };
const DATABASE_VERSION = 3;

export type ExerciseLog = { exerciseId: string; series: number; weight: string; repetitions: string; rpe: string; durationSeconds: number; note: string; completedAt: string };
export type ExerciseSetLog = Omit<ExerciseLog, 'exerciseId' | 'series'> & { setNumber: number };

function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }

export async function migrateDatabase(db: SQLiteDatabase) {
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = result?.user_version ?? 0;
  if (version === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS workouts (
        id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, days TEXT NOT NULL,
        created_at TEXT NOT NULL, updated_at TEXT NOT NULL
      );
    `);
    const count = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) AS count FROM workouts');
    if ((count?.count ?? 0) === 0) await saveWorkout(db, clone(initialWorkout));
    version = 1;
  }
  if (version < 2) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS workout_sessions (
        id TEXT PRIMARY KEY NOT NULL, workout_id TEXT NOT NULL, workout_day_id TEXT NOT NULL,
        note TEXT NOT NULL DEFAULT '', started_at TEXT NOT NULL, finished_at TEXT
      );
      CREATE TABLE IF NOT EXISTS workout_set_logs (
        id TEXT PRIMARY KEY NOT NULL, session_id TEXT NOT NULL, workout_exercise_id TEXT NOT NULL,
        exercise_id TEXT NOT NULL, set_number INTEGER NOT NULL, weight TEXT NOT NULL,
        reps TEXT NOT NULL, completed_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS workout_set_logs_exercise_id ON workout_set_logs(exercise_id, completed_at DESC);
    `);
    version = 2;
  }
  if (version < 3) {
    await db.execAsync(`
      ALTER TABLE workout_set_logs ADD COLUMN rpe TEXT NOT NULL DEFAULT '';
      ALTER TABLE workout_set_logs ADD COLUMN duration_seconds INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE workout_set_logs ADD COLUMN note TEXT NOT NULL DEFAULT '';
    `);
  }
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

export async function startWorkoutSession(db: SQLiteDatabase, workoutId: string, dayId: string) {
  const id = `session-${Date.now()}`;
  await db.runAsync('INSERT INTO workout_sessions (id, workout_id, workout_day_id, started_at) VALUES (?, ?, ?, ?)', id, workoutId, dayId, new Date().toISOString());
  return id;
}

export async function saveExerciseLog(db: SQLiteDatabase, input: { sessionId: string; workoutExerciseId: string; exerciseId: string; series: number; weight: string; repetitions: string; rpe: string; durationSeconds: number; note: string }) {
  await db.runAsync(
    `INSERT INTO workout_set_logs (id, session_id, workout_exercise_id, exercise_id, set_number, weight, reps, rpe, duration_seconds, note, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    `set-${Date.now()}-${input.series}`, input.sessionId, input.workoutExerciseId, input.exerciseId, input.series, input.weight, input.repetitions, input.rpe, input.durationSeconds, input.note, new Date().toISOString(),
  );
}

export async function finishWorkoutSession(db: SQLiteDatabase, sessionId: string, note: string) {
  await db.runAsync('UPDATE workout_sessions SET note = ?, finished_at = ? WHERE id = ?', note, new Date().toISOString(), sessionId);
}

export async function getExerciseHistory(db: SQLiteDatabase, exerciseId: string): Promise<ExerciseSetLog[]> {
  const rows = await db.getAllAsync<SetLogRow>('SELECT weight, reps, rpe, duration_seconds, note, set_number, completed_at FROM workout_set_logs WHERE exercise_id = ? ORDER BY completed_at DESC LIMIT 5', exerciseId);
  return rows.map((row) => ({ weight: row.weight, repetitions: row.reps, rpe: row.rpe, durationSeconds: row.duration_seconds, note: row.note, setNumber: row.set_number, completedAt: row.completed_at }));
}
