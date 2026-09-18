import type { SQLiteDatabase } from 'expo-sqlite';

import { initialWorkout, type WorkoutPlan } from '@/data/workouts';
import type { Exercise } from '@/data/exercises';

type WorkoutRow = { id: string; name: string; days: string };
type SetLogRow = {
  weight: string;
  reps: string;
  rpe: string;
  duration_seconds: number;
  note: string;
  set_number: number;
  completed_at: string;
};
type SessionHistoryRow = {
  id: string;
  name: string;
  started_at: string;
  finished_at: string;
  sets: number;
  volume: number;
};
type PersonalRecordRow = {
  exercise_id: string;
  weight: number;
  reps: string;
  completed_at: string;
};
const DATABASE_VERSION = 5;

export type ExerciseLog = {
  exerciseId: string;
  series: number;
  weight: string;
  repetitions: string;
  rpe: string;
  durationSeconds: number;
  note: string;
  completedAt: string;
};
export type ExerciseSetLog = Omit<ExerciseLog, 'exerciseId' | 'series'> & {
  setNumber: number;
};
export type WorkoutSessionHistory = {
  id: string;
  name: string;
  startedAt: string;
  finishedAt: string;
  sets: number;
  volume: number;
};
export type PersonalRecord = {
  exerciseId: string;
  weight: number;
  repetitions: string;
  completedAt: string;
};
export type UserProfile = {
  name: string;
  weight: string;
  height: string;
  age: string;
  sex: string;
  goal: string;
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export async function migrateDatabase(db: SQLiteDatabase) {
  const result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version',
  );
  let version = result?.user_version ?? 0;
  if (version === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS workouts (
        id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, days TEXT NOT NULL,
        created_at TEXT NOT NULL, updated_at TEXT NOT NULL
      );
    `);
    const count = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) AS count FROM workouts',
    );
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
  if (version < 4) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, weight TEXT NOT NULL,
        height TEXT NOT NULL, age TEXT NOT NULL, sex TEXT NOT NULL, goal TEXT NOT NULL,
        completed_at TEXT NOT NULL
      );
    `);
  }
  if (version < 5) {
    await db.execAsync(
      'CREATE TABLE IF NOT EXISTS custom_exercises (id TEXT PRIMARY KEY NOT NULL, data TEXT NOT NULL, created_at TEXT NOT NULL)',
    );
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export async function getUserProfile(
  db: SQLiteDatabase,
): Promise<UserProfile | null> {
  return (
    (await db.getFirstAsync<UserProfile>(
      'SELECT name, weight, height, age, sex, goal FROM user_profile WHERE id = 1',
    )) ?? null
  );
}

export async function saveUserProfile(
  db: SQLiteDatabase,
  profile: UserProfile,
) {
  await db.runAsync(
    `INSERT INTO user_profile (id, name, weight, height, age, sex, goal, completed_at) VALUES (1, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET name = excluded.name, weight = excluded.weight, height = excluded.height, age = excluded.age, sex = excluded.sex, goal = excluded.goal, completed_at = excluded.completed_at`,
    profile.name,
    profile.weight,
    profile.height,
    profile.age,
    profile.sex,
    profile.goal,
    new Date().toISOString(),
  );
}

export async function getCustomExercises(
  db: SQLiteDatabase,
): Promise<Exercise[]> {
  const rows = await db.getAllAsync<{ data: string }>(
    'SELECT data FROM custom_exercises ORDER BY created_at DESC',
  );
  return rows.map(row => JSON.parse(row.data) as Exercise);
}

export async function saveCustomExercise(
  db: SQLiteDatabase,
  exercise: Exercise,
) {
  await db.runAsync(
    'INSERT INTO custom_exercises (id, data, created_at) VALUES (?, ?, ?)',
    exercise.id,
    JSON.stringify(exercise),
    new Date().toISOString(),
  );
}

export async function getWorkouts(db: SQLiteDatabase): Promise<WorkoutPlan[]> {
  const rows = await db.getAllAsync<WorkoutRow>(
    'SELECT id, name, days FROM workouts ORDER BY updated_at DESC',
  );
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    days: JSON.parse(row.days) as WorkoutPlan['days'],
  }));
}

