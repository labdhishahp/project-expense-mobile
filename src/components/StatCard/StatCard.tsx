import { StyleSheet, Text } from 'react-native';

import { colors, typography } from '../../theme';
import { formatCurrency } from '../../utils/currency';
import { Card } from '../Card';

type StatCardProps = {
  label: string;
  amount: number;
  variant: 'income' | 'expense';
};

export function StatCard({ label, amount, variant }: StatCardProps) {
  const amountColor = variant === 'income' ? colors.success : colors.error;

  return (
    <Card style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.amount, { color: amountColor }]}>
        {formatCurrency(amount)}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  amount: {
    ...typography.sectionTitle,
    fontWeight: '700',
  },
});
