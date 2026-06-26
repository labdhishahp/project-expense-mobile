import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Category } from '../../models';
import { radius, spacing, typography, useTheme } from '../../theme';

type CategorySelectorListProps = {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelect: (categoryId: string) => void;
};

export function CategorySelectorList({
  categories,
  selectedCategoryId,
  onSelect,
}: CategorySelectorListProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        list: {
          marginBottom: spacing.md,
        },
        row: {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm + 4,
          marginBottom: spacing.sm,
          backgroundColor: colors.surface,
        },
        rowSelected: {
          borderColor: colors.primary,
          backgroundColor: colors.primaryMuted,
        },
        rowText: {
          ...typography.body,
          fontSize: 18,
          lineHeight: 26,
          color: colors.text,
          fontWeight: '500',
        },
        rowTextSelected: {
          color: colors.primaryDark,
          fontWeight: '600',
        },
      }),
    [colors],
  );

  return (
    <View style={styles.list}>
      {categories.map((category) => {
        const selected = selectedCategoryId === category.id;

        return (
          <Pressable
            key={category.id}
            accessibilityRole="button"
            accessibilityState={selected ? { selected: true } : undefined}
            onPress={() => onSelect(category.id)}
            style={[styles.row, selected && styles.rowSelected]}
          >
            <Text style={[styles.rowText, selected && styles.rowTextSelected]}>
              {category.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
