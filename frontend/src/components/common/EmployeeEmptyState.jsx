import { FaCheck } from "react-icons/fa";
import BackgroundBlobs from "./BackgroundBlobs";

export default function EmployeeEmptyState() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 via-[#d9f3f0] to-[#e6f7f5] pt-20 px-4">
      <BackgroundBlobs />
      <div className="relative z-10 text-center max-w-md mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-[#007768]/30 p-8 sm:p-12">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FaCheck className="text-3xl sm:text-4xl text-green-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#007768] mb-2 sm:mb-3">
            All Caught Up!
          </h2>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            No Pending Payments
          </h3>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Great job! All payments have been processed and submitted to SWIFT. 
            Check back later for new payments that need your attention.
          </p>
        </div>
      </div>
    </div>
  );
}