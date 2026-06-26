import {
  type Category,
  type CategoryId,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from '../models';
import { ValidationError } from '../database/errors';
import { categoryRepository, transactionRepository } from '../repositories';
import {
  assertHexColor,
  assertNonEmptyString,
} from '../utils/validation';

function validateCreateInput(input: CreateCategoryInput): void {
  assertNonEmptyString(input.name, 'name');
  assertNonEmptyString(input.icon, 'icon');
  assertHexColor(input.color);
}

function validateUpdateInput(input: UpdateCategoryInput): void {
  if (input.name !== undefined) {
    assertNonEmptyString(input.name, 'name');
  }
  if (input.icon !== undefined) {
    assertNonEmptyString(input.icon, 'icon');
  }
  if (input.color !== undefined) {
    assertHexColor(input.color);
  }
}

export const categoryService = {
  getAll(): Promise<Category[]> {
    return categoryRepository.getAll();
  },

  getById(id: CategoryId): Promise<Category | null> {
    return categoryRepository.getById(id);
  },

  async create(input: CreateCategoryInput): Promise<Category> {
    validateCreateInput(input);

    const existing = await categoryRepository.getByName(input.name);
    if (existing) {
      throw new ValidationError(`Category "${input.name}" already exists.`);
    }

    return categoryRepository.create({
      ...input,
      isDefault: input.isDefault ?? false,
    });
  },

  async update(input: UpdateCategoryInput): Promise<Category> {
    validateUpdateInput(input);

    if (input.name) {
      const existing = await categoryRepository.getByName(input.name);
      if (existing && existing.id !== input.id) {
        throw new ValidationError(`Category "${input.name}" already exists.`);
      }
    }

    return categoryRepository.update(input);
  },

  async delete(id: CategoryId): Promise<void> {
    const existing = await categoryRepository.getById(id);
    if (!existing) {
      await categoryRepository.delete(id);
      return;
    }

    if (existing.isDefault) {
      throw new ValidationError('Default categories cannot be deleted.');
    }

    const linkedTransactions = await transactionRepository.getByCategory(id);
    if (linkedTransactions.length > 0) {
      throw new ValidationError(
        'This category is already used in transactions and cannot be deleted.',
      );
    }

    await categoryRepository.delete(id);
  },
};
