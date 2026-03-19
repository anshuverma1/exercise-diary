import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { useWorkout } from '../../src/context/WorkoutContext';
import { ThemedView, ThemedText } from '../../src/components/Themed';
import { WorkoutCard } from '../../src/components/WorkoutCard';
import {
  getToday,
  getMonthName,
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDate,
} from '../../src/utils/date';

export default function CalendarScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { entries, getTotalVolume, getWorkoutStreak, isLoading } = useWorkout();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [refreshing, setRefreshing] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(getToday());
  };

  const selectDate = (day: number) => {
    const dateStr = formatDate(new Date(year, month, day));
    setSelectedDate(dateStr);
  };

  const openWorkout = () => {
    router.push(`/workout/${selectedDate}`);
  };

  const getEntriesForDate = (dateStr: string) => {
    return entries.filter((e) => e.date === dateStr);
  };

  const hasWorkout = (dateStr: string) => {
    return getEntriesForDate(dateStr).length > 0;
  };

  const selectedEntries = getEntriesForDate(selectedDate);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendarDays = () => {
    const days = [];
    const today = getToday();

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(new Date(year, month, day));
      const isSelected = selectedDate === dateStr;
      const isToday = today === dateStr;
      const hasWorkoutOnDay = hasWorkout(dateStr);

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isSelected && { backgroundColor: colors.primary },
            isToday && !isSelected && { borderColor: colors.primary, borderWidth: 2 },
          ]}
          onPress={() => selectDate(day)}
        >
          <Text
            style={[
              styles.dayText,
              { color: isSelected ? '#FFFFFF' : colors.text },
              isToday && !isSelected && { fontWeight: '700' },
            ]}
          >
            {day}
          </Text>
          {hasWorkoutOnDay && (
            <View
              style={[
                styles.workoutDot,
                { backgroundColor: isSelected ? '#FFFFFF' : colors.success },
              ]}
            />
          )}
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText variant="title">Exercise Diary</ThemedText>
            <ThemedText variant="subtitle">Track your workouts</ThemedText>
          </View>
          <TouchableOpacity
            style={[styles.themeButton, { backgroundColor: colors.surface }]}
            onPress={goToToday}
          >
            <Text style={{ color: colors.primary, fontWeight: '600' }}>Today</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {getWorkoutStreak()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Day Streak
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {entries.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Total Workouts
            </Text>
          </View>
        </View>

        {/* Calendar */}
        <View style={[styles.calendarCard, { backgroundColor: colors.surface }]}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={goToPreviousMonth}>
              <Text style={[styles.navArrow, { color: colors.text }]}>‹</Text>
            </TouchableOpacity>
            <Text style={[styles.monthTitle, { color: colors.text }]}>
              {getMonthName(month)} {year}
            </Text>
            <TouchableOpacity onPress={goToNextMonth}>
              <Text style={[styles.navArrow, { color: colors.text }]}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dayNamesRow}>
            {dayNames.map((day) => (
              <Text
                key={day}
                style={[styles.dayName, { color: colors.textSecondary }]}
              >
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>{renderCalendarDays()}</View>
        </View>

        {/* Selected Date Section */}
        <View style={styles.selectedSection}>
          <View style={styles.selectedHeader}>
            <ThemedText variant="subtitle">
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </ThemedText>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={openWorkout}
            >
              <Text style={styles.addButtonText}>+ Add Workout</Text>
            </TouchableOpacity>
          </View>

          {selectedEntries.length > 0 && (
            <View style={styles.volumeCard}>
              <Text style={[styles.volumeLabel, { color: colors.textSecondary }]}>
                Total Volume
              </Text>
              <Text style={[styles.volumeValue, { color: colors.text }]}>
                {getTotalVolume(selectedDate).toLocaleString()} kg
              </Text>
            </View>
          )}

          {selectedEntries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No workouts for this day
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Tap "Add Workout" to get started
              </Text>
            </View>
          ) : (
            selectedEntries.map((entry) => (
              <WorkoutCard
                key={entry.id}
                entry={entry}
                onPress={() => router.push(`/workout/${selectedDate}`)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  themeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  calendarCard: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navArrow: {
    fontSize: 28,
    paddingHorizontal: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  dayText: {
    fontSize: 14,
  },
  workoutDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  selectedSection: {
    padding: 16,
    paddingBottom: 40,
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  volumeCard: {
    marginBottom: 16,
  },
  volumeLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  volumeValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
});
