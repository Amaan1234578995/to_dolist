import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ setToken }) {
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (username, password) => {
    setAuthLoading(true);
    setAuthError("");

    const response = await fetch("https://to-do-backend-s0dj.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    setAuthLoading(false);

    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/");
    } else {
      setAuthError(data.message || "Login failed");
    }
  };

  return (
    <>
      <style>
        {`
          .login-container {
            max-width: 28rem;
            margin: 4rem auto;
            padding: 2rem;
            background-color: #fff7ed;
            border: 1px solid #fed7aa;
            border-radius: 0.5rem;
          }

          .login-title {
            font-size: 1.875rem;
            font-weight: 800;
            color: #ea580c;
            text-align: center;
            margin-bottom: 1.5rem;
          }

          .login-error {
            margin-bottom: 1rem;
            text-align: center;
            color: #dc2626;
            font-weight: 600;
          }

          .login-input {
            padding: 0.75rem;
            border: 2px solid #fdba74;
            border-radius: 0.375rem;
            width: 100%;
            margin-bottom: 1rem;
            outline: none;
          }

          .login-input:focus {
            border-color: #fb923c;
            box-shadow: 0 0 0 2px rgba(251, 146, 60, 0.5);
          }

          .login-button {
            padding: 0.5rem 1rem;
            background-color: #f97316;
            color: white;
            font-weight: 500;
            border: none;
            border-radius: 0.375rem;
            width: 100%;
            transition: background-color 0.2s;
            cursor: pointer;
          }

          .login-button:hover {
            background-color: #ea580c;
          }

          .login-footer {
            margin-top: 1.25rem;
            text-align: center;
            color: #374151;
          }

          .signup-link {
            color: #f97316;
            font-weight: 600;
            margin-left: 0.25rem;
            text-decoration: none;
          }

          .signup-link:hover {
            text-decoration: underline;
          }
        `}
      </style>

      <div className="login-container">
        <h2 className="login-title">Login</h2>
        {authError && <div className="login-error">{authError}</div>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login(username, password);
          }}
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            placeholder="Password"
          />
          <button type="submit" className="login-button">
            {authLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="login-footer">
          Don't have an account?{" "}
          <Link to="/signup" className="signup-link">
            Signup
          </Link>
        </div>
      </div>
    </>
  );
}
