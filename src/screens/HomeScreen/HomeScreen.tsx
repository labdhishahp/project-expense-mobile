import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  BalanceCard,
  ErrorState,
  FloatingActionButton,
  LoadingState,
  SectionHeader,
  SummaryCard,
  TransactionList,
} from '../../components';
import { useCategories, useSummary, useTransactions } from '../../hooks';
import type { Transaction } from '../../models';
import { colors, spacing } from '../../theme';
import type { RootStackParamList } from '../../types';

const RECENT_TRANSACTION_LIMIT = 5;

export function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    summary,
    loading: summaryLoading,
    error: summaryError,
    refresh: refreshSummary,
  } = useSummary(RECENT_TRANSACTION_LIMIT);

  const {
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

  const recentTransactions = summary?.recentTransactions ?? [];

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
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => void refresh()} />
        }
        showsVerticalScrollIndicator={false}
      >
        {error ? <ErrorState message={error} /> : null}

        <BalanceCard balance={summary?.currentBalance ?? 0} />

        <SummaryCard
          incomeThisMonth={summary?.incomeThisMonth ?? 0}
          expenseThisMonth={summary?.expenseThisMonth ?? 0}
        />

        <SectionHeader title="Recent Transactions" />

        <TransactionList
          transactions={recentTransactions}
          getCategoryById={getCategoryById}
          onTransactionPress={handleTransactionPress}
        />

        <View style={styles.fabSpacer} />
      </ScrollView>

      <FloatingActionButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  fabSpacer: {
    height: 80,
  },
});
