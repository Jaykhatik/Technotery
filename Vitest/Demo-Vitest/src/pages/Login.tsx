import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Login.css";

type LoginResponse = {
  token: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
};

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post<LoginResponse>(
        "https://dummyjson.com/auth/login",
        {
          username,
          password,
        }
      );

      console.log(res.data);
      localStorage.setItem("token", res.data.token);

      toast.success(`Welcome back, ${res.data.firstName}!`);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (err) {
      console.log(err);
      toast.error("Invalid Username or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <form
        className="login-box"
        onSubmit={handleLogin}
      >
        <h1 className="login-title">
          Login
        </h1>

        {/* Username */}
        <div className="input-group">
          <label>Username</label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />
        </div>

        {/* Password */}
        <div className="input-group">
          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="login-btn"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

// username: emilys
// password: emilyspass