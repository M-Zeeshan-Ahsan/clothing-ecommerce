import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CategoryForm.scss";

export interface CategoryFormData {
  category_name: string;
  category_image: string;
  category_slogan: string;
}

interface CategoryFormProps {
  mode: "add" | "edit";
  initialData?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => void;
  isLoading?: boolean;
}

const emptyForm: CategoryFormData = {
  category_name: "",
  category_image: "",
  category_slogan: "",
};

const CategoryForm = ({
  mode,
  initialData,
  onSubmit,
  isLoading = false,
}: CategoryFormProps) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CategoryFormData>(emptyForm);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(emptyForm);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(formData);
  };

  return (
    <div className="category-form">
      {/* Header */}
      <div className="category-form__header">
        <div>
          <button
            type="button"
            className="category-form__back"
            onClick={() => navigate("/admin/categories")}
          >
            ← Back to Categories
          </button>

          <h1>{mode === "add" ? "Add New Category" : "Edit Category"}</h1>

          <p>
            {mode === "add"
              ? "Create a new product category"
              : "Update category information"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form className="category-form__card" onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="category-form__section">
          <div className="category-form__section-header">
            <h2>Category Information</h2>
            <p>Enter the basic category details.</p>
          </div>

          <div className="category-form__row">
            {/* Category Name */}
            <div className="category-form__group">
              <label htmlFor="category_name">
                Category Name
                <span>*</span>
              </label>

              <input
                id="category_name"
                name="category_name"
                type="text"
                placeholder="e.g. Lawn"
                value={formData.category_name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category Image */}
            <div className="category-form__group">
              <label htmlFor="category_image">
                Category Image
                <span>*</span>
              </label>

              <input
                id="category_image"
                name="category_image"
                type="text"
                placeholder="Enter image URL"
                value={formData.category_image}
                onChange={handleChange}
                required
              />

              <small>Example: https://example.com/lawn.jpg</small>
            </div>
          </div>

          {/* Category Slogan */}
          <div className="category-form__group">
            <label htmlFor="category_slogan">
              Category Slogan
              <span>*</span>
            </label>

            <input
              id="category_slogan"
              name="category_slogan"
              type="text"
              placeholder="e.g. Elegant lawn collection"
              value={formData.category_slogan}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Actions */}
        <div className="category-form__actions">
          <button
            type="button"
            className="category-form__cancel"
            onClick={() => navigate("/admin/categories")}
            disabled={isLoading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="category-form__submit"
            disabled={isLoading}
          >
            {isLoading
              ? mode === "add"
                ? "Adding..."
                : "Updating..."
              : mode === "add"
                ? "Add Category"
                : "Update Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
