import { useState } from "react";
import api from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaIdCard } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    accountNumber: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      //Promise to allow for a cleaner UI response
      //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const res = await api.post("/api/login", formData);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      localStorage.setItem("user", JSON.stringify(res.data.user.fullName));
      setLoading(false);
      navigate("/pastPayments");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      setLoading(false);
    }
  };
  //https://chatgpt.com/share/68de71ec-5710-8012-8bac-679bf1123dbc styling help
  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 px-4 relative overflow-hidden">
      {/* Login Form */}
      <div className="w-full max-w-md mt-32 relative z-10">
        <div className="bg-white shadow-lg rounded-2xl p-8 animate-fadeIn">
          <h1 className="text-2xl font-bold text-[#007786] mb-6 text-center">
            Sign In
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#007786]" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007786] transition duration-300"
              />
            </div>

            {/* Account Number */}
            <div className="relative">
              <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-[#007786]" />
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Enter account number"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007786] transition duration-300"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#007786]" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007786] transition duration-300"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#007786] text-white py-2 rounded-lg font-semibold hover:bg-[#005f66] active:scale-95 transition duration-300 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-[#007786] font-medium hover:underline hover:text-[#005f66] transition duration-300"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
