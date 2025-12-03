import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { colors, typography, spacing, borderRadius, layout } from '@/theme';
import { MonthlyReport as MonthlyReportType } from '@/types';
import { workoutDb } from '@/services/database/workoutDb';

const { width } = Dimensions.get('window');

export const MonthlyReport: React.FC = () => {
  const [report, setReport] = useState<MonthlyReportType | null>(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadMonthlyReport();
  }, [month, year]);

  const loadMonthlyReport = async () => {
    // Load monthly data
    const totalVolume = await workoutDb.getMonthlyVolume(year, month);
    const volumeByMuscleGroup = await workoutDb.getVolumeByMuscleGroup(
      year,
      month
    );

    // Mock report for now - would need more DB queries
    const monthlyReport: MonthlyReportType = {
      month: `${year}-${month.toString().padStart(2, '0')}`,
      totalWorkouts: 12,
      totalVolume,
      volumeByMuscleGroup,
      topExercises: [
        {
          exerciseId: '1',
          exerciseName: 'Barbell Bench Press',
          totalSets: 24,
          totalVolume: 3840,
        },
        {
          exerciseId: '2',
          exerciseName: 'Barbell Squat',
          totalSets: 20,
          totalVolume: 4200,
        },
        {
          exerciseId: '3',
          exerciseName: 'Deadlift',
          totalSets: 15,
          totalVolume: 5250,
        },
      ],
      prsAchieved: 5,
      workoutStreak: 7,
      averageSessionDuration: 65,
    };

    setReport(monthlyReport);
  };

  const renderMuscleGroupVolume = () => {
    if (!report) return null;

    const muscleGroups = Object.entries(report.volumeByMuscleGroup);
    const maxVolume = Math.max(...muscleGroups.map(([_, vol]) => vol));

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Muscle Group Volume</Text>

        {muscleGroups.map(([muscle, volume]) => {
          const percentage = (volume / maxVolume) * 100;

          return (
            <View key={muscle} style={styles.volumeRow}>
              <Text style={styles.muscleLabel}>{muscle.toUpperCase()}</Text>
              <View style={styles.volumeBarContainer}>
                <View
                  style={[styles.volumeBar, { width: `${percentage}%` }]}
                />
              </View>
              <Text style={styles.volumeValue}>
                {(volume / 1000).toFixed(1)}k
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderTopExercises = () => {
    if (!report) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Exercises</Text>

        {report.topExercises.map((exercise, index) => (
          <View key={exercise.exerciseId} style={styles.exerciseRow}>
            <View style={styles.exerciseRank}>
              <Text style={styles.exerciseRankText}>{index + 1}</Text>
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
              <Text style={styles.exerciseStats}>
                {exercise.totalSets} sets • {(exercise.totalVolume / 1000).toFixed(1)}k volume
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderStats = () => {
    if (!report) return null;

    return (
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{report.totalWorkouts}</Text>
          <Text style={styles.statLabel}>WORKOUTS</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{report.prsAchieved}</Text>
          <Text style={styles.statLabel}>PRs</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {(report.totalVolume / 1000).toFixed(1)}k
          </Text>
          <Text style={styles.statLabel}>TOTAL VOLUME</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>🔥 {report.workoutStreak}</Text>
          <Text style={styles.statLabel}>STREAK</Text>
        </View>
      </View>
    );
  };

  if (!report) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading report...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>
          {new Date(year, month - 1).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </Text>

        {renderStats()}
        {renderMuscleGroupVolume()}
        {renderTopExercises()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: layout.screenPadding,
    gap: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: (width - layout.screenPadding * 2 - spacing.md) / 2,
    backgroundColor: colors.bgSecondary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  statValue: {
    ...typography.numbersLarge,
    fontSize: 32,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  muscleLabel: {
    ...typography.label,
    color: colors.textSecondary,
    width: 80,
  },
  volumeBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  volumeBar: {
    height: '100%',
    backgroundColor: colors.accentGreen,
  },
  volumeValue: {
    ...typography.numbers,
    color: colors.textPrimary,
    width: 50,
    textAlign: 'right',
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  exerciseRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accentGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseRankText: {
    ...typography.label,
    color: colors.bgPrimary,
    fontWeight: '700',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  exerciseStats: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
