import { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, spacing, typography, useTheme } from '../../theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  emphasis?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
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
          opacity: disabled || loading ? 0.5 : 1,
        },
        content: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
        },
        label: {
          ...typography.body,
          fontSize: emphasis ? 18 : typography.body.fontSize,
          lineHeight: emphasis ? 26 : typography.body.lineHeight,
          color: colors.textInverse,
          fontWeight: '700',
        },
      }),
    [colors, disabled, emphasis, loading],
  );

  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && !isDisabled && { opacity: 0.85 }]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={colors.textInverse} size="small" />
        ) : null}
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
}
