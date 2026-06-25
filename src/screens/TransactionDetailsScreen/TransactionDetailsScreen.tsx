import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, LoadingState } from '../../components';
import { useCategories, useTransactions } from '../../hooks';
import { TransactionType } from '../../models';
import { colors, radius, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../types';
import { formatDisplayDate } from '../../utils/date';
import { formatSignedCurrency } from '../../utils/currency';

type TransactionDetailsRouteProp = RouteProp<
  RootStackParamList,
  'TransactionDetails'
>;

export function TransactionDetailsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<TransactionDetailsRouteProp>();
  const { transactionId } = route.params;

  const { transactions, loading } = useTransactions();
  const { getById: getCategoryById } = useCategories();

  const transaction = useMemo(
    () => transactions.find((item) => item.id === transactionId) ?? null,
    [transactions, transactionId],
  );

  const category = transaction ? getCategoryById(transaction.categoryId) : null;

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Transaction Details',
      headerBackVisible: false,
      headerLeft: () => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={handleGoBack}
          hitSlop={8}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
      ),
      headerStyle: { backgroundColor: colors.background },
      headerTitleStyle: { ...typography.sectionTitle, color: colors.text },
      headerShadowVisible: false,
    });
  }, [navigation, handleGoBack]);

  if (loading && !transaction) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <LoadingState message="Loading transaction..." />
      </SafeAreaView>
    );
  }

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Transaction not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isIncome = transaction.type === TransactionType.INCOME;
  const amountColor = isIncome ? colors.success : colors.error;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.amountCard}>
          <Text style={styles.amountLabel}>
            {isIncome ? 'Income' : 'Expense'}
          </Text>
          <Text style={[styles.amount, { color: amountColor }]}>
            {formatSignedCurrency(transaction.amount, transaction.type)}
          </Text>
        </Card>

        <Card style={styles.detailCard}>
          <DetailRow label="Category" value={category?.name ?? 'Unknown'} />
          <DetailRow label="Date" value={formatDisplayDate(transaction.date)} />
          <DetailRow
            label="Description"
            value={transaction.description || '—'}
            isLast
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
  isLast?: boolean;
};

function DetailRow({ label, value, isLast = false }: DetailRowProps) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  backButton: {
    paddingHorizontal: spacing.sm,
  },
  amountCard: {
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.lg,
  },
  amountLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  amount: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 44,
  },
  detailCard: {
    padding: 0,
    overflow: 'hidden',
  },
  row: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  rowValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  notFoundText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
