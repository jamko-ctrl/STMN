# STMN Workout Tracker

A minimalist workout tracking app with AI training intelligence, inspired by Stoic aesthetics.

## Features

- **Workout Logging**: Real-time set/rep/weight tracking with rest timer
- **Progress Tracking**: Monthly reports, PRs, volume trends
- **AI Intelligence**: Progressive overload suggestions, form reminders, recovery analysis
- **Offline-First**: All data stored locally with SQLite

## Tech Stack

- React Native (Expo)
- SQLite + WatermelonDB
- Claude API for AI insights
- Zustand for state management
- Victory Native for charts

## Getting Started

```bash
npm install
npm start
```

## Design Philosophy

Dark-mode-first, brutally minimal UI with focus on:
- Performance (<100ms input latency)
- Typography (SF Pro Display/Text)
- Functional design (no unnecessary decoration)

## Project Structure

```
/app
  /screens       - Main UI screens
  /components    - Reusable components
  /services      - Business logic & API
  /types         - TypeScript types
  /theme         - Design system
```
