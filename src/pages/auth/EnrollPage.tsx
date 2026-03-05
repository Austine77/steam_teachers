import React, { useEffect, useMemo, useState } from "react";
import "./SignupPage.css";
import { setSession, setEmailVerified } from "../../utils/authStore";

type Role = "teacher" | "facilitator";
type PlanId = "steam_one" | "steam_two" | "steam_three";

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

function formatNaira(amount: number) {
  try {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);
  } catch {
    return `₦${amount.toLocaleString("en-NG")}`;
  }
}

const PLANS: Array<{
  id: PlanId;
  name: string;
  price: number;
  desc: string;
  bullets: string[];
}> = [
  {
    id: "steam_one",
    name: "STEAM ONE",
    price: 25000,
    desc: "Introductory program for pre-service and in-service teachers.",
    bullets: ["Foundations of STEAM teaching", "Digital literacy essentials", "Certificate of completion"],
  },
  {
    id: "steam_two",
    name: "STEAM TWO",
    price: 45000,
    desc: "Technology integration for effective classroom delivery.",
    bullets: ["Teaching with modern tools", "Learning management workflows", "Practical classroom projects"],
  },
  {
    id: "steam_three",
    name: "STEAM THREE",
    price: 75000,
    desc: "Expert level: AI-integrated teaching and innovation leadership.",
    bullets: ["AI lesson design & creativity", "Advanced digital pedagogy", "Leadership & mentorship track"],
  },
];

