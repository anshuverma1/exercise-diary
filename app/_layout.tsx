import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../src/context/ThemeContext';
import { WorkoutProvider } from '../src/context/WorkoutContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <WorkoutProvider>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="workout/[date]"
              options={{
                presentation: 'modal',
                headerShown: true,
                headerTitle: 'Workout',
              }}
            />
          </Stack>
        </WorkoutProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
