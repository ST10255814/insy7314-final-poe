import { Navigate } from 'react-router-dom';

export default function EmployeeRoute({ children }) {
  const userRole = sessionStorage.getItem("userRole");
  const user = sessionStorage.getItem("user");

  // Check if user is logged in and has Employee role
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== "Employee") {
    return <Navigate to="/pastPayments" replace />;
  }

  return children;
}

export function CustomerRoute({ children }) {
  const userRole = sessionStorage.getItem("userRole");
  const user = sessionStorage.getItem("user");

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If employee tries to access customer routes, redirect to employee dashboard
  if (userRole === "Employee") {
    return <Navigate to="/employee/dashboard" replace />;
  }

  return children;
}