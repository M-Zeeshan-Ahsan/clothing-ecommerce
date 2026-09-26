import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../store/store";

const ProtectedRoute = () => {
  const { isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth,
  );

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
