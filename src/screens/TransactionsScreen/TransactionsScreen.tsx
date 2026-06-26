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
  EmptyState,
  ErrorState,
  GroupedTransactionList,
  LoadingState,
} from '../../components';
import { getTabBarBottomInset } from '../../constants';
import { useCategories, useTransactions } from '../../hooks';
import type { Transaction } from '../../models';
import { spacing, typography, useTheme } from '../../theme';
import type { RootStackParamList } from '../../types';
import { groupTransactionsByMonth } from '../../utils/transactionGroups';

export function TransactionsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const {
    transactions,
    loading,
    error,
    refresh,
  } = useTransactions();

  const { getById: getCategoryById } = useCategories();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const groupedTransactions = useMemo(
    () => groupTransactionsByMonth(transactions),
    [transactions],
  );

  const handleTransactionPress = useCallback(
    (transaction: Transaction) => {
      navigation.navigate('TransactionDetails', {
        transactionId: transaction.id,
      });
    },
    [navigation],
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        header: {
          paddingHorizontal: spacing.md,
          paddingTop: spacing.lg,
          marginBottom: spacing.md,
        },
        title: {
          ...typography.screenTitle,
          color: colors.text,
        },
        content: {
          paddingHorizontal: spacing.md,
          paddingBottom: getTabBarBottomInset(insets.bottom) + spacing.md,
        },
      }),
    [colors, insets.bottom],
  );

  if (loading && transactions.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <LoadingState message="Loading transactions..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => void refresh()} />
        }
        showsVerticalScrollIndicator={false}
      >
        {error ? <ErrorState message={error} /> : null}

        {transactions.length === 0 ? (
          <EmptyState
            message="No transactions yet."
            subtitle="Start by adding your first expense."
          />
        ) : (
          <GroupedTransactionList
            groups={groupedTransactions}
            getCategoryById={getCategoryById}
            onTransactionPress={handleTransactionPress}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
