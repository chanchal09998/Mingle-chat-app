import React, { useState } from "react";
import { toast } from "react-hot-toast";
import "./Signup.css";
import axios from "axios"; // Import Axios
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !name || !password) {
      toast.error("All fields are required!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:3000/api/signup", {
        email,
        name,
        password,
      });

      toast.success("Signup successful!");
      // Clear form
      setEmail("");
      setName("");
      setPassword("");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-header">SIGN UP</h2>
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
          <label htmlFor="name" className="label">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
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
            Sign Up
          </button>
        </div>
        <p>
          already have account <Link to={"/login"}>log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
