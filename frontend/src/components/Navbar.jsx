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
import { showErrorToast, showSuccessToast } from "../utils/toastHelper";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userRole = sessionStorage.getItem("userRole");

  const handleLogout = async () => {
    try {
      const res = await api.post("/api/logout", {}, { withCredentials: true });

      // Clear all client-side data
      sessionStorage.clear();
      localStorage.clear();
      
      // Clear document cookies manually (additional cleanup)
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });

      showSuccessToast(res.data.message || "Logged out successfully");
      
      navigate("/login");
    } catch (err) {
      // Even if logout request fails, clear local data
      sessionStorage.clear();
      localStorage.clear();
      
      showErrorToast(err.response?.data?.error || "Logout failed");
      
      navigate("/login");
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
    <nav className="bg-white shadow-lg py-3 sm:py-4 w-full fixed top-0 z-50">
      <div className="flex flex-col sm:flex-row items-center justify-between w-full px-2 sm:px-0 gap-2 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-[#007768] flex items-center space-x-1 sm:ml-4">
          <FaMoneyCheckAlt className="text-2xl sm:text-3xl animate-bounce-slow" />
          <NavLink
            to="/"
            className="hover:text-[#005f57] transition duration-300"
          >
            PayFlow
          </NavLink>
        </h1>
        {user && (
          <div className="flex flex-wrap justify-center space-x-3 sm:space-x-6 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 text-sm sm:text-base lg:text-lg">
            {userRole === "Employee" ? (
              <>
                <NavLink
                  to="/employee/dashboard"
                  className={({ isActive }) =>
                    `flex items-center space-x-1 relative group transition transform hover:scale-105 ${
                      isActive ? activeTextClass : normalTextClass
                    }`
                  }
                >
                  <FaHistory
                    className={
                      window.location.pathname === "/employee/dashboard"
                        ? activeIconClass
                        : normalIconClass
                    }
                  />
                  <span className="hidden sm:inline">Pending Payments</span>
                  <span className="sm:hidden">Pending</span>
                  <span className={getUnderlineClass("/employee/dashboard")}></span>
                </NavLink>
                <NavLink
                  to="/employee/submitted"
                  className={({ isActive }) =>
                    `flex items-center space-x-1 relative group transition transform hover:scale-105 ${
                      isActive ? activeTextClass : normalTextClass
                    }`
                  }
                >
                  <FaMoneyCheckAlt
                    className={
                      window.location.pathname === "/employee/submitted"
                        ? activeIconClass
                        : normalIconClass
                    }
                  />
                  <span className="hidden sm:inline">Submitted Payments</span>
                  <span className="sm:hidden">Submitted</span>
                  <span className={getUnderlineClass("/employee/submitted")}></span>
                </NavLink>
              </>
            ) : (
              <>
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
                  <span className="hidden sm:inline">Past Payments</span>
                  <span className="sm:hidden">Payments</span>
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
                  <span className="hidden sm:inline">Make a Payment</span>
                  <span className="sm:hidden">Pay</span>
                  <span className={getUnderlineClass("/createPayment")}></span>
                </NavLink>
              </>
            )}
          </div>
        )}
        <div className="flex items-center space-x-2 sm:space-x-4 sm:pr-4 text-sm sm:text-base lg:text-lg">
          {user ? (
            <>
              <span className="text-gray-800 font-medium flex items-center space-x-1">
                <FaUserCircle className="text-[#007768] text-lg sm:text-xl transition-transform duration-300 group-hover:scale-110" />
                <span className="hidden md:inline">Welcome, {user}</span>
                <span className="md:hidden">{user.split(' ')[0]}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-[#007768] text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center space-x-1 hover:bg-[#005f57] shadow-md hover:shadow-lg transition transform hover:scale-105 text-sm sm:text-base"
              >
                <FaSignOutAlt className="text-white" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#007768] text-sm sm:text-base ${
                    isActive ? "bg-[#007768] text-white" : "text-[#007768]"
                  } hover:bg-[#005f57] hover:text-white transition transform hover:scale-105`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#007768] text-sm sm:text-base ${
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
