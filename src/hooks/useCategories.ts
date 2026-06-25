import { useCallback, useEffect, useState } from 'react';

import type {
  Category,
  CategoryId,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../models';
import { categoryService } from '../services/categoryService';
import { toUserMessage } from '../database/errors';

type UseCategoriesState = {
  categories: Category[];
  loading: boolean;
  error: string | null;
};

export function useCategories() {
  const [state, setState] = useState<UseCategoriesState>({
    categories: [],
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));

    try {
      const categories = await categoryService.getAll();
      setState({ categories, loading: false, error: null });
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: toUserMessage(error),
      }));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createCategory = useCallback(
    async (input: CreateCategoryInput) => {
      const category = await categoryService.create(input);
      await refresh();
      return category;
    },
    [refresh],
  );

  const updateCategory = useCallback(
    async (input: UpdateCategoryInput) => {
      const category = await categoryService.update(input);
      await refresh();
      return category;
    },
    [refresh],
  );

  const deleteCategory = useCallback(
    async (id: CategoryId) => {
      await categoryService.delete(id);
      await refresh();
    },
    [refresh],
  );

  const getById = useCallback(
    (id: CategoryId) => state.categories.find((category) => category.id === id) ?? null,
    [state.categories],
  );

  return {
    categories: state.categories,
    loading: state.loading,
    error: state.error,
    refresh,
    createCategory,
    updateCategory,
    deleteCategory,
    getById,
  };
}
