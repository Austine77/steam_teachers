import React, { useEffect, useMemo, useState } from "react";
import "./VerificationPage.css";
import { getRole } from "../utils/authStore";

type Role = "teacher" | "facilitator";

const LS_EMAIL = "steam_user_email";
const LS_EMAIL_VERIFIED = "steam_email_verified_v1";
const LS_PHONE_VERIFIED = "steam_phone_verified_v1";
const LS_WELCOME_SENT = "steam_welcome_sent_v1";

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

function maskEmail(email: string) {
  const [u, d] = email.split("@");
  if (!d) return email;
  if (u.length <= 2) return `${u[0] || ""}***@${d}`;
  return `${u.slice(0, 2)}***${u.slice(-1)}@${d}`;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function randOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function VerificationPage() {
  const role = (getRole() === "facilitator" ? "facilitator" : "teacher") as Role;

  // Nigeria time
  const [lagosNow, setLagosNow] = useState(getLagosTimeString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Stored email
  const email = useMemo(() => localStorage.getItem(LS_EMAIL) || "user@example.com", []);

  // Verification status (persisted)
  const [emailVerified, setEmailVerified] = useState(localStorage.getItem(LS_EMAIL_VERIFIED) === "1");
  const [phoneVerified, setPhoneVerified] = useState(localStorage.getItem(LS_PHONE_VERIFIED) === "1");

  // OTP simulation
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Phone simulation
  const [phone, setPhone] = useState("+234 000 000 0000");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpValue, setPhoneOtpValue] = useState("");
  const [phoneOtpInput, setPhoneOtpInput] = useState("");

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 1800);
  };

  // Resend cooldown tick
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearInterval(t);
  }, [cooldown]);

  const completion = useMemo(() => {
    const total = 2;
    const done = (emailVerified ? 1 : 0) + (phoneVerified ? 1 : 0);
    return Math.round((done / total) * 100);
  }, [emailVerified, phoneVerified]);

  function sendEmailOtp() {
    if (cooldown > 0) return;
    const code = randOtp();
    setOtpValue(code);
    setOtpSent(true);
    setOtpInput("");
    setCooldown(30);
    showToast(`📧 OTP sent (demo): ${code}`);
  }

  function confirmEmailOtp() {
    if (!otpSent) return showToast("Send OTP first.");
    if (otpInput.trim() !== otpValue) return showToast("❌ Invalid OTP. Try again.");
    localStorage.setItem(LS_EMAIL_VERIFIED, "1");
    setEmailVerified(true);
    showToast("✅ Email verified!");
    autoWelcome();
  }

  function sendPhoneOtp() {
    const code = randOtp();
    setPhoneOtpValue(code);
    setPhoneOtpSent(true);
    setPhoneOtpInput("");
    showToast(`📱 Phone OTP sent (demo): ${code}`);
  }

  function confirmPhoneOtp() {
    if (!phoneOtpSent) return showToast("Send phone OTP first.");
    if (phoneOtpInput.trim() !== phoneOtpValue) return showToast("❌ Invalid OTP. Try again.");
    localStorage.setItem(LS_PHONE_VERIFIED, "1");
    setPhoneVerified(true);
    showToast("✅ Phone verified!");
    autoWelcome();
  }

  function autoWelcome() {
    // only once
    if (localStorage.getItem(LS_WELCOME_SENT) === "1") return;

    // send when at least email verified (or both)
    if (localStorage.getItem(LS_EMAIL_VERIFIED) !== "1") return;

    localStorage.setItem(LS_WELCOME_SENT, "1");

    // Demo notification simulation
    const msg =
      role === "teacher"
        ? "🎉 Welcome Teacher! Please choose a plan in your dashboard and make payment to unlock learning."
        : "🎉 Welcome Facilitator! Your dashboard is unlocked. Start supporting teachers and managing classes.";
    showToast(msg);
  }

  function goNext() {
    // Teachers/facilitators can access dashboard after signup,
    // but verification is recommended. This button just navigates.
    const dash = role === "teacher" ? "/teacher/dashboard" : "/facilitator/dashboard";
    window.location.href = dash;
  }

  function resetDemo() {
    localStorage.removeItem(LS_EMAIL_VERIFIED);
    localStorage.removeItem(LS_PHONE_VERIFIED);
    localStorage.removeItem(LS_WELCOME_SENT);
    setEmailVerified(false);
    setPhoneVerified(false);
    setOtpSent(false);
    setOtpValue("");
    setOtpInput("");
    setPhoneOtpSent(false);
    setPhoneOtpValue("");
    setPhoneOtpInput("");
    setCooldown(0);
    showToast("Verification reset (demo).");
  }

  return (
    <div className="vp">
      {/* Sidebar */}
      <aside className="vpSide">
        <div className="vpBrand">
          <div className="vpMsLogo" aria-label="Microsoft Education logo" />
          <div className="vpBrandText">
            <div className="vpTopTxt">Microsoft Education</div>
            <div className="vpNameTxt">
              <span className="vpSteam">STEAM</span> <span className="vpOne">ONE</span>{" "}
              <span className="vpPlat">Platform</span>
            </div>
          </div>
        </div>

        <div className="vpSideCard">
          <div className="vpSideTitle">Account Verification</div>
          <div className="vpSideSub">
            Verify your email and phone for a secure account and certificate eligibility.
          </div>

          <div className="vpTime">
            Nigeria Time: <span className="vpTimeRed">{lagosNow}</span>
          </div>

          <div className="vpProgress">
            <div className="vpProgressTop">
              <span>Verification completion</span>
              <b>{completion}%</b>
            </div>
            <div className="vpBar">
              <div className="vpFill" style={{ width: `${completion}%` }} />
            </div>
          </div>

          <div className="vpSideBtns">
            <button className="vpBtn vpBtnPrimary" onClick={goNext}>
              Continue to Dashboard
            </button>
            <button className="vpBtn vpBtnGhost" onClick={resetDemo}>
              Reset Demo
            </button>
          </div>

          <div className="vpNote">
            ✅ Backend will later send real OTP via email/SMS. This UI is ready for integration.
          </div>
        </div>

        <div className="vpSideFooter">
          <div className="vpFootRow"><span className="vpDot" /> ISTE • UNESCO ICT CFT • PISA</div>
          <div className="vpFootCopy">© 2026 STEAM ONE Platform</div>
        </div>
      </aside>

      {/* Main */}
      <main className="vpMain">
        <header className="vpHeader">
          <div>
            <div className="vpTitle">Verify your Account</div>
            <div className="vpSub">
              {role === "teacher" ? "Teacher Account" : "Facilitator Account"} • Frontend simulation
            </div>
          </div>

          <div className="vpHeaderRight">
            <span className={`vpPill ${emailVerified ? "ok" : ""}`}>
              {emailVerified ? "✅ Email Verified" : "⚠ Email Not Verified"}
            </span>
            <span className={`vpPill ${phoneVerified ? "ok" : ""}`}>
              {phoneVerified ? "✅ Phone Verified" : "⚠ Phone Not Verified"}
            </span>
          </div>
        </header>

        <section className="vpGrid">
          {/* Email Verification */}
          <div className="vpCard">
            <div className="vpCardHead">
              <div>
                <div className="vpH3">Email Verification</div>
                <div className="vpHint">
                  Verify: <b>{maskEmail(email)}</b>
                </div>
              </div>
              <span className={`vpStatus ${emailVerified ? "ok" : ""}`}>
                {emailVerified ? "Verified" : "Pending"}
              </span>
            </div>

            <div className="vpBody">
              <div className="vpRow">
                <button
                  className="vpBtn vpBtnPrimary"
                  onClick={sendEmailOtp}
                  disabled={emailVerified || cooldown > 0}
                  title={cooldown > 0 ? `Wait ${cooldown}s` : "Send OTP"}
                >
                  📧 {emailVerified ? "Verified" : cooldown > 0 ? `Resend in ${cooldown}s` : "Send OTP"}
                </button>

                <button
                  className="vpBtn vpBtnGhost"
                  onClick={() => showToast("Resend link placeholder (backend later).")}
                  disabled={emailVerified}
                >
                  🔁 Send verification link
                </button>
              </div>

              <div className="vpFieldRow">
                <label className="vpField">
                  <span>Enter OTP</span>
                  <input
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="6-digit OTP"
                    disabled={emailVerified}
                    inputMode="numeric"
                  />
                </label>

                <button className="vpBtn vpBtnPrimary" onClick={confirmEmailOtp} disabled={emailVerified}>
                  Confirm
                </button>
              </div>

              <div className="vpMini">
                Demo note: OTP shows in toast for testing. Backend will send real email OTP later.
              </div>
            </div>
          </div>

          {/* Phone Verification */}
          <div className="vpCard">
            <div className="vpCardHead">
              <div>
                <div className="vpH3">Phone Verification</div>
                <div className="vpHint">Add/verify your phone for security and account recovery.</div>
              </div>
              <span className={`vpStatus ${phoneVerified ? "ok" : ""}`}>
                {phoneVerified ? "Verified" : "Pending"}
              </span>
            </div>

            <div className="vpBody">
              <label className="vpField">
                <span>Phone Number</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234..."
                  disabled={phoneVerified}
                />
              </label>

              <div className="vpRow">
                <button className="vpBtn vpBtnPrimary" onClick={sendPhoneOtp} disabled={phoneVerified}>
                  📱 {phoneVerified ? "Verified" : "Send OTP"}
                </button>
                <button
                  className="vpBtn vpBtnGhost"
                  onClick={() => showToast("SMS gateway placeholder (backend later).")}
                  disabled={phoneVerified}
                >
                  Provider settings
                </button>
              </div>

              <div className="vpFieldRow">
                <label className="vpField">
                  <span>Enter OTP</span>
                  <input
                    value={phoneOtpInput}
                    onChange={(e) => setPhoneOtpInput(e.target.value)}
                    placeholder="6-digit OTP"
                    disabled={phoneVerified}
                    inputMode="numeric"
                  />
                </label>

                <button className="vpBtn vpBtnPrimary" onClick={confirmPhoneOtp} disabled={phoneVerified}>
                  Confirm
                </button>
              </div>

              <div className="vpMini">
                Demo note: OTP shows in toast for testing. Backend will send real SMS OTP later.
              </div>
            </div>
          </div>

          {/* Security + Certificate Note */}
          <div className="vpCard vpWide">
            <div className="vpCardHead">
              <div>
                <div className="vpH3">Security & Certificate Eligibility</div>
                <div className="vpHint">
                  Verification improves account security and is required for trusted certification.
                </div>
              </div>
            </div>

            <div className="vpChecklist">
              <div className={`vpCheck ${emailVerified ? "ok" : ""}`}>
                <div className="ico">{emailVerified ? "✅" : "⬜"}</div>
                <div>
                  <div className="t">Verify Email</div>
                  <div className="d">Email verification enables account recovery and secure notifications.</div>
                </div>
              </div>

              <div className={`vpCheck ${phoneVerified ? "ok" : ""}`}>
                <div className="ico">{phoneVerified ? "✅" : "⬜"}</div>
                <div>
                  <div className="t">Verify Phone</div>
                  <div className="d">Phone verification helps secure logins and supports 2FA later.</div>
                </div>
              </div>

              <div className="vpCheck">
                <div className="ico">🛡</div>
                <div>
                  <div className="t">Backend Integration Ready</div>
                  <div className="d">Replace OTP simulation with Paystack/Flutterwave callbacks and real email/SMS services.</div>
                </div>
              </div>

              <div className="vpCheck">
                <div className="ico">🏅</div>
                <div>
                  <div className="t">Certificate Rule</div>
                  <div className="d">Certificate becomes available after 100% completion + verification + admin approval.</div>
                </div>
              </div>
            </div>

            <div className="vpActionsWide">
              <button className="vpBtn vpBtnPrimary" onClick={goNext}>
                Continue to Dashboard
              </button>
              <button className="vpBtn vpBtnGhost" onClick={() => showToast("Privacy policy placeholder (demo).")}>
                View Privacy Policy
              </button>
            </div>
          </div>
        </section>

        <footer className="vpFooter">
          <div>© 2026 STEAM ONE Platform • Verification</div>
          <div className="muted">Microsoft Education • ISTE • UNESCO ICT CFT • PISA</div>
        </footer>
      </main>

      {toast && <div className="vpToast">{toast}</div>}
    </div>
  );
}