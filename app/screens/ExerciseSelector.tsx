import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors, typography, spacing, borderRadius, layout } from '@/theme';
import { Exercise, MuscleGroup } from '@/types';
import { workoutDb } from '@/services/database/workoutDb';

interface ExerciseSelectorProps {
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
}

const MUSCLE_GROUPS: MuscleGroup[] = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'legs',
  'glutes',
  'calves',
  'core',
];

export const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  onSelect,
  onClose,
}) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MuscleGroup | null>(
    null
  );

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [searchQuery, selectedCategory, exercises]);

  const loadExercises = async () => {
    const allExercises = await workoutDb.getAllExercises();
    setExercises(allExercises);
    setFilteredExercises(allExercises);
  };

  const filterExercises = () => {
    let filtered = exercises;

    if (selectedCategory) {
      filtered = filtered.filter(ex => ex.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ex =>
        ex.name.toLowerCase().includes(query)
      );
    }

    setFilteredExercises(filtered);
  };

  const handleSelectExercise = (exercise: Exercise) => {
    onSelect(exercise);
    onClose();
  };

  const renderCategoryFilter = () => (
    <View style={styles.categoryContainer}>
      <TouchableOpacity
        style={[
          styles.categoryChip,
          !selectedCategory && styles.categoryChipActive,
        ]}
        onPress={() => setSelectedCategory(null)}
      >
        <Text
          style={[
            styles.categoryChipText,
            !selectedCategory && styles.categoryChipTextActive,
          ]}
        >
          ALL
        </Text>
      </TouchableOpacity>

      {MUSCLE_GROUPS.map(category => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryChip,
            selectedCategory === category && styles.categoryChipActive,
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text
            style={[
              styles.categoryChipText,
              selectedCategory === category && styles.categoryChipTextActive,
            ]}
          >
            {category.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={styles.exerciseItem}
      onPress={() => handleSelectExercise(item)}
    >
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseCategory}>{item.category}</Text>
      </View>
      <Text style={styles.exerciseEquipment}>
        {item.equipment.join(', ')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Exercise</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <FlatList
        ListHeaderComponent={renderCategoryFilter()}
        data={filteredExercises}
        renderItem={renderExerciseItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No exercises found. Try a different search.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: layout.screenPadding,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    ...typography.h2,
    color: colors.textSecondary,
  },
  searchContainer: {
    padding: layout.screenPadding,
  },
  searchInput: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.bgSecondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    padding: layout.screenPadding,
    paddingTop: 0,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.accentGreen,
    borderColor: colors.accentGreen,
  },
  categoryChipText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  categoryChipTextActive: {
    color: colors.bgPrimary,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.xxl,
  },
  exerciseItem: {
    paddingVertical: spacing.lg,
  },
  exerciseInfo: {
    marginBottom: spacing.xs,
  },
  exerciseName: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  exerciseCategory: {
    ...typography.label,
    color: colors.textSecondary,
  },
  exerciseEquipment: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
