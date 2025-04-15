
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Still loading authentication state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Chargement...</div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Authenticated but requires admin and user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
