/**
 * Public Route Component
 * 
 * This component handles routes that should only be accessible to non-authenticated users,
 * such as login and registration pages. It prevents authenticated users from
 * accessing these routes by redirecting them to the dashboard.
 */

import React from "react";
import { Navigate } from "react-router-dom";  // For redirecting users
import { useSelector } from "react-redux";    // For accessing Redux state
import { toast } from "react-toastify";       // For notifications

/**
 * PublicRoute Component
 * 
 * Wraps public routes (login, register) to prevent authenticated users
 * from accessing them. Checks for authentication token and Redux user state.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if not authenticated
 * @returns {JSX.Element} Public content or redirect to dashboard
 */
const PublicRoute = ({ children }) => {
  // Check both localStorage token and Redux auth state
  const token = localStorage.getItem("token");
  const { user } = useSelector((state) => state.auth);
  
  // If token exists AND user data is loaded, user is authenticated
  if (token && user) {
    // Redirect to dashboard
    return <Navigate to="/dashboard" />;
  }
  
  // If only token exists (user data might still be loading), redirect
  if (token) {
    return <Navigate to="/dashboard" />;
  }
  
  // Render public content if not authenticated
  return children;
};

export default PublicRoute;
