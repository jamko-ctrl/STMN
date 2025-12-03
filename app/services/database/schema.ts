import { appSchema, tableSchema } from '@nozbe/watermelondb';

// SQLite schema using WatermelonDB

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'exercises',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'category', type: 'string' },
        { name: 'equipment', type: 'string' }, // JSON array
        { name: 'is_custom', type: 'boolean' },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'workout_sessions',
      columns: [
        { name: 'start_time', type: 'number' },
        { name: 'end_time', type: 'number', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'is_active', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'workout_sets',
      columns: [
        { name: 'session_id', type: 'string', isIndexed: true },
        { name: 'exercise_id', type: 'string', isIndexed: true },
        { name: 'set_number', type: 'number' },
        { name: 'weight', type: 'number' },
        { name: 'reps', type: 'number' },
        { name: 'rpe', type: 'number', isOptional: true },
        { name: 'rest_time', type: 'number', isOptional: true },
        { name: 'is_pr', type: 'boolean' },
        { name: 'completed_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'personal_records',
      columns: [
        { name: 'exercise_id', type: 'string', isIndexed: true },
        { name: 'weight', type: 'number' },
        { name: 'reps', type: 'number' },
        { name: 'record_type', type: 'string' },
        { name: 'achieved_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'user_profile',
      columns: [
        { name: 'experience', type: 'string' },
        { name: 'goals', type: 'string' }, // JSON array
        { name: 'injuries', type: 'string' }, // JSON array
        { name: 'weight_unit', type: 'string' },
      ],
    }),
  ],
});

// Model definitions

export interface ExerciseModel {
  id: string;
  name: string;
  category: string;
  equipment: string;
  isCustom: boolean;
  createdAt: number;
}

export interface WorkoutSessionModel {
  id: string;
  startTime: number;
  endTime?: number;
  notes?: string;
  isActive: boolean;
}

export interface WorkoutSetModel {
  id: string;
  sessionId: string;
  exerciseId: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe?: number;
  restTime?: number;
  isPR: boolean;
  completedAt: number;
}
