import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.scss";

interface AdminProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  status: "Active" | "Out of Stock";
}

const dummyProducts: AdminProduct[] = [
  {
    id: 1,
    name: "Nishat Boski Suit",
    category: "Boski",
    price: 5480,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=200&q=80",
    status: "Active",
  },
  {
    id: 2,
    name: "Premium Cotton Suit",
    category: "Cotton",
    price: 4200,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=200&q=80",
    status: "Active",
  },
  {
    id: 3,
    name: "Nishat China Boski",
    category: "Boski",
    price: 5480,
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80",
    status: "Active",
  },
  {
    id: 4,
    name: "Edenrobe Premium",
    category: "Men",
    price: 3450,
    stock: 0,
    image:
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=200&q=80",
    status: "Out of Stock",
  },
  {
    id: 5,
    name: "Men Wash Wear",
    category: "Wash Wear",
    price: 5500,
    stock: 15,
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=200&q=80",
    status: "Active",
  },
];

const Products = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    return dummyProducts.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, category]);

  return (
    <div className="admin-products">
      {/* Page Header */}
      <div className="admin-products__header">
        <div>
          <h1>Products</h1>
          <p>Manage your store products</p>
        </div>

        <button
          className="admin-products__add-btn"
          onClick={() => navigate("/admin/products/add")}
        >
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="admin-products__filters">
        <div className="admin-products__search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Boski">Boski</option>
          <option value="Cotton">Cotton</option>
          <option value="Lawn">Lawn</option>
          <option value="Men">Men</option>
          <option value="Wash Wear">Wash Wear</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="admin-products__table-wrapper">
        <table className="admin-products__table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-products__product">
                      <img src={product.image} alt={product.name} />

                      <div>
                        <strong>{product.name}</strong>
                        <span>#{product.id}</span>
                      </div>
                    </div>
                  </td>

                  <td>{product.category}</td>

                  <td>Rs. {product.price.toLocaleString()}</td>

                  <td>{product.stock}</td>

                  <td>
                    <span
                      className={`admin-products__status ${
                        product.status === "Active" ? "active" : "out-of-stock"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>

                  <td>
                    <div className="admin-products__actions">
                      <button
                        title="Edit"
                        onClick={() =>
                          navigate(`/admin/products/edit/${product.id}`)
                        }
                      >
                        ✎
                      </button>
                      <button title="Delete">🗑</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="admin-products__empty">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="admin-products__footer">
        Showing {filteredProducts.length} of {dummyProducts.length} products
      </div>
    </div>
  );
};

export default Products;
