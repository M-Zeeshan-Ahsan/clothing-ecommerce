export interface Category {
  id: number;
  category_name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}
