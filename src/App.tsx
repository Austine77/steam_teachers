import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./layout/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";

/** Public Pages */
import HomePage from "./pages/public/HomePage";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import ServicesPage from "./pages/public/ServicesPage";
import CoursesPage from "./pages/public/CoursesPage";
import MarketplacePage from "./pages/public/MarketplacePage";
import RecruiterPage from "./pages/public/RecruiterPage";
import ConsultingPage from "./pages/public/ConsultingPage";
import FAQsPage from "./pages/public/FAQsPage";
import PrivacyPolicyPage from "./pages/public/PrivacyPolicyPage";
import TermsPage from "./pages/public/TermsPage";
import CourseDetailsPage from "./pages/public/CourseDetailsPage";

/** Auth Pages */
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import AdminLoginPage from "./pages/auth/AdminLoginPage";

/** App Pages */
import VerificationPage from "./pages/app/VerificationPage";
import SupportCenterPage from "./pages/app/SupportCenterPage";
import UserProfilePage from "./pages/app/UserProfilePage";

/** Teacher App Pages */
import CourseMarketplacePage from "./pages/app/CourseMarketplacePage";
import AssignmentsPage from "./pages/app/AssignmentsPage";
import AttendancePage from "./pages/app/AttendancePage";
import CertificatesPage from "./pages/app/CertificatesPage";
import AnnouncementsPage from "./pages/app/AnnouncementsPage";
import LiveClassPage from "./pages/app/LiveClassPage";
import MessagingPage from "./pages/app/MessagingPage";
import NotificationsPage from "./pages/app/NotificationsPage";
import EarningsPage from "./pages/app/EarningsPage";
import ContactAdminPage from "./pages/app/ContactAdminPage";

/** Dashboards */
import TeacherDashboardPage from "./pages/dashboards/TeacherDashboardPage";
import FacilitatorDashboardPage from "./pages/dashboards/FacilitatorDashboardPage";
import AdminDashboardPage from "./pages/dashboards/AdminDashboardPage";
import AdminTicketDashboard from "./pages/app/AdminTicketDashboard";
import AdminProfilePage from "./pages/app/AdminProfilePage";

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
      <Route element={<AppShell />}>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/course-details" element={<CourseDetailsPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/recruiter" element={<RecruiterPage />} />
        <Route path="/consulting" element={<ConsultingPage />} />
        <Route path="/faqs" element={<FAQsPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Enroll always opens signup */}
        <Route path="/enroll" element={<Navigate to="/signup" replace />} />

        {/* Admin login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Utility */}
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/support" element={<SupportCenterPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Teacher Protected */}
        <Route element={<ProtectedRoute allow={["teacher"]} redirectTo="/login" />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
          <Route path="/teacher/course-marketplace" element={<CourseMarketplacePage />} />
          <Route path="/teacher/assignments" element={<AssignmentsPage />} />
          <Route path="/teacher/attendance" element={<AttendancePage />} />
          <Route path="/teacher/certificates" element={<CertificatesPage />} />
          <Route path="/teacher/announcements" element={<AnnouncementsPage />} />
          <Route path="/teacher/live-class" element={<LiveClassPage />} />
          <Route path="/teacher/messaging" element={<MessagingPage />} />
          <Route path="/teacher/notifications" element={<NotificationsPage />} />
          <Route path="/teacher/earnings" element={<EarningsPage />} />
          <Route path="/teacher/contact-admin" element={<ContactAdminPage />} />
        </Route>

        {/* Facilitator Protected */}
        <Route element={<ProtectedRoute allow={["facilitator"]} redirectTo="/login" />}>
          <Route path="/facilitator/dashboard" element={<FacilitatorDashboardPage />} />
          <Route path="/facilitator/notifications" element={<NotificationsPage />} />
        </Route>

        {/* Shared Protected */}
        <Route element={<ProtectedRoute allow={["teacher", "facilitator"]} redirectTo="/login" />}>
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>

        {/* Admin Protected */}
        <Route element={<ProtectedRoute allow={["admin"]} redirectTo="/admin/login" />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/tickets" element={<AdminTicketDashboard />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />
        </Route>

        {/* Convenience */}
        <Route path="/dashboard" element={<Navigate to="/teacher/dashboard" replace />} />
        <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
        <Route path="/facilitator" element={<Navigate to="/facilitator/dashboard" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
