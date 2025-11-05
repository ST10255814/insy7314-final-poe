import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { FaUser, FaLock, FaIdCard } from "react-icons/fa";
import { z } from "zod";
import FormCard from "./common/FormCard";
import FormInput from "./common/FormInput";
import LoadingButton from "./common/LoadingButton";
import { showErrorToast, showSuccessToast } from "../utils/toastHelper";

export default function Register() {
  const navigate = useNavigate();

  // Cosden Solutions. 2024. Zod Validation in React (Complete Tutorial). [video online] Available at:
  // <https://youtu.be/U9PYyMhDc_k?si=qC9Y8InAB6jDJSqh> [Accessed 3 October 2025].
  const registerSchema = z.object({
    fullName: z.string(),
    idNumber: z.string().min(13).max(13),
    accountNumber: z.string().min(8).max(12),
    username: z.string().min(4).max(15),
    password: z.string().min(10).max(25),
  });

  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    accountNumber: "",
    username: "",
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
      const { success, error, data } = registerSchema.safeParse(formData);
      if (!success) {
        error.issues.forEach((issue) => {
          const field = issue.path[0];
          showErrorToast(`${field}: ${issue.message}` || "Validation error");
        });
        setLoading(false);
        return;
      } else {
        const res = await api.post("/api/register", data);

        showSuccessToast(res.data.message || "User registered successfully!");
        setFormData({
          fullName: "",
          idNumber: "",
          accountNumber: "",
          username: "",
          password: "",
        });
        setLoading(false);
        navigate("/login");
      }
    } catch (err) {
      showErrorToast(err.response?.data?.error || "Registration failed");
      setLoading(false);
    }
  };
  // OpenAI. 2025. Please can you help me style the register form the same way you did with the login form below. [ChatGPT] 
  // Available at: <https://chatgpt.com/share/68de6f2b-24a4-8012-b840-43960854a6fc> [Accessed 1 October 2025].
  return (
    <FormCard title="Register">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        <div className="col-span-1 md:col-span-2">
          <FormInput
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full name"
            icon={FaUser}
          />
        </div>
        <FormInput
          label="ID Number"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleChange}
          placeholder="ID number"
          icon={FaIdCard}
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
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          icon={FaUser}
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
        <div className="col-span-1 md:col-span-2">
          <LoadingButton loading={loading} loadingText="Registering...">
            Register
          </LoadingButton>
        </div>
      </form>
      <p className="mt-5 text-center text-gray-700 font-medium">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-[#007768] font-medium hover:underline hover:text-[#005f57] transition duration-300"
        >
          Login
        </a>
      </p>
    </FormCard>
  );
}
