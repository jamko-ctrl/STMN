# STMN Workout Tracker - Feature Specification

## MVP (Phase 1) - Completed ✅

### 1. Workout Logging System

**Core Functionality:**
- ✅ Create and manage workout sessions
- ✅ Real-time set/rep/weight input via modal UI
- ✅ RPE (Rate of Perceived Exertion) tracking (1-10 scale)
- ✅ Automatic set numbering and organization
- ✅ Historical comparison (display previous session data for same exercise)

**Rest Timer:**
- ✅ Customizable timer (default 70s)
- ✅ Visual progress bar
- ✅ Pause/Resume/Reset controls
- ✅ Color coding (green → red as time runs low)
- ✅ Skip option

**Personal Records:**
- ✅ Automatic PR detection using Epley formula (1RM estimation)
- ✅ Visual PR badge on completed sets
- ✅ PR history tracking by exercise

### 2. Exercise Library

**Pre-seeded Exercises (50+ common movements):**
- ✅ Chest: Bench press variations, flies, dips, push-ups
- ✅ Back: Deadlifts, rows, pull-ups, pulldowns
- ✅ Shoulders: Presses, raises (lateral/front/rear)
- ✅ Arms: Bicep curls, tricep extensions, dips
- ✅ Legs: Squats, lunges, leg press, curls, extensions
- ✅ Glutes: Hip thrusts, bridges, kickbacks
- ✅ Calves: Standing/seated raises
- ✅ Core: Planks, ab wheel, cable crunches

**Exercise Metadata:**
- ✅ Name, muscle group category
- ✅ Equipment tags (barbell, dumbbell, cable, machine, bodyweight)
- ✅ Custom exercise support flag

### 3. Database Layer (SQLite)

**Schema:**
- ✅ exercises table (id, name, category, equipment, is_custom, created_at)
- ✅ workout_sessions table (id, start_time, end_time, notes, is_active)
- ✅ workout_sets table (id, session_id, exercise_id, set_number, weight, reps, rpe, rest_time, is_pr, completed_at)
- ✅ personal_records table (id, exercise_id, weight, reps, record_type, achieved_at)

**Performance:**
- ✅ Indexed foreign keys (session_id, exercise_id)
- ✅ WAL mode for concurrent access
- ✅ <100ms query times

**Key Operations:**
- ✅ Create/retrieve active session
- ✅ Add sets with automatic PR checking
- ✅ Get last session data for exercise
- ✅ Monthly volume aggregation
- ✅ Volume by muscle group

### 4. AI Training Intelligence

**Post-Workout Insights (Claude Haiku):**
- ✅ Progressive overload suggestions (weight/rep increases)
- ✅ Muscle balance warnings (push/pull ratio analysis)
- ✅ Recovery score (0-100 based on frequency/volume)
- ✅ Deload indicators (volume spikes, insufficient rest)
- ✅ Contextual tips (pattern detection)

**Next Set Recommendations (Rule-based):**
- ✅ Compare to previous session's best set
- ✅ Suggest specific weight/rep targets
- ✅ Reasoning for recommendation

**Weekly Deep Analysis (Claude Sonnet):**
- ✅ Comprehensive markdown report
- ✅ Volume trends, muscle distribution
- ✅ Top exercises by volume
- ✅ Recovery quality assessment
- ✅ Next week recommendations

**Cost Optimization:**
- ✅ 1-hour result caching
- ✅ Model selection (Haiku for real-time, Sonnet for weekly)
- ✅ Rule-based fallback when API unavailable
- ✅ Estimated cost: ~$0.05/month for active user

### 5. Design System

