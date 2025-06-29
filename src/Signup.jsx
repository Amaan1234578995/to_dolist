import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async (username, password) => {
    setAuthLoading(true);
    setAuthError("");
    setSuccess(false);

    try {
      const response = await fetch("https://to-do-backend-s0dj.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setAuthLoading(false);

      if (data.message === "User registered") {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setAuthError(data.message || "Signup failed");
      }
    } catch (error) {
      setAuthLoading(false);
      setAuthError("Failed to connect to server. Please try again.");
      console.error("Signup error:", error);
    }
  };

  return (
    <>
      <style>
        {`
          .signup-container {
            max-width: 28rem;
            margin: 4rem auto;
            padding: 2rem;
            background-color: #fff7ed;
            border-radius: 0.75rem;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
            border: 1px solid #fed7aa;
            font-family: Arial, sans-serif;
          }

          .signup-title {
            font-size: 1.875rem;
            font-weight: 800;
            color: #ea580c;
            text-align: center;
            margin-bottom: 1.5rem;
          }

          .message-error {
            margin-bottom: 0.75rem;
            text-align: center;
            color: #dc2626;
            font-weight: 600;
          }

          .message-success {
            margin-bottom: 0.75rem;
            text-align: center;
            color: #16a34a;
            font-weight: 600;
          }

          .signup-input {
            padding: 0.75rem;
            border: 2px solid #fdba74;
            border-radius: 0.375rem;
            width: 100%;
            margin-bottom: 1rem;
            outline: none;
          }

          .signup-input:focus {
            border-color: #fb923c;
            box-shadow: 0 0 0 2px rgba(251, 146, 60, 0.5);
          }

          .signup-button {
            padding: 0.5rem 1rem;
            background-color: #f97316;
            color: white;
            font-weight: 700;
            border: none;
            border-radius: 0.375rem;
            width: 100%;
            transition: background-color 0.2s;
            cursor: pointer;
          }

          .signup-button:hover {
            background-color: #ea580c;
          }

          .signup-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .signup-footer {
            margin-top: 1.25rem;
            text-align: center;
            color: #374151;
          }

          .signup-link {
            color: #ea580c;
            font-weight: 600;
            text-decoration: none;
            margin-left: 0.25rem;
          }

          .signup-link:hover {
            text-decoration: underline;
          }
        `}
      </style>

      <div className="signup-container">
        <h2 className="signup-title">Sign Up</h2>
        {authError && <div className="message-error">{authError}</div>}
        {success && (
          <div className="message-success">
            Registration successful! Redirecting to login...
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            signup(username, password);
          }}
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="signup-input"
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className="signup-button"
            disabled={authLoading}
          >
            {authLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="signup-footer">
          Already have an account?{" "}
          <Link to="/login" className="signup-link">
            Login
          </Link>
        </div>
      </div>
    </>
  );
}

export default Signup;
