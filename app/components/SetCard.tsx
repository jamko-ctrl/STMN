import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { WorkoutSet } from '@/types';

interface SetCardProps {
  setNumber: number;
  set?: WorkoutSet;
  previousSet?: WorkoutSet;
  isActive?: boolean;
  onPress?: () => void;
}

export const SetCard: React.FC<SetCardProps> = ({
  setNumber,
  set,
  previousSet,
  isActive,
  onPress,
}) => {
  const isCompleted = !!set;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive && styles.activeContainer,
        isCompleted && styles.completedContainer,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.setNumber}>
        <Text style={styles.setNumberText}>{setNumber}</Text>
      </View>

      <View style={styles.content}>
        {isCompleted ? (
          <>
            <View style={styles.dataRow}>
              <Text style={styles.weightText}>
                {set.weight}
                <Text style={styles.unitText}>kg</Text>
              </Text>
              <Text style={styles.separator}>×</Text>
              <Text style={styles.repsText}>
                {set.reps}
                <Text style={styles.unitText}> reps</Text>
              </Text>
              {set.isPR && <Text style={styles.prBadge}>PR</Text>}
            </View>
            {set.rpe && (
              <Text style={styles.rpeText}>RPE {set.rpe}</Text>
            )}
          </>
        ) : (
          <View style={styles.dataRow}>
            {previousSet ? (
              <>
                <Text style={styles.previousText}>
                  Previous: {previousSet.weight}kg × {previousSet.reps}
                </Text>
              </>
            ) : (
              <Text style={styles.emptyText}>Tap to log set</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeContainer: {
    borderColor: colors.accentGreen,
    borderWidth: 2,
  },
  completedContainer: {
    backgroundColor: colors.bgTertiary,
  },
  setNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  setNumberText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  weightText: {
    ...typography.numbers,
    fontSize: 20,
    color: colors.textPrimary,
  },
  repsText: {
    ...typography.numbers,
    fontSize: 20,
    color: colors.textPrimary,
  },
  separator: {
    ...typography.body,
    color: colors.textSecondary,
  },
  unitText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  rpeText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  previousText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  prBadge: {
    ...typography.label,
    color: colors.accentGreen,
    backgroundColor: colors.bgPrimary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
});
