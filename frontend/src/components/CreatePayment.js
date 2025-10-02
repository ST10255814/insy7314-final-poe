import React, { useState } from "react";
import api from "../lib/axios";
import { toast, Slide } from "react-toastify";

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
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const res = await api.post("/api/createPayment", formData, {
        withCredentials: true,
      });
      await new Promise((resolve) => setTimeout(resolve, 3000));
      toast.success(
        res.data.message || `Payment created successfully! ID: ${res.data.id}`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Slide,
        }
      );
      setLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Slide,
      });
      setLoading(false);
    }
  };
  //https://chatgpt.com/share/68de8211-c89c-8012-b72d-63542a20d6b1
  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white shadow-xl rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-[#007786] mb-6 text-center">
        Create Payment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount & Currency side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-gray-700">Amount:</label>
            <input
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="1200"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007786]"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-gray-700">
              Currency:
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007786]"
            >
              <option value="">Select currency</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="ZAR">ZAR</option>
            </select>
          </div>
        </div>

        {/* Service Provider */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">
            Service Provider:
          </label>
          <select
            name="serviceProvider"
            value={formData.serviceProvider}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007786]"
          >
            <option value="">Select provider</option>
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
          <div className="border-t border-gray-300 pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-[#007786] mb-4">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Account Number:
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007786]"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Branch Code:
                </label>
                <input
                  type="text"
                  name="branchCode"
                  value={formData.branchCode}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007786]"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Account Type:
                </label>
                <input
                  type="text"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007786]"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Account Holder Name:
                </label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007786]"
                />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="mb-1 font-medium text-gray-700">
                  SWIFT Code:
                </label>
                <input
                  type="text"
                  name="swiftCode"
                  value={formData.swiftCode}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007786]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 mt-6 rounded-lg text-white font-bold shadow-md ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#007786] hover:bg-[#00666a]"
          } transition-colors`}
        >
          {loading ? "Processing Payment..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}
