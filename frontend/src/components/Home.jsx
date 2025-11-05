import { Link } from "react-router-dom";
import { FaCreditCard, FaShieldAlt, FaChartLine } from "react-icons/fa";
import BackgroundBlobs from "./common/BackgroundBlobs";
import FeatureCard from "./common/FeatureCard";

export default function Home() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  
  const features = [
    {
      icon: FaCreditCard,
      title: "Easy Payments",
      description: "Quickly create and process payments in just a few clicks.",
    },
    {
      icon: FaShieldAlt,
      title: "Secure & Reliable",
      description: "Industry-standard security keeps your data safe at all times.",
    },
    {
      icon: FaChartLine,
      title: "Track Progress",
      description: "Monitor your transactions and gain insights with ease.",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-20 sm:py-0 bg-gradient-to-br from-gray-50 via-[#d9f3f0] to-[#e6f7f5] overflow-hidden">
      <BackgroundBlobs />
      {/* Hero Section */}
      <div className="z-10 text-center max-w-3xl px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#007768] mb-4 sm:mb-6 drop-shadow-md">
          Welcome to PayFlow
        </h1>
        <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10">
          A secure and simple platform to{" "}
          <span className="font-semibold text-[#007768]">create payments</span>,{" "}
          track transactions, and manage your financial activity with ease.
        </p>
      </div>
      {/* Feature Highlights */}
      <div className="z-10 flex flex-col md:flex-row gap-4 sm:gap-6 mt-4 sm:mt-6 px-4">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
      {/* CTA Buttons */}
      {!user && (
        <div className="z-10 mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4 justify-center px-4">
          <Link
            to="/register"
            className="bg-[#007768] text-white font-semibold px-6 sm:px-10 py-3 sm:py-4 rounded-full shadow-lg hover:bg-[#005f57] hover:shadow-2xl transition transform hover:scale-105 text-sm sm:text-base"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-white text-[#007768] font-semibold px-6 sm:px-10 py-3 sm:py-4 rounded-full shadow-lg border border-[#007768] hover:bg-gray-100 hover:shadow-2xl transition transform hover:scale-105 text-sm sm:text-base"
          >
            Log In
          </Link>
        </div>
      )}
      {user && (
        <div className="z-10 mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4 justify-center px-4">
          <Link
            to="/dashboard"
            className="bg-[#007768] text-white font-semibold px-6 sm:px-10 py-3 sm:py-4 rounded-full shadow-lg hover:bg-[#005f57] hover:shadow-2xl transition transform hover:scale-105 text-sm sm:text-base"
          >
            Go to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
