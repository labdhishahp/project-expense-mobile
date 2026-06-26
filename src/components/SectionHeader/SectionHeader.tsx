import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { spacing, typography, useTheme } from '../../theme';

type SectionHeaderProps = {
  title: string;
};

export function SectionHeader({ title }: SectionHeaderProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        title: {
          ...typography.sectionTitle,
          color: colors.text,
          marginBottom: spacing.sm,
        },
      }),
    [colors],
  );

  return <Text style={styles.title}>{title}</Text>;
}
