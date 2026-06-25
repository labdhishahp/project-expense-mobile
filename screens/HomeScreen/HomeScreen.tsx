import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '../../components';
import { colors, spacing, typography } from '../../theme';

export function HomeScreen() {
  return (
    <ScreenContainer
      title="Home"
      subtitle="Your expense overview will appear here."
    >
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Milestone 1 — Foundation</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  placeholderText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
