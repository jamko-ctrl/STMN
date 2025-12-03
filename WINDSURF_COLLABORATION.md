# Windsurf Agent Collaboration Guide

**Purpose:** Enable Windsurf and Claude Code to collaborate efficiently without conflicts or destructive changes.

---

## 🎯 Core Principles

1. **Read Before Write** - Always check existing implementation before making changes
2. **Preserve Working Code** - Never refactor code that isn't broken
3. **Communicate Changes** - Document what you're changing and why
4. **Respect Git History** - Check recent commits before modifying files

---

## 📋 Pre-Flight Checklist

Before making ANY changes, run:

```bash
# 1. Check what Claude Code just committed
git log --oneline -5

# 2. See what's currently changed
git status

# 3. Review the last commit details
git show HEAD

# 4. Check if a file was recently modified
git log -1 --format="%ai" -- path/to/file.tsx
```

**If a file was committed in last 10 minutes → ASK BEFORE MODIFYING**

---

## 🚫 DO NOT Touch These (Unless Explicitly Asked)

### Database Schema (`app/services/database/workoutDb.ts`)
- Already has `rep_type` column
- SQLite schema is set
- **Don't add migration code** - table already created with `CREATE TABLE IF NOT EXISTS`

### Type Definitions (`app/types/index.ts`)
- `RepType` already defined
- `PlateauDetection` interface exists
- `WorkoutSet` has `repType` field
- **Don't duplicate types**

### Core Features Already Implemented
- ✅ Exercise selector modal
- ✅ Rep type tracking (Normal/Failure/Drop Set)
- ✅ Plateau detection with AI
- ✅ Rest timer
- ✅ PR detection
- ✅ Previous session comparison

---

## ✅ Safe Areas to Work On

### Phase 2 Features (Not Yet Implemented)
1. **Navigation System** - React Navigation stack
2. **AI Insights Dashboard** - Visual display of plateau detection
3. **Charts** - Victory Native integration for progress graphs
4. **Settings Screen** - Anti-plateau toggle UI
5. **Apple Health Integration** - Export workout data
6. **Custom Exercise Creation** - UI for adding new exercises

### Enhancements to Existing Features
- Plate calculator for barbell exercises
- Quick weight adjustment buttons (+2.5kg, +5kg)
- Auto-adjust rest timer based on RPE
- Workout templates
- Exercise favorites

### Bug Fixes
- **Only if you've verified the bug exists**
- Include reproduction steps in commit message
- Test before committing

---

## 🤝 Collaboration Workflow

### Step 1: Check Current State
```bash
# What did Claude Code just do?
git log --oneline -3
git diff HEAD~1

# What's the current task?
cat TODO.md 2>/dev/null || echo "No TODO file"
```

### Step 2: Communicate Intent
Before writing code, state:
- **What** you're going to implement
- **Why** it's needed
- **Which files** you'll modify
- **Any dependencies** on Claude Code's work

**Example:**
```markdown
## Implementing Navigation System

**What:** Add React Navigation stack for screen transitions
**Files:**
- app/navigation/AppNavigator.tsx (new)
- App.tsx (modify - add NavigationContainer)
- package.json (add dependencies)

**Dependencies:**
- Requires WorkoutLogger.tsx (✓ already exists)
- Requires ExerciseSelector.tsx (✓ already exists)

**No conflicts with:** Recent rep type implementation
```

### Step 3: Incremental Changes
- **One feature per commit**
- **Test after each change**
- **Commit before moving to next feature**

```bash
# After implementing navigation
git add app/navigation/
git commit -m "feat: Add React Navigation stack

- Create AppNavigator with stack navigation
- Add WorkoutLogger and MonthlyReport screens
- Configure stack header styling"

# Push to sync with Claude Code
git push
```

### Step 4: Handle Conflicts
If you detect overlapping work:

```bash
# 1. Stash your changes
git stash

# 2. Pull Claude Code's latest
git pull

# 3. Review what changed
git log -1 --stat

# 4. Decide:
# - If Claude Code did it → abandon your version
# - If yours is better → discuss with user
# - If complementary → apply stash and merge

git stash pop  # only if safe to merge
```

---

## 📁 File Ownership Guide

### Claude Code's Primary Domain
```
app/services/database/     ← Database logic
app/services/aiAnalytics.ts ← AI features
app/types/index.ts         ← Type definitions
app/components/SetCard.tsx ← Workout UI components
app/components/RestTimer.tsx
app/screens/WorkoutLogger.tsx
app/screens/ExerciseSelector.tsx
```

