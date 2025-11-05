import { FaSpinner } from "react-icons/fa";
import BackgroundBlobs from "./BackgroundBlobs";

export default function EmployeeLoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 via-[#d9f3f0] to-[#e6f7f5] pt-20 px-4">
      <BackgroundBlobs />
      <div className="relative z-10 text-center">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-[#007768]/30 p-8 sm:p-12">
          <FaSpinner className="animate-spin text-4xl sm:text-5xl text-[#007768] mx-auto mb-4 sm:mb-6" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#007768] mb-2">
            Loading Payments...
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Please wait while we fetch pending payments for review
          </p>
        </div>
      </div>
    </div>
  );
}