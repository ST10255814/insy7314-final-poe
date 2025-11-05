import { useEffect, useState } from "react";
import api from "../lib/axios";
import BackgroundBlobs from "./common/BackgroundBlobs";
import PaymentCard from "./common/PaymentCard";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#d9f3f0] to-[#e6f7f5] pt-24 sm:pt-28 md:pt-32 px-3 sm:px-4 pb-8 sm:pb-12 relative">
      <BackgroundBlobs />
      <div className="max-w-5xl mx-auto relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-[#007786] border-b-2 border-[#007786] pb-2">
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
              <PaymentCard key={payment._id} payment={payment} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
