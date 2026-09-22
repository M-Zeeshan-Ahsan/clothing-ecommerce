import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./UserForm.scss";

export type UserRole = "Admin" | "User";
export type UserStatus = "Active" | "Inactive";

export interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  password: string;
}

interface UserFormProps {
  mode: "add" | "edit";
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => void;
}

const defaultData: UserFormData = {
  name: "",
  email: "",
  phone: "",
  role: "User",
  status: "Active",
  password: "",
};

const UserForm = ({ mode, initialData, onSubmit }: UserFormProps) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserFormData>(
    initialData || defaultData,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
    <form className="user-form" onSubmit={handleSubmit}>
      {/* Personal Information */}
      <section className="user-form__card">
        <div className="user-form__card-header">
          <h2>Personal Information</h2>
        </div>

        <div className="user-form__fields">
          <div className="user-form__group">
            <label htmlFor="name">Full Name</label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="user-form__group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="user-form__group">
            <label htmlFor="phone">Phone Number</label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>
      </section>

      {/* Account Settings */}
      <section className="user-form__card">
        <div className="user-form__card-header">
          <h2>Account Settings</h2>
        </div>

        <div className="user-form__fields">
          <div className="user-form__group">
            <label htmlFor="role">User Role</label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>

            <small>Admin users can access the admin dashboard.</small>
          </div>

          <div className="user-form__group">
            <label htmlFor="status">Account Status</label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <small>Inactive users cannot access their account.</small>
          </div>

          <div className="user-form__group">
            <label htmlFor="password">
              {mode === "add" ? "Password" : "New Password"}
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={
                mode === "add"
                  ? "Enter password"
                  : "Leave empty to keep current password"
              }
              required={mode === "add"}
            />

            {mode === "edit" && (
              <small>
                Leave empty if you don't want to change the password.
              </small>
            )}
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="user-form__actions">
        <button
          type="button"
          className="user-form__cancel"
          onClick={() => navigate("/admin/users")}
        >
          Cancel
        </button>

        <button type="submit" className="user-form__submit">
          {mode === "add" ? "Add User" : "Update User"}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
