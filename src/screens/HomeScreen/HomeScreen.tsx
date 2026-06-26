import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BalanceCard,
  CategorySpendingChart,
  ErrorState,
  FloatingActionButton,
  HomeHeader,
  LoadingState,
  SectionHeader,
  SummaryCard,
  TransactionList,
} from '../../components';
import { getFabBottomOffset } from '../../constants';
import { useCategories, useSummary, useTransactions } from '../../hooks';
import type { Transaction } from '../../models';
import { spacing, typography, useTheme } from '../../theme';
import type { RootStackParamList } from '../../types';
import { buildCategorySpendingSlices } from '../../utils/categorySpending';
import { getTodayISODate } from '../../utils/date';

export function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { colors, mode, toggleTheme } = useTheme();

  const {
    summary,
    loading: summaryLoading,
    error: summaryError,
    refresh: refreshSummary,
  } = useSummary(50);

  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    refresh: refreshTransactions,
  } = useTransactions();

  const { getById: getCategoryById } = useCategories();

  const loading = summaryLoading || transactionsLoading;
  const error = summaryError ?? transactionsError;

  const refresh = useCallback(async () => {
    await Promise.all([refreshSummary(), refreshTransactions()]);
  }, [refreshSummary, refreshTransactions]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const handleTransactionPress = useCallback(
    (transaction: Transaction) => {
      navigation.navigate('TransactionDetails', {
        transactionId: transaction.id,
      });
    },
    [navigation],
  );

  const handleAddPress = useCallback(() => {
    navigation.navigate('AddTransaction');
  }, [navigation]);

  const today = getTodayISODate();

  const todayTransactionsAll = useMemo(
    () => transactions.filter((transaction) => transaction.date === today),
    [today, transactions],
  );

  const todayTransactions = useMemo(
    () => todayTransactionsAll.slice(0, 5),
    [todayTransactionsAll],
  );

  const showTodayLimitHint = todayTransactionsAll.length > 5;

  const spendingSlices = useMemo(
    () => buildCategorySpendingSlices(transactions, getCategoryById),
    [getCategoryById, transactions],
  );

  const themeIcon = mode === 'light' ? '🌙' : '☀️';
  const bottomPadding = getFabBottomOffset(insets.bottom) + 72;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        scrollContent: {
          paddingHorizontal: spacing.md,
          paddingTop: spacing.lg,
        },
        limitHint: {
          ...typography.caption,
          color: colors.textMuted,
          textAlign: 'center',
          marginTop: spacing.xs,
          marginBottom: spacing.sm,
        },
      }),
    [colors.background, colors.textMuted],
  );

  if (loading && !summary) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <LoadingState message="Loading dashboard..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => void refresh()} />
        }
        showsVerticalScrollIndicator={false}
      >
        {error ? <ErrorState message={error} /> : null}

        <HomeHeader onToggleTheme={toggleTheme} themeIcon={themeIcon} />

        <BalanceCard balance={summary?.currentBalance ?? 0} />

        <SummaryCard
          incomeThisMonth={summary?.incomeThisMonth ?? 0}
          expenseThisMonth={summary?.expenseThisMonth ?? 0}
        />

        <SectionHeader title="Today's Transactions" />

        <TransactionList
          transactions={todayTransactions}
          getCategoryById={getCategoryById}
          onTransactionPress={handleTransactionPress}
          emptyMessage={'No transactions today.\nTap + to add your first expense.'}
          compactEmpty
        />

        {showTodayLimitHint ? (
          <Text style={styles.limitHint}>
            Showing latest 5 transactions today.
          </Text>
        ) : null}

        <SectionHeader title="Category Spending" />

        <CategorySpendingChart slices={spendingSlices} />
      </ScrollView>

      <FloatingActionButton onPress={handleAddPress} />
    </SafeAreaView>
  );
}
