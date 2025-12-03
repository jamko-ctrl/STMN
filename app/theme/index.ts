// STMN Design System - Brutally Minimal

export const colors = {
  // Backgrounds
  bgPrimary: '#000000',
  bgSecondary: '#0A0A0A',
  bgTertiary: '#141414',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#666666',
  textTertiary: '#333333',

  // Accents
  accentGreen: '#00FF88',
  accentRed: '#FF4444',
  accentYellow: '#FFD700',

  // Borders
  border: '#1A1A1A',
  borderLight: '#2A2A2A',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.8)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
} as const;

export const typography = {
  // Headers use SF Pro Display Bold equivalent
  h1: {
    fontSize: 34,
    fontWeight: '700' as const,
    lineHeight: 41,
    letterSpacing: 0.37,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
    letterSpacing: 0.36,
  },
  h3: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: 0.35,
  },

  // Body uses SF Pro Text Regular equivalent
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  bodyLarge: {
    fontSize: 19,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: -0.45,
  },
  bodySmall: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: -0.24,
  },

  // Numbers use SF Mono Medium equivalent (monospace)
  numbers: {
    fontSize: 17,
    fontWeight: '500' as const,
    lineHeight: 22,
    fontFamily: 'monospace' as const,
  },
  numbersLarge: {
    fontSize: 48,
    fontWeight: '500' as const,
    lineHeight: 56,
    fontFamily: 'monospace' as const,
  },

  // Labels
  label: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
    letterSpacing: -0.08,
    textTransform: 'uppercase' as const,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// Layout constants
export const layout = {
  screenPadding: spacing.lg,
  cardPadding: spacing.md,
  minTouchTarget: 44, // iOS HIG minimum
  headerHeight: 60,
} as const;

// Animation timings (ms)
export const animation = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;

// Helper function for responsive spacing
export const getResponsiveSpacing = (base: number, scale: number = 1) => {
  return Math.round(base * scale);
};
