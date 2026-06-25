import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { runDatabaseSmokeTest } from './dev';
import { initializeDatabase } from './database/sqlite';
import { RootNavigator } from './navigation';

export default function App() {
  useEffect(() => {
    async function bootstrap() {
      await initializeDatabase();

      if (__DEV__) {
        await runDatabaseSmokeTest();
      }
    }

    bootstrap().catch(console.error);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RootNavigator />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
