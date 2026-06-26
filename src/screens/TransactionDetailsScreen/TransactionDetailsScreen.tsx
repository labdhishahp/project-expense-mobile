import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, LoadingState, useToast } from '../../components';
import { useCategories, useTransactions } from '../../hooks';
import { TransactionType } from '../../models';
import { radius, spacing, typography, useTheme } from '../../theme';
import type { RootStackParamList } from '../../types';
import { formatDateTime, formatDisplayDate } from '../../utils/date';
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
  const { colors } = useTheme();
  const { showToast } = useToast();

  const { transactions, loading, deleteTransaction, refresh } = useTransactions();
  const { getById: getCategoryById } = useCategories();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const [menuVisible, setMenuVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const transaction = useMemo(
    () => transactions.find((item) => item.id === transactionId) ?? null,
    [transactions, transactionId],
  );

  const category = transaction ? getCategoryById(transaction.categoryId) : null;

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleEdit = useCallback(() => {
    setMenuVisible(false);
    navigation.navigate('AddTransaction', { transactionId });
  }, [navigation, transactionId]);

  const handleDeleteConfirm = useCallback(() => {
    setMenuVisible(false);

    Alert.alert(
      'Delete Transaction?',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              if (deleting) {
                return;
              }

              setDeleting(true);

              try {
                await deleteTransaction(transactionId);
                showToast('Transaction Deleted');
                navigation.goBack();
              } catch {
                Alert.alert(
                  'Unable to Delete',
                  'Something went wrong. Please try again.',
                );
              } finally {
                setDeleting(false);
              }
            })();
          },
        },
      ],
    );
  }, [deleteTransaction, deleting, navigation, showToast, transactionId]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
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
        menuButton: {
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
        menuBackdrop: {
          flex: 1,
          backgroundColor: colors.overlay,
          justifyContent: 'flex-start',
          alignItems: 'flex-end',
          paddingTop: spacing.xl,
          paddingRight: spacing.md,
        },
        menuSheet: {
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.border,
          minWidth: 200,
          overflow: 'hidden',
        },
        menuItem: {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
        },
        menuItemBorder: {
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
        },
        menuItemText: {
          ...typography.body,
          color: colors.text,
          fontWeight: '500',
        },
        menuItemDestructive: {
          color: colors.error,
        },
      }),
    [colors],
  );

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
      headerRight: () =>
        transaction ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Transaction options"
            onPress={() => setMenuVisible(true)}
            hitSlop={8}
            style={styles.menuButton}
          >
            <Ionicons name="ellipsis-vertical" size={22} color={colors.text} />
          </Pressable>
        ) : null,
      headerStyle: { backgroundColor: colors.background },
      headerTitleStyle: { ...typography.sectionTitle, color: colors.text },
      headerShadowVisible: false,
    });
  }, [colors, handleGoBack, navigation, styles.backButton, styles.menuButton, transaction]);

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
  const wasEdited = transaction.updatedAt !== transaction.createdAt;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={[styles.amount, { color: amountColor }]}>
            {formatSignedCurrency(transaction.amount, transaction.type)}
          </Text>
        </Card>

        <Card style={styles.detailCard}>
          <DetailRow
            label="Category"
            value={category?.name ?? 'Unknown'}
            styles={styles}
          />
          <DetailRow
            label="Date"
            value={formatDisplayDate(transaction.date)}
            styles={styles}
          />
          <DetailRow
            label="Description"
            value={transaction.description || '—'}
            styles={styles}
          />
          <DetailRow
            label="Transaction Type"
            value={isIncome ? 'Income' : 'Expense'}
            styles={styles}
          />
          <DetailRow
            label="Created At"
            value={formatDateTime(transaction.createdAt)}
            styles={styles}
            isLast={!wasEdited}
          />
          {wasEdited ? (
            <DetailRow
              label="Updated At"
              value={formatDateTime(transaction.updatedAt)}
              styles={styles}
              isLast
            />
          ) : null}
        </Card>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.menuBackdrop}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuSheet}>
            <Pressable
              accessibilityRole="button"
              onPress={handleEdit}
              style={[styles.menuItem, styles.menuItemBorder]}
            >
              <Text style={styles.menuItemText}>Edit Transaction</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={handleDeleteConfirm}
              style={styles.menuItem}
            >
              <Text style={[styles.menuItemText, styles.menuItemDestructive]}>
                Delete Transaction
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
  isLast?: boolean;
  styles: {
    row: object;
    rowBorder: object;
    rowLabel: object;
    rowValue: object;
  };
};

function DetailRow({
  label,
  value,
  isLast = false,
  styles,
}: DetailRowProps) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}
