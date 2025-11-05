import { FaCheck, FaUser } from "react-icons/fa";

export default function SubmittedPaymentCard({ payment, index }) {
  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
        <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap bg-green-100 text-green-800">
          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
        </span>
      </div>

      {/* Payment Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Payment Details */}
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-[#007768] mb-3 flex items-center">
            <FaCheck className="mr-2 text-sm text-green-600" />
            Payment Details
          </h4>
          <div className="space-y-2 text-sm sm:text-base text-gray-700">
            <p>
              <span className="font-medium">Amount:</span>{" "}
              {formatAmount(payment.amount, payment.currency)}
            </p>
            <p>
              <span className="font-medium">Bank:</span>{" "}
              {payment.serviceProvider}
            </p>
            <p>
              <span className="font-medium">Created:</span>{" "}
              {formatDate(payment.createdAt)}
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
              <span className="font-medium">Account Holder:</span>{" "}
              {payment.accountInformation.accountHolderName}
            </p>
            <p>
              <span className="font-medium">Account Type:</span>{" "}
              {payment.accountInformation.accountType}
            </p>
            <p>
              <span className="font-medium">Branch Code:</span>{" "}
              {payment.accountInformation.branchCode}
            </p>
            <p className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="font-medium">SWIFT Code:</span>
              <span className="px-2 py-1 bg-[#007768]/10 text-[#007768] rounded-lg font-mono text-xs sm:text-sm border border-[#007768]/20">
                {payment.accountInformation.swiftCode}
              </span>
            </p>
          </div>
        </div>

        {/* Submission Information */}
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-[#007768] mb-3 flex items-center">
            <FaUser className="mr-2 text-sm" />
            Verification Details
          </h4>
          <div className="space-y-2 text-sm sm:text-base text-gray-700">
            <p>
              <span className="font-medium">Verified By:</span>{" "}
              {payment.verifiedBy}
            </p>
            <p>
              <span className="font-medium">Verified At:</span>{" "}
              {formatDate(payment.verifiedAt)}
            </p>
            <div>
              <p className="font-medium mb-1">SWIFT Transaction ID:</p>
              <p className="px-2 py-1 bg-green-100 text-green-800 rounded-lg font-mono text-xs break-all border border-green-200">
                {payment.swiftTransactionId}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
