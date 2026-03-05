import React, { useState } from "react";
import "./AdminLoginPage.css";
import { setAdminSession } from "../../utils/authStore";

const ADMIN_USERNAME = "OyoTechHub";
const ADMIN_PASSWORD = "EduProject2026";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!username.trim() || !password) return setErr("Enter username and password.");

    setBusy(true);
    const ok = username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD;
    setBusy(false);

    if (!ok) return setErr("Invalid admin credentials.");

    setAdminSession();
    window.location.href = "/admin/dashboard";
  }

  return (
    <div className="admin-root">
      <div className="admin-card">
        <div className="admin-head">
          <h2>Admin Login</h2>
          <p>Authorized administrators only.</p>
        </div>

        {err && <div className="admin-error">{err}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Admin username" />
          </label>

          <label>
            Password
            <div className="admin-pass">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                type={show ? "text" : "password"}
              />
              <button type="button" className="admin-eye" onClick={() => setShow((s) => !s)}>
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button className="admin-btn" disabled={busy}>
            {busy ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="admin-links">
          <a href="/login">Teacher/Facilitator Login</a>
          <a href="/">Back Home</a>
        </div>

        <div className="admin-hint">
          <strong>Default Admin:</strong> {ADMIN_USERNAME} / {ADMIN_PASSWORD}
        </div>
      </div>
    </div>
  );
}
