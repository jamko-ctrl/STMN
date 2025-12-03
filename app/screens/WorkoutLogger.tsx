import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { colors, typography, spacing, borderRadius, layout } from '@/theme';
import { Exercise, WorkoutSet, WorkoutSession } from '@/types';
import { workoutDb } from '@/services/database/workoutDb';
import { SetCard } from '@/components/SetCard';
import { RestTimer } from '@/components/RestTimer';

export const WorkoutLogger: React.FC = () => {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [completedSets, setCompletedSets] = useState<WorkoutSet[]>([]);
  const [previousSets, setPreviousSets] = useState<WorkoutSet[]>([]);
  const [showTimer, setShowTimer] = useState(false);
  const [showSetInput, setShowSetInput] = useState(false);

  // Input state
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('');

  useEffect(() => {
    initSession();
  }, []);

  const initSession = async () => {
    await workoutDb.init();
    const activeSession = await workoutDb.getActiveSession();
    if (activeSession) {
      setSession(activeSession);
      loadSessionSets(activeSession.id);
    } else {
      const newSession = await workoutDb.createSession();
      setSession(newSession);
    }
  };

  const loadSessionSets = async (sessionId: string) => {
    const sets = await workoutDb.getSessionSets(sessionId);
    setCompletedSets(sets);
  };

  const loadExercise = async (exercise: Exercise) => {
    setSelectedExercise(exercise);
    const prevSets = await workoutDb.getLastSessionForExercise(exercise.id);
    setPreviousSets(prevSets);

    // Pre-fill with last weight/reps
    if (prevSets.length > 0) {
      const lastSet = prevSets[prevSets.length - 1];
      setWeight(lastSet.weight.toString());
      setReps(lastSet.reps.toString());
    }
  };

  const handleAddSet = () => {
    if (!selectedExercise) return;

    const exerciseSets = completedSets.filter(
      s => s.exerciseId === selectedExercise.id
    );

    // Pre-fill from last set of this exercise in current session
    if (exerciseSets.length > 0) {
      const lastSet = exerciseSets[exerciseSets.length - 1];
      setWeight(lastSet.weight.toString());
      setReps(lastSet.reps.toString());
    }

    setShowSetInput(true);
  };

  const handleSaveSet = async () => {
    if (!session || !selectedExercise || !weight || !reps) return;

    const weightNum = parseFloat(weight);
    const repsNum = parseInt(reps, 10);
    const rpeNum = rpe ? parseInt(rpe, 10) : undefined;

    const exerciseSets = completedSets.filter(
      s => s.exerciseId === selectedExercise.id
    );
    const setNumber = exerciseSets.length + 1;

    // Check for PR
    const isPR = await workoutDb.checkAndUpdatePR(
      selectedExercise.id,
      weightNum,
      repsNum
    );

    const newSet = await workoutDb.addSet({
      sessionId: session.id,
      exerciseId: selectedExercise.id,
      setNumber,
      weight: weightNum,
      reps: repsNum,
      rpe: rpeNum,
      isPR,
      completedAt: Date.now(),
    });

    setCompletedSets([...completedSets, newSet]);
    setShowSetInput(false);
    setShowTimer(true);

    // Clear RPE for next set
    setRpe('');
  };

  const handleTimerComplete = () => {
    setShowTimer(false);
  };

  const handleSkipTimer = () => {
    setShowTimer(false);
  };

  const getCurrentSetNumber = () => {
    if (!selectedExercise) return 1;
    const exerciseSets = completedSets.filter(
      s => s.exerciseId === selectedExercise.id
    );
    return exerciseSets.length + 1;
  };

  const renderExerciseSets = () => {
    if (!selectedExercise) return null;

    const exerciseSets = completedSets.filter(
      s => s.exerciseId === selectedExercise.id
    );

    const maxSets = Math.max(exerciseSets.length + 1, previousSets.length, 3);
    const sets = [];

    for (let i = 0; i < maxSets; i++) {
      sets.push(
        <SetCard
          key={i}
          setNumber={i + 1}
          set={exerciseSets[i]}
          previousSet={previousSets[i]}
          isActive={i === exerciseSets.length}
          onPress={i === exerciseSets.length ? handleAddSet : undefined}
        />
      );
    }

    return sets;
  };

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {selectedExercise?.name || 'Select Exercise'}
          </Text>
          {selectedExercise && (
            <Text style={styles.category}>{selectedExercise.category}</Text>
          )}
        </View>

        {/* Sets List */}
        {selectedExercise && (
          <View style={styles.setsContainer}>
            {renderExerciseSets()}
          </View>
        )}

        {/* Add Set Button */}
        {selectedExercise && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddSet}>
            <Text style={styles.addButtonText}>+ ADD SET</Text>
          </TouchableOpacity>
        )}

        {/* Exercise Selection (placeholder) */}
        {!selectedExercise && (
          <TouchableOpacity
            style={styles.selectExerciseButton}
            onPress={() => {
              // This would open exercise selector
              // For now, let's load a sample exercise
              workoutDb.getAllExercises().then(exercises => {
                if (exercises.length > 0) {
                  loadExercise(exercises[0]);
                }
              });
            }}
          >
            <Text style={styles.selectExerciseText}>SELECT EXERCISE</Text>
          </TouchableOpacity>
        )}

        {/* Rest Timer */}
        {showTimer && (
          <View style={styles.timerContainer}>
            <RestTimer
              targetSeconds={70}
              onComplete={handleTimerComplete}
              onSkip={handleSkipTimer}
            />
          </View>
        )}
      </ScrollView>

      {/* Set Input Modal */}
      <Modal
        visible={showSetInput}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSetInput(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowSetInput(false)}
          />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set {getCurrentSetNumber()}</Text>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>WEIGHT (KG)</Text>
                <TextInput
                  style={styles.input}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>REPS</Text>
                <TextInput
                  style={styles.input}
                  value={reps}
                  onChangeText={setReps}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>RPE (1-10)</Text>
                <TextInput
                  style={styles.input}
                  value={rpe}
                  onChangeText={setRpe}
                  keyboardType="numeric"
                  placeholder="-"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowSetInput(false)}
              >
                <Text style={styles.modalButtonText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveSet}
              >
                <Text style={[styles.modalButtonText, styles.saveButtonText]}>
                  SAVE
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    gap: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  category: {
    ...typography.label,
    color: colors.textSecondary,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  setsContainer: {
    gap: spacing.md,
  },
  addButton: {
    backgroundColor: colors.accentGreen,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  addButtonText: {
    ...typography.label,
    color: colors.bgPrimary,
    fontWeight: '700',
  },
  selectExerciseButton: {
    backgroundColor: colors.bgSecondary,
    padding: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  selectExerciseText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  timerContainer: {
    marginTop: spacing.lg,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  modalContent: {
    backgroundColor: colors.bgSecondary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: layout.screenPadding,
    gap: spacing.lg,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.numbers,
    fontSize: 24,
    color: colors.textPrimary,
    backgroundColor: colors.bgTertiary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    backgroundColor: colors.bgTertiary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalButtonText: {
    ...typography.label,
    color: colors.textPrimary,
  },
  saveButton: {
    backgroundColor: colors.accentGreen,
    borderColor: colors.accentGreen,
  },
  saveButtonText: {
    color: colors.bgPrimary,
  },
});
