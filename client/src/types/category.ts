export interface Category {
  id: number;
  category_name: string;
  category_image: string;
  category_slogan: string;
  createdAt: string;
  updatedAt: string;

  _count?: {
    products: number;
  };
}

export interface CategoryRequest {
  category_name: string;
  category_image: string;
  category_slogan: string;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}
