import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
<Route path="/support" element={<SupportCenterPage />} />

<Route path="/admin/dashboard" element={<AdminDashboardPage />} />
import AdminTicketDashboard from "./pages/admin/AdminTicketDashboard";

<Route path="/admin/tickets" element={<AdminTicketDashboard />} />
/** ✅ Public Pages */
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ServicesPage from "./pages/ServicesPage";
import CoursesPage from "./pages/CoursesPage";
import MarketplacePage from "./pages/MarketplacePage";

/** ✅ Auth Pages */
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

/** ✅ Teacher Pages */
import TeacherDashboard from "./dashboard/teacher/TeacherDashboard";
import CourseMarketplacePage from "./pages/CourseMarketplacePage";
import AssignmentsPage from "./pages/AssignmentsPage";
import AttendancePage from "./pages/AttendancePage";
import CertificatesPage from "./pages/CertificatesPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import LiveClassPage from "./pages/LiveClassPage";
import MessagingPage from "./pages/MessagingPage";
import NotificationsPage from "./pages/NotificationsPage";
import EarningsPage from "./pages/EarningsPage";
import ContactAdminPage from "./pages/ContactAdminPage";

/** ✅ Facilitator Pages */
import FacilitatorDashboard from "./dashboard/facilitator/FacilitatorDashboard";

/** ✅ Admin Pages */
import AdminDashboard from "./dashboard/admin/AdminDashboard";
import AdminProfilePage from "./pages/AdminProfilePage";

/** ✅ System Pages */
function Unauthorized() {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h2>Unauthorized</h2>
      <p>You do not have access to this page.</p>
      <a href="/login">Go to Login</a>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h2>404</h2>
      <p>Page not found.</p>
      <a href="/">Go Home</a>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* ✅ Default */}
      <Route path="/" element={<HomePage />} />

      {/* ✅ Public */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/marketplace" element={<MarketplacePage />} />

      {/* ✅ Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ========================= */}
      /* ✅ Teacher Protected Area */
      {/* ========================= */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allow={["teacher"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allow={["teacher"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/course-marketplace"
        element={
          <ProtectedRoute allow={["teacher"]}>
            <CourseMarketplacePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/assignments"
        element={
          <ProtectedRoute allow={["teacher"]}>
            <AssignmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/attendance"
        element={
          <ProtectedRoute allow={["teacher"]}>
            <AttendancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/certificates"
        element={
          <ProtectedRoute allow={["teacher"]}>
            <CertificatesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/announcements"
        element={
          <ProtectedRoute allow={["teacher"]}>
            <AnnouncementsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/live-class"
        element={
          <ProtectedRoute allow={["teacher"]}>
            <LiveClassPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/messaging"
        element={
          <ProtectedRoute allow={["teacher"]}>
            <MessagingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/notifications"
        element={
          <ProtectedRoute allow={["teacher"]}>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/earnings"
        element={
          <ProtectedRoute allow={["teacher"]}>
            <EarningsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/contact-admin"
        element={
          <ProtectedRoute allow={["teacher"]}>
            <ContactAdminPage />
          </ProtectedRoute>
        }
      />

    <Route path="/verify" element={<VerificationPage />} />
      
      <Route element={<ProtectedRoute allow={["teacher","facilitator"]} redirectTo="/login" />}>
  <Route path="/profile" element={<UserProfilePage />} />
</Route>

      {/* ============================= */}
      /* ✅ Facilitator Protected Area */
      {/* ============================= */}
      <Route
        path="/facilitator"
        element={
          <ProtectedRoute allow={["facilitator"]}>
            <FacilitatorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/facilitator/dashboard"
        element={
          <ProtectedRoute allow={["facilitator"]}>
            <FacilitatorDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/terms" element={<TermsPage />} />

      {/* ✅ Facilitator Notifications receives teacher contact link */}
      <Route
        path="/facilitator/notifications"
        element={
          <ProtectedRoute allow={["facilitator"]}>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* ======================= */}
      /* ✅ Admin Protected Area */
      {/* ======================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allow={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allow={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allow={["admin"]}>
            <AdminProfilePage />
          </ProtectedRoute>
        }
      />

      {/* ✅ Redirect convenience */}
      <Route path="/dashboard" element={<Navigate to="/teacher/dashboard" replace />} />

      {/* ✅ 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SupportCenterPage from "./pages/SupportCenterPage";

import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminTicketDashboard from "./pages/admin/AdminTicketDashboard";

import TeacherDashboardPage from "./pages/teacher/TeacherDashboardPage";
import FacilitatorDashboardPage from "./pages/facilitator/FacilitatorDashboardPage";
import UserProfilePage from "./pages/app/UserProfilePage";
import VerificationPage from "./pages/app/VerificationPage";
import TermsPage from "./pages/public/TermsPage";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/support" element={<SupportCenterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Teacher Protected */}
      <Route element={<ProtectedRoute allow={["teacher"]} redirectTo="/login" />}>
        <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
      </Route>

      {/* Facilitator Protected */}
      <Route element={<ProtectedRoute allow={["facilitator"]} redirectTo="/login" />}>
        <Route path="/facilitator/dashboard" element={<FacilitatorDashboardPage />} />
      </Route>

      {/* Admin Protected */}
      <Route element={<ProtectedRoute allow={["admin"]} redirectTo="/admin/login" />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/tickets" element={<AdminTicketDashboard />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}