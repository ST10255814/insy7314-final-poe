import React, { useState } from "react";
import api from "../lib/axios";

export default function CreatePayment() {
  const [formData, setFormData] = useState({
    amount: "",
    currency: "",
    serviceProvider: "",
    accountNumber: "",
    branchCode: "",
    accountType: "",
    accountHolderName: "",
    swiftCode: ""
  });

  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "serviceProvider") {
      setShowAccountInfo(value !== ""); // show fields only if provider is selected and set the value of those fields to empty
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/createPayment", formData, { withCredentials: true });
      setMessage(`Payment created successfully! ID: ${res.data.id}`);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setMessage("Error creating payment");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Payment</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount:</label>
          <input name="amount" value={formData.amount} onChange={handleChange} required />
        </div>
        <div>
          <label>Currency:</label>
          <select name="currency" value={formData.currency} onChange={handleChange} required>
            <option value="">Select currency</option>
            <option value="USD">ZAR</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="ZAR">USD</option>
          </select>
        </div>
        <div>
          <label>Service Provider:</label>
          <select name="serviceProvider" value={formData.serviceProvider} onChange={handleChange} required>
            <option value="" disabled>Select provider</option>
            <option value="FNB">First National Bank</option>
            <option value="Standard Bank">Standard Bank</option>
            <option value="Absa">Absa</option>
            <option value="Nedbank">Nedbank</option>
            <option value="Capitec">Capitec</option>
            <option value="Discovery">Discovery</option>
            <option value="African Bank">African Bank</option>
          </select>
        </div>
        {showAccountInfo && (
          <div>
            <h3>Account Information</h3>
            <div>
              <label>Account Number:</label>
              <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required />
            </div>
            <div>
              <label>Branch Code:</label>
              <input type="text" name="branchCode" value={formData.branchCode} onChange={handleChange} required />
            </div>
            <div>
              <label>Account Type:</label>
              <input type="text" name="accountType" value={formData.accountType} onChange={handleChange} required />
            </div>
            <div>
              <label>Account Holder Name:</label>
              <input type="text" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} required />
            </div>
            <div>
              <label>SWIFT Code:</label>
              <input type="text" name="swiftCode" value={formData.swiftCode} onChange={handleChange} required />
            </div>
          </div>
        )}
        <button type="submit" disabled={loading}>{loading ? "Processing Payment" : "Pay Now"}</button>
      </form>
    </div>
  );
}
