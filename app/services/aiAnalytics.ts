import Anthropic from '@anthropic-ai/sdk';
import { WorkoutInsights, WorkoutSession, WorkoutSet, Exercise } from '@/types';
import { workoutDb } from './database/workoutDb';

// Store API key in .env file: ANTHROPIC_API_KEY=your_key_here
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

class AIAnalyticsService {
  private client: Anthropic;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 1000 * 60 * 60; // 1 hour

  constructor() {
    this.client = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });
  }

  private getCachedResult<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    return null;
  }

  private setCachedResult(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Generate workout insights after session completion
   * Uses Claude Haiku for fast, cost-effective analysis
   */
  async generateWorkoutInsights(
    sessionId: string
  ): Promise<WorkoutInsights> {
    const cacheKey = `insights_${sessionId}`;
    const cached = this.getCachedResult<WorkoutInsights>(cacheKey);
    if (cached) return cached;

    try {
      // Gather workout data
      const sets = await workoutDb.getSessionSets(sessionId);
      const exercises = await workoutDb.getAllExercises();
      const exerciseMap = new Map(exercises.map(e => [e.id, e]));

      // Get recent history (last 4 weeks)
      const fourWeeksAgo = Date.now() - 1000 * 60 * 60 * 24 * 28;
      const recentHistory = await this.getRecentWorkoutHistory(fourWeeksAgo);

      // Calculate muscle group volumes
      const currentVolumes = this.calculateMuscleGroupVolumes(sets, exerciseMap);
      const historicalVolumes = this.calculateHistoricalVolumes(recentHistory, exerciseMap);

      const prompt = `You are an expert strength training coach analyzing workout data.

CURRENT WORKOUT:
${this.formatWorkoutData(sets, exerciseMap)}

RECENT 4-WEEK HISTORY:
Total sessions: ${recentHistory.sessions.length}
Weekly average volume by muscle group:
${this.formatVolumeData(historicalVolumes)}

CURRENT SESSION VOLUMES:
${this.formatVolumeData(currentVolumes)}

Analyze this data and provide:

1. PROGRESSIVE OVERLOAD SUGGESTIONS (2-3 most important)
   - For exercises where the athlete is ready to progress
   - Suggest specific weight/rep increases
   - Format: "Exercise: previous -> suggested (reason)"

2. MUSCLE BALANCE WARNINGS (if any)
   - Flag if push/pull ratio > 1.3:1 or < 0.7:1
   - Flag if any muscle group is neglected (< 50% of highest volume group)

3. RECOVERY ASSESSMENT
   - Score 0-100 based on training frequency and volume
   - Consider if they've trained same muscles within 48 hours

4. DELOAD INDICATOR
   - True if current week volume > 120% of 4-week average
   - True if 6+ workouts with 0 rest days in past week

5. CONTEXTUAL TIPS (1-2 actionable insights)
   - Detect training patterns (peaking, plateau, etc.)
   - Provide specific, actionable advice

Return ONLY valid JSON in this exact format:
{
  "nextSessionSuggestions": [
    {
      "exerciseId": "string",
      "exerciseName": "string",
      "type": "progressive_overload|volume_increase|intensity_increase",
      "recommendation": "string",
      "previousBest": {"weight": number, "reps": number},
      "suggested": {"weight": number, "reps": number}
    }
  ],
  "balanceWarnings": [
    {
      "muscleGroup": "string",
      "weeklyVolume": number,
      "comparedTo": "string",
      "comparedVolume": number,
      "ratio": number,
      "recommendation": "string"
    }
  ],
  "recoveryScore": number,
  "shouldDeload": boolean,
  "contextualTips": ["string"]
}`;

      const message = await this.client.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type');
      }

      const insights = JSON.parse(content.text) as WorkoutInsights;
      this.setCachedResult(cacheKey, insights);

      return insights;
    } catch (error) {
      console.error('AI analysis error:', error);
      // Return fallback insights using rule-based logic
      return this.generateFallbackInsights(sessionId);
    }
  }

  /**
   * Get progressive overload recommendation for next set
   * Quick calculation, no AI needed
   */
  async getNextSetRecommendation(
    exerciseId: string,
    currentWeight: number,
    currentReps: number
  ): Promise<{ weight: number; reps: number; reason: string }> {
    const lastSets = await workoutDb.getLastSessionForExercise(exerciseId);

    if (lastSets.length === 0) {
      return {
        weight: currentWeight,
        reps: currentReps,
        reason: 'First time - establish baseline',
      };
    }

    const lastBest = lastSets.reduce((best, set) => {
      const current1RM = set.weight * (1 + set.reps / 30);
      const best1RM = best.weight * (1 + best.reps / 30);
      return current1RM > best1RM ? set : best;
    }, lastSets[0]);

    // Progressive overload logic
    if (currentReps > lastBest.reps + 2) {
      // Reps increased significantly - increase weight
      return {
        weight: currentWeight + 2.5,
        reps: lastBest.reps,
        reason: 'Reps progressed - add weight',
      };
    } else if (currentReps >= lastBest.reps) {
      // Matched or slightly exceeded - small rep increase
      return {
        weight: currentWeight,
        reps: currentReps + 1,
        reason: 'Add 1 rep for progressive overload',
      };
    } else {
      // Maintain current
      return {
        weight: currentWeight,
        reps: currentReps,
        reason: 'Consolidate current performance',
      };
    }
  }

  /**
   * Deep weekly analysis using Claude Sonnet
   * More expensive but comprehensive
   */
  async generateWeeklyReport(startDate: number, endDate: number): Promise<string> {
    const cacheKey = `weekly_${startDate}_${endDate}`;
    const cached = this.getCachedResult<string>(cacheKey);
    if (cached) return cached;

    try {
      const history = await this.getRecentWorkoutHistory(startDate);
      const exercises = await workoutDb.getAllExercises();
      const exerciseMap = new Map(exercises.map(e => [e.id, e]));

      const prompt = `Analyze this week of training data and provide a comprehensive report.

${this.formatWeeklyData(history, exerciseMap, startDate, endDate)}

Provide:
1. Week summary (total volume, workouts, PRs)
2. Muscle group distribution analysis
3. Top 3 exercises by volume
4. Recovery quality assessment
5. Next week recommendations
6. Potential concerns or red flags

Write in a direct, motivating tone. Be specific with numbers.`;

      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type');
      }

      this.setCachedResult(cacheKey, content.text);
      return content.text;
    } catch (error) {
      console.error('Weekly report error:', error);
      return 'Unable to generate weekly report. Check back later.';
    }
  }

  // Helper methods

  private async getRecentWorkoutHistory(since: number) {
    // This would query the database for all sessions and sets since the given timestamp
    // Simplified for now
    return {
      sessions: [],
      sets: [],
    };
  }

  private calculateMuscleGroupVolumes(
    sets: WorkoutSet[],
    exerciseMap: Map<string, Exercise>
  ): Record<string, number> {
    const volumes: Record<string, number> = {};

    sets.forEach(set => {
      const exercise = exerciseMap.get(set.exerciseId);
      if (!exercise) return;

      const volume = set.weight * set.reps;
      volumes[exercise.category] = (volumes[exercise.category] || 0) + volume;
    });

    return volumes;
  }

  private calculateHistoricalVolumes(
    history: { sessions: any[]; sets: WorkoutSet[] },
    exerciseMap: Map<string, Exercise>
  ): Record<string, number> {
    return this.calculateMuscleGroupVolumes(history.sets, exerciseMap);
  }

  private formatWorkoutData(
    sets: WorkoutSet[],
    exerciseMap: Map<string, Exercise>
  ): string {
    const grouped = new Map<string, WorkoutSet[]>();

    sets.forEach(set => {
      const exerciseId = set.exerciseId;
      if (!grouped.has(exerciseId)) {
        grouped.set(exerciseId, []);
      }
      grouped.get(exerciseId)!.push(set);
    });

    let output = '';
    grouped.forEach((exerciseSets, exerciseId) => {
      const exercise = exerciseMap.get(exerciseId);
      if (!exercise) return;

      output += `\n${exercise.name} (${exercise.category}):\n`;
      exerciseSets.forEach(set => {
        output += `  Set ${set.setNumber}: ${set.weight}kg × ${set.reps}`;
        if (set.rpe) output += ` @ RPE ${set.rpe}`;
        if (set.isPR) output += ' [PR]';
        output += '\n';
      });
    });

    return output;
  }

  private formatVolumeData(volumes: Record<string, number>): string {
    return Object.entries(volumes)
      .map(([muscle, volume]) => `  ${muscle}: ${volume.toFixed(0)}kg`)
      .join('\n');
  }

  private formatWeeklyData(
    history: any,
    exerciseMap: Map<string, Exercise>,
    startDate: number,
    endDate: number
  ): string {
    return `Week: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}

Sessions: ${history.sessions.length}
Total Sets: ${history.sets.length}
Total Volume: ${history.sets.reduce((sum: number, s: WorkoutSet) => sum + s.weight * s.reps, 0)}kg

Exercises performed:
${this.formatWorkoutData(history.sets, exerciseMap)}`;
  }

  private async generateFallbackInsights(sessionId: string): Promise<WorkoutInsights> {
    // Rule-based fallback when AI is unavailable
    return {
      nextSessionSuggestions: [],
      balanceWarnings: [],
      recoveryScore: 75,
      shouldDeload: false,
      contextualTips: [
        'AI analysis temporarily unavailable. Continue with progressive overload.',
      ],
    };
  }
}

export const aiAnalytics = new AIAnalyticsService();
