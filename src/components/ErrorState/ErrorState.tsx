import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../../theme';

type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.error,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  message: {
    ...typography.caption,
    color: colors.error,
    textAlign: 'center',
  },
});
