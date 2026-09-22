import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ImageUpload from "../../common/image-upload/ImageUpload";

import "./ProductForm.scss";

export interface ProductFormData {
  name: string;
  category: string;
  price: string;
  stock: string;
  imageUrl: string;
  imageFile: File | null;
  description: string;
}

interface ProductFormProps {
  mode: "add" | "edit";
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
}

const emptyForm: ProductFormData = {
  name: "",
  category: "",
  price: "",
  stock: "",
  imageUrl: "",
  imageFile: null,
  description: "",
};

const ProductForm = ({ mode, initialData, onSubmit }: ProductFormProps) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProductFormData>(emptyForm);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(emptyForm);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(formData);
  };

  return (
    <div className="product-form">
      <div className="product-form__header">
        <button
          type="button"
          className="product-form__back"
          onClick={() => navigate("/admin/products")}
        >
          ← Back to Products
        </button>

        <h1>{mode === "add" ? "Add New Product" : "Edit Product"}</h1>

        <p>
          {mode === "add"
            ? "Create a new product for your store"
            : "Update product information"}
        </p>
      </div>

      <form className="product-form__card" onSubmit={handleSubmit}>
        <div className="product-form__section">
          <h2>Product Information</h2>

          <p>Enter the basic details of your product.</p>
        </div>

        {/* Product Name */}
        <div className="product-form__group">
          <label htmlFor="name">Product Name</label>

          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Category + Price */}
        <div className="product-form__row">
          <div className="product-form__group">
            <label htmlFor="category">Category</label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>

              <option value="Lawn">Lawn</option>
              <option value="Boski">Boski</option>
              <option value="Cotton">Cotton</option>
              <option value="Men">Men</option>
              <option value="Wash Wear">Wash Wear</option>
            </select>
          </div>

          <div className="product-form__group">
            <label htmlFor="price">Price</label>

            <input
              id="price"
              type="number"
              name="price"
              placeholder="Enter price"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Stock */}
        <div className="product-form__group">
          <label htmlFor="stock">Stock</label>

          <input
            id="stock"
            type="number"
            name="stock"
            placeholder="Enter stock quantity"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

        {/* Image */}
        <div className="product-form__group">
          <label>Product Image</label>

          <ImageUpload value={formData.imageUrl} onChange={handleImageChange} />
        </div>

        {/* Description */}
        <div className="product-form__group">
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            name="description"
            placeholder="Enter product description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
          />
        </div>

        {/* Actions */}
        <div className="product-form__actions">
          <button
            type="button"
            className="product-form__cancel"
            onClick={() => navigate("/admin/products")}
          >
            Cancel
          </button>

          <button type="submit" className="product-form__submit">
            {mode === "add" ? "Add Product" : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
