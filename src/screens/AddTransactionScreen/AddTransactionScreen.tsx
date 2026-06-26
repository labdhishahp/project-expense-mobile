import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  CategorySelectorList,
  PrimaryButton,
  TextField,
  useToast,
} from '../../components';
import {
  isExpenseDefaultCategoryName,
  isIncomeCategoryName,
  sortExpenseCategories,
} from '../../constants';
import { useCategories, useTransactions } from '../../hooks';
import { TransactionType } from '../../models';
import { spacing, typography, useTheme } from '../../theme';
import type { RootStackParamList } from '../../types';
import { toISODateString } from '../../utils/date';
import { parseCurrencyAmount } from '../../utils/currency';

type FormErrors = {
  amount?: string;
  categoryId?: string;
};

export function AddTransactionScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { showToast } = useToast();
  const { categories, refresh: refreshCategories } = useCategories();
  const { createTransaction } = useTransactions();

  const [transactionType, setTransactionType] = useState<TransactionType>(
    TransactionType.EXPENSE,
  );
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(toISODateString(new Date()));
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void refreshCategories();
    }, [refreshCategories]),
  );

  const isIncome = transactionType === TransactionType.INCOME;

  const availableCategories = useMemo(() => {
    const filtered = categories.filter((category) =>
      isIncome
        ? isIncomeCategoryName(category.name)
        : isExpenseDefaultCategoryName(category.name),
    );

    return isIncome ? filtered : sortExpenseCategories(filtered);
  }, [categories, isIncome]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.md,
          paddingTop: spacing.sm,
          paddingBottom: spacing.md,
        },
        title: {
          ...typography.sectionTitle,
          fontSize: 21,
          lineHeight: 28,
          color: colors.text,
        },
        switchType: {
          ...typography.caption,
          fontSize: 15,
          lineHeight: 20,
          color: colors.primary,
          fontWeight: '600',
        },
        content: {
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.xxl,
        },
        categoryLabel: {
          ...typography.body,
          fontSize: 17,
          lineHeight: 24,
          color: colors.textSecondary,
          marginBottom: spacing.sm,
          fontWeight: '600',
        },
        categoryError: {
          ...typography.caption,
          color: colors.error,
          marginTop: -spacing.sm,
          marginBottom: spacing.md,
        },
      }),
    [colors],
  );

  const validate = useCallback((): FormErrors => {
    const nextErrors: FormErrors = {};
    const parsedAmount = parseCurrencyAmount(amount);

    if (!amount.trim()) {
      nextErrors.amount = 'Amount is required.';
    } else if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      nextErrors.amount = 'Amount must be greater than 0.';
    }

    if (!categoryId) {
      nextErrors.categoryId = 'Category is required.';
    }

    return nextErrors;
  }, [amount, categoryId]);

  const handleSwitchType = useCallback(() => {
    setTransactionType((current) =>
      current === TransactionType.EXPENSE
        ? TransactionType.INCOME
        : TransactionType.EXPENSE,
    );
    setCategoryId(null);
    setErrors({});
  }, []);

  const handleSave = useCallback(async () => {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !categoryId) {
      return;
    }

    const parsedAmount = parseCurrencyAmount(amount);

    setSaving(true);

    try {
      await createTransaction({
        type: transactionType,
        amount: parsedAmount,
        categoryId,
        description: description.trim(),
        date: date.trim(),
      });

      showToast(isIncome ? 'Income Added' : 'Expense Added');
      navigation.goBack();
    } catch {
      setErrors({
        amount: 'Unable to save transaction. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  }, [
    amount,
    categoryId,
    createTransaction,
    date,
    description,
    isIncome,
    navigation,
    showToast,
    transactionType,
    validate,
  ]);

  const handleCategorySelect = useCallback(
    (nextCategoryId: string) => {
      setCategoryId(nextCategoryId);
      if (errors.categoryId) {
        setErrors((current) => ({ ...current, categoryId: undefined }));
      }
    },
    [errors.categoryId],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {isIncome ? 'Add Income' : 'Add Expense'}
          </Text>
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={handleSwitchType}
          >
            <Text style={styles.switchType}>
              {isIncome ? 'Switch to Expense' : 'Switch to Income'}
            </Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TextField
            label="Amount"
            value={amount}
            onChangeText={(value) => {
              setAmount(value);
              if (errors.amount) {
                setErrors((current) => ({ ...current, amount: undefined }));
              }
            }}
            keyboardType="decimal-pad"
            placeholder="0.00"
            error={errors.amount}
            emphasis
          />

          <Text style={styles.categoryLabel}>Category</Text>
          <CategorySelectorList
            categories={availableCategories}
            selectedCategoryId={categoryId}
            onSelect={handleCategorySelect}
          />
          {errors.categoryId ? (
            <Text style={styles.categoryError}>{errors.categoryId}</Text>
          ) : null}

          <TextField
            label="Description (Optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Add a note"
            emphasis
          />

          <TextField
            label="Date"
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            emphasis
          />

          <PrimaryButton
            label={isIncome ? 'Add Income' : 'Add Expense'}
            onPress={() => void handleSave()}
            disabled={saving}
            emphasis
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
