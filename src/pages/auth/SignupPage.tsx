import React, { useEffect, useState } from "react";
import "./SignupPage.css";
import { setSession } from "../../utils/authStore";
import { createUser, type UserRole } from "../../utils/userStore";

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
  const [lagosNow, setLagosNow] = useState(getLagosTimeString());
  useEffect(() => {
    const t = window.setInterval(() => setLagosNow(getLagosTimeString()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const [role, setRole] = useState<UserRole>("teacher");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [show, setShow] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validateEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function goDashboard(r: UserRole) {
    window.location.href = r === "teacher" ? "/teacher/dashboard" : "/facilitator/dashboard";
  }

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Full name is required.");
    if (!phone.trim()) return setError("Phone number is required.");
    if (!validateEmail(email)) return setError("Please enter a valid email address.");
    if (p1.trim().length < 6) return setError("Password must be at least 6 characters.");
    if (p1 !== p2) return setError("Passwords do not match.");

    setBusy(true);
    const res = createUser({
      role,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password: p1,
    });
    setBusy(false);

    if (!res.ok) return setError(res.error);

    setSession(role);
    goDashboard(role);
  }

  return (
    <div className="signup-root">
      <div className="signup-card">
        <div className="signup-header">
          <h2>
            STEAM <span>ONE</span> Platform
          </h2>
          <h1>Create Account</h1>
          <p>Sign up as Teacher or Facilitator to access courses, sessions, and updates.</p>
          <div className="timeBadge">Nigeria Time: <strong>{lagosNow}</strong></div>
        </div>

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

        <form onSubmit={handleSignup} className="signup-form">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (+234...)" required />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email" required />

          <div className="passRow">
            <input
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              placeholder="Create password"
              type={show ? "text" : "password"}
              required
            />
            <button type="button" className="eyeBtn" onClick={() => setShow((s) => !s)}>
              {show ? "Hide" : "Show"}
            </button>
          </div>

          <input
            value={p2}
            onChange={(e) => setP2(e.target.value)}
            placeholder="Confirm password"
            type={show ? "text" : "password"}
            required
          />

          <button className="primaryBtn" disabled={busy}>
            {busy ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="helperRow">
          <a className="linkBtn" href="/login">Already have an account? Login</a>
          <a className="linkBtn ghost" href="/courses">Browse Courses</a>
        </div>

        <a className="linkBtn ghost" href="/admin/login" style={{ marginTop: 10 }}>
          Admin Login
        </a>
      </div>
    </div>
  );
}
