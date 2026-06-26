import { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { radius, spacing, typography, useTheme } from '../../theme';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  emphasis?: boolean;
};

export function TextField({
  label,
  error,
  emphasis = false,
  style,
  ...props
}: TextFieldProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginBottom: spacing.md,
        },
        label: {
          ...(emphasis ? typography.body : typography.caption),
          fontSize: emphasis ? 17 : typography.caption.fontSize,
          lineHeight: emphasis ? 24 : typography.caption.lineHeight,
          color: colors.textSecondary,
          marginBottom: spacing.xs,
          fontWeight: '600',
        },
        input: {
          ...typography.body,
          fontSize: emphasis ? 18 : typography.body.fontSize,
          lineHeight: emphasis ? 26 : typography.body.lineHeight,
          color: colors.text,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: error ? colors.error : colors.border,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm + 2,
        },
        error: {
          ...typography.caption,
          color: colors.error,
          marginTop: spacing.xs,
        },
      }),
    [colors, emphasis, error],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
