import { Link, useNavigate, useParams } from "react-router-dom";
import UserForm, {
  type UserFormData,
} from "../../../components/admin/user/UserForm";
import {
  useGetAdminUserByIdQuery,
  useUpdateAdminUserMutation,
} from "../../../store/api/userApi";
import { getApiErrorMessage } from "../../../utils/apiError";
import { showToast } from "../../../utils/toast";
import "./EditUser.scss";
const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = Number(id);
  const { data, isLoading, isError } = useGetAdminUserByIdQuery(userId, {
    skip: !id || Number.isNaN(userId),
  });
  const [updateAdminUser, { isLoading: isUpdating }] =
    useUpdateAdminUserMutation();
  const user = data?.data;
  const handleSubmit = async (formData: UserFormData) => {
    if (!user) return;
    try {
      await updateAdminUser({
        id: user.id,
        name: formData.name,
        email: formData.email,
        role: formData.role === "Admin" ? "ADMIN" : "USER",
        ...(formData.password && { password: formData.password }),
      }).unwrap();
      showToast("User updated successfully", "success");
      navigate("/admin/users");
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    }
  };
  if (isLoading) {
    return (
      <div className="edit-user">
        {" "}
        <p>Loading user...</p>{" "}
      </div>
    );
  }
  if (isError || !user) {
    return (
      <div className="edit-user">
        {" "}
        <div className="edit-user__header">
          {" "}
          <Link to="/admin/users" className="edit-user__back">
            {" "}
            ← Back to Users{" "}
          </Link>{" "}
          <h1>User Not Found</h1>{" "}
          <p> The requested user could not be found. </p>{" "}
        </div>{" "}
      </div>
    );
  }
  const initialData: UserFormData = {
    name: user.name,
    email: user.email,
    role: user.role === "ADMIN" ? "Admin" : "User",
    password: "",
    confirmPassword: "",
  };
  return (
    <div className="edit-user">
      {" "}
      <div className="edit-user__header">
        {" "}
        <Link to="/admin/users" className="edit-user__back">
          {" "}
          ← Back to Users{" "}
        </Link>{" "}
        <h1>Edit User</h1>{" "}
        <p> Update user information and account settings. </p>{" "}
      </div>{" "}
      <UserForm
        mode="edit"
        initialData={initialData}
        onSubmit={handleSubmit}
        isSubmitting={isUpdating}
      />{" "}
    </div>
  );
};
export default EditUser;
