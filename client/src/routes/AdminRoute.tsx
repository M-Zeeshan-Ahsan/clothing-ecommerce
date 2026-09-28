import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../store/store";

const AdminRoute = () => {
  const { user, isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth,
  );

  // User login nahi hai
  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/admin/login" replace />;
  }

  // User login hai lekin ADMIN nahi hai
  if (user?.role !== "ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }

  // ADMIN hai
  return <Outlet />;
};

export default AdminRoute;
