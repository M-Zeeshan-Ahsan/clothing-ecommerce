import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import useDebounce from "../../../hooks/useDebounce";
import Pagination from "../../../components/common/pagination/Pagination";
import { showToast } from "../../../utils/toast";
import { getApiErrorMessage } from "../../../utils/apiError";
import {
  useGetAdminUsersQuery,
  useDeleteAdminUserMutation,
  type UserRole as ApiUserRole,
} from "../../../store/api/userApi";

import "./Users.scss";
import Loader from "../../../components/common/loader/Loader";

type UserRole = "Admin" | "User";

const USERS_PER_PAGE = 5;

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [roleFilter, setRoleFilter] = useState<"All" | UserRole>("All");

  const [currentPage, setCurrentPage] = useState(1);

  const apiRole: ApiUserRole | undefined =
    roleFilter === "All"
      ? undefined
      : roleFilter === "Admin"
        ? "ADMIN"
        : "USER";

  const { data, isLoading, isFetching, isError } = useGetAdminUsersQuery({
    page: currentPage,
    limit: USERS_PER_PAGE,
    search: debouncedSearch.trim(),
    role: apiRole,
  });
  const [deleteAdminUser, { isLoading: isDeleting }] =
    useDeleteAdminUserMutation();
  const users = data?.data.users ?? [];
  const pagination = data?.data.pagination;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) return;

    try {
      await deleteAdminUser(id).unwrap();

      showToast("User deleted successfully", "success");
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    }
  };
  if (isLoading || isDeleting) {
    return <Loader />;
  }
  return (
    <div className="admin-users">
      {/* Header */}
      <div className="admin-users__header">
        <div>
          <h1>Users</h1>
          <p>Manage registered users and their roles.</p>
        </div>

        <Link to="/admin/users/add" className="admin-users__add-btn">
          <UserPlus size={18} />
          Add User
        </Link>
      </div>

      {/* Filters */}
      <div className="admin-users__filters">
        <div className="admin-users__search">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as "All" | UserRole)}
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
      </div>

      {/* Table */}
      <div className="admin-users__table-wrapper">
        <table className="admin-users__table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Orders</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={5} className="admin-users__empty">
                  Loading users...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="admin-users__empty">
                  Failed to load users.
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => {
                const role: UserRole = user.role === "ADMIN" ? "Admin" : "User";

                return (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-cell__avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <strong>{user.name}</strong>
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`role-badge role-badge--${role.toLowerCase()}`}
                      >
                        {role}
                      </span>
                    </td>

                    <td>{user._count.orders}</td>

                    <td>
                      {new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td>
                      <div className="user-actions">
                        <Link
                          to={`/admin/users/edit/${user.id}`}
                          className="user-actions__edit"
                          title="Edit User"
                        >
                          <Pencil size={17} />
                        </Link>

                        <button
                          type="button"
                          className="user-actions__delete"
                          title="Delete User"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="admin-users__empty">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="admin-users__footer">
        <p>
          Showing{" "}
          {pagination && pagination.total > 0
            ? (pagination.page - 1) * pagination.limit + 1
            : 0}{" "}
          to{" "}
          {pagination
            ? Math.min(pagination.page * pagination.limit, pagination.total)
            : 0}{" "}
          of {pagination?.total ?? 0} users
        </p>

        <Pagination
          currentPage={pagination?.page ?? currentPage}
          totalPages={pagination?.totalPages ?? 1}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Users;
