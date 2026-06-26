import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_DISPLAY_NAME, USER_FIRST_NAME } from '../../constants';
import { spacing, typography, useTheme } from '../../theme';
import { getGreeting } from '../../utils/greeting';

type HomeHeaderProps = {
  onToggleTheme: () => void;
  themeIcon: string;
};

export function HomeHeader({ onToggleTheme, themeIcon }: HomeHeaderProps) {
  const { colors } = useTheme();
  const greeting = useMemo(() => getGreeting(USER_FIRST_NAME), []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginBottom: spacing.lg,
        },
        topRow: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        },
        greeting: {
          ...typography.body,
          color: colors.textSecondary,
          flex: 1,
          paddingRight: spacing.sm,
        },
        themeButton: {
          width: 36,
          height: 36,
          alignItems: 'center',
          justifyContent: 'center',
        },
        themeIcon: {
          fontSize: 22,
          lineHeight: 26,
        },
        appName: {
          ...typography.screenTitle,
          color: colors.text,
          marginTop: spacing.xs,
        },
      }),
    [colors],
  );

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Toggle theme"
          hitSlop={8}
          onPress={onToggleTheme}
          style={({ pressed }) => [styles.themeButton, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.themeIcon}>{themeIcon}</Text>
        </Pressable>
      </View>
      <Text style={styles.appName}>{APP_DISPLAY_NAME}</Text>
    </View>
  );
}
