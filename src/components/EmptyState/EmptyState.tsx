import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing, typography, useTheme } from '../../theme';

type EmptyStateProps = {
  message?: string;
  subtitle?: string;
  compact?: boolean;
};

export function EmptyState({
  message = 'No transactions yet',
  subtitle,
  compact = false,
}: EmptyStateProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: compact ? spacing.md : spacing.xl,
          paddingHorizontal: spacing.lg,
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
        },
        message: {
          ...typography.body,
          color: colors.textMuted,
          textAlign: 'center',
          lineHeight: compact ? 20 : 22,
          fontWeight: subtitle ? '600' : '400',
        },
        subtitle: {
          ...typography.caption,
          color: colors.textMuted,
          textAlign: 'center',
          marginTop: spacing.xs,
          lineHeight: 20,
        },
      }),
    [colors, compact, subtitle],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}
