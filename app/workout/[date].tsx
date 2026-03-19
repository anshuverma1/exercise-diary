import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { useWorkout } from '../../src/context/WorkoutContext';
import { ThemedView, ThemedText } from '../../src/components/Themed';
import { SetInput } from '../../src/components/SetInput';
import { ExerciseCard } from '../../src/components/ExerciseCard';
import { WorkoutSet, WorkoutEntry } from '../../src/types';
import { exercises } from '../../src/data/exercises';
import { formatDisplayDate } from '../../src/utils/date';

export default function WorkoutScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { entries, addEntry, updateEntry, deleteEntry, getEntriesByDate } =
    useWorkout();

  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [notes, setNotes] = useState('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const existingEntries = getEntriesByDate(date);

  const generateSetId = () =>
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addSet = () => {
    const newSet: WorkoutSet = {
      id: generateSetId(),
      reps: 0,
      weight: 0,
      completed: false,
    };
    setSets([...sets, newSet]);
  };

  const updateSet = (setId: string, updates: Partial<WorkoutSet>) => {
    setSets(sets.map((s) => (s.id === setId ? { ...s, ...updates } : s)));
  };

  const deleteSet = (setId: string) => {
    setSets(sets.filter((s) => s.id !== setId));
  };

  const selectExercise = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setShowExerciseModal(false);
    setSets([
      { id: generateSetId(), reps: 10, weight: 0, completed: false },
    ]);
  };

  const saveWorkout = () => {
    if (!selectedExercise || sets.length === 0) return;

    const validSets = sets.filter((s) => s.reps > 0);
    if (validSets.length === 0) return;

    if (editingEntryId) {
      updateEntry(editingEntryId, {
        exerciseId: selectedExercise,
        sets: validSets,
        notes: notes || undefined,
      });
    } else {
      addEntry({
        date,
        exerciseId: selectedExercise,
        sets: validSets,
        notes: notes || undefined,
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setSelectedExercise(null);
    setSets([]);
    setNotes('');
    setEditingEntryId(null);
  };

  const editEntry = (entry: WorkoutEntry) => {
    setEditingEntryId(entry.id);
    setSelectedExercise(entry.exerciseId);
    setSets([...entry.sets]);
    setNotes(entry.notes || '');
  };

  const cancelEdit = () => {
    resetForm();
  };

  const filteredExercises = exercises.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedExerciseData = exercises.find((e) => e.id === selectedExercise);

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.backButton, { color: colors.primary }]}> Back</Text>
          </TouchableOpacity>
          <ThemedText variant="title">{formatDisplayDate(date)}</ThemedText>
          <ThemedText variant="subtitle">
            {existingEntries.length} exercise
            {existingEntries.length !== 1 ? 's' : ''} logged
          </ThemedText>
        </View>

        {/* Existing Entries */}
        {existingEntries.length > 0 && !editingEntryId && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Today's Workouts
            </Text>
            {existingEntries.map((entry) => {
              const exercise = exercises.find((e) => e.id === entry.exerciseId);
              const completedSets = entry.sets.filter((s) => s.completed).length;
              const totalVolume = entry.sets.reduce(
                (sum, s) => (s.completed ? sum + s.reps * s.weight : sum),
                0
              );

              return (
                <TouchableOpacity
                  key={entry.id}
                  style={[
                    styles.entryCard,
                    { backgroundColor: colors.surface },
                  ]}
                  onPress={() => editEntry(entry)}
                >
                  <View style={styles.entryHeader}>
                    <Text style={[styles.entryName, { color: colors.text }]}>
                      {exercise?.name || 'Unknown'}
                    </Text>
                    <TouchableOpacity
                      onPress={() => deleteEntry(entry.id)}
                      style={styles.deleteButton}
                    >
                      <Text style={{ color: colors.error }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={[styles.entryStats, { color: colors.textSecondary }]}
                  >
                    {completedSets}/{entry.sets.length} sets •{' '}
                    {totalVolume > 0
                      ? `${totalVolume.toLocaleString()} kg`
                      : 'No volume'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Add/Edit Form */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {editingEntryId ? 'Edit Exercise' : 'Add Exercise'}
          </Text>

          {/* Exercise Selection */}
          {!selectedExercise ? (
            <TouchableOpacity
              style={[
                styles.selectButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setShowExerciseModal(true)}
            >
              <Text style={[styles.selectButtonText, { color: colors.text }]}>
                + Select Exercise
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              style={[
                styles.selectedExercise,
                { backgroundColor: colors.surface },
              ]}
            >
              <View style={styles.selectedHeader}>
                <Text style={[styles.selectedName, { color: colors.text }]}>
                  {selectedExerciseData?.name}
                </Text>
                <TouchableOpacity onPress={() => setSelectedExercise(null)}>
                  <Text style={{ color: colors.error }}>Change</Text>
                </TouchableOpacity>
              </View>
              <Text
                style={[styles.selectedCategory, { color: colors.textSecondary }]}
              >
                {selectedExerciseData?.category} • {selectedExerciseData?.equipment}
              </Text>
            </View>
          )}

          {/* Sets */}
          {selectedExercise && (
            <>
              <View style={styles.setsHeader}>
                <Text style={[styles.setsTitle, { color: colors.text }]}>
                  Sets
                </Text>
                <TouchableOpacity
                  style={[styles.addSetButton, { backgroundColor: colors.primary }]}
                  onPress={addSet}
                >
                  <Text style={styles.addSetText}>+ Add Set</Text>
                </TouchableOpacity>
              </View>

              {sets.map((set, index) => (
                <SetInput
                  key={set.id}
                  set={set}
                  index={index}
                  onUpdate={(updated) => updateSet(set.id, updated)}
                  onDelete={() => deleteSet(set.id)}
                />
              ))}

              {/* Notes */}
              <View style={styles.notesContainer}>
                <Text style={[styles.notesLabel, { color: colors.textSecondary }]}>
                  Notes (optional)
                </Text>
                <TextInput
                  style={[
                    styles.notesInput,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add notes..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[
                    styles.cancelButton,
                    { backgroundColor: colors.surface },
                  ]}
                  onPress={editingEntryId ? cancelEdit : () => router.back()}
                >
                  <Text style={{ color: colors.text, fontWeight: '600' }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={saveWorkout}
                  disabled={sets.length === 0}
                >
                  <Text style={styles.saveButtonText}>
                    {editingEntryId ? 'Update' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Exercise Selection Modal */}
      <Modal
        visible={showExerciseModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Exercise
            </Text>
            <TouchableOpacity onPress={() => setShowExerciseModal(false)}>
              <Text style={[styles.closeButton, { color: colors.primary }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={[
              styles.modalSearch,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Search exercises..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />

          <ScrollView>
            {filteredExercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                onPress={() => selectExercise(exercise.id)}
              >
                <ExerciseCard exercise={exercise} />
              </TouchableOpacity>
            ))}
            <View style={styles.bottomPadding} />
          </ScrollView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  entryCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 4,
  },
  entryStats: {
    fontSize: 14,
  },
  selectButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedExercise: {
    borderRadius: 12,
    padding: 16,
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedName: {
    fontSize: 18,
    fontWeight: '600',
  },
  selectedCategory: {
    fontSize: 14,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  setsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  setsTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  addSetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addSetText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  notesContainer: {
    marginTop: 20,
  },
  notesLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  bottomPadding: {
    height: 40,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalSearch: {
    margin: 16,
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});
