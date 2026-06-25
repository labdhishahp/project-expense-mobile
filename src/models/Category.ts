export type CategoryId = string;

export type Category = {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
};

export type CreateCategoryInput = {
  name: string;
  icon: string;
  color: string;
  isDefault?: boolean;
};

export type UpdateCategoryInput = {
  id: CategoryId;
  name?: string;
  icon?: string;
  color?: string;
};
