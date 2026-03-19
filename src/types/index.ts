export type ExerciseCategory = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'cardio';
export type Equipment = 'bodyweight' | 'dumbbell' | 'barbell' | 'machine' | 'cable';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  equipment: Equipment;
  description?: string;
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutEntry {
  id: string;
  date: string;
  exerciseId: string;
  sets: WorkoutSet[];
  notes?: string;
}

export type ThemePreference = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryLight: string;
  border: string;
  success: string;
  error: string;
}
