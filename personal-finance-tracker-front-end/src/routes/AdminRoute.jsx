import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export const AdminRoute = ({ children }) => {
  const { user, accessToken, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if no token
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Debug: Log user info
  console.log("AdminRoute - User info:", user);
  console.log("AdminRoute - User role:", user?.role);

  // Check if user is admin (support both "admin" and "ADMIN")
  const isAdmin = user?.role === "admin" || user?.role === "ADMIN";

  console.log("AdminRoute - Is admin:", isAdmin);

  if (!isAdmin) {
    console.log("AdminRoute - Access denied for role:", user?.role);
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
