import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Pagination from "../../../components/common/pagination/Pagination";

import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "../../../store/api/categoryApi";

import { showToast } from "../../../utils/toast";
import { getApiErrorMessage } from "../../../utils/apiError";
import Loader from "../../../components/common/loader/Loader";

import "./Categories.scss";

const CATEGORIES_PER_PAGE = 5;

const Categories = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useGetCategoriesQuery();

  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const categories = data?.data ?? [];

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.category_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [categories, searchTerm]);

  const totalPages = Math.ceil(filteredCategories.length / CATEGORIES_PER_PAGE);

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * CATEGORIES_PER_PAGE,
    currentPage * CATEGORIES_PER_PAGE,
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCategory(id).unwrap();

      showToast("Category deleted successfully", "success");

      // Agar last item delete hone ke baad
      // current page empty ho jaye
      if (paginatedCategories.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    }
  };

  if (isLoading) {
    return (
      <div className="admin-categories">
        <div className="admin-categories__header">
          <div>
            <h1>Categories</h1>
            <p>Manage your product categories</p>
          </div>
        </div>

        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="admin-categories">
        <div className="admin-categories__header">
          <div>
            <h1>Categories</h1>
            <p>Manage your product categories</p>
          </div>
        </div>

        <div className="admin-categories__empty">
          {getApiErrorMessage(error)}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-categories">
      {/* Page Header */}
      <div className="admin-categories__header">
        <div>
          <h1>Categories</h1>
          <p>Manage your product categories</p>
        </div>

        <button
          type="button"
          className="admin-categories__add-btn"
          onClick={() => navigate("/admin/categories/add")}
        >
          + Add Category
        </button>
      </div>

      {/* Search */}
      <div className="admin-categories__filters">
        <div className="admin-categories__search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="admin-categories__table-wrapper">
        <table className="admin-categories__table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Slug</th>
              <th>Products</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCategories.length > 0 ? (
              paginatedCategories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <div className="admin-categories__category">
                      <div className="admin-categories__icon">
                        {category.category_name.charAt(0)}
                      </div>

                      <div>
                        <strong>{category.category_name}</strong>

                        <span>#{category.id}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="admin-categories__slug">
                      {category.category_name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}
                    </span>
                  </td>

                  <td>{category._count?.products ?? 0}</td>

                  <td>
                    <span className="admin-categories__status active">
                      Active
                    </span>
                  </td>

                  <td>
                    {new Date(category.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td>
                    <div className="admin-categories__actions">
                      <button
                        type="button"
                        title="Edit"
                        onClick={() =>
                          navigate(`/admin/categories/edit/${category.id}`)
                        }
                      >
                        ✎
                      </button>

                      <button
                        type="button"
                        title="Delete"
                        disabled={isDeleting}
                        onClick={() => handleDelete(category.id)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="admin-categories__empty">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="admin-categories__footer">
        Showing{" "}
        {paginatedCategories.length > 0
          ? `${(currentPage - 1) * CATEGORIES_PER_PAGE + 1}-${
              (currentPage - 1) * CATEGORIES_PER_PAGE +
              paginatedCategories.length
            }`
          : 0}{" "}
        of {filteredCategories.length} categories
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Categories;
