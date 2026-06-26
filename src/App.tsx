import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastProvider } from './components/Toast';
import { runDatabaseSmokeTest } from './dev';
import { initializeDatabase } from './database/sqlite';
import { RootNavigator } from './navigation';
import { ThemeProvider, useTheme } from './theme';

function AppShell() {
  const { mode } = useTheme();

  return (
    <>
      <RootNavigator />
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

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
        <ThemeProvider>
          <ToastProvider>
            <AppShell />
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
