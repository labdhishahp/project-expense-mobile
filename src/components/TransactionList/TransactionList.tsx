import { StyleSheet, View } from 'react-native';

import type { Category, Transaction } from '../../models';
import { EmptyState } from '../EmptyState';
import { TransactionListItem } from '../TransactionListItem';

type TransactionListProps = {
  transactions: Transaction[];
  getCategoryById: (id: string) => Category | null;
  onTransactionPress: (transaction: Transaction) => void;
};

export function TransactionList({
  transactions,
  getCategoryById,
  onTransactionPress,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return <EmptyState />;
  }

  return (
    <View style={styles.list}>
      {transactions.map((transaction) => (
        <TransactionListItem
          key={transaction.id}
          transaction={transaction}
          category={getCategoryById(transaction.categoryId)}
          onPress={onTransactionPress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
  },
});
