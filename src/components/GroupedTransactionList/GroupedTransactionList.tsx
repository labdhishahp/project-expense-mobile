import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Category, Transaction } from '../../models';
import { spacing, typography, useTheme } from '../../theme';
import type { TransactionMonthGroup } from '../../utils/transactionGroups';
import { EmptyState } from '../EmptyState';
import { TransactionListItem } from '../TransactionListItem';

type GroupedTransactionListProps = {
  groups: TransactionMonthGroup[];
  getCategoryById: (id: string) => Category | null;
  onTransactionPress: (transaction: Transaction) => void;
  emptyMessage?: string;
};

export function GroupedTransactionList({
  groups,
  getCategoryById,
  onTransactionPress,
  emptyMessage = 'No transactions yet.',
}: GroupedTransactionListProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        monthHeading: {
          ...typography.sectionTitle,
          color: colors.text,
          marginBottom: spacing.sm,
        },
        monthBlock: {
          marginBottom: spacing.lg,
        },
        divider: {
          height: 1,
          backgroundColor: colors.divider,
          marginBottom: spacing.lg,
        },
      }),
    [colors],
  );

  if (groups.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <View>
      {groups.map((group, index) => (
        <View key={group.monthKey}>
          <View style={styles.monthBlock}>
            <Text style={styles.monthHeading}>{group.label}</Text>
            {group.transactions.map((transaction) => (
              <TransactionListItem
                key={transaction.id}
                transaction={transaction}
                category={getCategoryById(transaction.categoryId)}
                onPress={onTransactionPress}
              />
            ))}
          </View>
          {index < groups.length - 1 ? <View style={styles.divider} /> : null}
        </View>
      ))}
    </View>
  );
}
