import { create } from 'zustand';
import {
  Exercise,
  WorkoutSession,
  WorkoutSet,
  TimerState,
  WorkoutInsights,
} from '@/types';

interface WorkoutStore {
  // Current session
  currentSession: WorkoutSession | null;
  selectedExercise: Exercise | null;
  completedSets: WorkoutSet[];

  // Timer
  timer: TimerState;

  // AI insights
  insights: WorkoutInsights | null;
  isLoadingInsights: boolean;

  // Actions
  setCurrentSession: (session: WorkoutSession | null) => void;
  setSelectedExercise: (exercise: Exercise | null) => void;
  addCompletedSet: (set: WorkoutSet) => void;
  setCompletedSets: (sets: WorkoutSet[]) => void;

  // Timer actions
  startTimer: (targetSeconds: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;

  // Insights
  setInsights: (insights: WorkoutInsights | null) => void;
  setLoadingInsights: (loading: boolean) => void;
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  currentSession: null,
  selectedExercise: null,
  completedSets: [],

  timer: {
    isRunning: false,
    seconds: 0,
    targetSeconds: 70,
  },

  insights: null,
  isLoadingInsights: false,

  // Session actions
  setCurrentSession: (session) => set({ currentSession: session }),
  setSelectedExercise: (exercise) => set({ selectedExercise: exercise }),
  addCompletedSet: (set_param) =>
    set((state) => ({
      completedSets: [...state.completedSets, set_param],
    })),
  setCompletedSets: (sets) => set({ completedSets: sets }),

  // Timer actions
  startTimer: (targetSeconds) =>
    set({
      timer: {
        isRunning: true,
        seconds: targetSeconds,
        targetSeconds,
      },
    }),
  pauseTimer: () =>
    set((state) => ({
      timer: { ...state.timer, isRunning: false },
    })),
  resumeTimer: () =>
    set((state) => ({
      timer: { ...state.timer, isRunning: true },
    })),
  resetTimer: () =>
    set((state) => ({
      timer: {
        isRunning: true,
        seconds: state.timer.targetSeconds,
        targetSeconds: state.timer.targetSeconds,
      },
    })),
  tickTimer: () => {
    const { timer } = get();
    if (timer.isRunning && timer.seconds > 0) {
      set({
        timer: { ...timer, seconds: timer.seconds - 1 },
      });
    }
  },

  // Insights
  setInsights: (insights) => set({ insights }),
  setLoadingInsights: (loading) => set({ isLoadingInsights: loading }),
}));
