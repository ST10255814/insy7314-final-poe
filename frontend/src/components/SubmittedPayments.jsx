import { useState, useEffect } from "react";
import api from "../lib/axios";
import { showErrorToast } from "../utils/toastHelper";
import { 
  SubmittedPaymentCard, 
  SubmittedLoadingState, 
  SubmittedEmptyState,
  BackgroundBlobs 
} from "./common";

export default function SubmittedPayments() {
  const [submittedPayments, setSubmittedPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmittedPayments();
  }, []);

  const fetchSubmittedPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/employee/submitted-payments", {withCredentials: true});
      setSubmittedPayments(response.data);
    } catch (error) {
      showErrorToast(error.response?.data?.error || "Failed to fetch submitted payments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <SubmittedLoadingState />;
  }

  if (submittedPayments.length === 0) {
    return <SubmittedEmptyState />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-[#d9f3f0] to-[#e6f7f5] pt-20 px-4 sm:px-6 pb-8">
      <BackgroundBlobs />
      
      <div className="relative z-10 max-w-6xl mx-auto py-6 sm:py-8">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-[#007768]/30 p-6 sm:p-8 mx-auto max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#007768] mb-2 sm:mb-4 drop-shadow-sm">
              Submitted Payments
            </h1>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              Payments successfully submitted to the{" "}
              <span className="font-semibold text-[#007768]">SWIFT network</span>{" "}
              for processing and completion
            </p>
            <div className="mt-4 px-4 py-2 bg-green-100 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 font-medium">
                {submittedPayments.length} payment{submittedPayments.length !== 1 ? 's' : ''} successfully submitted
              </p>
            </div>
          </div>
        </div>

        {/* Payments Grid */}
        <div className="grid gap-4 sm:gap-6">
          {submittedPayments.map((payment, index) => (
            <SubmittedPaymentCard
              key={payment._id}
              payment={payment}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}