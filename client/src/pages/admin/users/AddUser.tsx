import { Link, useNavigate } from "react-router-dom";

import UserForm, {
  type UserFormData,
} from "../../../components/admin/user/UserForm";

import { useCreateAdminUserMutation } from "../../../store/api/userApi";

import { getApiErrorMessage } from "../../../utils/apiError";

import { showToast } from "../../../utils/toast";

import "./AddUser.scss";

const AddUser = () => {
  const navigate = useNavigate();

  const [createAdminUser, { isLoading: isCreating }] =
    useCreateAdminUserMutation();

  const handleSubmit = async (data: UserFormData) => {
    try {
      await createAdminUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role === "Admin" ? "ADMIN" : "USER",
      }).unwrap();

      showToast("User created successfully", "success");

      navigate("/admin/users");
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    }
  };

  return (
    <div className="add-user">
      <div className="add-user__header">
        <Link to="/admin/users" className="add-user__back">
          ← Back to Users
        </Link>

        <h1>Add User</h1>

        <p>Create a new user account and assign account settings.</p>
      </div>

      <UserForm mode="add" onSubmit={handleSubmit} isSubmitting={isCreating} />
    </div>
  );
};

export default AddUser;
