import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./layout/AppShell";

import HomePage from "./pages/public/HomePage";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import CoursesPage from "./pages/public/CoursesPage";
import CourseDetailsPage from "./pages/public/CourseDetailsPage";
import ServicesPage from "./pages/public/ServicesPage";
import ConsultingPage from "./pages/public/ConsultingPage";
import FAQsPage from "./pages/public/FAQsPage";
import MarketplacePage from "./pages/public/MarketplacePage";
import RecruiterPage from "./pages/public/RecruiterPage";
import PrivacyPolicyPage from "./pages/public/PrivacyPolicyPage";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import AdminLoginPage from "./pages/auth/AdminLoginPage";
import AdminSignupPage from "./pages/auth/AdminSignupPage";

import CheckoutPage from "./pages/payments/CheckoutPage";
import PaymentPage from "./pages/payments/PaymentPage";

import AdminDashboardPage from "./pages/dashboards/AdminDashboardPage";
import TeacherDashboardPage from "./pages/dashboards/TeacherDashboardPage";
import FacilitatorDashboardPage from "./pages/dashboards/FacilitatorDashboardPage";

import LiveClassPage from "./pages/app/LiveClassPage";
import AnnouncementsPage from "./pages/app/AnnouncementsPage";
import NotificationsPage from "./pages/app/NotificationsPage";
import MessagingPage from "./pages/app/MessagingPage";
import SettingsPage from "./pages/app/SettingsPage";
import CertificatesPage from "./pages/app/CertificatesPage";
import EarningsPage from "./pages/app/EarningsPage";
import UsersReportPage from "./pages/app/UsersReportPage";
import UserProfilePage from "./pages/app/UserProfilePage";
import AdminProfilePage from "./pages/app/AdminProfilePage";
import ContactAdminPage from "./pages/app/ContactAdminPage";
import CourseMarketplacePage from "./pages/app/CourseMarketplacePage";
import AttendancePage from "./pages/app/AttendancePage";
import AssignmentsPage from "./pages/app/AssignmentsPage";
import SupportCenterPage from "./pages/app/SupportCenterPage";
import VerificationPage from "./pages/app/VerificationPage";
import TermsPage from "./pages/public/TermsPage";


export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/consulting" element={<ConsultingPage />} />
        <Route path="/faqs" element={<FAQsPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/recruiter" element={<RecruiterPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/signup" element={<AdminSignupPage />} />

        {/* Payments */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />

        {/* Dashboards */}
        <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
        <Route path="/dashboard/teacher" element={<TeacherDashboardPage />} />
        <Route path="/dashboard/facilitator" element={<FacilitatorDashboardPage />} />

        {/* App */}
        <Route path="/app/live-class" element={<LiveClassPage />} />
        <Route path="/app/announcements" element={<AnnouncementsPage />} />
        <Route path="/app/notifications" element={<NotificationsPage />} />
        <Route path="/app/messaging" element={<MessagingPage />} />
        <Route path="/app/settings" element={<SettingsPage />} />
        <Route path="/app/certificates" element={<CertificatesPage />} />
        <Route path="/app/earnings" element={<EarningsPage />} />
        <Route path="/app/users-report" element={<UsersReportPage />} />
        <Route path="/app/profile" element={<UserProfilePage />} />
        <Route path="/app/admin-profile" element={<AdminProfilePage />} />
        <Route path="/app/contact-admin" element={<ContactAdminPage />} />
        <Route path="/app/course-marketplace" element={<CourseMarketplacePage />} />
<Route path="/app/attendance" element={<AttendancePage />} />
<Route path="/app/assignments" element={<AssignmentsPage />} />
<Route path="/app/support" element={<SupportCenterPage />} />
<Route path="/verify" element={<VerificationPage />} />
<Route path="/terms" element={<TermsPage />} />

        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
