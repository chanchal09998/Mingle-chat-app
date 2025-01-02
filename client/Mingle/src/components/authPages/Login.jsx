import React, { useState } from "react";
import { toast } from "react-hot-toast";
import "./Login.css";
import axios from "axios"; // Import Axios
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      toast.error("All fields are required!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });
      console.log(data);
      const expiryTime = new Date().getTime() + 1000 * 60 * 60 * 24 * 7; // Token expires in 7 days (in milliseconds)
      localStorage.setItem("mingle-sender-id", data.user._id);
      localStorage.setItem("mingle-name", data.user.name);
      localStorage.setItem("mingle-email", data.user.email);
      localStorage.setItem("mingle-token", data.token);
      localStorage.setItem("mingle-token-expiry", expiryTime);
      toast.success("Login successful!");

      // Clear form
      setEmail("");
      setPassword("");
      setTimeout(() => {
        navigate(`/${data.user._id}`);
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-header">LOG IN</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="input-group">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="input"
          />
        </div>

        <div className="button-container">
          <button type="submit" className="submit-btn">
            Log In
          </button>
        </div>
        <p>
          don't have account <Link to={"/signup"}>sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
