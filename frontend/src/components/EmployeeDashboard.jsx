import { useState, useEffect } from "react";
import api from "../lib/axios";
import { showErrorToast, showSuccessToast } from "../utils/toastHelper";
import {
  EmployeePaymentCard,
  EmployeeLoadingState,
  EmployeeEmptyState,
  BackgroundBlobs
} from "./common";

export default function EmployeeDashboard() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingSwift, setVerifyingSwift] = useState({});
  const [submittingSwift, setSubmittingSwift] = useState({});

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/employee/pending-payments");
      setPendingPayments(response.data);
    } catch (error) {
      showErrorToast(error.response?.data?.error || "Failed to fetch pending payments");
    } finally {
      setLoading(false);
    }
  };

  const verifySwiftCode = async (paymentId, swiftCode) => {
    try {
      setVerifyingSwift(prev => ({ ...prev, [paymentId]: true }));
      
      const response = await api.post(`/api/employee/verify-swift/${paymentId}`, {
        swiftCode: swiftCode
      });
      
      showSuccessToast(response.data.message);
      
      // Update the payment status in the local state
      setPendingPayments(prev =>
        prev.map(payment =>
          payment._id === paymentId
            ? { ...payment, status: 'verified' }
            : payment
        )
      );
      
    } catch (error) {
      showErrorToast(error.response?.data?.error || "Failed to verify SWIFT code");
    } finally {
      setVerifyingSwift(prev => ({ ...prev, [paymentId]: false }));
    }
  };

  const submitToSwift = async (paymentId) => {
    try {
      setSubmittingSwift(prev => ({ ...prev, [paymentId]: true }));
      
      const response = await api.post(`/api/employee/submit-swift/${paymentId}`);
      
      showSuccessToast(response.data.message);
      
      // Remove the payment from pending list
      setPendingPayments(prev => 
        prev.filter(payment => payment._id !== paymentId)
      );
      
    } catch (error) {
      showErrorToast(error.response?.data?.error || "Failed to submit to SWIFT");
    } finally {
      setSubmittingSwift(prev => ({ ...prev, [paymentId]: false }));
    }
  };

  if (loading) {
    return <EmployeeLoadingState />;
  }

  if (pendingPayments.length === 0) {
    return <EmployeeEmptyState />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-[#d9f3f0] to-[#e6f7f5] pt-20 px-4 sm:px-6 pb-8">
      <BackgroundBlobs />
      
      <div className="relative z-10 max-w-6xl mx-auto py-6 sm:py-8">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-[#007768]/30 p-6 sm:p-8 mx-auto max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#007768] mb-2 sm:mb-4 drop-shadow-sm">
              Employee Dashboard
            </h1>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              Review and process international payments with{" "}
              <span className="font-semibold text-[#007768]">secure verification</span>{" "}
              and SWIFT integration
            </p>
            <div className="mt-4 px-4 py-2 bg-[#007768]/10 rounded-lg border border-[#007768]/20">
              <p className="text-sm text-[#007768] font-medium">
                {pendingPayments.length} payment{pendingPayments.length !== 1 ? 's' : ''} awaiting your review
              </p>
            </div>
          </div>
        </div>

        {/* Payments Grid */}
        <div className="grid gap-4 sm:gap-6">
          {pendingPayments.map((payment, index) => (
            <EmployeePaymentCard
              key={payment._id}
              payment={payment}
              index={index}
              verifyingSwift={verifyingSwift}
              submittingSwift={submittingSwift}
              onVerifySwift={verifySwiftCode}
              onSubmitToSwift={submitToSwift}
            />
          ))}
        </div>
      </div>
    </div>
  );
}