export async function saveWorkout(db: SQLiteDatabase, workout: WorkoutPlan) {
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT INTO workouts (id, name, days, created_at, updated_at) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET name = excluded.name, days = excluded.days, updated_at = excluded.updated_at`,
    workout.id,
    workout.name.trim() || 'Treino sem nome',
    JSON.stringify(workout.days),
    now,
    now,
  );
}

export async function deleteWorkout(db: SQLiteDatabase, id: string) {
  await db.runAsync('DELETE FROM workouts WHERE id = ?', id);
}

export function createEmptyWorkout(): WorkoutPlan {
  const id = Date.now();
  return {
    id: `workout-${id}`,
    name: 'Novo treino',
    days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map(weekday => ({
      id: `${weekday}-${id}`,
      weekday,
      focus: [],
      isRest: false,
      exercises: [],
    })),
  };
}

export function duplicateWorkout(workout: WorkoutPlan): WorkoutPlan {
  const copy = clone(workout);
  const id = Date.now();
  return {
    ...copy,
    id: `workout-${id}`,
    name: `${copy.name} (cópia)`,
    days: copy.days.map((day, dayIndex) => ({
      ...day,
      id: `${day.id}-${id}-${dayIndex}`,
      exercises: day.exercises.map((item, index) => ({
        ...item,
        id: `${item.id}-${id}-${index}`,
      })),
    })),
  };
}

export async function startWorkoutSession(
  db: SQLiteDatabase,
  workoutId: string,
  dayId: string,
) {
  const id = `session-${Date.now()}`;
  await db.runAsync(
    'INSERT INTO workout_sessions (id, workout_id, workout_day_id, started_at) VALUES (?, ?, ?, ?)',
    id,
    workoutId,
    dayId,
    new Date().toISOString(),
  );
  return id;
}

export async function saveExerciseLog(
  db: SQLiteDatabase,
  input: {
    sessionId: string;
    workoutExerciseId: string;
    exerciseId: string;
    series: number;
    weight: string;
    repetitions: string;
    rpe: string;
    durationSeconds: number;
    note: string;
  },
) {
  await db.runAsync(
    `INSERT INTO workout_set_logs (id, session_id, workout_exercise_id, exercise_id, set_number, weight, reps, rpe, duration_seconds, note, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    `set-${Date.now()}-${input.series}`,
    input.sessionId,
    input.workoutExerciseId,
    input.exerciseId,
    input.series,
    input.weight,
    input.repetitions,
    input.rpe,
    input.durationSeconds,
    input.note,
    new Date().toISOString(),
  );
}

export async function finishWorkoutSession(
  db: SQLiteDatabase,
  sessionId: string,
  note: string,
) {
  await db.runAsync(
    'UPDATE workout_sessions SET note = ?, finished_at = ? WHERE id = ?',
    note,
    new Date().toISOString(),
    sessionId,
  );
}

export async function getExerciseHistory(
  db: SQLiteDatabase,
  exerciseId: string,
): Promise<ExerciseSetLog[]> {
  const rows = await db.getAllAsync<SetLogRow>(
    'SELECT weight, reps, rpe, duration_seconds, note, set_number, completed_at FROM workout_set_logs WHERE exercise_id = ? ORDER BY completed_at DESC LIMIT 5',
    exerciseId,
  );
  return rows.map(row => ({
    weight: row.weight,
    repetitions: row.reps,
    rpe: row.rpe,
    durationSeconds: row.duration_seconds,
    note: row.note,
    setNumber: row.set_number,
    completedAt: row.completed_at,
  }));
}

/** Completed sessions only. All aggregates are calculated from the locally saved set logs. */
export async function getWorkoutHistory(
  db: SQLiteDatabase,
): Promise<WorkoutSessionHistory[]> {
  const rows = await db.getAllAsync<SessionHistoryRow>(`
    SELECT sessions.id, workouts.name, sessions.started_at, sessions.finished_at,
      COUNT(logs.id) AS sets,
      COALESCE(SUM(CAST(REPLACE(logs.weight, ',', '.') AS REAL) * CAST(REPLACE(logs.reps, ',', '.') AS REAL)), 0) AS volume
    FROM workout_sessions AS sessions
    JOIN workouts ON workouts.id = sessions.workout_id
    LEFT JOIN workout_set_logs AS logs ON logs.session_id = sessions.id
    WHERE sessions.finished_at IS NOT NULL
    GROUP BY sessions.id
    ORDER BY sessions.finished_at DESC
  `);
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    sets: Number(row.sets),
    volume: Number(row.volume),
  }));
}

export async function getPersonalRecords(
  db: SQLiteDatabase,
): Promise<PersonalRecord[]> {
  const rows = await db.getAllAsync<PersonalRecordRow>(`
    SELECT logs.exercise_id, CAST(REPLACE(logs.weight, ',', '.') AS REAL) AS weight, logs.reps, logs.completed_at
    FROM workout_set_logs AS logs
    JOIN workout_sessions AS sessions ON sessions.id = logs.session_id
    WHERE sessions.finished_at IS NOT NULL
    ORDER BY weight DESC, logs.completed_at DESC
  `);
  const seen = new Set<string>();
  return rows
    .filter(row => !seen.has(row.exercise_id) && !!seen.add(row.exercise_id))
    .slice(0, 5)
    .map(row => ({
      exerciseId: row.exercise_id,
      weight: Number(row.weight),
      repetitions: row.reps,
      completedAt: row.completed_at,
    }));
}
