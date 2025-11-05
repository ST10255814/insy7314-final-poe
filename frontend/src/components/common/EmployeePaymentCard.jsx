import { FaEye, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import LoadingButton from "./LoadingButton";

export default function EmployeePaymentCard({ 
  payment, 
  index,
  verifyingSwift,
  submittingSwift,
  onVerifySwift,
  onSubmitToSwift 
}) {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className="bg-white/90 backdrop-blur-md border border-[#007768]/30 rounded-2xl shadow-lg p-4 sm:p-6 transform transition duration-500 ease-out opacity-0 translate-y-4"
      style={{
        animation: `fadeInUp 0.5s ease-out forwards`,
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Header with Customer and Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#007768]">
            {payment.customerName}
          </h3>
          <p className="text-sm text-gray-600">@{payment.customerUsername}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${getStatusColor(payment.status)}`}
        >
          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
        </span>
      </div>

      {/* Payment Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Payment Details */}
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-[#007768] mb-3 flex items-center">
            <FaEye className="mr-2 text-sm" />
            Payment Details
          </h4>
          <div className="space-y-2 text-sm sm:text-base text-gray-700">
            <p>
              <span className="font-medium">Amount:</span> {formatAmount(payment.amount, payment.currency)}
            </p>
            <p>
              <span className="font-medium">Bank:</span> {payment.serviceProvider}
            </p>
            <p>
              <span className="font-medium">Created:</span> {formatDate(payment.createdAt)}
            </p>
          </div>
        </div>

        {/* Account Information */}
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-[#007768] mb-3">
            Account Information
          </h4>
          <div className="space-y-2 text-sm sm:text-base text-gray-700">
            <p>
              <span className="font-medium">Account Holder:</span> {payment.accountInformation.accountHolderName}
            </p>
            <p>
              <span className="font-medium">Account Type:</span> {payment.accountInformation.accountType}
            </p>
            <p>
              <span className="font-medium">Branch Code:</span> {payment.accountInformation.branchCode}
            </p>
            <p className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="font-medium">SWIFT Code:</span>
              <span className="px-2 py-1 bg-[#007768]/10 text-[#007768] rounded-lg font-mono text-xs sm:text-sm border border-[#007768]/20">
                {payment.accountInformation.swiftCode}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        {payment.status === 'pending' && (
          <LoadingButton
            loading={verifyingSwift[payment._id]}
            loadingText="Verifying..."
            onClick={() => onVerifySwift(payment._id, payment.accountInformation.swiftCode)}
            className="flex-1 bg-[#007768] hover:bg-[#005f57] text-white py-3 px-4 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <FaCheck className="mr-2" />
            Verify SWIFT Code
          </LoadingButton>
        )}
        
        {payment.status === 'verified' && (
          <LoadingButton
            loading={submittingSwift[payment._id]}
            loadingText="Submitting..."
            onClick={() => onSubmitToSwift(payment._id)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <FaExclamationTriangle className="mr-2" />
            Submit to SWIFT
          </LoadingButton>
        )}
      </div>
    </div>
  );
}