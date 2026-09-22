import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";

import "./AdminLayout.scss";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div
        className={`admin-layout__mobile-overlay ${
          sidebarOpen ? "active" : ""
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="admin-layout__main">
        <AdminHeader onMenuClick={() => setSidebarOpen((prev) => !prev)} />

        <main className="admin-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
