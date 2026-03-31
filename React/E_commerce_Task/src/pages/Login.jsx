import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../services/UserServices";
import { useAuth } from "../context/AuthContext"; // ✅ NEW

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth(); // ✅ use context

  const handleLogin = (e) => {
    e.preventDefault();

    getUsers()
      .then((users) => {
        const foundUser = users.find((u) => u.email === email);

        if (!foundUser) {
          alert("Invalid Email");
          return;
        }

        if (foundUser.password !== password) {
          alert("Incorrect Password");
          return;
        }

        // ✅ save using context (NOT localStorage directly)
        login(foundUser);

        alert("Login Successful");

        // ✅ redirect after login
        navigate("/carts");
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong");
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email} // ✅ controlled input
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password} // ✅ controlled input
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <span className="forgot">Forgot Password?</span>
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>

          <p className="signup-text">
            Don't have an account? <span>Sign up</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;