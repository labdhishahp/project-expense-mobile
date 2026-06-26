import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { radius, spacing, typography, useTheme } from '../../theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  emphasis?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  emphasis = false,
}: PrimaryButtonProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        button: {
          backgroundColor: colors.primary,
          borderRadius: radius.md,
          paddingVertical: spacing.sm + 4,
          alignItems: 'center',
          opacity: disabled ? 0.5 : 1,
        },
        label: {
          ...typography.body,
          fontSize: emphasis ? 18 : typography.body.fontSize,
          lineHeight: emphasis ? 26 : typography.body.lineHeight,
          color: colors.textInverse,
          fontWeight: '700',
        },
      }),
    [colors, disabled, emphasis],
  );

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && !disabled && { opacity: 0.85 }]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
