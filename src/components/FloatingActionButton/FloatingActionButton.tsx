import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, shadows, spacing, typography } from '../../theme';

type FloatingActionButtonProps = {
  onPress?: () => void;
};

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  const insets = useSafeAreaInsets();
  const bottomOffset = spacing.lg + insets.bottom;

  return (
    <View pointerEvents="box-none" style={[styles.wrapper, { bottom: bottomOffset }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add transaction"
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.label}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
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
