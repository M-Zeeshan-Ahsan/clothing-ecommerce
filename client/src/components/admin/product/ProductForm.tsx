import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ImageUpload from "../../common/image-upload/ImageUpload";

import { useGetCategoriesQuery } from "../../../store/api/categoryApi";

import "./ProductForm.scss";

export interface ProductFormData {
  name: string;
  category: string;
  price: string;
  salePrice: string;
  imageUrl: string;
  imageFile: File | null;
}

interface ProductFormProps {
  mode: "add" | "edit";
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  isSubmitting?: boolean;
}

const emptyForm: ProductFormData = {
  name: "",
  category: "",
  price: "",
  salePrice: "",
  imageUrl: "",
  imageFile: null,
};

const ProductForm = ({
  mode,
  initialData,
  onSubmit,
  isSubmitting = false,
}: ProductFormProps) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProductFormData>(emptyForm);

  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();

  const categories = categoriesResponse?.data ?? [];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(emptyForm);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
              disabled={isCategoriesLoading}
            >
              <option value="">
                {isCategoriesLoading
                  ? "Loading categories..."
                  : "Select category"}
              </option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="product-form__group">
            <label htmlFor="price">Price</label>

            <input
              id="price"
              type="number"
              name="price"
              placeholder="Enter price"
              min="1"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Sale Price */}
        <div className="product-form__group">
          <label htmlFor="salePrice">Sale Price</label>

          <input
            id="salePrice"
            type="number"
            name="salePrice"
            placeholder="Enter sale price (optional)"
            min="1"
            value={formData.salePrice}
            onChange={handleChange}
          />

          <small>Sale price must be less than the original price.</small>
        </div>

        {/* Image */}
        <div className="product-form__group">
          <label>Product Image</label>

          <ImageUpload value={formData.imageUrl} onChange={handleImageChange} />
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

          <button
            type="submit"
            className="product-form__submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : mode === "add"
                ? "Add Product"
                : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
