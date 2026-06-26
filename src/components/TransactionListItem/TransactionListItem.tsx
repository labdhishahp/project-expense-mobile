import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import type { Category, Transaction } from '../../models';
import { spacing, typography, useTheme } from '../../theme';
import { formatCurrency } from '../../utils/currency';
import { formatShortDate } from '../../utils/date';

type TransactionListItemProps = {
  transaction: Transaction;
  category: Category | null;
  onPress: (transaction: Transaction) => void;
};

export function TransactionListItem({
  transaction,
  category,
  onPress,
}: TransactionListItemProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: spacing.sm + 2,
        },
        date: {
          ...typography.body,
          color: colors.text,
          width: 68,
        },
        categoryName: {
          ...typography.body,
          color: colors.text,
          flex: 1,
          marginHorizontal: spacing.sm,
        },
        amount: {
          ...typography.body,
          color: colors.text,
          fontWeight: '600',
          textAlign: 'right',
          minWidth: 72,
        },
        pressed: {
          opacity: 0.7,
        },
      }),
    [colors],
  );

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(transaction)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Text style={styles.date}>{formatShortDate(transaction.date)}</Text>
      <Text style={styles.categoryName} numberOfLines={1}>
        {category?.name ?? 'Unknown'}
      </Text>
      <Text style={styles.amount}>{formatCurrency(transaction.amount)}</Text>
    </Pressable>
  );
}
