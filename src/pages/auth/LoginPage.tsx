import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import { setSession } from "../utils/authStore"; // role session storage

type TFRole = "teacher" | "facilitator";

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

export default function LoginPage() {
  // Nigeria time
  const [lagosNow, setLagosNow] = useState(getLagosTimeString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Role: Teacher or Facilitator only
  const [role, setRole] = useState<TFRole>("teacher");

  // Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // UX
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function goDashboard(r: TFRole) {
    if (r === "teacher") window.location.href = "/teacher/dashboard";
    else window.location.href = "/facilitator/dashboard";
  }

  function validateEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) return setError("Please enter a valid email address.");
    if (password.trim().length < 6) return setError("Password must be at least 6 characters.");

    // FRONTEND ONLY: backend will authenticate later
    setBusy(true);
    setTimeout(() => {
      setSession(role); // saves role + logged-in flag (for ProtectedRoute)
      setBusy(false);
      goDashboard(role);
    }, 650);
  }

  function googleLogin() {
    setError(null);
    setBusy(true);

    // FRONTEND ONLY placeholder for OAuth
    setTimeout(() => {
      setSession(role);
      setBusy(false);
      goDashboard(role);
    }, 650);
  }

  return (
    <div className="login-root">
      <div className="login-card">
        {/* HEADER */}
        <div className="login-header">
          <h2>
            STEAM <span>ONE</span> Platform
          </h2>
          <h1>Welcome Back!</h1>
          <p>Teachers and Facilitators can log in to continue learning and managing sessions.</p>

          <div className="login-time">
            Nigeria Time: <span className="login-timeRed">{lagosNow}</span>
          </div>

          <div className="login-adminNote">
            Admin?{" "}
            <a className="login-adminLink" href="/admin/login">
              Use Admin Login
            </a>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="login-formCard">
          <h3>Log in (Teacher / Facilitator)</h3>

          {/* ROLE SWITCH */}
          <div className="login-roleRow" aria-label="Choose account type">
            <button
              type="button"
              className={`login-roleBtn ${role === "teacher" ? "active" : ""}`}
              onClick={() => setRole("teacher")}
              disabled={busy}
            >
              Teacher
            </button>
            <button
              type="button"
              className={`login-roleBtn ${role === "facilitator" ? "active" : ""}`}
              onClick={() => setRole("facilitator")}
              disabled={busy}
            >
              Facilitator
            </button>
          </div>

          {/* GOOGLE LOGIN */}
          <button className="google-btn" onClick={googleLogin} disabled={busy}>
            <span className="gMark">G</span> Continue with Google
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          {error && <div className="login-error">{error}</div>}

          {/* EMAIL LOGIN */}
          <form onSubmit={handleLogin}>
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

            <label>Password</label>

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="***********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={busy}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={busy}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                👁
              </button>
            </div>

            <div className="forgot">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Password reset will connect to backend later.");
                }}
              >
                Forgot password?
              </a>
            </div>

            <button className="login-btn" disabled={busy}>
              {busy
                ? "Please wait..."
                : `Log In as ${role === "teacher" ? "Teacher" : "Facilitator"}`}
            </button>
          </form>

          <p className="signup">
            Don’t have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>

        {/* FOOTER */}
        <div className="login-footer">
          <p>Complies with ISTE Standards | UNESCO ICT CFT | PISA Framework</p>
          <p>© 2026 STEAM ONE Platform</p>
          <h4>Microsoft Education</h4>
        </div>
      </div>
    </div>
  );
}