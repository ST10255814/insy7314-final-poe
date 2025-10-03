import { useState } from "react";
import api from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaIdCard } from "react-icons/fa";
import { toast, Slide } from "react-toastify";
import { z } from "zod";

export default function Login() {
  const navigate = useNavigate();

  const loginSchema = z.object({
    username: z.string().min(4),
    accountNumber: z.string().min(8).max(12),
    password: z.string().min(10).max(25),
  });

  const [formData, setFormData] = useState({
    username: "",
    accountNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const { success, error, safeData } = loginSchema.safeParse(formData);
      if (!success) {
        error.issues.forEach((issue) => {
          const field = issue.path[0];
          toast.error(`${field}: ${issue.message}` || "Validation error", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Slide,
          });
        });
        setLoading(false);
        return;
      } else {
        //Promise to allow for a cleaner UI response
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const res = await api.post("/api/login", safeData);
        localStorage.setItem("user", JSON.stringify(res.data.user.fullName));
        setLoading(false);
        toast.success(res.data.message || "Login Successful", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Slide,
        });
        navigate("/pastPayments");
      }
    } catch (err) {
      //https://fkhadra.github.io/react-toastify/introduction
      toast.error(err.response?.data?.error || "Login failed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Slide,
      });
      setLoading(false);
    }
  };
  //https://chatgpt.com/share/68de71ec-5710-8012-8bac-679bf1123dbc styling help
  return (
    <div className="min-h-screen flex justify-center items-start relative overflow-hidden bg-gradient-to-br from-gray-50 via-[#d9f3f0] to-[#e6f7f5] pt-52 px-4">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#007768]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#007768]/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      {/* Login Form Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-[#007768]/30 p-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#007768] text-center mb-6 drop-shadow-sm">
            Sign In
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Username
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#007768] text-lg" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#007768] focus:border-[#007768] bg-white/70 transition duration-300"
                />
              </div>
            </div>

            {/* Account Number */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Account Number
              </label>
              <div className="relative">
                <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-[#007768] text-lg" />
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="Account number"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#007768] focus:border-[#007768] bg-white/70 transition duration-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#007768] text-lg" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#007768] focus:border-[#007768] bg-white/70 transition duration-300"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-[#007768] to-[#005f57] hover:from-[#005f57] hover:to-[#007768] active:scale-95 transition duration-300 flex justify-center items-center shadow-lg hover:shadow-2xl"
            >
              {loading ? (
                <span className="animate-pulse cursor-not-allowed">
                  Signing in...
                </span>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
          <p className="mt-5 text-center text-gray-700 font-medium">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-[#007768] font-medium hover:underline hover:text-[#005f57] transition duration-300"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
