import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useLoginMutation } from "../../../store/api/authApi";
import { login } from "../../../store/slices/authSlice";
import { showToast } from "../../../utils/toast";
import { getApiErrorMessage } from "../../../utils/apiError";

import "./AdminLogin.scss";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginUser, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await loginUser({
        email,
        password,
      }).unwrap();

      const { user, accessToken } = response.data;

      // Only ADMIN can access admin panel
      if (user.role !== "ADMIN") {
        showToast("Access denied. Admin account required.", "error");

        return;
      }

      dispatch(
        login({
          user,
          accessToken,
        }),
      );

      showToast("Admin logged in successfully", "success");

      navigate("/admin");
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    }
  };

  return (
    <main className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__brand">
          <h1>LIBAAS</h1>
          <span>ADMIN PANEL</span>
        </div>

        <div className="admin-login__header">
          <h2>Welcome Back</h2>
          <p>Sign in to manage your store.</p>
        </div>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="admin-login__field">
            <label htmlFor="admin-email">Email Address</label>

            <input
              id="admin-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="admin-login__field">
            <label htmlFor="admin-password">Password</label>

            <input
              id="admin-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="admin-login__button"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <button
          type="button"
          className="admin-login__back"
          onClick={() => navigate("/")}
          disabled={isLoading}
        >
          ← Back to Store
        </button>
      </div>
    </main>
  );
};

export default AdminLogin;
