import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

// Public pages
import HomePage from "./pages/public/HomePage";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import CoursesPage from "./pages/public/CoursesPage";
import CourseDetailsPage from "./pages/public/CourseDetailsPage";
import MarketplacePage from "./pages/public/MarketplacePage";
import RecruiterPage from "./pages/public/RecruiterPage";
import ServicesPage from "./pages/public/ServicesPage";
import PolicyPage from "./pages/public/PolicyPage";
import CheckoutPage from "./pages/public/CheckoutPage";
import PaymentPage from "./pages/public/PaymentPage";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import AdminLoginPage from "./pages/auth/AdminLoginPage";

// Dashboards
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import TeacherDashboard from "./pages/dashboard/teacher/TeacherDashboard";
import FacilitatorDashboard from "./pages/dashboard/facilitator/FacilitatorDashboard";

/** Scroll to top on route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function ProtectedRoute({
  children,
  role
}: {
  children: React.ReactNode;
  role?: "admin" | "teacher" | "facilitator";
}) {
  const isAuthed = true; // TODO: replace with real auth
  const userRole: "admin" | "teacher" | "facilitator" = "admin"; // TODO: replace with real role

  if (!isAuthed) return <Navigate to="/login" replace />;
  if (role && userRole !== role) return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
}

function NotFound() {
  return (
    <div style={{ padding: 32, fontFamily: "Arial" }}>
      <h2>404 — Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <a href="/" style={{ fontWeight: 800 }}>Go back home</a>
    </div>
  );
}

function Unauthorized() {
  return (
    <div style={{ padding: 32, fontFamily: "Arial" }}>
      <h2>Unauthorized</h2>
      <p>You don’t have access to this page.</p>
      <a href="/" style={{ fontWeight: 800 }}>Go back home</a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />

        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
        <Route path="/course-details" element={<CourseDetailsPage />} />

        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/recruiter" element={<RecruiterPage />} />
        <Route path="/services" element={<ServicesPage />} />

        <Route path="/policy" element={<PolicyPage />} />
        <Route path="/terms" element={<PolicyPage />} />
        <Route path="/cookie-policy" element={<PolicyPage />} />

        {/* Payment flow */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Dashboards */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/teacher"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/facilitator"
          element={
            <ProtectedRoute role="facilitator">
              <FacilitatorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Helpers */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}