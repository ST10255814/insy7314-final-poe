import { Link } from "react-router-dom";
import { FaCreditCard, FaShieldAlt, FaChartLine } from "react-icons/fa";

export default function Home() {
  return (
    <div className="relative h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-gray-50 via-[#d9f3f0] to-[#e6f7f5] overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#007768]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#007768]/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      {/* Hero Section */}
      <div className="z-10 text-center max-w-3xl">
        <h1 className="text-6xl md:text-7xl font-extrabold text-[#007768] mb-6 drop-shadow-md">
          Welcome to PayFlow
        </h1>
        <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-10">
          A secure and simple platform to{" "}
          <span className="font-semibold text-[#007768]">create payments</span>,{" "}
          track transactions, and manage your financial activity with ease.
        </p>
      </div>
      {/* Feature Highlights */}
      <div className="z-10 flex flex-col md:flex-row gap-6 mt-6">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-72 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center">
          <FaCreditCard className="text-[#007768] text-5xl mb-4 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Easy Payments
          </h3>
          <p className="text-gray-600 text-sm">
            Quickly create and process payments in just a few clicks.
          </p>
        </div>
        <div className="bg-white rounded-3xl shadow-lg p-8 w-72 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center">
          <FaShieldAlt className="text-[#007768] text-5xl mb-4 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Secure & Reliable
          </h3>
          <p className="text-gray-600 text-sm">
            Industry-standard security keeps your data safe at all times.
          </p>
        </div>
        <div className="bg-white rounded-3xl shadow-lg p-8 w-72 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center">
          <FaChartLine className="text-[#007768] text-5xl mb-4 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Track Progress
          </h3>
          <p className="text-gray-600 text-sm">
            Monitor your transactions and gain insights with ease.
          </p>
        </div>
      </div>
      {/* CTA Buttons */}
      <div className="z-10 mt-10 flex flex-wrap gap-4 justify-center">
        <Link
          to="/register"
          className="bg-[#007768] text-white font-semibold px-10 py-4 rounded-full shadow-lg hover:bg-[#005f57] hover:shadow-2xl transition transform hover:scale-105"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="bg-white border border-gray-300 text-gray-700 font-semibold px-10 py-4 rounded-full shadow-lg hover:bg-gray-100 hover:shadow-xl transition transform hover:scale-105"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
