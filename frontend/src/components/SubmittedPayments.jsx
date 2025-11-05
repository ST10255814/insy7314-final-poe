import { useState, useEffect } from "react";
import api from "../lib/axios";
import { FaCheck, FaSpinner, FaClock, FaUser } from "react-icons/fa";
import { showErrorToast } from "../utils/toastHelper";

export default function SubmittedPayments() {
  const [submittedPayments, setSubmittedPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmittedPayments();
  }, []);

  const fetchSubmittedPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/employee/submitted-payments");
      setSubmittedPayments(response.data);
    } catch (error) {
      showErrorToast(error.response?.data?.error || "Failed to fetch submitted payments");
    } finally {
      setLoading(false);
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
          <p className="text-gray-600">Loading submitted payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20 px-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Submitted Payments</h1>
          <p className="text-gray-600">Payments successfully submitted to SWIFT network</p>
        </div>

        {submittedPayments.length === 0 ? (
          <div className="text-center py-12">
            <FaClock className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Submitted Payments</h3>
            <p className="text-gray-500">No payments have been submitted to SWIFT yet</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {submittedPayments.map((payment) => (
              <div key={payment._id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Payment Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaCheck className="mr-2 text-green-600" />
                      Payment Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Customer:</span> {payment.customerName}</p>
                      <p><span className="font-medium">Username:</span> {payment.customerUsername}</p>
                      <p><span className="font-medium">Amount:</span> {formatAmount(payment.amount, payment.currency)}</p>
                      <p><span className="font-medium">Service Provider:</span> {payment.serviceProvider}</p>
                      <p><span className="font-medium">Created:</span> {formatDate(payment.createdAt)}</p>
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
                  </div>

                  {/* Submission Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaUser className="mr-2 text-[#007768]" />
                      Submission Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Submitted By:</span> {payment.submittedBy}</p>
                      <p><span className="font-medium">Submitted At:</span> {formatDate(payment.submittedAt)}</p>
                      <p><span className="font-medium">SWIFT Transaction ID:</span></p>
                      <p className="px-2 py-1 bg-green-100 text-green-800 rounded font-mono text-xs break-all">
                        {payment.swiftTransactionId}
                      </p>
                      <p className="flex items-center">
                        <span className="font-medium">Status:</span>
                        <span className="ml-2 px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                          ✓ Submitted to SWIFT
                        </span>
                      </p>
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