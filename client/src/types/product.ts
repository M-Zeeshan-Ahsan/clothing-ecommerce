export interface Product {
  id: number;
  product_name: string;
  product_image: string;
  categoryId: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
}
interface Category {
  id: number;
  category_name: string;
}
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: {
    products: Product[];
    pagination: Pagination;
  };
}
