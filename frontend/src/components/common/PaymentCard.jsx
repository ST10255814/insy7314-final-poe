import { format } from "date-fns";

export default function PaymentCard({ payment, index }) {
  return (
    <div
      key={payment._id}
      className="bg-white/90 backdrop-blur-md border border-[#007786]/30 rounded-2xl shadow-lg p-4 sm:p-6 transform transition duration-500 ease-out opacity-0 translate-y-4"
      style={{
        animation: `fadeInUp 0.5s ease-out forwards`,
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Header with Amount and Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h3 className="text-lg sm:text-xl font-bold text-[#007786]">
          Amount: {payment.amount.toLocaleString()} {payment.currency}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${
            payment.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : payment.status === "verified"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
        </span>
      </div>
      {/* Grid for other details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base text-gray-700">
        <p>
          <span className="font-medium">Bank:</span> {payment.serviceProvider}
        </p>
        <p>
          <span className="font-medium">Date:</span>{" "}
          {/*https://www.npmjs.com/package/date-fns */}
          {format(new Date(payment.createdAt), "MMM dd, yyyy HH:mm a")}
        </p>
        <p>
          <span className="font-medium">Account Holder:</span>{" "}
          {payment.accountInformation.accountHolderName}
        </p>
        <p>
          <span className="font-medium">Account Type:</span>{" "}
          {payment.accountInformation.accountType.charAt(0).toUpperCase() +
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
  );
}
