import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutEntry, WorkoutSet } from '../types';
import { getToday } from '../utils/date';

const STORAGE_KEY = 'workout_entries';

interface WorkoutContextType {
  entries: WorkoutEntry[];
  addEntry: (entry: Omit<WorkoutEntry, 'id'>) => void;
  updateEntry: (id: string, entry: Partial<WorkoutEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntriesByDate: (date: string) => WorkoutEntry[];
  getEntriesByDateRange: (startDate: string, endDate: string) => WorkoutEntry[];
  getExerciseHistory: (exerciseId: string) => WorkoutEntry[];
  getTotalVolume: (date: string) => number;
  getWorkoutStreak: () => number;
  isLoading: boolean;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setEntries(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load workout entries:', error);
    }
    setIsLoading(false);
  };

  const saveEntries = async (newEntries: WorkoutEntry[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
    } catch (error) {
      console.error('Failed to save workout entries:', error);
    }
  };

  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const addEntry = (entry: Omit<WorkoutEntry, 'id'>) => {
    const newEntry: WorkoutEntry = {
      ...entry,
      id: generateId(),
    };
    const newEntries = [...entries, newEntry];
    setEntries(newEntries);
    saveEntries(newEntries);
  };

  const updateEntry = (id: string, updates: Partial<WorkoutEntry>) => {
    const newEntries = entries.map(entry =>
      entry.id === id ? { ...entry, ...updates } : entry
    );
    setEntries(newEntries);
    saveEntries(newEntries);
  };

  const deleteEntry = (id: string) => {
    const newEntries = entries.filter(entry => entry.id !== id);
    setEntries(newEntries);
    saveEntries(newEntries);
  };

  const getEntriesByDate = (date: string) => {
    return entries.filter(entry => entry.date === date);
  };

  const getEntriesByDateRange = (startDate: string, endDate: string) => {
    return entries.filter(entry => entry.date >= startDate && entry.date <= endDate);
  };

  const getExerciseHistory = (exerciseId: string) => {
    return entries
      .filter(entry => entry.exerciseId === exerciseId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getTotalVolume = (date: string) => {
    return entries
      .filter(entry => entry.date === date)
      .reduce((total, entry) => {
        return total + entry.sets.reduce((setTotal, set) => {
          return set.completed ? setTotal + (set.reps * set.weight) : setTotal;
        }, 0);
      }, 0);
  };

  const getWorkoutStreak = () => {
    if (entries.length === 0) return 0;

    const uniqueDates = [...new Set(entries.map(e => e.date))].sort().reverse();
    const today = getToday();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let streak = 0;
    let currentDate = today;

    // Check if worked out today or yesterday to start streak
    if (!uniqueDates.includes(today) && !uniqueDates.includes(yesterdayStr)) {
      return 0;
    }

    if (uniqueDates.includes(today)) {
      streak = 1;
      currentDate = yesterdayStr;
    } else {
      currentDate = yesterdayStr;
    }

    // Count consecutive days
    for (let i = 0; i < uniqueDates.length; i++) {
      if (uniqueDates[i] === currentDate) {
        streak++;
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        currentDate = prevDate.toISOString().split('T')[0];
      } else if (uniqueDates[i] < currentDate) {
        break;
      }
    }

    return streak;
  };

  return (
    <WorkoutContext.Provider value={{
      entries,
      addEntry,
      updateEntry,
      deleteEntry,
      getEntriesByDate,
      getEntriesByDateRange,
      getExerciseHistory,
      getTotalVolume,
      getWorkoutStreak,
      isLoading,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}
