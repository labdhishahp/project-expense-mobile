import type { Category, CategoryId } from '../models';

export const categoryRepository = {
  async getAll(): Promise<Category[]> {
    return [];
  },

  async getById(_id: CategoryId): Promise<Category | null> {
    return null;
  },

  async create(_category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    throw new Error('Not implemented');
  },

  async update(_category: Category): Promise<Category> {
    throw new Error('Not implemented');
  },

  async delete(_id: CategoryId): Promise<void> {
    throw new Error('Not implemented');
  },
};
