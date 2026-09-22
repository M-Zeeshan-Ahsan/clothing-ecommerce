import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Pagination from "../../../components/common/pagination/Pagination";

import "./Categories.scss";

interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  products: number;
  status: "Active" | "Inactive";
  createdAt: string;
}

const dummyCategories: AdminCategory[] = [
  {
    id: 1,
    name: "Lawn",
    slug: "lawn",
    products: 18,
    status: "Active",
    createdAt: "20 Sep 2026",
  },
  {
    id: 2,
    name: "Cotton",
    slug: "cotton",
    products: 12,
    status: "Active",
    createdAt: "18 Sep 2026",
  },
  {
    id: 3,
    name: "Boski",
    slug: "boski",
    products: 15,
    status: "Active",
    createdAt: "15 Sep 2026",
  },
  {
    id: 4,
    name: "Wash Wear",
    slug: "wash-wear",
    products: 8,
    status: "Active",
    createdAt: "12 Sep 2026",
  },
  {
    id: 5,
    name: "Men",
    slug: "men",
    products: 10,
    status: "Active",
    createdAt: "10 Sep 2026",
  },
  {
    id: 6,
    name: "Winter Collection",
    slug: "winter-collection",
    products: 0,
    status: "Inactive",
    createdAt: "05 Sep 2026",
  },
];

const CATEGORIES_PER_PAGE = 5;

const Categories = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCategories = useMemo(() => {
    return dummyCategories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredCategories.length / CATEGORIES_PER_PAGE);

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * CATEGORIES_PER_PAGE,
    currentPage * CATEGORIES_PER_PAGE,
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="admin-categories">
      {/* Page Header */}
      <div className="admin-categories__header">
        <div>
          <h1>Categories</h1>
          <p>Manage your product categories</p>
        </div>

        <button
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
                        {category.name.charAt(0)}
                      </div>

                      <div>
                        <strong>{category.name}</strong>
                        <span>#{category.id}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="admin-categories__slug">
                      {category.slug}
                    </span>
                  </td>

                  <td>{category.products}</td>

                  <td>
                    <span
                      className={`admin-categories__status ${
                        category.status === "Active" ? "active" : "inactive"
                      }`}
                    >
                      {category.status}
                    </span>
                  </td>

                  <td>{category.createdAt}</td>

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

                      <button type="button" title="Delete">
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
