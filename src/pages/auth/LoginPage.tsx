import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import { setSession } from "../../utils/authStore";
import { authenticate, type UserRole } from "../../utils/userStore";

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
  const [lagosNow, setLagosNow] = useState(getLagosTimeString());
  useEffect(() => {
    const t = window.setInterval(() => setLagosNow(getLagosTimeString()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const [role, setRole] = useState<UserRole>("teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function goDashboard(r: UserRole) {
    window.location.href = r === "teacher" ? "/teacher/dashboard" : "/facilitator/dashboard";
  }

  function validateEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) return setError("Please enter a valid email address.");
    if (password.trim().length < 6) return setError("Password must be at least 6 characters.");

    setBusy(true);
    const res = authenticate(email, password);
    setBusy(false);

    if (!res.ok) return setError(res.error);

    // Optional: enforce selected role matches account role
    if (res.user.role !== role) {
      return setError(`This account is registered as ${res.user.role}. Please switch role and try again.`);
    }

    setSession(role);
    goDashboard(role);
  }

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-header">
          <h2>
            STEAM <span>ONE</span> Platform
          </h2>
          <h1>Welcome Back</h1>
          <p>Login as Teacher or Facilitator to continue learning and managing sessions.</p>
          <div className="timeBadge">Nigeria Time: <strong>{lagosNow}</strong></div>
        </div>

        {/* Role switch */}
        <div className="roleSwitch">
          <button
            type="button"
            className={role === "teacher" ? "roleBtn active" : "roleBtn"}
            onClick={() => setRole("teacher")}
          >
            Teacher
          </button>
          <button
            type="button"
            className={role === "facilitator" ? "roleBtn active" : "roleBtn"}
            onClick={() => setRole("facilitator")}
          >
            Facilitator
          </button>
        </div>

        {error && <div className="errorBox">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="passRow">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" className="eyeBtn" onClick={() => setShowPassword((s) => !s)}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button className="login-btn" disabled={busy}>
            {busy ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="divider">OR</div>

        <a className="linkBtn" href="/signup">
          Create an account
        </a>

        <a className="linkBtn ghost" href="/admin/login" style={{ marginTop: 10 }}>
          Admin Login
        </a>
      </div>
    </div>
  );
}
