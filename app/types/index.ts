// Core domain types

export interface Exercise {
  id: string;
  name: string;
  category: MuscleGroup;
  equipment: Equipment[];
  isCustom: boolean;
  createdAt: number;
}

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'core'
  | 'glutes'
  | 'calves'
  | 'forearms';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'kettlebell'
  | 'resistance-band';

export interface WorkoutSession {
  id: string;
  startTime: number;
  endTime?: number;
  notes?: string;
  isActive: boolean;
}

export interface WorkoutSet {
  id: string;
  sessionId: string;
  exerciseId: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  restTime?: number; // seconds
  isPR: boolean;
  completedAt: number;
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  weight: number;
  reps: number;
  recordType: 'one_rep_max' | 'volume' | 'total_weight';
  achievedAt: number;
}

export interface UserProfile {
  experience: 'beginner' | 'intermediate' | 'advanced';
  goals: ('strength' | 'hypertrophy' | 'endurance' | 'weight-loss')[];
  injuries: string[];
  weightUnit: 'kg' | 'lbs';
}

// AI Analysis types

export interface WorkoutInsights {
  nextSessionSuggestions: Suggestion[];
  balanceWarnings: BalanceWarning[];
  recoveryScore: number; // 0-100
  shouldDeload: boolean;
  contextualTips: string[];
}

export interface Suggestion {
  exerciseId: string;
  exerciseName: string;
  type: 'progressive_overload' | 'volume_increase' | 'intensity_increase';
  recommendation: string;
  previousBest: {
    weight: number;
    reps: number;
  };
  suggested: {
    weight: number;
    reps: number;
  };
}

export interface BalanceWarning {
  muscleGroup: MuscleGroup;
  weeklyVolume: number;
  comparedTo: MuscleGroup;
  comparedVolume: number;
  ratio: number;
  recommendation: string;
}

export interface MonthlyReport {
  month: string;
  totalWorkouts: number;
  totalVolume: number;
  volumeByMuscleGroup: Record<MuscleGroup, number>;
  topExercises: {
    exerciseId: string;
    exerciseName: string;
    totalSets: number;
    totalVolume: number;
  }[];
  prsAchieved: number;
  workoutStreak: number;
  averageSessionDuration: number; // minutes
}

// UI State types

export interface TimerState {
  isRunning: boolean;
  seconds: number;
  targetSeconds: number;
}

export interface WorkoutLoggerState {
  currentSession: WorkoutSession | null;
  selectedExercise: Exercise | null;
  completedSets: WorkoutSet[];
  timer: TimerState;
}
