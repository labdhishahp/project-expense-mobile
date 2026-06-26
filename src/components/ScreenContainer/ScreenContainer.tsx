import { useMemo } from 'react';
import { StyleSheet, Text, View, type ViewProps } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { getTabBarBottomInset } from '../../constants';
import { spacing, typography, useTheme } from '../../theme';

type ScreenContainerProps = ViewProps & {
  title: string;
  subtitle?: string;
};

export function ScreenContainer({
  title,
  subtitle,
  style,
  children,
  ...props
}: ScreenContainerProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        header: {
          paddingHorizontal: spacing.md,
          paddingTop: spacing.lg,
          marginBottom: spacing.md,
        },
        content: {
          flex: 1,
          paddingHorizontal: spacing.md,
          paddingBottom: getTabBarBottomInset(insets.bottom) + spacing.md,
        },
        title: {
          ...typography.screenTitle,
          color: colors.text,
        },
        subtitle: {
          ...typography.body,
          color: colors.textSecondary,
          marginTop: spacing.xs,
        },
      }),
    [colors, insets.bottom],
  );

  return (
    <SafeAreaView style={[styles.container, style]} edges={['top']} {...props}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}
