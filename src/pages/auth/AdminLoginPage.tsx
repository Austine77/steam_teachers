import React, { useMemo, useState } from "react";
import "./AdminLoginPage.css";

export default function AdminLoginPage() {
  const year = useMemo(() => new Date().getFullYear(), []);

  const [adminUsername, setAdminUsername] = useState("admin");
  const [email, setEmail] = useState("johndoe@example.com");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [toast, setToast] = useState(false);

  function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();

    // Frontend only (backend will authenticate later)
    console.log("Admin Login:", { adminUsername, email, password });

    setToast(true);
    window.setTimeout(() => setToast(false), 1800);
  }

  function handleChangeCredentials() {
    alert("This will open admin change credentials page/modal later (backend required).");
  }

  return (
    <div className="al-root">
      <div className="al-card">
        {/* header */}
        <div className="al-header">
          <h2 className="al-title">
            STEAM <span>ONE</span> Platform
          </h2>
          <h1 className="al-h1">Admin Login</h1>
          <p className="al-sub">Authorized access for administrators only.</p>
        </div>

        {/* form card */}
        <div className="al-formCard">
          <form onSubmit={handleAdminLogin}>
            <label className="al-label">Admin Username</label>
            <div className="al-inputIcon">
              <span className="al-ico">👤</span>
              <input
                className="al-input"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="admin"
              />
            </div>

            <label className="al-label">
              Your Email Address <span className="al-req">*</span>
            </label>
            <div className="al-inputIcon">
              <span className="al-ico">✉️</span>
              <input
                className="al-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@steamoneplatform.com"
                required
              />
            </div>

            <div className="al-passRow">
              <label className="al-label">
                Password <span className="al-req">*</span>
              </label>
              <a className="al-forgot" href="#">
                Forgot password?
              </a>
            </div>

            <div className="al-passWrap">
              <input
                className="al-input"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="al-eye"
                onClick={() => setShowPass((v) => !v)}
                aria-label="Toggle password visibility"
              >
                👁
              </button>
            </div>

            <button className="al-loginBtn" type="submit">
              Log In
            </button>

            <button
              className="al-changeBtn"
              type="button"
              onClick={handleChangeCredentials}
            >
              ⚙️ Change Username or Password
            </button>

            <div className="al-support">
              Contact <b>support@steamoneplatform.com</b> if you need assistance.
            </div>

            {toast ? (
              <div className="al-toast">
                ✅ Demo admin login submitted (backend will authenticate later).
              </div>
            ) : null}
          </form>
        </div>

        {/* security notes */}
        <div className="al-notes">
          <span>✅ Secure Admin Access</span>
          <span>•</span>
          <span>Managed Settings</span>
          <span>•</span>
          <span>Advanced Security</span>
        </div>

        {/* microsoft footer */}
        <div className="al-msFooter">
          <div className="al-msMark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="al-msText">Microsoft Education</div>
        </div>

        <div className="al-copy">
          © {year} STEAM ONE Platform • Microsoft Education
        </div>
      </div>
    </div>
  );
}