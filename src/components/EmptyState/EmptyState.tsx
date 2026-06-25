import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../../theme';

type EmptyStateProps = {
  message?: string;
};

export function EmptyState({ message = 'No transactions yet' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