**→ Read-only unless user explicitly asks you to modify**

### Windsurf's Safe Zones (New Features)
```
app/navigation/            ← You can create this
app/screens/Settings.tsx   ← You can create this
app/screens/AIInsights.tsx ← You can create this
app/hooks/                 ← You can create this
app/utils/                 ← You can create this
```

**→ Create freely, but check if Claude Code started it first**

### Shared Territory (Coordinate)
```
App.tsx                    ← Coordinate changes
package.json               ← Both may add dependencies
app.json                   ← Both may modify config
```

**→ Always check git log before modifying**

---

## 🛠️ Specific Scenarios

### Scenario 1: User Asks "Add Settings Screen"

**❌ Wrong Approach:**
```typescript
// Don't create from scratch without checking existing work
// WindsurfAgent creates app/screens/Settings.tsx
export const Settings = () => { ... }
```

**✅ Correct Approach:**
```bash
# 1. Check if it exists
ls app/screens/Settings.tsx

# 2. Check if Claude Code mentioned it
git log --all --grep="settings" -i

# 3. Check if there's a related type
grep -r "UserProfile\|Settings" app/types/

# 4. Found UserProfile with antiPlateauEnabled!
# Claude Code already added the data model

# 5. Build UI that uses existing types
import { UserProfile } from '@/types';
// Create Settings screen that matches existing architecture
```

### Scenario 2: User Reports Bug

**❌ Wrong:**
```bash
# Immediately refactor the file
sed -i 's/old/new/g' app/screens/WorkoutLogger.tsx
```

**✅ Right:**
```bash
# 1. Reproduce the bug
npm start
# Test in Expo Go

# 2. Check if it's really a bug or expected behavior
git log -- app/screens/WorkoutLogger.tsx
git show <commit-hash>

# 3. Verify Claude Code didn't just fix it
git pull
git log --since="10 minutes ago"

# 4. Fix only the specific bug
# 5. Add test case if possible
# 6. Commit with clear description
```

### Scenario 3: Adding New Dependency

**✅ Safe Process:**
```bash
# 1. Check if Claude Code already added it
grep "package-name" package.json

# 2. Check compatibility with Expo
npx expo install package-name

# 3. Document why you're adding it
git commit -m "feat: Add package-name for X feature

- Needed for navigation system
- Compatible with Expo SDK 50
- No conflicts with existing dependencies"
```

---

## 🎨 Code Style Alignment

Match Claude Code's existing style:

### TypeScript
```typescript
// ✅ Use existing patterns
export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState<Type>(initialValue);

  // Async functions
  const handleAction = async () => {
    if (!dependency) return;
    // ...
  };
};

// ❌ Don't introduce new patterns
export default function ComponentName(props: Props) { ... }
```

### Styling
```typescript
// ✅ Use theme system
import { colors, typography, spacing, borderRadius } from '@/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgPrimary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
  },
});

// ❌ Don't use hardcoded values
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 24,
    borderRadius: 8,
  },
});
```

### Database Queries
```typescript
// ✅ Follow existing patterns
async getFoo(): Promise<Foo[]> {
  if (!this.db) return [];
  const rows = await this.db.getAllAsync<any>(
    'SELECT * FROM table WHERE condition = ?',
    [param]
  );
  return rows.map(row => ({
    id: row.id,
    field: row.field,
  }));
}
```

---

## 📊 Communication Protocol

### When Starting Work
```markdown
**Windsurf Starting:** Navigation System Implementation

**Checked:**
- ✓ No recent commits to App.tsx (last change: 2 hours ago)
- ✓ No existing navigation/ folder
- ✓ Dependencies: WorkoutLogger, ExerciseSelector exist

**Plan:**
1. Install @react-navigation/native
2. Create app/navigation/AppNavigator.tsx
3. Modify App.tsx to wrap with NavigationContainer
4. Test navigation between screens

**ETA:** 20 minutes

**Will notify when:** Ready for testing
```

### When Conflicts Arise
```markdown
**⚠️ Conflict Detected**

**File:** app/screens/WorkoutLogger.tsx
**Issue:** Claude Code modified this 5 minutes ago
**My Change:** Wanted to add navigation params
**Claude's Change:** Added rep type selector

**Resolution:**
- Pulling latest changes first
- Will add navigation params in separate commit
- No overwrite of rep type logic
```

