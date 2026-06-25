import { StyleSheet, Text } from 'react-native';

import { colors, spacing, typography } from '../../theme';

type SectionHeaderProps = {
  title: string;
};

export function SectionHeader({ title }: SectionHeaderProps) {
  return <Text style={styles.title}>{title}</Text>;
}

const styles = StyleSheet.create({
  title: {
    ...typography.sectionTitle,
    color: colors.text,
    marginBottom: spacing.sm,
  },
});
