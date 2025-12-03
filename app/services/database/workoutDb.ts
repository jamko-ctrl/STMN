import * as SQLite from 'expo-sqlite';
import { Exercise, WorkoutSession, WorkoutSet, PersonalRecord } from '@/types';

const DB_NAME = 'stmn_workout.db';

class WorkoutDatabase {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    this.db = await SQLite.openDatabaseAsync(DB_NAME);
    await this.createTables();
    await this.seedExercises();
  }

  private async createTables() {
    if (!this.db) return;

    await this.db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS exercises (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        equipment TEXT NOT NULL,
        is_custom INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS workout_sessions (
        id TEXT PRIMARY KEY,
        start_time INTEGER NOT NULL,
        end_time INTEGER,
        notes TEXT,
        is_active INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS workout_sets (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        exercise_id TEXT NOT NULL,
        set_number INTEGER NOT NULL,
        weight REAL NOT NULL,
        reps INTEGER NOT NULL,
        rpe INTEGER,
        rest_time INTEGER,
        is_pr INTEGER DEFAULT 0,
        completed_at INTEGER NOT NULL,
        FOREIGN KEY (session_id) REFERENCES workout_sessions(id),
        FOREIGN KEY (exercise_id) REFERENCES exercises(id)
      );

      CREATE TABLE IF NOT EXISTS personal_records (
        id TEXT PRIMARY KEY,
        exercise_id TEXT NOT NULL,
        weight REAL NOT NULL,
        reps INTEGER NOT NULL,
        record_type TEXT NOT NULL,
        achieved_at INTEGER NOT NULL,
        FOREIGN KEY (exercise_id) REFERENCES exercises(id)
      );

      CREATE INDEX IF NOT EXISTS idx_sets_session ON workout_sets(session_id);
      CREATE INDEX IF NOT EXISTS idx_sets_exercise ON workout_sets(exercise_id);
      CREATE INDEX IF NOT EXISTS idx_prs_exercise ON personal_records(exercise_id);
    `);
  }

  private async seedExercises() {
    if (!this.db) return;

    const count = await this.db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM exercises WHERE is_custom = 0'
    );

    if (count && count.count > 0) return; // Already seeded

    const exercises = [
      // Chest
      { name: 'Barbell Bench Press', category: 'chest', equipment: ['barbell'] },
      { name: 'Dumbbell Bench Press', category: 'chest', equipment: ['dumbbell'] },
      { name: 'Incline Barbell Bench Press', category: 'chest', equipment: ['barbell'] },
      { name: 'Incline Dumbbell Press', category: 'chest', equipment: ['dumbbell'] },
      { name: 'Cable Chest Fly', category: 'chest', equipment: ['cable'] },
      { name: 'Dips (Chest)', category: 'chest', equipment: ['bodyweight'] },
      { name: 'Push-Ups', category: 'chest', equipment: ['bodyweight'] },

      // Back
      { name: 'Deadlift', category: 'back', equipment: ['barbell'] },
      { name: 'Barbell Row', category: 'back', equipment: ['barbell'] },
      { name: 'Pull-Ups', category: 'back', equipment: ['bodyweight'] },
      { name: 'Lat Pulldown', category: 'back', equipment: ['cable'] },
      { name: 'Dumbbell Row', category: 'back', equipment: ['dumbbell'] },
      { name: 'T-Bar Row', category: 'back', equipment: ['barbell'] },
      { name: 'Cable Row', category: 'back', equipment: ['cable'] },
      { name: 'Face Pulls', category: 'back', equipment: ['cable'] },

      // Shoulders
      { name: 'Overhead Press', category: 'shoulders', equipment: ['barbell'] },
      { name: 'Dumbbell Shoulder Press', category: 'shoulders', equipment: ['dumbbell'] },
      { name: 'Lateral Raises', category: 'shoulders', equipment: ['dumbbell'] },
      { name: 'Front Raises', category: 'shoulders', equipment: ['dumbbell'] },
      { name: 'Rear Delt Fly', category: 'shoulders', equipment: ['dumbbell'] },
      { name: 'Arnold Press', category: 'shoulders', equipment: ['dumbbell'] },

      // Arms - Biceps
      { name: 'Barbell Curl', category: 'biceps', equipment: ['barbell'] },
      { name: 'Dumbbell Curl', category: 'biceps', equipment: ['dumbbell'] },
      { name: 'Hammer Curl', category: 'biceps', equipment: ['dumbbell'] },
      { name: 'Cable Curl', category: 'biceps', equipment: ['cable'] },
      { name: 'Preacher Curl', category: 'biceps', equipment: ['barbell', 'dumbbell'] },

      // Arms - Triceps
      { name: 'Close-Grip Bench Press', category: 'triceps', equipment: ['barbell'] },
      { name: 'Tricep Dips', category: 'triceps', equipment: ['bodyweight'] },
      { name: 'Overhead Tricep Extension', category: 'triceps', equipment: ['dumbbell'] },
      { name: 'Cable Tricep Pushdown', category: 'triceps', equipment: ['cable'] },
      { name: 'Skull Crushers', category: 'triceps', equipment: ['barbell'] },

      // Legs
      { name: 'Barbell Squat', category: 'legs', equipment: ['barbell'] },
      { name: 'Front Squat', category: 'legs', equipment: ['barbell'] },
      { name: 'Romanian Deadlift', category: 'legs', equipment: ['barbell'] },
      { name: 'Leg Press', category: 'legs', equipment: ['machine'] },
      { name: 'Leg Curl', category: 'legs', equipment: ['machine'] },
      { name: 'Leg Extension', category: 'legs', equipment: ['machine'] },
      { name: 'Bulgarian Split Squat', category: 'legs', equipment: ['dumbbell'] },
      { name: 'Lunges', category: 'legs', equipment: ['dumbbell'] },

      // Glutes
      { name: 'Hip Thrust', category: 'glutes', equipment: ['barbell'] },
      { name: 'Glute Bridge', category: 'glutes', equipment: ['bodyweight'] },
      { name: 'Cable Kickbacks', category: 'glutes', equipment: ['cable'] },

      // Calves
      { name: 'Standing Calf Raise', category: 'calves', equipment: ['machine'] },
      { name: 'Seated Calf Raise', category: 'calves', equipment: ['machine'] },

      // Core
      { name: 'Planks', category: 'core', equipment: ['bodyweight'] },
      { name: 'Ab Wheel Rollout', category: 'core', equipment: ['bodyweight'] },
      { name: 'Cable Crunches', category: 'core', equipment: ['cable'] },
      { name: 'Hanging Leg Raises', category: 'core', equipment: ['bodyweight'] },
    ];

    const stmt = await this.db.prepareAsync(
      'INSERT INTO exercises (id, name, category, equipment, is_custom, created_at) VALUES (?, ?, ?, ?, 0, ?)'
    );

    for (const ex of exercises) {
      const id = `ex_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await stmt.executeAsync([
        id,
        ex.name,
        ex.category,
        JSON.stringify(ex.equipment),
        Date.now(),
      ]);
    }

    await stmt.finalizeAsync();
  }

  // Exercise operations
  async getAllExercises(): Promise<Exercise[]> {
    if (!this.db) return [];
    const rows = await this.db.getAllAsync<any>('SELECT * FROM exercises ORDER BY name');
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      equipment: JSON.parse(row.equipment),
      isCustom: row.is_custom === 1,
      createdAt: row.created_at,
    }));
  }

  async searchExercises(query: string): Promise<Exercise[]> {
    if (!this.db) return [];
    const rows = await this.db.getAllAsync<any>(
      'SELECT * FROM exercises WHERE name LIKE ? ORDER BY name',
      [`%${query}%`]
    );
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      equipment: JSON.parse(row.equipment),
      isCustom: row.is_custom === 1,
      createdAt: row.created_at,
    }));
  }

  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    if (!this.db) return [];
    const rows = await this.db.getAllAsync<any>(
      'SELECT * FROM exercises WHERE category = ? ORDER BY name',
      [category]
    );
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      equipment: JSON.parse(row.equipment),
      isCustom: row.is_custom === 1,
      createdAt: row.created_at,
    }));
  }

  // Workout session operations
  async createSession(): Promise<WorkoutSession> {
    if (!this.db) throw new Error('Database not initialized');

    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    await this.db.runAsync(
      'INSERT INTO workout_sessions (id, start_time, is_active) VALUES (?, ?, 1)',
      [id, startTime]
    );

    return { id, startTime, isActive: true };
  }

  async getActiveSession(): Promise<WorkoutSession | null> {
    if (!this.db) return null;
    const row = await this.db.getFirstAsync<any>(
      'SELECT * FROM workout_sessions WHERE is_active = 1 LIMIT 1'
    );
    if (!row) return null;
    return {
      id: row.id,
      startTime: row.start_time,
      endTime: row.end_time,
      notes: row.notes,
      isActive: row.is_active === 1,
    };
  }

  async endSession(sessionId: string, notes?: string): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync(
      'UPDATE workout_sessions SET end_time = ?, notes = ?, is_active = 0 WHERE id = ?',
      [Date.now(), notes || '', sessionId]
    );
  }

  // Set operations
  async addSet(set: Omit<WorkoutSet, 'id'>): Promise<WorkoutSet> {
    if (!this.db) throw new Error('Database not initialized');

    const id = `set_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await this.db.runAsync(
      `INSERT INTO workout_sets
       (id, session_id, exercise_id, set_number, weight, reps, rpe, rest_time, is_pr, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        set.sessionId,
        set.exerciseId,
        set.setNumber,
        set.weight,
        set.reps,
        set.rpe || null,
        set.restTime || null,
        set.isPR ? 1 : 0,
        set.completedAt,
      ]
    );

    return { id, ...set };
  }

  async getSessionSets(sessionId: string): Promise<WorkoutSet[]> {
    if (!this.db) return [];
    const rows = await this.db.getAllAsync<any>(
      'SELECT * FROM workout_sets WHERE session_id = ? ORDER BY completed_at',
      [sessionId]
    );
    return rows.map(row => ({
      id: row.id,
      sessionId: row.session_id,
      exerciseId: row.exercise_id,
      setNumber: row.set_number,
      weight: row.weight,
      reps: row.reps,
      rpe: row.rpe,
      restTime: row.rest_time,
      isPR: row.is_pr === 1,
      completedAt: row.completed_at,
    }));
  }

  async getLastSessionForExercise(exerciseId: string): Promise<WorkoutSet[]> {
    if (!this.db) return [];

    // Get the most recent completed session with this exercise
    const lastSessionRow = await this.db.getFirstAsync<any>(
      `SELECT DISTINCT ws.session_id
       FROM workout_sets ws
       JOIN workout_sessions s ON ws.session_id = s.id
       WHERE ws.exercise_id = ? AND s.is_active = 0
       ORDER BY s.end_time DESC
       LIMIT 1`,
      [exerciseId]
    );

    if (!lastSessionRow) return [];

    const rows = await this.db.getAllAsync<any>(
      'SELECT * FROM workout_sets WHERE session_id = ? AND exercise_id = ? ORDER BY set_number',
      [lastSessionRow.session_id, exerciseId]
    );

    return rows.map(row => ({
      id: row.id,
      sessionId: row.session_id,
      exerciseId: row.exercise_id,
      setNumber: row.set_number,
      weight: row.weight,
      reps: row.reps,
      rpe: row.rpe,
      restTime: row.rest_time,
      isPR: row.is_pr === 1,
      completedAt: row.completed_at,
    }));
  }

  // Personal records
  async checkAndUpdatePR(
    exerciseId: string,
    weight: number,
    reps: number
  ): Promise<boolean> {
    if (!this.db) return false;

    // Calculate estimated 1RM using Epley formula
    const estimated1RM = weight * (1 + reps / 30);

    const currentPR = await this.db.getFirstAsync<any>(
      'SELECT * FROM personal_records WHERE exercise_id = ? AND record_type = "one_rep_max" ORDER BY achieved_at DESC LIMIT 1',
      [exerciseId]
    );

    const currentBest1RM = currentPR
      ? currentPR.weight * (1 + currentPR.reps / 30)
      : 0;

    if (estimated1RM > currentBest1RM) {
      const id = `pr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await this.db.runAsync(
        'INSERT INTO personal_records (id, exercise_id, weight, reps, record_type, achieved_at) VALUES (?, ?, ?, ?, "one_rep_max", ?)',
        [id, exerciseId, weight, reps, Date.now()]
      );
      return true;
    }

    return false;
  }

  async getPersonalRecords(exerciseId: string): Promise<PersonalRecord[]> {
    if (!this.db) return [];
    const rows = await this.db.getAllAsync<any>(
      'SELECT * FROM personal_records WHERE exercise_id = ? ORDER BY achieved_at DESC',
      [exerciseId]
    );
    return rows.map(row => ({
      id: row.id,
      exerciseId: row.exercise_id,
      weight: row.weight,
      reps: row.reps,
      recordType: row.record_type,
      achievedAt: row.achieved_at,
    }));
  }

  // Analytics queries
  async getMonthlyVolume(year: number, month: number): Promise<number> {
    if (!this.db) return 0;

    const startDate = new Date(year, month - 1, 1).getTime();
    const endDate = new Date(year, month, 0, 23, 59, 59).getTime();

    const result = await this.db.getFirstAsync<{ total: number }>(
      `SELECT SUM(weight * reps) as total
       FROM workout_sets ws
       JOIN workout_sessions s ON ws.session_id = s.id
       WHERE s.start_time >= ? AND s.start_time <= ?`,
      [startDate, endDate]
    );

    return result?.total || 0;
  }

  async getVolumeByMuscleGroup(
    year: number,
    month: number
  ): Promise<Record<string, number>> {
    if (!this.db) return {};

    const startDate = new Date(year, month - 1, 1).getTime();
    const endDate = new Date(year, month, 0, 23, 59, 59).getTime();

    const rows = await this.db.getAllAsync<{ category: string; volume: number }>(
      `SELECT e.category, SUM(ws.weight * ws.reps) as volume
       FROM workout_sets ws
       JOIN workout_sessions s ON ws.session_id = s.id
       JOIN exercises e ON ws.exercise_id = e.id
       WHERE s.start_time >= ? AND s.start_time <= ?
       GROUP BY e.category`,
      [startDate, endDate]
    );

    const result: Record<string, number> = {};
    rows.forEach(row => {
      result[row.category] = row.volume;
    });

    return result;
  }
}

export const workoutDb = new WorkoutDatabase();