### When Complete
```markdown
**✅ Windsurf Complete:** Navigation System

**Changes:**
- Created app/navigation/AppNavigator.tsx
- Modified App.tsx (added NavigationContainer)
- Updated package.json (+3 dependencies)

**Tested:**
- ✓ Navigation between WorkoutLogger ↔ MonthlyReport
- ✓ Back button works
- ✓ Existing features unaffected

**Committed:** abc123f
**Ready for:** Claude Code to continue with AI Insights
```

---

## 🔍 Verification Checklist

Before committing, verify:

```bash
# 1. No accidental deletions
git diff --stat | grep " deletion"

# 2. No duplicate code
grep -r "export interface WorkoutSet" app/

# 3. TypeScript compiles
npx tsc --noEmit

# 4. No console errors
npm start
# Check Metro bundler output

# 5. Git history is clean
git log --oneline -3
```

---

## 🚨 Red Flags - Stop and Ask

**Stop immediately if you encounter:**

1. **Database schema changes** in files modified <1 hour ago
2. **Type definition conflicts** (duplicate interfaces)
3. **Breaking changes** to existing API signatures
4. **Files with 100+ lines changed** in recent commits
5. **Merge conflicts** during git pull

**Action:** Ask user "Should I wait for Claude Code to finish X before proceeding?"

---

## 💡 Best Practices Summary

1. ✅ **Always pull before starting work**
2. ✅ **Read existing code before writing new code**
3. ✅ **Use existing patterns and conventions**
4. ✅ **Commit frequently with clear messages**
5. ✅ **Test before pushing**
6. ✅ **Communicate what you're doing**
7. ✅ **Respect Claude Code's implementations**
8. ✅ **Focus on Phase 2+ features (new work)**
9. ✅ **Ask when uncertain**
10. ✅ **Leave working code alone**

---

## 🎯 Current Focus Areas (Safe for Windsurf)

Based on latest commits, these are **open for implementation**:

### High Priority (User Wants These)
1. **Settings Screen with Anti-Plateau Toggle**
   - Create `app/screens/Settings.tsx`
   - Use existing `UserProfile` type
   - Toggle for `antiPlateauEnabled`

2. **AI Insights Dashboard**
   - Create `app/screens/AIInsights.tsx`
   - Display `PlateauDetection` data
   - Show plateau-breaking suggestions

3. **Navigation System**
   - Create `app/navigation/AppNavigator.tsx`
   - Connect: WorkoutLogger, MonthlyReport, Settings, AIInsights
   - Add tab bar or stack navigation

4. **Charts & Visualizations**
   - Install Victory Native
   - Create progress charts (weight/reps over time)
   - Radar chart for muscle balance

### Medium Priority
- Apple Health integration
- Custom exercise creation UI
- Workout templates
- Export functionality (CSV/PDF)

### Low Priority (Polish)
- Plate calculator
- Quick weight buttons
- Auto-adjust rest timer
- Exercise favorites

---

## 📝 Example Workflow

```bash
# Morning: Check what Claude Code did overnight
git pull
git log --since="yesterday" --oneline

# Claude Code added rep type feature → Don't touch those files

# User asks: "Add settings screen"

# Step 1: Research
grep -r "Settings\|antiPlateau" app/
# Found: UserProfile has antiPlateauEnabled field

# Step 2: Plan
cat <<EOF > WINDSURF_PLAN.md
## Settings Screen Implementation

Using existing UserProfile type from app/types/index.ts:
- antiPlateauEnabled: boolean
- experience: beginner | intermediate | advanced
- goals: strength | hypertrophy | endurance | weight-loss
- injuries: string[]
- weightUnit: kg | lbs

Will create:
- app/screens/Settings.tsx
- Use AsyncStorage to persist settings
- Match existing UI style (dark mode, STMN aesthetic)
EOF

# Step 3: Implement
# Create Settings.tsx...

# Step 4: Test
npm start
# Verify in Expo Go

# Step 5: Commit
git add app/screens/Settings.tsx
git commit -m "feat: Add Settings screen with anti-plateau toggle

- Create Settings UI matching STMN design
- Persist UserProfile to AsyncStorage
- Toggle for AI plateau detection
- Weight unit selector (kg/lbs)
- Experience level picker

Complements Claude Code's plateau detection feature"

# Step 6: Push and notify
git push
echo "✅ Settings screen complete. Claude Code can now add Settings to navigation."
```

---

## 🤖 TL;DR for Windsurf

**In 3 Rules:**

1. **`git pull && git log -3`** before every task
2. **Create NEW files** > Modify existing files
3. **Ask if uncertain** > Break working code

**Golden Rule:** If Claude Code touched it in the last hour, leave it alone.

---

**Ready to collaborate! 🤝**
