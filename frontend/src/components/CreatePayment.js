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
    swiftCode: "",
  });

  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "serviceProvider") {
      setShowAccountInfo(value !== "");
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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-[#007786] mb-4 text-center">Create Payment</h2>
      {message && (
        <p className="text-center text-white bg-[#007786] px-4 py-2 rounded mb-4">{message}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Amount:</label>
          <input
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007786]"
          />
        </div>

        {/* Currency */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Currency:</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007786]"
          >
            <option value="">Select currency</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="ZAR">ZAR</option>
          </select>
        </div>

        {/* Service Provider */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Service Provider:</label>
          <select
            name="serviceProvider"
            value={formData.serviceProvider}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007786]"
          >
            <option value="">
              Select provider
            </option>
            <option value="FNB">First National Bank</option>
            <option value="Standard Bank">Standard Bank</option>
            <option value="Absa">Absa</option>
            <option value="Nedbank">Nedbank</option>
            <option value="Capitec">Capitec</option>
            <option value="Discovery">Discovery</option>
            <option value="African Bank">African Bank</option>
          </select>
        </div>

        {/* Account Information */}
        {showAccountInfo && (
          <div className="border-t border-gray-300 pt-4 space-y-3">
            <h3 className="text-xl font-semibold text-[#007786] mb-2">Specify Account Information</h3>
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Account Number:</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007786]"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Branch Code:</label>
              <input
                type="text"
                name="branchCode"
                value={formData.branchCode}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007786]"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Account Type:</label>
              <input
                type="text"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007786]"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Account Holder Name:</label>
              <input
                type="text"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007786]"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">SWIFT Code:</label>
              <input
                type="text"
                name="swiftCode"
                value={formData.swiftCode}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007786]"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 mt-4 rounded text-white font-bold ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#007786] hover:bg-[#00666a]"
          } transition-colors`}
        >
          {loading ? "Processing Payment..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}
