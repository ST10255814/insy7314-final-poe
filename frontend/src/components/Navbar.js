import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/axios';

export default function Navbar() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
  try {
    const res = await api.post('/api/logout', {}, { withCredentials: true });
    setMessage(res.data.message); // Show success message
    setError(""); // Clear any previous error
    localStorage.removeItem("user"); // Clear user info
    navigate("/login"); // Redirect to login page

    // Clear the message after 3 seconds
    setTimeout(() => {
      setMessage("");
    }, 3000);

  } catch (err) {
    setError(err.response?.data?.error || "Logout failed");
    setMessage(""); //Clear message

    // Clear the error after 3 seconds
    setTimeout(() => {
      setError("");
    }, 3000);

    console.error("Logout error:", err);
  }
};

  return (
    <nav>
      <h1>International Payment System</h1>
      <div>
        {/*Assign nav bar depending on if the user is logged in or not*/}
        {user ? (
          <div>
            <Link to="/pastPayments">Past Payments</Link> 
            <Link to="/createPayment">Make a Payment</Link>  
            <span>Welcome, {user}</span>  
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>
            <Link to="/login">Login</Link>  
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </nav>
  );
}
