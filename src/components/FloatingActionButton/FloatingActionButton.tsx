import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getFabBottomOffset } from '../../constants';
import { radius, shadows, spacing, typography, useTheme } from '../../theme';

type FloatingActionButtonProps = {
  onPress?: () => void;
};

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const bottomOffset = getFabBottomOffset(insets.bottom);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { bottom: bottomOffset }]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add expense"
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: colors.primary,
            ...shadows.lg,
          },
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.label, { color: colors.textInverse }]}>+</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...typography.sectionTitle,
    lineHeight: 28,
  },
});
