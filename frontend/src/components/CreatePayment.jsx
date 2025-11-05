import React, { useState } from "react";
import api from "../lib/axios";
import { z } from "zod";
import BackgroundBlobs from "./common/BackgroundBlobs";
import FormSelect from "./common/FormSelect";
import PaymentFormInput from "./common/PaymentFormInput";
import { showErrorToast, showSuccessToast } from "../utils/toastHelper";

export default function CreatePayment() {
  const paymentSchema = z.object({
    amount: z.string(),
    currency: z.string(),
    serviceProvider: z.string(),
    accountNumber: z.string().min(8).max(12),
    branchCode: z.string().min(6).max(6),
    accountType: z.string(),
    accountHolderName: z.string().min(2).max(50),
    swiftCode: z.string().min(8).max(11),
  });
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
      const { success, error, data } = paymentSchema.safeParse(formData);
      if (!success) {
        error.issues.forEach((issue) => {
          const field = issue.path[0];
          showErrorToast(`${field}: ${issue.message}` || "Validation error");
        });
        setFormData({
          amount: "",
          currency: "",
          serviceProvider: "",
          accountNumber: "",
          branchCode: "",
          accountType: "",
          accountHolderName: "",
          swiftCode: "",
        });
        setLoading(false);
        return;
      } else {
        const res = await api.post("/api/createPayment", data, {
          withCredentials: true,
        });
        showSuccessToast(
          res.data.message ||
            `Payment created successfully! ID: ${res.data.id}`
        );
        setLoading(false);
      }
    } catch (err) {
      showErrorToast(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Something went wrong"
      );
      setLoading(false);
    }
  };
  const currencyOptions = [
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
    { value: "ZAR", label: "ZAR" },
  ];

  const serviceProviderOptions = [
    { value: "FNB", label: "First National Bank" },
    { value: "Standard Bank", label: "Standard Bank" },
    { value: "Absa", label: "Absa" },
    { value: "Nedbank", label: "Nedbank" },
    { value: "Capitec", label: "Capitec" },
    { value: "Discovery", label: "Discovery" },
    { value: "African Bank", label: "African Bank" },
  ];

  return (
    <div className="relative min-h-screen flex justify-center items-start px-3 sm:px-4 pt-24 sm:pt-28 pb-8 bg-gradient-to-br from-gray-50 via-[#d9f3f0] to-[#e6f7f5] overflow-hidden">
      <BackgroundBlobs />
      <div className="w-full max-w-md relative z-10 bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border border-[#007786]/30 p-5 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-[#007786] mb-4 sm:mb-6 text-center">
          Create Payment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <PaymentFormInput
              label="Amount:"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="1200"
            />
            <FormSelect
              label="Currency:"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              options={currencyOptions}
              placeholder="Select currency"
            />
          </div>
          <FormSelect
            label="Service Provider:"
            name="serviceProvider"
            value={formData.serviceProvider}
            onChange={handleChange}
            options={serviceProviderOptions}
            placeholder="Select provider"
          />
          {showAccountInfo && (
            <div className="border-t border-gray-300 pt-4 sm:pt-6 space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-[#007786] mb-3 sm:mb-4">
                Account Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <PaymentFormInput
                  label="Account Number:"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                />
                <PaymentFormInput
                  label="Branch Code:"
                  name="branchCode"
                  value={formData.branchCode}
                  onChange={handleChange}
                />
                <PaymentFormInput
                  label="Account Type:"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                />
                <PaymentFormInput
                  label="Account Holder Name:"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                />
                <div className="sm:col-span-2">
                  <PaymentFormInput
                    label="SWIFT Code:"
                    name="swiftCode"
                    value={formData.swiftCode}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 sm:py-3 px-4 mt-4 sm:mt-6 rounded-lg text-white font-bold shadow-md text-sm sm:text-base ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#007786] hover:bg-[#00666a]"
            } transition-colors`}
          >
            {loading ? "Processing Payment..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