**Color Palette (Dark Mode First):**
- ✅ Pure black (#000) primary background
- ✅ Elevated surfaces (#0A0A0A)
- ✅ High contrast white text (#FFF)
- ✅ Secondary text (#666)
- ✅ Accent green (#00FF88) for PRs/success
- ✅ Accent red (#FF4444) for warnings

**Typography:**
- ✅ SF Pro-inspired scale (Bold headers, Regular body)
- ✅ Monospace numbers for weight/reps
- ✅ Uppercase labels (13pt, letterspacing)
- ✅ Responsive sizing

**Components:**
- ✅ SetCard (with previous session comparison)
- ✅ RestTimer (with progress animation)
- ✅ Modal inputs (keyboard-aware)

### 6. State Management

**Zustand Store:**
- ✅ Current session state
- ✅ Selected exercise
- ✅ Completed sets array
- ✅ Timer state (isRunning, seconds, target)
- ✅ AI insights cache

### 7. Monthly Report

**Statistics:**
- ✅ Total workouts count
- ✅ Total volume (kg)
- ✅ Volume by muscle group (bar chart)
- ✅ Top 3 exercises by volume
- ✅ PRs achieved count
- ✅ Workout streak (with fire emoji)
- ✅ Average session duration

## Phase 2 - Planned Features

### Navigation & Screens

**React Navigation Stack:**
- [ ] Home/Dashboard screen
  - Quick start workout button
  - Today's workout suggestions (AI)
  - Recent PRs widget
- [ ] WorkoutLogger (existing, needs navigation integration)
- [ ] ExerciseSelector (existing, add as modal)
- [ ] MonthlyReport (existing, needs date picker)
- [ ] AIInsights Dashboard (new)
  - Large contextual tip card
  - "Challenge yourself" targets
  - 4-metric grid: Consistency, Strength, Endurance, Recovery
  - Post-workout binary feedback

### Exercise Management

**Custom Exercise Creation:**
- [ ] Add exercise form (name, category, equipment)
- [ ] Edit/delete custom exercises
- [ ] Exercise usage frequency tracking

**Exercise Selector Enhancements:**
- [ ] Muscle group filter chips (existing, needs activation)
- [ ] Search with fuzzy matching
- [ ] Recent exercises quick access
- [ ] Favorite exercises

### Workout Session Improvements

**Session Management:**
- [ ] End session with notes
- [ ] Session duration tracking
- [ ] Pause/resume session
- [ ] Discard session confirmation

**Set Input Enhancements:**
- [ ] Plate calculator (e.g., "60kg = 1x20kg + 2x10kg per side")
- [ ] Quick weight adjustments (+2.5kg, +5kg buttons)
- [ ] Rep failure detection (prompt for RPE)
- [ ] Superset support (link exercises)

**Rest Timer Improvements:**
- [ ] Auto-adjust based on set difficulty (higher RPE → longer rest)
- [ ] Rest time recommendations by exercise type
- [ ] Audio/haptic feedback on completion
- [ ] Custom timer presets (short/medium/long)

### Progress Tracking & Analytics

**Charts & Visualizations:**
- [ ] Radar chart for muscle group balance (Victory Native)
- [ ] Calendar heatmap for workout days
- [ ] Line charts for strength progression by exercise
- [ ] Volume trends over 12 weeks

**Advanced Reports:**
- [ ] Weekly summary push notifications
- [ ] Compare current month vs. previous
- [ ] Identify weakest muscle groups
- [ ] Volume per session over time

**Personal Records:**
- [ ] PR history by exercise (timeline view)
- [ ] Estimated 1RM leaderboard
- [ ] Bodyweight-adjusted PRs (Wilks/Dots score)
- [ ] Volume PRs (most total weight in one session)

### AI Features (Phase 2)

**Real-time Coaching:**
- [ ] Form check reminders after rep PRs
- [ ] Fatigue detection (suggest deload)
- [ ] Exercise rotation suggestions (every 4-6 weeks)
- [ ] Plateau detection (same weight 3+ sessions)

**Workout Planning:**
- [ ] Auto-generate weekly split
- [ ] Exercise substitution suggestions
- [ ] Volume auto-regulation (based on recovery score)
- [ ] Periodization templates (linear/undulating)

**Context-Aware Tips:**
- [ ] "You're peaking - test 1RMs next week"
- [ ] "Volume drops but PRs up - strength phase working"
- [ ] "Rest <48hrs on same muscle - extend recovery"

### Social & Sharing

**Export & Sharing:**
- [ ] Share PR as styled image card
- [ ] Export workout to PDF
- [ ] CSV export for external analysis
- [ ] Shareable workout plan templates

**Community (Optional):**
- [ ] Follow friends' PRs
- [ ] Public/private workout log
- [ ] Challenge friends (who can add more volume this week?)

### Integrations

**Apple Health (iOS):**
- [ ] Export workouts to Apple Health
- [ ] Sync body weight
- [ ] Import resting heart rate (for recovery scoring)

**Google Fit (Android):**
- [ ] Export workouts
- [ ] Sync biometrics

**Wearables:**
- [ ] Apple Watch companion app
  - Start workout
  - Log sets
  - View rest timer
- [ ] Heart rate during sets (for RPE validation)

### Settings & Customization

**User Profile:**
- [ ] Experience level (beginner/intermediate/advanced)
- [ ] Training goals (strength/hypertrophy/endurance/weight loss)
- [ ] Injuries list (exclude exercises)
- [ ] Weight unit preference (kg/lbs)

**App Settings:**
- [ ] Default rest timer duration
- [ ] Rest timer auto-start on/off
- [ ] Notification preferences
- [ ] Dark/light theme toggle (dark first)
- [ ] Database backup/restore

### Performance & Infrastructure

**Offline Support:**
- [ ] Queue workouts when offline
- [ ] Sync when connection restored
- [ ] Conflict resolution

**Cloud Sync (Optional):**
- [ ] Firebase/Supabase backend
- [ ] Cross-device sync
- [ ] Backup to cloud

**Push Notifications:**
- [ ] Rest timer completion
- [ ] Daily workout reminder
- [ ] Weekly report ready
- [ ] New PR celebration

### Quality of Life

**Accessibility:**
- [ ] Screen reader support
- [ ] High contrast mode
- [ ] Larger text option
- [ ] VoiceOver/TalkBack optimization

**Haptics:**
- [ ] Success haptic on PR
- [ ] Timer completion
- [ ] Button press feedback

**Animations:**
- [ ] Smooth screen transitions
- [ ] Set completion celebration
- [ ] PR confetti effect

## Phase 3 - Advanced Features

### Advanced Training Tools

**1RM Calculator:**
- [ ] Estimate 1RM from multiple formulas
- [ ] Percentage-based set planning (5x3 @ 85%)

**Workout Templates:**
- [ ] Save workouts as templates
- [ ] Popular programs library (5/3/1, nSuns, PPL, etc.)
- [ ] Quick-start from template

**Mesocycle Planning:**
- [ ] Plan 4-12 week training blocks
- [ ] Auto-adjust volume/intensity week-to-week
- [ ] Deload week scheduling

### Video & Form

**Exercise Demos:**
- [ ] Video library for each exercise
- [ ] Cue cards (key points)
- [ ] Common mistakes

**Form Recording:**
- [ ] Record sets with camera
- [ ] Side-by-side comparison with demo
- [ ] AI form analysis (stretch goal)

### Nutrition Integration (Stretch Goal)

**Macros Tracking:**
- [ ] Log meals
- [ ] Macro targets based on goals
- [ ] Sync with MyFitnessPal

**Body Metrics:**
- [ ] Weight tracking
- [ ] Body measurements (chest, waist, arms, etc.)
- [ ] Progress photos with comparison overlay

### Gamification

**Achievement System:**
- [ ] Badges (100 workouts, 10 PRs, etc.)
- [ ] Milestone celebrations
- [ ] Monthly challenges

**Leaderboards:**
- [ ] Volume leaderboard (you vs. past you)
- [ ] Consistency streaks
- [ ] PR count

## Technical Debt & Improvements

### Code Quality

- [ ] Unit tests for database layer (Jest)
- [ ] Integration tests for AI analytics
- [ ] E2E tests (Detox)
- [ ] Storybook for component library

### Performance

- [ ] Lazy load exercise list (virtualized)
- [ ] Optimize SQLite queries (EXPLAIN QUERY PLAN)
- [ ] Reduce bundle size (<20MB target)
- [ ] Memory profiling

### Developer Experience

- [ ] GitHub Actions CI/CD
- [ ] Automated releases (Semantic Release)
- [ ] Changelog generation
- [ ] Contributing guide

## Success Metrics

**User Engagement:**
- [ ] Weekly active users
- [ ] Average workouts per week
- [ ] Session duration
- [ ] Feature usage (AI insights, reports)

**Performance:**
- [ ] Crash-free rate (target: >99.9%)
- [ ] API response time (target: <3s for insights)
- [ ] App launch time (target: <2s)

**Growth:**
- [ ] App Store rating (target: >4.5★)
- [ ] User retention (D1, D7, D30)
- [ ] Viral coefficient (sharing/referrals)

## Roadmap Timeline

**Q1 2025:**
- ✅ MVP completion (Phase 1)
- [ ] Navigation system
- [ ] Exercise selector integration
- [ ] AI insights dashboard
- [ ] Beta release (TestFlight/Play Store Internal)

**Q2 2025:**
- [ ] Custom exercises
- [ ] Charts & visualizations
- [ ] Apple Health integration
- [ ] Public release (App Store + Google Play)

**Q3 2025:**
- [ ] Workout templates
- [ ] Social features
- [ ] Apple Watch app
- [ ] Cloud sync

**Q4 2025:**
- [ ] Advanced training tools
- [ ] Video demos
- [ ] Nutrition integration (stretch)

---

**Last Updated:** December 2025
**Version:** 1.0.0 (MVP)
