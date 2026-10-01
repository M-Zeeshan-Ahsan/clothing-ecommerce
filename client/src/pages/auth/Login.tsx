import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";

import { useLoginMutation } from "../../store/api/authApi";
import { login } from "../../store/slices/authSlice";
import { getApiErrorMessage } from "../../utils/apiError";
import { showToast } from "../../utils/toast";

import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginUser, { isLoading }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);

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

          <h1>Login to ESHANI</h1>

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

            <div className="auth-page__password">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="auth-page__password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
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
