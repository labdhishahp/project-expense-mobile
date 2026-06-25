import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';
import { formatCurrency } from '../../utils/currency';

type BalanceCardProps = {
  balance: number;
};

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Balance</Text>
      <Text style={styles.amount}>{formatCurrency(balance)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  amount: {
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 48,
    color: colors.text,
  },
});
