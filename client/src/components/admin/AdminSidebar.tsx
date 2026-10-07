import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logout } from "../../store/slices/authSlice";
import { baseApi } from "../../store/api/baseApi";
import { useGetUnreadContactMessageCountQuery } from "../../store/api/contactApi";
import { showToast } from "../../utils/toast";

import "./AdminSidebar.scss";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: unreadData } = useGetUnreadContactMessageCountQuery();

  const unreadCount = unreadData?.data.unreadCount ?? 0;

  const handleLogout = () => {
    dispatch(logout());

    // Clear RTK Query cache
    dispatch(baseApi.util.resetApiState());

    showToast("Admin logged out successfully", "success");

    navigate("/admin/login");
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__logo">
        ESHANI
        <span>ADMIN</span>
      </div>

      <nav className="admin-sidebar__nav">
        <p className="admin-sidebar__label">MAIN</p>

        <NavLink to="/admin" end className="admin-sidebar__link">
          <span>⌂</span>
          Dashboard
        </NavLink>

        <p className="admin-sidebar__label">CATALOG</p>

        <NavLink to="/admin/products" className="admin-sidebar__link">
          <span>▣</span>
          Products
        </NavLink>

        <NavLink to="/admin/categories" className="admin-sidebar__link">
          <span>▤</span>
          Categories
        </NavLink>

        <p className="admin-sidebar__label">SALES</p>

        <NavLink to="/admin/orders" className="admin-sidebar__link">
          <span>▢</span>
          Orders
        </NavLink>

        <p className="admin-sidebar__label">CUSTOMERS</p>

        <NavLink to="/admin/users" className="admin-sidebar__link">
          <span>♙</span>
          Users
        </NavLink>

        <NavLink to="/admin/contact-messages" className="admin-sidebar__link">
          <span>✉</span>
          Customer Queries
          {unreadCount > 0 && (
            <span className="admin-sidebar__badge">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </NavLink>
      </nav>

      <div className="admin-sidebar__bottom">
        <NavLink to="/" className="admin-sidebar__store">
          ← View Store
        </NavLink>

        <button
          type="button"
          className="admin-sidebar__logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
