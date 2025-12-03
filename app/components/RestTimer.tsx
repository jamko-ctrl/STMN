import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '@/theme';

interface RestTimerProps {
  targetSeconds?: number;
  onComplete?: () => void;
  onSkip?: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  targetSeconds = 70,
  onComplete,
  onSkip,
}) => {
  const [seconds, setSeconds] = useState(targetSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [progress] = useState(new Animated.Value(1));

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onComplete]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: seconds / targetSeconds,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [seconds, targetSeconds]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const togglePause = () => {
    setIsRunning(prev => !prev);
  };

  const reset = () => {
    setSeconds(targetSeconds);
    setIsRunning(true);
  };

  const progressBarWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressBarWidth,
              backgroundColor:
                seconds > 10 ? colors.accentGreen : colors.accentRed,
            },
          ]}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>REST</Text>
        <Text style={styles.timer}>{formatTime(seconds)}</Text>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={togglePause}>
            <Text style={styles.buttonText}>{isRunning ? 'PAUSE' : 'RESUME'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={reset}>
            <Text style={styles.buttonText}>RESET</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.skipButton]}
            onPress={onSkip}
          >
            <Text style={[styles.buttonText, styles.skipButtonText]}>SKIP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.border,
  },
  progressBar: {
    height: '100%',
  },
  content: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  timer: {
    ...typography.numbersLarge,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.bgTertiary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    ...typography.label,
    color: colors.textPrimary,
  },
  skipButton: {
    backgroundColor: colors.bgPrimary,
    borderColor: colors.accentGreen,
  },
  skipButtonText: {
    color: colors.accentGreen,
  },
});
