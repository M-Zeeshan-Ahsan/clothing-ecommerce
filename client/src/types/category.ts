export interface Category {
  id: number;
  category_name: string;
  category_image: string;
  category_slogan: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}
