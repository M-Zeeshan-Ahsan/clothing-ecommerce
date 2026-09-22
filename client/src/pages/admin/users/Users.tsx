import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, UserPlus } from "lucide-react";

import Pagination from "../../../components/common/pagination/Pagination";

import "./Users.scss";

type UserRole = "Admin" | "User";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  orders: number;
  joinedDate: string;
  status: "Active" | "Inactive";
}

const USERS_PER_PAGE = 5;

const Users = () => {
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: 1,
      name: "Ahmed Khan",
      email: "ahmed@example.com",
      phone: "0300-1234567",
      role: "User",
      orders: 8,
      joinedDate: "20 Sep 2026",
      status: "Active",
    },
    {
      id: 2,
      name: "Ali Raza",
      email: "ali@example.com",
      phone: "0312-9876543",
      role: "User",
      orders: 12,
      joinedDate: "18 Sep 2026",
      status: "Active",
    },
    {
      id: 3,
      name: "Sara Ahmed",
      email: "sara@example.com",
      phone: "0321-4567890",
      role: "Admin",
      orders: 5,
      joinedDate: "15 Sep 2026",
      status: "Active",
    },
    {
      id: 4,
      name: "Hassan Malik",
      email: "hassan@example.com",
      phone: "0333-1112233",
      role: "User",
      orders: 3,
      joinedDate: "12 Sep 2026",
      status: "Active",
    },
    {
      id: 5,
      name: "Usman Tariq",
      email: "usman@example.com",
      phone: "0345-5556677",
      role: "User",
      orders: 15,
      joinedDate: "10 Sep 2026",
      status: "Inactive",
    },
    {
      id: 6,
      name: "Fatima Noor",
      email: "fatima@example.com",
      phone: "0301-2223344",
      role: "User",
      orders: 6,
      joinedDate: "08 Sep 2026",
      status: "Active",
    },
    {
      id: 7,
      name: "Hamza Shah",
      email: "hamza@example.com",
      phone: "0302-3334455",
      role: "User",
      orders: 9,
      joinedDate: "05 Sep 2026",
      status: "Active",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | UserRole>("All");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive"
  >("All");

  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.phone.includes(search);

      const matchesRole = roleFilter === "All" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE,
  );

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) return;

    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

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
            placeholder="Search by name, email or phone..."
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

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "All" | "Active" | "Inactive")
          }
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="admin-users__table-wrapper">
        <table className="admin-users__table">
          <thead>
            <tr>
              <th>User</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Orders</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
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

                  <td>{user.phone}</td>

                  <td>
                    <span
                      className={`role-badge role-badge--${user.role.toLowerCase()}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>{user.orders}</td>

                  <td>
                    <span
                      className={`status-badge status-badge--${user.status.toLowerCase()}`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td>{user.joinedDate}</td>

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
              ))
            ) : (
              <tr>
                <td colSpan={7} className="admin-users__empty">
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
          {filteredUsers.length > 0
            ? (currentPage - 1) * USERS_PER_PAGE + 1
            : 0}{" "}
          to {Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length)} of{" "}
          {filteredUsers.length} users
        </p>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Users;
