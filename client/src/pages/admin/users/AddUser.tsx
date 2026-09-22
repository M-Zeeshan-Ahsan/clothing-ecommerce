import { Link } from "react-router-dom";

import UserForm, {
  type UserFormData,
} from "../../../components/admin/user/UserForm";
import "./AddUser.scss";

const AddUser = () => {
  const handleSubmit = (data: UserFormData) => {
    console.log("Add User:", data);
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

      <UserForm mode="add" onSubmit={handleSubmit} />
    </div>
  );
};

export default AddUser;
