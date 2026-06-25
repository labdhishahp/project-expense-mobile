import { StyleSheet, View } from 'react-native';

import { spacing } from '../../theme';
import { StatCard } from '../StatCard';

type SummaryCardProps = {
  incomeThisMonth: number;
  expenseThisMonth: number;
};

export function SummaryCard({ incomeThisMonth, expenseThisMonth }: SummaryCardProps) {
  return (
    <View style={styles.row}>
      <StatCard label="Income This Month" amount={incomeThisMonth} variant="income" />
      <View style={styles.gap} />
      <StatCard label="Expense This Month" amount={expenseThisMonth} variant="expense" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  gap: {
    width: spacing.sm,
  },
});
