import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AdminLogin.scss";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      email,
      password,
    });
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
            />
          </div>

          <button type="submit" className="admin-login__button">
            Sign In
          </button>
        </form>

        <button
          type="button"
          className="admin-login__back"
          onClick={() => navigate("/")}
        >
          ← Back to Store
        </button>
      </div>
    </main>
  );
};

export default AdminLogin;
