import { useMemo } from 'react';
import { StyleSheet, Text, View, type ViewProps } from 'react-native';

import { radius, spacing, typography, useTheme } from '../../theme';

type PlaceholderBoxProps = ViewProps & {
  label: string;
};

export function PlaceholderBox({ label, style, ...props }: PlaceholderBoxProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.border,
          borderStyle: 'dashed',
          backgroundColor: colors.surface,
          padding: spacing.lg,
        },
        label: {
          ...typography.caption,
          color: colors.textMuted,
          textAlign: 'center',
        },
      }),
    [colors],
  );

  return (
    <View style={[styles.container, style]} {...props}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}
