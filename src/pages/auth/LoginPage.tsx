import React, { useState } from "react";
import "./LoginPage.css";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // FRONTEND ONLY (backend will handle real login)
    console.log("Login:", email, password);

    alert("Demo Login Submitted (Backend will authenticate later)");
  }

  function googleLogin() {
    alert("Google login will connect to backend OAuth later");
  }

  return (
    <div className="login-root">

      <div className="login-card">

        {/* HEADER */}
        <div className="login-header">
          <h2>STEAM <span>ONE</span> Platform</h2>
          <h1>Welcome Back!</h1>
          <p>Log in to continue your learning journey.</p>
        </div>

        {/* FORM CARD */}
        <div className="login-formCard">

          <h3>Log in to Your Account</h3>

          <button className="google-btn" onClick={googleLogin}>
            <span>G</span> Log in with Google
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <form onSubmit={handleLogin}>

            <label>Email Address</label>
            <input
              type="email"
              placeholder="info@example.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />

            <label>Password</label>

            <div className="password-box">
              <input
                type={showPassword ? "text":"password"}
                placeholder="***********"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="eye-btn"
                onClick={()=>setShowPassword(!showPassword)}
              >
                👁
              </button>
            </div>

            <div className="forgot">
              <a href="#">Forgot password?</a>
            </div>

            <button className="login-btn">Log In</button>

          </form>

          <p className="signup">
            Don’t have an account? <a href="/signup">Sign Up</a>
          </p>

        </div>

        {/* FOOTER */}
        <div className="login-footer">
          <p>Complies with ISTE Standards | UNESCO ICT CFT | PISA Framework</p>
          <p>© 2025 STEAM ONE Platform</p>
          <h4>Microsoft Education</h4>
        </div>

      </div>

    </div>
  );
}