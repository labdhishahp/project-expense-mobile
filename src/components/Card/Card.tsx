import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radius, shadows, spacing } from '../../theme';

type CardProps = ViewProps & {
  elevated?: boolean;
};

export function Card({ elevated = true, style, children, ...props }: CardProps) {
  return (
    <View
      style={[styles.card, elevated && shadows.sm, style]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
});
