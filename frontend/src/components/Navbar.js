import { useState } from "react";
//https://reactrouter.com/api/components/NavLink
import { NavLink, useNavigate } from "react-router-dom";
//https://www.npmjs.com/package/react-icons
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

  const activeTextClass = "text-[#007786] font-semibold";
  const normalTextClass = "text-gray-700 hover:text-[#00a3b0]";
  const activeIconClass = "text-[#007786] animate-bounce-slow";
  const normalIconClass = "text-gray-600 group-hover:text-[#00a3b0] transition duration-300";

  const getUnderlineClass = (path) =>
    window.location.pathname === path
      ? "absolute bottom-0 left-0 w-full h-0.5 bg-[#007786]"
      : "absolute bottom-0 left-0 w-0 h-0.5 bg-[#00a3b0] group-hover:w-full transition-all duration-300";

  return (
    <nav className="bg-white shadow-md p-4 w-full">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-bold text-[#007786] flex items-center space-x-2">
          <FaMoneyCheckAlt className="text-[#007786] text-2xl animate-bounce-slow" />
          <span>International Payment System</span>
        </h1>
        {user && (
          <div className="flex space-x-6 text-lg">
            <NavLink
              to="/pastPayments"
              className={({ isActive }) =>
                `flex items-center space-x-1 relative group transition transform hover:scale-105 ${
                  isActive ? activeTextClass : normalTextClass
                }`
              }
            >
              <FaHistory
                className={({ isActive }) =>
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
                className={({ isActive }) =>
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
                <FaUserCircle className="text-[#007786] text-lg transition-transform duration-300 group-hover:scale-110" />
                <span>Welcome, {user}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-[#007786] text-white px-3 py-1 rounded flex items-center space-x-1 hover:bg-[#005f66] transition duration-300 transform hover:scale-105"
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
                  `relative group transition transform hover:scale-105 ${
                    isActive ? activeTextClass : normalTextClass
                  }`
                }
              >
                Login
                <span className={getUnderlineClass("/login")}></span>
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `relative group transition transform hover:scale-105 ${
                    isActive ? activeTextClass : normalTextClass
                  }`
                }
              >
                Register
                <span className={getUnderlineClass("/register")}></span>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
