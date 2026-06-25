import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Category, Transaction } from '../../models';
import { TransactionType } from '../../models';
import { colors, radius, spacing, typography } from '../../theme';
import { formatSignedCurrency } from '../../utils/currency';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

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
  const isIncome = transaction.type === TransactionType.INCOME;
  const amountColor = isIncome ? colors.success : colors.error;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(transaction)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.leading}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${category?.color ?? colors.textMuted}20` },
          ]}
        >
          <Ionicons
            name={(category?.icon as IoniconName) ?? 'ellipse-outline'}
            size={20}
            color={category?.color ?? colors.textMuted}
          />
        </View>
        <Text style={styles.categoryName} numberOfLines={1}>
          {category?.name ?? 'Unknown'}
        </Text>
      </View>
      <Text style={[styles.amount, { color: amountColor }]}>
        {formatSignedCurrency(transaction.amount, transaction.type)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  leading: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  categoryName: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    fontWeight: '500',
  },
  amount: {
    ...typography.body,
    fontWeight: '600',
  },
});
