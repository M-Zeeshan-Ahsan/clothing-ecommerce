import { Link, useParams } from "react-router-dom";

import UserForm, {
  type UserFormData,
} from "../../../components/admin/user/UserForm";

import "./EditUser.scss";

const EditUser = () => {
  const { id } = useParams();

  const initialData: UserFormData = {
    name: "Ahmed Khan",
    email: "ahmed@example.com",
    phone: "0300-1234567",
    role: "User",
    status: "Active",
    password: "",
  };

  const handleSubmit = (data: UserFormData) => {
    console.log("User ID:", id);
    console.log("Update User:", data);
  };

  return (
    <div className="edit-user">
      <div className="edit-user__header">
        <Link to="/admin/users" className="edit-user__back">
          ← Back to Users
        </Link>

        <h1>Edit User</h1>

        <p>Update user information and account settings.</p>
      </div>

      <UserForm mode="edit" initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditUser;
