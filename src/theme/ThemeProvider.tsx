import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Animated, StyleSheet } from 'react-native';

import { themes, type ThemeColors, type ThemeMode } from './colors';

const THEME_STORAGE_KEY = '@expense-mobile/theme-mode';

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  isReady: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [isReady, setIsReady] = useState(false);
  const [transition] = useState(() => new Animated.Value(1));

  useEffect(() => {
    async function loadTheme() {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') {
          setMode(stored);
        }
      } catch {
        setMode('light');
      } finally {
        setIsReady(true);
      }
    }

    void loadTheme();
  }, []);

  const persistTheme = useCallback(async (nextMode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
    } catch {
      // Preference save failure should not block theme switching.
    }
  }, []);

  const animateThemeChange = useCallback(
    (nextMode: ThemeMode) => {
      transition.setValue(0.92);
      setMode(nextMode);
      void persistTheme(nextMode);

      Animated.timing(transition, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    },
    [persistTheme, transition],
  );

  const toggleTheme = useCallback(() => {
    animateThemeChange(mode === 'light' ? 'dark' : 'light');
  }, [animateThemeChange, mode]);

  const setTheme = useCallback(
    (nextMode: ThemeMode) => {
      if (nextMode !== mode) {
        animateThemeChange(nextMode);
      }
    },
    [animateThemeChange, mode],
  );

  const colors = themes[mode];

  const value = useMemo(
    () => ({
      mode,
      colors,
      isReady,
      toggleTheme,
      setTheme,
    }),
    [mode, colors, isReady, toggleTheme, setTheme],
  );

  if (!isReady) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      <Animated.View
        style={[
          styles.root,
          {
            backgroundColor: colors.background,
            opacity: transition,
            transform: [
              {
                scale: transition.interpolate({
                  inputRange: [0.92, 1],
                  outputRange: [0.985, 1],
                }),
              },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
