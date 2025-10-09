import { useState } from "react";
// ReactRouter. 2025. NavLink. React Router. [online]. Available at: 
// <https://reactrouter.com/api/components/NavLink> [Accessed 1 October 2025].
import { NavLink, useNavigate } from "react-router-dom";
// NPM. 2025. react-icons. npmjs. [online]. Available at: 
// <https://www.npmjs.com/package/react-icons> [Accessed 1 October 2025].
import {
  FaSignOutAlt,
  FaUserCircle,
  FaMoneyCheckAlt,
  FaHistory,
} from "react-icons/fa";
import api from "../lib/axios";
import { toast, Slide } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      const res = await api.post("/api/logout", {}, { withCredentials: true });

      toast.success(res.data.message || "Logged out successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Slide,
      });
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Logout failed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Slide,
      });
    }
  };

  const activeTextClass = "text-[#007768] font-semibold";
  const normalTextClass =
    "text-gray-700 hover:text-[#007768] transition duration-300";
  const activeIconClass = "text-[#007768] animate-bounce-slow";
  const normalIconClass =
    "text-gray-600 group-hover:text-[#007768] transition duration-300";

  const getUnderlineClass = (path) =>
    window.location.pathname === path
      ? "absolute bottom-0 left-0 w-full h-0.5 bg-[#007768]"
      : "absolute bottom-0 left-0 w-0 h-0.5 bg-[#007768] group-hover:w-full transition-all duration-300";

  return (
    <nav className="bg-white shadow-lg py-4 w-full fixed top-0 z-50">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold text-[#007768] flex items-center space-x-1 ml-4">
          <FaMoneyCheckAlt className="text-3xl animate-bounce-slow" />
          <NavLink
            to="/"
            className="hover:text-[#005f57] transition duration-300"
          >
            PayFlow
          </NavLink>
        </h1>
        {user && (
          <div className="flex space-x-6 absolute left-1/2 transform -translate-x-1/2 text-lg">
            <NavLink
              to="/pastPayments"
              className={({ isActive }) =>
                `flex items-center space-x-1 relative group transition transform hover:scale-105 ${
                  isActive ? activeTextClass : normalTextClass
                }`
              }
            >
              <FaHistory
                className={
                  window.location.pathname === "/pastPayments"
                    ? activeIconClass
                    : normalIconClass
                }
              />
              <span>Past Payments</span>
              <span className={getUnderlineClass("/pastPayments")}></span>
            </NavLink>
            <NavLink
              to="/createPayment"
              className={({ isActive }) =>
                `flex items-center space-x-1 relative group transition transform hover:scale-105 ${
                  isActive ? activeTextClass : normalTextClass
                }`
              }
            >
              <FaMoneyCheckAlt
                className={
                  window.location.pathname === "/createPayment"
                    ? activeIconClass
                    : normalIconClass
                }
              />
              <span>Make a Payment</span>
              <span className={getUnderlineClass("/createPayment")}></span>
            </NavLink>
          </div>
        )}
        <div className="flex items-center space-x-4 pr-4 text-lg">
          {user ? (
            <>
              <span className="text-gray-800 font-medium flex items-center space-x-1">
                <FaUserCircle className="text-[#007768] text-xl transition-transform duration-300 group-hover:scale-110" />
                <span>Welcome, {user}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-[#007768] text-white px-3 py-1.5 rounded-full flex items-center space-x-1 hover:bg-[#005f57] shadow-md hover:shadow-lg transition transform hover:scale-105"
              >
                <FaSignOutAlt className="text-white" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full border border-[#007768] ${
                    isActive ? "bg-[#007768] text-white" : "text-[#007768]"
                  } hover:bg-[#005f57] hover:text-white transition transform hover:scale-105`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full border border-[#007768] ${
                    isActive ? "bg-[#007768] text-white" : "text-[#007768]"
                  } hover:bg-[#005f57] hover:text-white transition transform hover:scale-105`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
