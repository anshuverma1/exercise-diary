import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Exercise } from '../types';
import { useTheme } from '../context/ThemeContext';
import { categories } from '../data/exercises';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress?: () => void;
  selected?: boolean;
}

export function ExerciseCard({ exercise, onPress, selected }: ExerciseCardProps) {
  const { colors } = useTheme();
  const category = categories.find(c => c.id === exercise.category);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: selected ? colors.primary : colors.border,
          borderWidth: selected ? 2 : 1,
        },
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.text }]}>
            {exercise.name}
          </Text>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: category?.color + '20' || colors.primaryLight },
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                { color: category?.color || colors.primary },
              ]}
            >
              {exercise.category}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.equipment, { color: colors.textSecondary }]}>
            {exercise.equipment}
          </Text>
          {exercise.description && (
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {exercise.description}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  equipment: {
    fontSize: 13,
    textTransform: 'capitalize',
    marginRight: 8,
  },
  description: {
    fontSize: 13,
    flex: 1,
  },
});
