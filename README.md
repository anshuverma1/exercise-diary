# Exercise Diary App

A React Native app for tracking your workouts with a built-in exercise database, set/rep tracking, and dark/light theme support.

## Features

- **Calendar View**: Visual calendar to see which days have workouts
- **Exercise Database**: 35+ built-in exercises across 7 categories
- **Workout Tracking**: Log sets, reps, and weight for each exercise
- **Statistics**: Track your streak, total volume, and favorite exercises
- **Dark/Light Theme**: Automatic system detection with manual override
- **Local Storage**: All data saved locally using AsyncStorage

## Screens

1. **Calendar** - Month view with workout indicators, tap date to add/view workouts
2. **Exercises** - Browse and search the exercise database by category
3. **Stats** - View workout statistics, streaks, and progress
4. **Workout Entry** - Add/edit exercises with sets/reps/weight tracking

## Tech Stack

- React Native with Expo
- Expo Router for navigation
- AsyncStorage for local persistence
- React Context for state management

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Project Structure

```
app/
├── (tabs)/           # Tab navigation screens
│   ├── index.tsx     # Calendar view
│   ├── exercises.tsx # Exercise database
│   └── stats.tsx     # Statistics
├── workout/
│   └── [date].tsx    # Workout entry screen
└── _layout.tsx       # Root layout

src/
├── components/       # Reusable components
├── context/          # Theme and workout providers
├── data/             # Exercise database
├── hooks/            # Custom hooks
├── types/            # TypeScript types
└── utils/            # Date utilities
```

## Data Models

### Exercise
- id: string
- name: string
- category: chest | back | legs | shoulders | arms | core | cardio
- equipment: bodyweight | dumbbell | barbell | machine | cable

### WorkoutEntry
- id: string
- date: string (YYYY-MM-DD)
- exerciseId: string
- sets: WorkoutSet[]
- notes?: string

### WorkoutSet
- id: string
- reps: number
- weight: number
- completed: boolean
