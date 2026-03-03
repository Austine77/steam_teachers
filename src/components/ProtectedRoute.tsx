import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getRole, isAdminAuthed, isAuthed, type Role } from "../utils/authStore";

type Props = {
  allow?: Role[];                // allowed roles
  redirectTo?: string;           // where to go if blocked
};

export default function ProtectedRoute({
  allow,
  redirectTo,
}: Props) {
  const role = getRole();

  // Not authenticated at all
  if (!isAuthed() || !role) {
    return <Navigate to={redirectTo || "/login"} replace />;
  }

  // Admin must pass admin flag
  if (role === "admin" && !isAdminAuthed()) {
    return <Navigate to="/admin/login" replace />;
  }

  // Role filtering
  if (allow && !allow.includes(role)) {
    const fallback = role === "admin" ? "/admin/dashboard" : role === "teacher" ? "/teacher/dashboard" : "/facilitator/dashboard";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}