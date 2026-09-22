import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CategoryForm.scss";

export interface CategoryFormData {
  name: string;
  slug: string;
  status: "Active" | "Inactive";
  description: string;
}

interface CategoryFormProps {
  mode: "add" | "edit";
  initialData?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => void;
}

const emptyForm: CategoryFormData = {
  name: "",
  slug: "",
  status: "Active",
  description: "",
};

const CategoryForm = ({ mode, initialData, onSubmit }: CategoryFormProps) => {
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
            {/* Name */}
            <div className="category-form__group">
              <label htmlFor="name">
                Category Name
                <span>*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Lawn"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Slug */}
            <div className="category-form__group">
              <label htmlFor="slug">
                Slug
                <span>*</span>
              </label>

              <input
                id="slug"
                name="slug"
                type="text"
                placeholder="e.g. lawn"
                value={formData.slug}
                onChange={handleChange}
                required
              />

              <small>Used in URLs. Example: lawn, cotton, boski</small>
            </div>
          </div>

          {/* Status */}
          <div className="category-form__group">
            <label htmlFor="status">Status</label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Description */}
          <div className="category-form__group">
            <label htmlFor="description">Description</label>

            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Write a short description..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="category-form__actions">
          <button
            type="button"
            className="category-form__cancel"
            onClick={() => navigate("/admin/categories")}
          >
            Cancel
          </button>

          <button type="submit" className="category-form__submit">
            {mode === "add" ? "Add Category" : "Update Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
