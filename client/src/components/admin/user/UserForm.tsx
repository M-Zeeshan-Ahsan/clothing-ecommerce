import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import "./UserForm.scss";

export type UserRole = "Admin" | "User";

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
}

interface UserFormProps {
  mode: "add" | "edit";
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => void;
  isSubmitting?: boolean;
}

const defaultData: UserFormData = {
  name: "",
  email: "",
  role: "User",
  password: "",
  confirmPassword: "",
};

const UserForm = ({
  mode,
  initialData,
  onSubmit,
  isSubmitting = false,
}: UserFormProps) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserFormData>(
    initialData || defaultData,
  );

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
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

    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (mode === "add" && !formData.password) {
      setError("Password is required");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password and confirm password do not match");
      return;
    }

    setError("");

    onSubmit(formData);
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <div className="user-form__grid">
        {/* Name */}
        <div className="user-form__field">
          <label htmlFor="name">Full Name</label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        {/* Email */}
        <div className="user-form__field">
          <label htmlFor="email">Email Address</label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        {/* Role */}
        <div className="user-form__field">
          <label htmlFor="role">Role</label>

          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {/* Password */}
        <div className="user-form__field">
          <label htmlFor="password">
            Password
            {mode === "edit" && <span> (optional)</span>}
          </label>

          <div className="user-form__password">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={
                mode === "edit"
                  ? "Leave blank to keep current password"
                  : "Enter password"
              }
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            <button
              type="button"
              className="user-form__password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isSubmitting}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="user-form__field">
          <label htmlFor="confirmPassword">Confirm Password</label>

          <div className="user-form__password">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            <button
              type="button"
              className="user-form__password-toggle"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              disabled={isSubmitting}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      {error && <p className="user-form__error">{error}</p>}

      <div className="user-form__actions">
        <button
          type="button"
          className="user-form__cancel"
          onClick={() => navigate("/admin/users")}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="user-form__submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? mode === "add"
              ? "Creating..."
              : "Updating..."
            : mode === "add"
              ? "Create User"
              : "Update User"}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
