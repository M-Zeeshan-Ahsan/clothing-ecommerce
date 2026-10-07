import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Pagination from "../../../components/common/pagination/Pagination";

import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../../store/api/productApi";
import useDebounce from "../../../hooks/useDebounce";
import { useGetCategoriesQuery } from "../../../store/api/categoryApi";

import { showToast } from "../../../utils/toast";
import { getApiErrorMessage } from "../../../utils/apiError";
import Loader from "../../../components/common/loader/Loader";

import "./Product.scss";

const PRODUCTS_PER_PAGE = 10;

const Products = () => {
  const navigate = useNavigate();

  // =========================
  // FILTER STATES
  // =========================

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(undefined);

  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // GET CATEGORIES
  // =========================

  const { data: categoryData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const categories = categoryData?.data ?? [];

  // =========================
  // GET PRODUCTS
  // =========================

  const {
    data: productData,
    isLoading: productsLoading,
    isFetching,
    isError: productsError,
  } = useGetProductsQuery({
    page: currentPage,
    limit: PRODUCTS_PER_PAGE,
    search: debouncedSearch.trim(),
    categoryId: selectedCategoryId,
  });

  // =========================
  // PRODUCTS
  // =========================

  const products = productData?.data.products ?? [];

  const pagination = productData?.data.pagination;

  // =========================
  // DELETE PRODUCT
  // =========================

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // =========================
  // SEARCH CHANGE
  // =========================

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // =========================
  // CATEGORY CHANGE
  // =========================

  const handleCategoryChange = (value: string) => {
    const categoryId = value === "All" ? undefined : Number(value);

    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id).unwrap();

      showToast("Product deleted successfully", "success");
    } catch (error) {
      console.error("Delete product error:", error);

      showToast(getApiErrorMessage(error), "error");
    }
  };

  // =========================
  // LOADING
  // =========================

  if (productsLoading || categoriesLoading) {
    return <Loader />;
  }

  // =========================
  // ERROR
  // =========================

  if (productsError) {
    return (
      <div className="admin-products">
        <p>Failed to load products.</p>
      </div>
    );
  }

  return (
    <div className="admin-products">
      {/* =========================
          HEADER
      ========================= */}

      <div className="admin-products__header">
        <div>
          <h1>Products</h1>

          <p>Manage your store products</p>
        </div>

        <button
          type="button"
          className="admin-products__add-btn"
          onClick={() => navigate("/admin/products/add")}
        >
          + Add Product
        </button>
      </div>

      {/* =========================
          FILTERS
      ========================= */}

      <div className="admin-products__filters">
        {/* Search */}

        <div className="admin-products__search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Category */}

        <select
          value={selectedCategoryId ?? "All"}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="All">All Categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.category_name}
            </option>
          ))}
        </select>
      </div>

      {/* =========================
          FETCHING
      ========================= */}

      {isFetching && !productsLoading && (
        <div className="admin-products__loading">
          <p>Updating products...</p>
        </div>
      )}

      {/* =========================
          PRODUCTS TABLE
      ========================= */}

      {!isFetching && (
        <div className="admin-products__table-wrapper">
          <table className="admin-products__table">
            <thead>
              <tr>
                <th>Product</th>

                <th>Category</th>

                <th>Price</th>

                <th>Sale Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    {/* Product */}

                    <td>
                      <div className="admin-products__product">
                        <img
                          src={product.product_image}
                          alt={product.product_name}
                        />

                        <div>
                          <strong>{product.product_name}</strong>

                          <span>#{product.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}

                    <td>{product.category?.category_name}</td>

                    {/* Price */}

                    <td>Rs. {Number(product.price).toLocaleString()}</td>

                    {/* Sale Price */}

                    <td>
                      {product.sale_price !== null &&
                      product.sale_price !== undefined
                        ? `Rs. ${Number(product.sale_price).toLocaleString()}`
                        : "-"}
                    </td>
                    <td>{product.stock}</td>
                    {/* Actions */}

                    <td>
                      <div className="admin-products__actions">
                        <button
                          type="button"
                          title="Edit"
                          onClick={() =>
                            navigate(`/admin/products/edit/${product.id}`)
                          }
                        >
                          ✎
                        </button>

                        <button
                          type="button"
                          title="Delete"
                          disabled={isDeleting}
                          onClick={() => handleDelete(product.id)}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="admin-products__empty">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================
          FOOTER
      ========================= */}

      <div className="admin-products__footer">
        Showing {products.length} of {pagination?.total ?? 0} products
      </div>

      {/* =========================
          PAGINATION
      ========================= */}

      {!isFetching && products.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination?.totalPages ?? 1}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Products;
