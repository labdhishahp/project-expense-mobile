import { categoryRepository } from '../repositories';
import type { Category, CategoryId } from '../models';

export const categoryService = {
  getAll(): Promise<Category[]> {
    return categoryRepository.getAll();
  },

  getById(id: CategoryId): Promise<Category | null> {
    return categoryRepository.getById(id);
  },
};
