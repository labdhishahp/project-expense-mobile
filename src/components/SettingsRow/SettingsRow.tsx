import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useTheme } from '../../theme';

type SettingsRowProps = {
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  disabled?: boolean;
  isLast?: boolean;
};

export function SettingsRow({
  title,
  subtitle,
  value,
  onPress,
  showChevron = Boolean(onPress),
  disabled = false,
  isLast = false,
}: SettingsRowProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          opacity: disabled ? 0.55 : 1,
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: colors.divider,
        },
        content: {
          flex: 1,
        },
        title: {
          ...typography.body,
          color: colors.text,
          fontWeight: '500',
        },
        subtitle: {
          ...typography.caption,
          color: colors.textSecondary,
          marginTop: 2,
        },
        value: {
          ...typography.body,
          color: colors.textSecondary,
          marginRight: showChevron ? spacing.xs : 0,
        },
      }),
    [colors, disabled, isLast, showChevron],
  );

  const content = (
    <>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {value ? <Text style={styles.value}>{value}</Text> : null}
      {showChevron && onPress ? (
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      ) : null}
    </>
  );

  if (!onPress || disabled) {
    return <View style={styles.row}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.75 }]}
    >
      {content}
    </Pressable>
  );
}
