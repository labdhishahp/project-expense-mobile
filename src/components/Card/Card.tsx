import { useMemo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { radius, shadows, spacing, useTheme } from '../../theme';

type CardProps = ViewProps & {
  elevated?: boolean;
};

export function Card({
  elevated = true,
  style,
  children,
  ...props
}: CardProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          padding: spacing.md,
        },
      }),
    [colors],
  );

  return (
    <View style={[styles.card, elevated && shadows.sm, style]} {...props}>
      {children}
    </View>
  );
}
