import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { WorkoutSet } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SetInputProps {
  set: WorkoutSet;
  onUpdate: (set: WorkoutSet) => void;
  onDelete: () => void;
  index: number;
}

export function SetInput({ set, onUpdate, onDelete, index }: SetInputProps) {
  const { colors } = useTheme();

  const updateField = (field: keyof WorkoutSet, value: string | boolean) => {
    if (field === 'completed') {
      onUpdate({ ...set, [field]: value });
    } else {
      const numValue = parseFloat(value) || 0;
      onUpdate({ ...set, [field]: numValue });
    }
  };

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <Text style={[styles.setNumber, { color: colors.textSecondary }]}>
        {index + 1}
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Reps</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          value={set.reps > 0 ? set.reps.toString() : ''}
          onChangeText={(value) => updateField('reps', value)}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Weight</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          value={set.weight > 0 ? set.weight.toString() : ''}
          onChangeText={(value) => updateField('weight', value)}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <TouchableOpacity
        onPress={() => updateField('completed', !set.completed)}
        style={[
          styles.checkButton,
          {
            backgroundColor: set.completed ? colors.success : colors.surface,
            borderColor: set.completed ? colors.success : colors.border,
          },
        ]}
      >
        <Text
          style={{
            color: set.completed ? '#FFFFFF' : colors.textSecondary,
            fontSize: 12,
            fontWeight: '600',
          }}
        >
          ✓
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Text style={{ color: colors.error, fontSize: 18 }}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  setNumber: {
    width: 30,
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  label: {
    fontSize: 11,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  checkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  deleteButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
