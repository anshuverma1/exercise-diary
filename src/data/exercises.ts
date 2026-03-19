import { Exercise } from '../types';

export const exercises: Exercise[] = [
  // Chest
  { id: 'bench-press', name: 'Bench Press', category: 'chest', equipment: 'barbell', description: 'Classic chest exercise' },
  { id: 'push-ups', name: 'Push-ups', category: 'chest', equipment: 'bodyweight', description: 'Bodyweight chest exercise' },
  { id: 'chest-fly', name: 'Chest Fly', category: 'chest', equipment: 'dumbbell', description: 'Isolation chest exercise' },
  { id: 'incline-press', name: 'Incline Press', category: 'chest', equipment: 'barbell', description: 'Upper chest focus' },
  { id: 'chest-dips', name: 'Chest Dips', category: 'chest', equipment: 'bodyweight', description: 'Lower chest exercise' },

  // Back
  { id: 'pull-ups', name: 'Pull-ups', category: 'back', equipment: 'bodyweight', description: 'Wide grip back exercise' },
  { id: 'rows', name: 'Bent Over Rows', category: 'back', equipment: 'barbell', description: 'Mid back thickness' },
  { id: 'deadlift', name: 'Deadlift', category: 'back', equipment: 'barbell', description: 'Full body pull exercise' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', category: 'back', equipment: 'machine', description: 'Lat width exercise' },
  { id: 't-bar-rows', name: 'T-Bar Rows', category: 'back', equipment: 'machine', description: 'Mid back thickness' },

  // Legs
  { id: 'squats', name: 'Squats', category: 'legs', equipment: 'barbell', description: 'King of leg exercises' },
  { id: 'lunges', name: 'Lunges', category: 'legs', equipment: 'dumbbell', description: 'Unilateral leg exercise' },
  { id: 'leg-press', name: 'Leg Press', category: 'legs', equipment: 'machine', description: 'Machine leg press' },
  { id: 'calf-raises', name: 'Calf Raises', category: 'legs', equipment: 'machine', description: 'Calf development' },
  { id: 'leg-curls', name: 'Leg Curls', category: 'legs', equipment: 'machine', description: 'Hamstring isolation' },
  { id: 'leg-extensions', name: 'Leg Extensions', category: 'legs', equipment: 'machine', description: 'Quad isolation' },

  // Shoulders
  { id: 'overhead-press', name: 'Overhead Press', category: 'shoulders', equipment: 'barbell', description: 'Shoulder mass builder' },
  { id: 'lateral-raises', name: 'Lateral Raises', category: 'shoulders', equipment: 'dumbbell', description: 'Side delt isolation' },
  { id: 'front-raises', name: 'Front Raises', category: 'shoulders', equipment: 'dumbbell', description: 'Front delt isolation' },
  { id: 'rear-delt-fly', name: 'Rear Delt Fly', category: 'shoulders', equipment: 'dumbbell', description: 'Rear delt isolation' },
  { id: 'arnold-press', name: 'Arnold Press', category: 'shoulders', equipment: 'dumbbell', description: 'Rotational shoulder press' },

  // Arms
  { id: 'bicep-curls', name: 'Bicep Curls', category: 'arms', equipment: 'dumbbell', description: 'Classic bicep exercise' },
  { id: 'tricep-extensions', name: 'Tricep Extensions', category: 'arms', equipment: 'cable', description: 'Tricep isolation' },
  { id: 'hammer-curls', name: 'Hammer Curls', category: 'arms', equipment: 'dumbbell', description: 'Brachialis focus' },
  { id: 'skull-crushers', name: 'Skull Crushers', category: 'arms', equipment: 'barbell', description: 'Lying tricep extension' },
  { id: 'preacher-curls', name: 'Preacher Curls', category: 'arms', equipment: 'barbell', description: 'Strict bicep curls' },
  { id: 'tricep-dips', name: 'Tricep Dips', category: 'arms', equipment: 'bodyweight', description: 'Bodyweight tricep exercise' },

  // Core
  { id: 'plank', name: 'Plank', category: 'core', equipment: 'bodyweight', description: 'Isometric core hold' },
  { id: 'crunches', name: 'Crunches', category: 'core', equipment: 'bodyweight', description: 'Upper ab exercise' },
  { id: 'leg-raises', name: 'Leg Raises', category: 'core', equipment: 'bodyweight', description: 'Lower ab exercise' },
  { id: 'russian-twists', name: 'Russian Twists', category: 'core', equipment: 'bodyweight', description: 'Oblique exercise' },
  { id: 'hanging-knee-raises', name: 'Hanging Knee Raises', category: 'core', equipment: 'bodyweight', description: 'Advanced core exercise' },

  // Cardio
  { id: 'running', name: 'Running', category: 'cardio', equipment: 'bodyweight', description: 'Outdoor or treadmill' },
  { id: 'cycling', name: 'Cycling', category: 'cardio', equipment: 'machine', description: 'Stationary or outdoor' },
  { id: 'jump-rope', name: 'Jump Rope', category: 'cardio', equipment: 'bodyweight', description: 'High intensity cardio' },
  { id: 'burpees', name: 'Burpees', category: 'cardio', equipment: 'bodyweight', description: 'Full body cardio' },
  { id: 'rowing', name: 'Rowing', category: 'cardio', equipment: 'machine', description: 'Full body cardio' },
];

export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find(e => e.id === id);
};

export const getExercisesByCategory = (category: string): Exercise[] => {
  return exercises.filter(e => e.category === category);
};

export const categories = [
  { id: 'chest', name: 'Chest', color: '#FF6B6B' },
  { id: 'back', name: 'Back', color: '#4ECDC4' },
  { id: 'legs', name: 'Legs', color: '#45B7D1' },
  { id: 'shoulders', name: 'Shoulders', color: '#96CEB4' },
  { id: 'arms', name: 'Arms', color: '#FFEAA7' },
  { id: 'core', name: 'Core', color: '#DDA0DD' },
  { id: 'cardio', name: 'Cardio', color: '#98D8C8' },
] as const;
