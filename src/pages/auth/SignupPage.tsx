import React, { useEffect, useState } from "react";
import "./SignupPage.css";
import { setSession, setEmailVerified } from "../utils/authStore";

type Role = "teacher" | "facilitator";

function getLagosTimeString() {
  const dt = new Date();
  const date = new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(dt);

  const time = new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(dt);

  return `${date} • ${time}`;
}

export default function SignupPage() {
  // Nigeria time
  const [lagosNow, setLagosNow] = useState(getLagosTimeString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const [role, setRole] = useState<Role>("teacher");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email verification placeholder modal
  const [verifyModal, setVerifyModal] = useState(false);

  function goDashboard(r: Role) {
    if (r === "teacher") window.location.href = "/teacher/dashboard";
    else window.location.href = "/facilitator/dashboard";
  }

  function validateEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function addWelcomeNotification(r: Role, name: string) {
    const existing = JSON.parse(localStorage.getItem("steam_one_notifications_v1") || "[]");

    const welcomeNote = {
      id: "WELCOME-" + Date.now(),
      type: "System",
      title: "Welcome to STEAM ONE Platform 🎉",
      message:
        r === "teacher"
          ? `Hello ${name}, your Teacher account is ready. Choose a course plan from your dashboard and complete payment to unlock learning.`
          : `Hello ${name}, your Facilitator account is active. You can now manage classes, requests, and teacher activities.`,
      timeISO: new Date().toISOString(),
      priority: "High",
      read: false,
    };

    localStorage.setItem("steam_one_notifications_v1", JSON.stringify([welcomeNote, ...existing]));
  }

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) return setError("Full name is required.");
    if (!validateEmail(email)) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    setBusy(true);

    setTimeout(() => {
      // ✅ Create session (role-based)
      setSession(role);

      // ✅ Email verification placeholder (backend later)
      setEmailVerified(false);

      // ✅ Welcome notification
      addWelcomeNotification(role, fullName.trim());

      setBusy(false);

      // ✅ Show verification modal, then go dashboard
      setVerifyModal(true);
    }, 700);
  }

  function confirmEmailVerification() {
    setEmailVerified(true);
    setVerifyModal(false);
    goDashboard(role);
  }

  function googleSignup() {
    setError(null);
    setBusy(true);

    setTimeout(() => {
      // Demo: assume Google provides name/email later
      setSession(role);
      setEmailVerified(false);
      addWelcomeNotification(role, fullName.trim() || "User");

      setBusy(false);
      setVerifyModal(true);
    }, 650);
  }

  return (
    <div className="signup-root">
      <div className="signup-card">
        {/* HEADER */}
        <div className="signup-header">
          <h2>
            STEAM <span>ONE</span> Platform
          </h2>
          <h1>Create Your Account</h1>
          <p>Teachers and Facilitators can sign up and unlock their dashboards.</p>

          <div className="signup-time">
            Nigeria Time: <span className="signup-timeRed">{lagosNow}</span>
          </div>
        </div>

        {/* FORM */}
        <div className="signup-formCard">
          <h3>Sign Up (Teacher / Facilitator)</h3>

          {/* ROLE SELECTOR */}
          <div className="signup-roleRow">
            <button
              type="button"
              className={`signup-roleBtn ${role === "teacher" ? "active" : ""}`}
              onClick={() => setRole("teacher")}
              disabled={busy}
            >
              Teacher
            </button>

            <button
              type="button"
              className={`signup-roleBtn ${role === "facilitator" ? "active" : ""}`}
              onClick={() => setRole("facilitator")}
              disabled={busy}
            >
              Facilitator
            </button>
          </div>

          {/* GOOGLE SIGNUP */}
          <button className="google-btn" onClick={googleSignup} disabled={busy}>
            <span className="gMark">G</span> Continue with Google
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          {error && <div className="signup-error">{error}</div>}

          <form onSubmit={handleSignup}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={busy}
            />

            <label>Email Address</label>
            <input
              type="email"
              placeholder="info@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={busy}
            />

            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="+234..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={busy}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={busy}
            />

            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={busy}
            />

            <button className="signup-btn" disabled={busy}>
              {busy ? "Creating Account..." : `Create ${role === "teacher" ? "Teacher" : "Facilitator"} Account`}
            </button>
          </form>

          <p className="login-link">
            Already have an account? <a href="/login">Log In</a>
          </p>
        </div>

        {/* FOOTER */}
        <div className="signup-footer">
          <p>Complies with ISTE Standards | UNESCO ICT CFT | PISA Framework</p>
          <p>© 2026 STEAM ONE Platform</p>
          <h4>Microsoft Education</h4>
        </div>
      </div>

      {/* Email Verification Placeholder Modal */}
      {verifyModal && (
        <div className="verify-modal" role="dialog" aria-modal="true">
          <div className="verify-box">
            <h2>📧 Verify Your Email</h2>
            <p>
              We sent a verification link to <b>{email || "your email"}</b>.
              <br />
              (Backend will handle real verification later.)
            </p>

            <div className="verify-actions">
              <button
                className="verify-btn"
                onClick={() => alert("Resend verification email (demo).")}
              >
                Resend Email
              </button>

              <button className="verify-btn primary" onClick={confirmEmailVerification}>
                I Have Verified
              </button>
            </div>

            <div className="verify-note">
              Tip: Teachers must choose a plan and pay inside Teacher Dashboard before learning is unlocked.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}