import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useWorkout } from '../../src/context/WorkoutContext';
import { ThemedView, ThemedText } from '../../src/components/Themed';
import { getExerciseById, categories } from '../../src/data/exercises';
import { getToday, formatDate, parseDate } from '../../src/utils/date';

export default function StatsScreen() {
  const { colors } = useTheme();
  const { entries, getWorkoutStreak, getTotalVolume } = useWorkout();

  const stats = useMemo(() => {
    const today = getToday();
    const thirtyDaysAgo = formatDate(
      new Date(new Date().setDate(new Date().getDate() - 30))
    );
    const sevenDaysAgo = formatDate(
      new Date(new Date().setDate(new Date().getDate() - 7))
    );

    // Total workouts
    const totalWorkouts = entries.length;

    // Workouts this month
    const workoutsThisMonth = entries.filter(
      (e) => e.date >= thirtyDaysAgo
    ).length;

    // Workouts this week
    const workoutsThisWeek = entries.filter(
      (e) => e.date >= sevenDaysAgo
    ).length;

    // Total volume all time
    const totalVolume = entries.reduce(
      (sum, entry) =>
        sum +
        entry.sets.reduce(
          (setSum, set) => (set.completed ? setSum + set.reps * set.weight : setSum),
          0
        ),
      0
    );

    // Volume this week
    const volumeThisWeek = entries
      .filter((e) => e.date >= sevenDaysAgo)
      .reduce(
        (sum, entry) =>
          sum +
          entry.sets.reduce(
            (setSum, set) => (set.completed ? setSum + set.reps * set.weight : setSum),
            0
          ),
        0
      );

    // Most trained category
    const categoryCounts: Record<string, number> = {};
    entries.forEach((entry) => {
      const exercise = getExerciseById(entry.exerciseId);
      if (exercise) {
        categoryCounts[exercise.category] =
          (categoryCounts[exercise.category] || 0) + 1;
      }
    });

    const topCategory = Object.entries(categoryCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];

    // Most performed exercise
    const exerciseCounts: Record<string, number> = {};
    entries.forEach((entry) => {
      exerciseCounts[entry.exerciseId] =
        (exerciseCounts[entry.exerciseId] || 0) + 1;
    });

    const topExercise = Object.entries(exerciseCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];

    // Total sets completed
    const totalSets = entries.reduce(
      (sum, entry) => sum + entry.sets.filter((s) => s.completed).length,
      0
    );

    // Average workouts per week (all time)
    const uniqueDates = [...new Set(entries.map((e) => e.date))];
    const firstWorkout =
      uniqueDates.length > 0
        ? new Date(Math.min(...uniqueDates.map((d) => new Date(d).getTime())))
        : null;
    const weeksSinceStart = firstWorkout
      ? Math.max(
          1,
          Math.ceil(
            (new Date().getTime() - firstWorkout.getTime()) /
              (1000 * 60 * 60 * 24 * 7)
          )
        )
      : 1;
    const avgWorkoutsPerWeek = uniqueDates.length / weeksSinceStart;

    return {
      totalWorkouts,
      workoutsThisMonth,
      workoutsThisWeek,
      totalVolume,
      volumeThisWeek,
      topCategory: topCategory
        ? {
            name: topCategory[0],
            count: topCategory[1],
            color:
              categories.find((c) => c.id === topCategory[0])?.color || colors.primary,
          }
        : null,
      topExercise: topExercise
        ? {
            name: getExerciseById(topExercise[0])?.name || 'Unknown',
            count: topExercise[1],
          }
        : null,
      totalSets,
      avgWorkoutsPerWeek: Math.round(avgWorkoutsPerWeek * 10) / 10,
      streak: getWorkoutStreak(),
    };
  }, [entries, colors.primary, getWorkoutStreak]);

  const StatCard = ({
    title,
    value,
    subtitle,
    color,
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
      <Text style={[styles.statTitle, { color: colors.textSecondary }]}>
        {title}
      </Text>
      <Text style={[styles.statValue, { color: color || colors.primary }]}>
        {value}
      </Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <ThemedText variant="title">Statistics</ThemedText>
          <ThemedText variant="subtitle">Your workout journey</ThemedText>
        </View>

        {/* Streak Card */}
        <View style={[styles.streakCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakValue}>{stats.streak}</Text>
          <Text style={styles.streakLabel}>Day Streak</Text>
          <Text style={styles.streakSubtext}>
            {stats.streak > 0
              ? 'Keep it up! Consistency is key.'
              : 'Start your streak today!'}
          </Text>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.grid}>
          <StatCard
            title="Total Workouts"
            value={stats.totalWorkouts}
            subtitle={`${stats.workoutsThisMonth} this month`}
          />
          <StatCard
            title="This Week"
            value={stats.workoutsThisWeek}
            subtitle="workouts"
          />
        </View>

        <View style={styles.grid}>
          <StatCard
            title="Total Volume"
            value={`${(stats.totalVolume / 1000).toFixed(1)}k`}
            subtitle="kg lifted"
          />
          <StatCard
            title="Sets Completed"
            value={stats.totalSets}
            subtitle="all time"
          />
        </View>

        {/* Weekly Average */}
        <View style={[styles.detailCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.detailTitle, { color: colors.text }]}>
            Weekly Average
          </Text>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Workouts per week
            </Text>
            <Text style={[styles.detailValue, { color: colors.primary }]}>
              {stats.avgWorkoutsPerWeek}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Volume this week
            </Text>
            <Text style={[styles.detailValue, { color: colors.primary }]}>
              {stats.volumeThisWeek.toLocaleString()} kg
            </Text>
          </View>
        </View>

        {/* Top Category */}
        {stats.topCategory && (
          <View style={[styles.detailCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.detailTitle, { color: colors.text }]}>
              Most Trained
            </Text>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                Category
              </Text>
              <View style={styles.tagContainer}>
                <View
                  style={[
                    styles.tag,
                    { backgroundColor: stats.topCategory.color + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      { color: stats.topCategory.color },
                    ]}
                  >
                    {stats.topCategory.name}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                Times trained
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {stats.topCategory.count}
              </Text>
            </View>
          </View>
        )}

        {/* Top Exercise */}
        {stats.topExercise && (
          <View style={[styles.detailCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.detailTitle, { color: colors.text }]}>
              Favorite Exercise
            </Text>
            <Text style={[styles.favoriteName, { color: colors.primary }]}>
              {stats.topExercise.name}
            </Text>
            <Text style={[styles.favoriteCount, { color: colors.textSecondary }]}>
              Completed {stats.topExercise.count} times
            </Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  streakCard: {
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  streakEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  streakValue: {
    fontSize: 56,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  streakLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 4,
  },
  streakSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  detailCard: {
    margin: 16,
    marginTop: 4,
    borderRadius: 12,
    padding: 16,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  tagContainer: {
    flexDirection: 'row',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  favoriteName: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
  },
  favoriteCount: {
    fontSize: 14,
    marginTop: 4,
  },
  bottomPadding: {
    height: 40,
  },
});
