import { useState } from "react";
import api from '../lib/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    accountNumber: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/login", formData);
      localStorage.setItem("user", JSON.stringify(res.data.user.fullName))
      alert(`Welcome, ${res.data.user.fullName}!`);
      setLoading(false);
      navigate("/pastPayments")
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h1>Sign In</h1>
        {error && (<div>{error}</div>)}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Enter your username" required/>
          </div>
          <div>
            <label>Account Number</label>
            <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange}placeholder="Enter account number" required/>
          </div>
          <div>
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
          </div>
          <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
        </form>
        <p>Don't have an account?<a href="/register">Register</a></p>
      </div>
    </div>
  );
}
