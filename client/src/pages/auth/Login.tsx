import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useLoginMutation } from "../../store/api/authApi";
import { login } from "../../store/slices/authSlice";
import { getApiErrorMessage } from "../../utils/apiError";
import { showToast } from "../../utils/toast";

import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginUser, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await loginUser(formData).unwrap();

      dispatch(
        login({
          user: result.data.user,
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        }),
      );

      showToast(result.message, "success");

      navigate("/");
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__header">
          <span className="auth-page__eyebrow">WELCOME BACK</span>

          <h1>Login to LIBAAS</h1>

          <p>Sign in to your account to continue shopping.</p>
        </div>

        <form className="auth-page__form" onSubmit={handleSubmit}>
          <div className="auth-page__field">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-page__field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-page__button"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-page__footer">
          <span>Don't have an account?</span>

          <Link to="/register">Create Account</Link>
        </div>
      </div>
    </main>
  );
};

export default Login;
