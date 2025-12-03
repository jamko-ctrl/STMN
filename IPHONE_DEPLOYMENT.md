# iPhone Deployment Guide - STMN Workout Tracker

Get your workout tracker app running on your iPhone in **under 15 minutes**.

## Prerequisites

✅ **macOS computer** (for iOS development)
✅ **iPhone** with iOS 13 or later
✅ **Apple ID** (free, no paid developer account needed for testing)
✅ **Xcode** installed (free from App Store)

## Quick Start (Expo Go - Fastest Method)

### Option 1: Using Expo Go App (5 minutes)

**Best for:** Testing the app quickly without building

1. **On your iPhone:**
   ```
   App Store → Search "Expo Go" → Install
   ```

2. **On your Mac (in this project):**
   ```bash
   # Install dependencies (first time only)
   npm install

   # Start the development server
   npm start
   ```

3. **Scan the QR code:**
   - Open Expo Go app on iPhone
   - Tap "Scan QR Code"
   - Scan the QR code shown in your terminal
   - App will load on your phone!

**✅ Pros:** Super fast, no Xcode needed
**❌ Cons:** Requires dev server running, can't use all native features

---

## Full Native Build (Standalone App)

### Option 2: Local Build with Xcode (20 minutes)

**Best for:** Full native app on your phone, works offline

#### Step 1: Install Xcode

```bash
# Check if Xcode is installed
xcode-select -p

# If not installed:
# 1. Open App Store
# 2. Search "Xcode"
# 3. Install (12GB download, takes 30-60 min)
```

#### Step 2: Install Dependencies

```bash
# In the STMN directory
npm install

# Install iOS dependencies
npx pod-install
```

#### Step 3: Generate iOS Project

```bash
# Generate native iOS project
npx expo prebuild --platform ios

# This creates an ios/ folder with Xcode project
```

#### Step 4: Open in Xcode

```bash
# Open the Xcode workspace
open ios/stmnworkouttracker.xcworkspace
```

#### Step 5: Configure Signing

In Xcode:
1. Click "stmnworkouttracker" in left sidebar
2. Select "Signing & Capabilities" tab
3. Check "Automatically manage signing"
4. Select your Apple ID in "Team" dropdown
   - If no team: Click "Add Account" → Sign in with Apple ID

#### Step 6: Build and Run on iPhone

1. **Connect iPhone via USB**
2. **Trust this computer** (popup on iPhone)
3. **Select your iPhone** from device dropdown (top of Xcode)
4. **Click ▶️ Play button** (or Cmd+R)

First build takes 5-10 minutes. Subsequent builds: ~30 seconds.

**On iPhone:** Settings → General → VPN & Device Management → Trust developer

Your app is now installed! 🎉

---

### Option 3: Expo EAS Build (Cloud Build)

**Best for:** Don't have a Mac, or want automated builds

#### Step 1: Install EAS CLI

```bash
npm install -g eas-cli

# Login to Expo account
eas login
```

#### Step 2: Configure EAS

```bash
# Initialize EAS
eas build:configure
```

#### Step 3: Create Development Build

```bash
# Build for iPhone (cloud build, ~10-15 min)
eas build --platform ios --profile development
```

#### Step 4: Install on iPhone

1. Build completes → You get a QR code
2. Scan QR with iPhone camera
3. Download and install the app
4. Trust the developer (Settings → General → VPN & Device Management)

---

## Post-Installation Setup

### 1. Add Your Claude API Key

```bash
# Create .env file
cp .env.example .env

# Edit .env and add your key
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

Get API key: https://console.anthropic.com/

### 2. Rebuild App (if using native build)

```bash
# Expo Go: Just refresh
# Native: Cmd+R in Xcode
# EAS: Create new build with updated .env
```

---

## Troubleshooting

### "Developer Mode Required" (iOS 16+)

iPhone: **Settings → Privacy & Security → Developer Mode → Toggle ON**

### "Untrusted Developer"

iPhone: **Settings → General → VPN & Device Management → Trust [Your Apple ID]**

### Build Fails: "No signing certificate"

Xcode → Preferences → Accounts → Add Apple ID → Download Manual Profiles

### "Module not found" errors

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo prebuild --clean
```

### "Database not working"

```bash
# Reinstall expo-sqlite
npx expo install expo-sqlite
npx expo prebuild --clean
```

### App crashes on launch

Check Console.app (Mac) while iPhone is connected for error logs.

---

## Feature Checklist

Once installed, verify these features work:

- [ ] Select an exercise (tap "SELECT EXERCISE")
- [ ] Log a set with weight/reps
- [ ] Select rep type (Normal/Failure/Drop Set)
- [ ] Rest timer starts automatically
- [ ] Set shows "PR" badge if personal record
- [ ] Previous session data shows for comparison
- [ ] Switch exercises mid-workout ("CHANGE" button)

---

## Production Deployment (App Store)

Want to publish to the App Store?

### Requirements:
- **Apple Developer Account** ($99/year)
- **App Store Connect** access
- **Privacy policy** (required)
- **Screenshots** for App Store listing

### Steps:

1. **Enroll in Apple Developer Program**
   - https://developer.apple.com/programs/
   - $99/year

2. **Update app.json**
   ```json
   {
     "expo": {
       "ios": {
         "bundleIdentifier": "com.yourname.stmnworkout",
         "buildNumber": "1"
       },
       "version": "1.0.0"
     }
   }
   ```

3. **Create Production Build**
   ```bash
   eas build --platform ios --profile production
   ```

4. **Submit to App Store**
   ```bash
   eas submit --platform ios
   ```

5. **App Store Connect**
   - Add screenshots
   - Write description
   - Set price (free or paid)
   - Submit for review (1-3 days)

---

## Tips for Best Performance

### Battery Optimization
- Close other apps when working out
- Lower screen brightness during rest timers
- Enable Low Power Mode for longer sessions

### Data Management
- Export workouts weekly (Settings → Export)
- Backup database regularly
- Clear old sessions if app gets slow (>1000 workouts)

### AI Features
- Enable "Anti-Plateau Toggle" for suggestions (Settings)
- Check insights after every workout
- Review weekly reports for trends

---

## Support

**Issues?**
- Check IMPLEMENTATION_GUIDE.md
- File bug: https://github.com/anthropics/claude-code/issues
- Re-read troubleshooting section above

**Want to customize?**
- Edit colors: `app/theme/index.ts`
- Add exercises: Database auto-seeds, or use UI (coming in Phase 2)
- Modify rest timer: Change `targetSeconds` in WorkoutLogger.tsx

---

## What's Next?

✅ Phase 1 (MVP) - DONE
- Workout logging
- Rest timer
- PR tracking
- Exercise library (50+ exercises)
- Rep type selection (normal/failure/drop-set)
- Plateau detection with AI suggestions

🚧 Phase 2 (Coming Soon)
- Navigation between screens
- Monthly reports with charts
- AI insights dashboard
- Apple Health integration
- Custom exercises
- Workout templates

---

**You're ready to track workouts!** 💪

Open the app → Tap "SELECT EXERCISE" → Choose exercise → Start logging sets.

The app saves everything locally to your phone's SQLite database. No internet required (except for AI insights).
