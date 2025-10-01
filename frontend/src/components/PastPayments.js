import React, { useEffect, useState } from "react";
import api from "../lib/axios";

export default function PastPayments() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/api/pastPayments", { withCredentials: true }); 
        setPayments(res.data);
      } catch (err) {
        console.error(err);
        setError("Error fetching payments");
      }
    };

    fetchPayments();
  }, []);

  return (
    <div>
      <h2>Payments</h2>
      {error && <p>{error}</p>}
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <ul>
          {payments.map((payment) => (
            <li key={payment._id}>
              Amount: {payment.amount} | Date: {payment.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
