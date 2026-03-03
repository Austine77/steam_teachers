import React, { useState } from "react";
import "./AdminLoginPage.css";
import { setAdminSession } from "../utils/authStore";

const ADMIN_USERNAME = "OyoTechHub";
const ADMIN_PASSWORD = "EduProject2026";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAdminSession();
      window.location.href = "/admin/dashboard";
      return;
    }
    setErr("Invalid admin credentials.");
  }

  return (
    <div className="admin-login-root">
      <div className="admin-login-card">
        <div className="admin-header">
          <h2>STEAM <span>ONE</span> Platform</h2>
          <h1>Admin Login</h1>
          <p>Authorized access only</p>
        </div>

        <form onSubmit={submit} className="admin-form">
          {err && <div className="admin-error">{err}</div>}

          <label>Admin Username</label>
          <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Enter username" required />

          <label>Password</label>
          <div className="admin-password-box">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
            <button type="button" onClick={() => setShow(!show)} aria-label="toggle password">👁</button>
          </div>

          <button className="admin-login-btn">Login as Admin</button>
        </form>

        <div className="admin-footer">
          <p>Microsoft Education | ISTE | UNESCO ICT CFT | PISA</p>
          <p>© 2026 STEAM ONE Platform</p>
        </div>
      </div>
    </div>
  );
}