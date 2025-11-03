import React, { useEffect, useState } from "react";
import api from "../lib/axios";
import { format } from "date-fns";

export default function PastPayments() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/api/pastPayments", {
          withCredentials: true,
        });
        setPayments(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch payments");
      }
    };
    fetchPayments();
  }, []);

  // OpenAI. 2025. Please can you help me style the html to be aesthetically pleasing with the color 007786 using tailwind. [ChatGPT] 
  // Available at: <https://chatgpt.com/share/68de7c95-fdfc-8012-81e8-45958844e1dc> [Accessed 1 October 2025].
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#d9f3f0] to-[#e6f7f5] pt-32 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-[#007786] border-b-2 border-[#007786] pb-2">
          Past Payments
        </h2>
        {error && (
          <p className="text-red-500 mb-6 bg-red-100 p-3 rounded">{error}</p>
        )}
        {payments.length === 0 ? (
          <p className="text-gray-600 font-bold text-center py-10">
            No payments found.
          </p>
        ) : (
          <div className="grid gap-6">
            {payments.map((payment, index) => (
              <div
                key={payment._id}
                className="bg-white/90 backdrop-blur-md border border-[#007786]/30 rounded-2xl shadow-lg p-6 transform transition duration-500 ease-out opacity-0 translate-y-4"
                style={{
                  animation: `fadeInUp 0.5s ease-out forwards`,
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Header with Amount and Status */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-[#007786]">
                    Amount: {""}
                    {payment.amount.toLocaleString()} {payment.currency}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      payment.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : payment.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {payment.status.charAt(0).toUpperCase() +
                      payment.status.slice(1)}
                  </span>
                </div>
                {/* Grid for other details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                  <p>
                    <span className="font-medium">Bank:</span>{" "}
                    {payment.serviceProvider}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {/*https://www.npmjs.com/package/date-fns */}
                    {format(
                      new Date(payment.createdAt),
                      "MMM dd, yyyy HH:mm a"
                    )}
                  </p>
                  <p>
                    <span className="font-medium">Account Holder:</span>{" "}
                    {payment.accountInformation.accountHolderName}
                  </p>
                  <p>
                    <span className="font-medium">Account Type:</span>{" "}
                    {payment.accountInformation.accountType
                      .charAt(0)
                      .toUpperCase() +
                      payment.accountInformation.accountType.slice(1)}
                  </p>
                  <p>
                    <span className="font-medium">Branch Code:</span>{" "}
                    {payment.accountInformation.branchCode}
                  </p>
                  <p>
                    <span className="font-medium">SWIFT Code:</span>{" "}
                    {payment.accountInformation.swiftCode}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
