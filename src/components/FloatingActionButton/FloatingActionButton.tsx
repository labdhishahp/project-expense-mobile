import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, shadows, spacing, typography } from '../../theme';

type FloatingActionButtonProps = {
  onPress?: () => void;
};

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add transaction"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.label}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...typography.sectionTitle,
    color: colors.textInverse,
    lineHeight: 28,
  },
});
