import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WorkoutEntry } from '../types';
import { useTheme } from '../context/ThemeContext';
import { getExerciseById } from '../data/exercises';
import { formatDisplayDate } from '../utils/date';

interface WorkoutCardProps {
  entry: WorkoutEntry;
  onPress?: () => void;
  showDate?: boolean;
}

export function WorkoutCard({ entry, onPress, showDate = false }: WorkoutCardProps) {
  const { colors } = useTheme();
  const exercise = getExerciseById(entry.exerciseId);

  const totalSets = entry.sets.length;
  const completedSets = entry.sets.filter(s => s.completed).length;
  const totalVolume = entry.sets.reduce((sum, s) =>
    s.completed ? sum + (s.reps * s.weight) : sum, 0
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.exerciseName, { color: colors.text }]}>
            {exercise?.name || 'Unknown Exercise'}
          </Text>
          {showDate && (
            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {formatDisplayDate(entry.date)}
            </Text>
          )}
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.categoryText, { color: colors.primary }]}>
            {exercise?.category || 'unknown'}
          </Text>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {completedSets}/{totalSets}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            sets
          </Text>
        </View>

        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {totalVolume > 0 ? totalVolume.toLocaleString() : '-'}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            volume
          </Text>
        </View>

        {entry.notes && (
          <View style={[styles.notes, { backgroundColor: colors.background }]}>
            <Text
              style={[styles.notesText, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {entry.notes}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
  },
  date: {
    fontSize: 13,
    marginTop: 2,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  stat: {
    marginRight: 24,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  notes: {
    flex: 1,
    minWidth: 100,
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  notesText: {
    fontSize: 13,
  },
});
