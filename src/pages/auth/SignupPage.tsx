import React, { useMemo, useState } from "react";
import "./SignupPage.css";

export default function SignupPage() {
  const year = useMemo(() => new Date().getFullYear(), []);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState(false);

  function googleSignup() {
    alert("Google Sign Up will connect to backend OAuth later.");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!agree) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // FRONTEND ONLY (backend will create account later)
    console.log("Signup:", { fullName, email, password });
    setToast(true);
    window.setTimeout(() => setToast(false), 1800);
  }

  return (
    <div className="su-root">
      <div className="su-card">
        {/* top mini brand */}
        <div className="su-topBrand">
          <div className="su-msMark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="su-topText">Microsoft Education</div>
        </div>

        {/* header */}
        <div className="su-header">
          <h2 className="su-title">
            STEAM <span>ONE</span> Platform
          </h2>

          <h1 className="su-welcome">Join STEAM <span>ONE</span> Platform</h1>
          <p className="su-sub">Create a new account to start your learning journey.</p>
        </div>

        {/* form card */}
        <div className="su-formCard">
          <h3 className="su-formTitle">Sign Up for Your Account</h3>

          <button className="su-googleBtn" type="button" onClick={googleSignup}>
            <span className="su-g">G</span> Sign up with Google
          </button>

          <div className="su-divider">
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="su-label">Full Name</label>
            <input
              className="su-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              required
            />

            <label className="su-label">Email Address</label>
            <input
              className="su-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
            />

            <label className="su-label">Password</label>
            <div className="su-passWrap">
              <input
                className="su-input"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button
                type="button"
                className="su-eye"
                onClick={() => setShowPass((v) => !v)}
                aria-label="Toggle password visibility"
              >
                👁
              </button>
            </div>

            <label className="su-label">Confirm Password</label>
            <div className="su-passWrap">
              <input
                className="su-input"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
              />
              <button
                type="button"
                className="su-eye"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label="Toggle confirm password visibility"
              >
                👁
              </button>
            </div>

            <label className="su-checkRow">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>
                I agree to the{" "}
                <a href="/terms">Terms of Service</a> and{" "}
                <a href="/policy">Privacy Policy</a>
              </span>
            </label>

            {error ? <div className="su-error">{error}</div> : null}

            <button className="su-submit" type="submit">
              Sign Up
            </button>
          </form>

          <p className="su-bottomText">
            Already have an account? <a href="/login">Log In</a>
          </p>

          {toast ? (
            <div className="su-toast">✅ Demo signup submitted (backend will create account later).</div>
          ) : null}
        </div>

        {/* footer */}
        <div className="su-footer">
          <p>Complies with ISTE Standards | UNESCO ICT CFT | PISA Framework</p>
          <p>© {year} STEAM ONE Platform. All rights reserved.</p>

          <div className="su-msFooter">
            <div className="su-msMark small" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div>Microsoft Education</div>
          </div>
        </div>

        {/* bottom nav strip (as in wireframe) */}
        <div className="su-navStrip">
          <a href="/">Home</a>
          <a href="/courses">Courses</a>
          <a href="/marketplace">Marketplace</a>
          <a href="/services">Services</a>
          <a href="/about">About</a>
          <a href="/faq">FAQ</a>
          <a href="/policy">Privacy Policy</a>
          <a href="/cookie-policy">Cookie Policy</a>
        </div>
      </div>
    </div>
  );
}