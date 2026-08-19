import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { migrateDatabase } from '@/db/workouts';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <>
      <SQLiteProvider databaseName="vital.db" onInit={migrateDatabase}>
        <Stack screenOptions={{ headerShown: false }} />
      </SQLiteProvider>
      <AnimatedSplashOverlay />
    </>
  );
}
