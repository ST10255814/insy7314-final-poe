import { useState } from "react";
import api from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaIdCard } from "react-icons/fa";
import { z } from "zod";
import FormCard from "./common/FormCard";
import FormInput from "./common/FormInput";
import LoadingButton from "./common/LoadingButton";
import { showErrorToast, showSuccessToast } from "../utils/toastHelper";

export default function Login() {
  const navigate = useNavigate();

  const loginSchema = z.object({
    username: z.string().min(4).max(15),
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

      const { success, error, data } = loginSchema.safeParse(formData);

      if (!success) {
        error.issues.forEach((issue) => {
          const field = issue.path[0];
          showErrorToast(`${field}: ${issue.message}` || "Validation error");
        });

        setLoading(false);
        return;
      } else {
        // Promise to allow for a cleaner UI response
        // Mozilla. 2025. Promise() constructor. Mozilla. [online] Available at: 
        // <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise> [Accessed 2 October 2025].
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const res = await api.post("/api/login", data);
        sessionStorage.setItem("user", JSON.stringify(res.data.user.fullName));
        sessionStorage.setItem("userRole", res.data.user.role || "Customer");

        setLoading(false);
        showSuccessToast(res.data.message || "Login Successful");
        
        // Role-based redirection
        if (res.data.user.role === "Employee") {
          navigate("/employee/dashboard");
        } else {
          navigate("/pastPayments");
        }
      }
    } catch (err) {
      showErrorToast(err.response?.data?.error || "Login failed");
      setLoading(false);
    }
  };
  // OpenAI. 2025. Please can you help me only style this component with the color 007786 using tailwind. 
  // I also want a animation for the button while its submitting and add icons within the input fields etc. [ChatGPT]
  // Available at: <https://chatgpt.com/share/68de71ec-5710-8012-8bac-679bf1123dbc> [Accessed 1 October 2025].
  return (
    <FormCard title="Sign In">
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          icon={FaUser}
        />
        <FormInput
          label="Account Number"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          placeholder="Account number"
          icon={FaIdCard}
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          icon={FaLock}
        />
        <LoadingButton loading={loading} loadingText="Signing in...">
          Sign In
        </LoadingButton>
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
    </FormCard>
  );
}
