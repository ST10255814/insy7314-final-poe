import { useState, useEffect } from "react";
import api from "../lib/axios";
import { FaEye, FaCheck, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { showErrorToast, showSuccessToast } from "../utils/toastHelper";
import LoadingButton from "./common/LoadingButton";

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

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#007768] mx-auto mb-4" />
          <p className="text-gray-600">Loading pending payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20 px-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Employee Dashboard</h1>
          <p className="text-gray-600">Review and process international payments</p>
        </div>

        {pendingPayments.length === 0 ? (
          <div className="text-center py-12">
            <FaCheck className="text-6xl text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Pending Payments</h3>
            <p className="text-gray-500">All payments have been processed</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingPayments.map((payment) => (
              <div key={payment._id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Payment Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaEye className="mr-2 text-[#007768]" />
                      Payment Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Customer:</span> {payment.customerName}</p>
                      <p><span className="font-medium">Username:</span> {payment.customerUsername}</p>
                      <p><span className="font-medium">Amount:</span> {formatAmount(payment.amount, payment.currency)}</p>
                      <p><span className="font-medium">Service Provider:</span> {payment.serviceProvider}</p>
                      <p><span className="font-medium">Created:</span> {formatDate(payment.createdAt)}</p>
                      <p className="flex items-center">
                        <span className="font-medium">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          payment.status === 'verified' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Account Holder:</span> {payment.accountInformation.accountHolderName}</p>
                      <p><span className="font-medium">Branch Code:</span> {payment.accountInformation.branchCode}</p>
                      <p><span className="font-medium">Account Type:</span> {payment.accountInformation.accountType}</p>
                      <p><span className="font-medium">SWIFT Code:</span> 
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded font-mono text-xs">
                          {payment.accountInformation.swiftCode}
                        </span>
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 space-y-3">
                      {payment.status === 'pending' && (
                        <LoadingButton
                          loading={verifyingSwift[payment._id]}
                          loadingText="Verifying..."
                          onClick={() => verifySwiftCode(payment._id, payment.accountInformation.swiftCode)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                        >
                          <FaCheck className="mr-2" />
                          Verify SWIFT Code
                        </LoadingButton>
                      )}
                      
                      {payment.status === 'verified' && (
                        <LoadingButton
                          loading={submittingSwift[payment._id]}
                          loadingText="Submitting..."
                          onClick={() => submitToSwift(payment._id)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                        >
                          <FaExclamationTriangle className="mr-2" />
                          Submit to SWIFT
                        </LoadingButton>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}