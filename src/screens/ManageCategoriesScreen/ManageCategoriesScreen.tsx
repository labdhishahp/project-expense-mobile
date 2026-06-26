import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, PrimaryButton, TextField } from '../../components';
import { useCategories } from '../../hooks';
import type { Category } from '../../models';
import { radius, spacing, typography, useTheme } from '../../theme';
import type { RootStackParamList } from '../../types';

type CategoryFormState = {
  name: string;
  icon: string;
  color: string;
};

const DEFAULT_FORM: CategoryFormState = {
  name: '',
  icon: 'ellipse-outline',
  color: '#64748B',
};

export function ManageCategoriesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { categories, createCategory, updateCategory, deleteCategory } =
    useCategories();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryFormState>(DEFAULT_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
        backButton: {
          padding: spacing.xs,
        },
        title: {
          ...typography.sectionTitle,
          color: colors.text,
        },
        addButton: {
          ...typography.caption,
          color: colors.primary,
          fontWeight: '700',
        },
        content: {
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.xxl,
        },
        categoryRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
        },
        categoryName: {
          ...typography.body,
          color: colors.text,
          flex: 1,
          fontWeight: '500',
        },
        actions: {
          flexDirection: 'row',
          gap: spacing.sm,
        },
        modalBackdrop: {
          flex: 1,
          backgroundColor: colors.overlay,
          justifyContent: 'flex-end',
        },
        modalSheet: {
          backgroundColor: colors.surface,
          borderTopLeftRadius: radius.lg,
          borderTopRightRadius: radius.lg,
          padding: spacing.md,
        },
        modalTitle: {
          ...typography.sectionTitle,
          color: colors.text,
          marginBottom: spacing.md,
        },
        deleteLink: {
          ...typography.caption,
          color: colors.error,
          textAlign: 'center',
          marginTop: spacing.sm,
          fontWeight: '600',
        },
      }),
    [colors],
  );

  const openCreateModal = useCallback(() => {
    setEditingCategory(null);
    setForm(DEFAULT_FORM);
    setFormError(null);
    setModalVisible(true);
  }, []);

  const openEditModal = useCallback((category: Category) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      icon: category.icon,
      color: category.color,
    });
    setFormError(null);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setEditingCategory(null);
    setForm(DEFAULT_FORM);
    setFormError(null);
  }, []);

  const handleSaveCategory = useCallback(async () => {
    const trimmedName = form.name.trim();

    if (!trimmedName) {
      setFormError('Category name is required.');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          name: trimmedName,
          icon: form.icon.trim() || DEFAULT_FORM.icon,
          color: form.color.trim() || DEFAULT_FORM.color,
        });
      } else {
        await createCategory({
          name: trimmedName,
          icon: form.icon.trim() || DEFAULT_FORM.icon,
          color: form.color.trim() || DEFAULT_FORM.color,
        });
      }

      closeModal();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to save category.',
      );
    } finally {
      setSaving(false);
    }
  }, [
    closeModal,
    createCategory,
    editingCategory,
    form.color,
    form.icon,
    form.name,
    updateCategory,
  ]);

  const handleDeleteCategory = useCallback(async () => {
    if (!editingCategory || editingCategory.isDefault) {
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      await deleteCategory(editingCategory.id);
      closeModal();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to delete category.',
      );
    } finally {
      setSaving(false);
    }
  }, [closeModal, deleteCategory, editingCategory]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Manage Categories</Text>
        <Pressable accessibilityRole="button" hitSlop={8} onPress={openCreateModal}>
          <Text style={styles.addButton}>Add</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {categories.map((category, index) => (
            <Pressable
              key={category.id}
              accessibilityRole="button"
              onPress={() => openEditModal(category)}
              style={[
                styles.categoryRow,
                index === categories.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: category.color,
                  marginRight: spacing.sm,
                }}
              />
              <Text style={styles.categoryName}>{category.name}</Text>
              <View style={styles.actions}>
                <Ionicons name="create-outline" size={18} color={colors.textMuted} />
              </View>
            </Pressable>
          ))}
        </Card>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackdrop}>
          <SafeAreaView edges={['bottom']} style={styles.modalSheet}>
            <Text style={styles.modalTitle}>
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </Text>

            <TextField
              label="Name"
              value={form.name}
              onChangeText={(name) => setForm((current) => ({ ...current, name }))}
              placeholder="Category name"
              error={formError ?? undefined}
            />

            <TextField
              label="Icon"
              value={form.icon}
              onChangeText={(icon) => setForm((current) => ({ ...current, icon }))}
              placeholder="Ionicons name"
            />

            <TextField
              label="Color"
              value={form.color}
              onChangeText={(color) => setForm((current) => ({ ...current, color }))}
              placeholder="#64748B"
              autoCapitalize="none"
            />

            <PrimaryButton
              label={editingCategory ? 'Save Changes' : 'Add Category'}
              onPress={() => void handleSaveCategory()}
              disabled={saving}
            />

            {editingCategory && !editingCategory.isDefault ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => void handleDeleteCategory()}
              >
                <Text style={styles.deleteLink}>Delete Category</Text>
              </Pressable>
            ) : null}
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