export default function SignupPage() {
  // Nigeria time
  const [lagosNow, setLagosNow] = useState(getLagosTimeString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Role
  const [role, setRole] = useState<Role>("teacher");

  // Plan selection (teacher only)
  const [planId, setPlanId] = useState<PlanId>("steam_one");
  const selectedPlan = useMemo(() => PLANS.find((p) => p.id === planId)!, [planId]);

  // Form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UX
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email verification placeholder modal
  const [verifyModal, setVerifyModal] = useState(false);

  // Payment placeholder modal (teacher only)
  const [payModal, setPayModal] = useState(false);

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
          ? `Hello ${name}, your Teacher account is ready. Your selected plan is ${selectedPlan.name}. Complete payment (demo for now) to unlock learning.`
          : `Hello ${name}, your Facilitator account is active. You can now manage classes, requests, and teacher activities.`,
      timeISO: new Date().toISOString(),
      priority: "High",
      read: false,
    };

    localStorage.setItem("steam_one_notifications_v1", JSON.stringify([welcomeNote, ...existing]));
  }

  function saveEnrollInfo() {
    // store selected plan for teacher (so dashboard can read it)
    if (role !== "teacher") return;
    const payload = {
      planId,
      planName: selectedPlan.name,
      amountNGN: selectedPlan.price,
      currency: "NGN",
      createdAtISO: new Date().toISOString(),
      status: "pending_payment", // demo state
    };
    localStorage.setItem("steam_one_teacher_enroll_v1", JSON.stringify(payload));
  }

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) return setError("Full name is required.");
    if (!validateEmail(email)) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    // Teacher must choose plan before continuing
    if (role === "teacher" && !planId) return setError("Please choose a teacher plan.");

    setBusy(true);

    setTimeout(() => {
      // ✅ Create session (role-based)
      setSession(role);

      // ✅ Email verification placeholder (backend later)
      setEmailVerified(false);

      // ✅ Save enrollment (teacher only)
      saveEnrollInfo();

      // ✅ Welcome notification
      addWelcomeNotification(role, fullName.trim());

      setBusy(false);

      // ✅ Teacher: show payment placeholder first; Facilitator: skip payment placeholder
      if (role === "teacher") setPayModal(true);
      else setVerifyModal(true);
    }, 700);
  }

  function confirmPaymentDemo() {
    // Demo: mark "paid" so teacher dashboard can unlock later
    try {
      const raw = localStorage.getItem("steam_one_teacher_enroll_v1");
      if (raw) {
        const data = JSON.parse(raw);
        data.status = "paid_demo";
        data.paidAtISO = new Date().toISOString();
        localStorage.setItem("steam_one_teacher_enroll_v1", JSON.stringify(data));
      }
    } catch {}

    setPayModal(false);
    setVerifyModal(true);
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
      setSession(role);
      setEmailVerified(false);

      // teacher enrollment saved too
      saveEnrollInfo();

      addWelcomeNotification(role, fullName.trim() || "User");
      setBusy(false);

      if (role === "teacher") setPayModal(true);
      else setVerifyModal(true);
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
          <h3>Sign Up / Enroll (Teacher / Facilitator)</h3>

          {/* ROLE SELECTOR */}
          <div className="signup-roleRow" aria-label="Choose account type">
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

          {/* Teacher plan selector */}
          {role === "teacher" && (
            <div className="signup-planBox" aria-label="Select a plan">
              <div className="signup-planHead">
                <div>
                  <h4>Choose Your Plan</h4>
                  <p>Select a certification track to enroll (payment is demo for now).</p>
                </div>
                <div className="signup-planPrice">
                  <span>{formatNaira(selectedPlan.price)}</span>
                </div>
              </div>

              <div className="signup-planGrid">
                {PLANS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`signup-planCard ${planId === p.id ? "active" : ""}`}
                    onClick={() => setPlanId(p.id)}
                    disabled={busy}
                  >
                    <div className="signup-planTitle">
                      <strong>{p.name}</strong>
                      <span>{formatNaira(p.price)}</span>
                    </div>
                    <div className="signup-planDesc">{p.desc}</div>
                    <ul className="signup-planBullets">
                      {p.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              <div className="signup-planNote">
                Tip: Teachers must complete payment to unlock learning modules (backend will enforce later).
              </div>
            </div>
          )}

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
              autoComplete="name"
            />

            <label>Email Address</label>
            <input
              type="email"
              placeholder="info@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={busy}
              autoComplete="email"
            />

            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="+234..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={busy}
              autoComplete="tel"
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={busy}
              autoComplete="new-password"
            />

            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={busy}
              autoComplete="new-password"
            />

            <button className="signup-btn" disabled={busy}>
              {busy
                ? "Creating Account..."
                : role === "teacher"
                  ? `Enroll as Teacher (${selectedPlan.name})`
                  : "Create Facilitator Account"}
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

      {/* Payment Placeholder Modal (Teacher only) */}
      {payModal && role === "teacher" && (
        <div className="verify-modal" role="dialog" aria-modal="true">
          <div className="verify-box">
            <h2>💳 Complete Payment (Demo)</h2>
            <p>
              You selected <b>{selectedPlan.name}</b> — <b>{formatNaira(selectedPlan.price)}</b>.
              <br />
              (Paystack/Flutterwave will be connected later.)
            </p>

            <div className="pay-summary">
              <div><span>Plan</span><b>{selectedPlan.name}</b></div>
              <div><span>Amount</span><b>{formatNaira(selectedPlan.price)}</b></div>
              <div><span>Status</span><b>Pending</b></div>
            </div>

            <div className="verify-actions">
              <button className="verify-btn" onClick={() => setPayModal(false)}>
                Cancel
              </button>

              <button className="verify-btn primary" onClick={confirmPaymentDemo}>
                Confirm Payment (Demo)
              </button>
            </div>

            <div className="verify-note">
              After payment, we’ll show email verification (demo), then redirect to your dashboard.
            </div>
          </div>
        </div>
      )}

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
              <button className="verify-btn" onClick={() => alert("Resend verification email (demo).")}>
                Resend Email
              </button>

              <button className="verify-btn primary" onClick={confirmEmailVerification}>
                I Have Verified
              </button>
            </div>

            <div className="verify-note">
              Tip: Teacher learning unlock will be enforced by backend later. For now it’s demo-ready.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}