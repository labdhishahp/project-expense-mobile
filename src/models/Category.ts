export type CategoryId = string;

export type Category = {
  id: CategoryId;
  name: string;
  isDefault: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};
