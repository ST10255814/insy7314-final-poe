import { useState } from "react";
import api from "../lib/axios"; 

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    accountNumber: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.post("/api/register", formData);
      setSuccess(res.data.message || "User registered successfully!");
      setFormData({
        fullName: "",
        idNumber: "",
        accountNumber: "",
        username: "",
        password: "",
      });
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Register</h1>

      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>ID Number:</label>
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Account Number:</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <p>
          Already have an account?{" "}
          <a href="/login">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
