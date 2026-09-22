import { NavLink } from "react-router-dom";

import "./AdminSidebar.scss";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__logo">
        LIBAAS
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
      </nav>

      <div className="admin-sidebar__bottom">
        <NavLink to="/" className="admin-sidebar__store">
          ← View Store
        </NavLink>

        <button type="button" className="admin-sidebar__logout">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
