import React, { useEffect, useState } from "react";
import "./SettingsPage.css";
import { getPaidPlans, type PlanKey } from "../../utils/paymentStore";

type Role = "teacher" | "facilitator" | "admin";

export default function SettingsPage() {

  const [role, setRole] = useState<Role>("teacher");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailNotify, setEmailNotify] = useState(true);
  const [platformNotify, setPlatformNotify] = useState(true);
  const [liveReminder, setLiveReminder] = useState(true);
  const [twoFA, setTwoFA] = useState(false);

  const paidPlans = getPaidPlans();

  useEffect(() => {
    const storedRole = localStorage.getItem("steam_user_role") as Role;
    const storedName = localStorage.getItem("steam_user_name");
    const storedEmail = localStorage.getItem("steam_user_email");

    if (storedRole) setRole(storedRole);
    if (storedName) setFullName(storedName);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  function saveProfile() {
    localStorage.setItem("steam_user_name", fullName);
    localStorage.setItem("steam_user_phone", phone);
    alert("Profile updated successfully.");
  }

  function logout() {
    localStorage.removeItem("steam_user_role");
    localStorage.removeItem("steam_admin_auth_v1");
    window.location.href = "/";
  }

  return (
    <div className="settings-root">

      <div className="settings-container">

        <h1>Account Settings</h1>
        <p>Manage your account preferences and security.</p>

        {/* Profile Section */}
        <div className="settings-card">
          <h2>Profile Information</h2>

          <label>Full Name</label>
          <input
            value={fullName}
            onChange={(e)=>setFullName(e.target.value)}
          />

          <label>Email Address</label>
          <input value={email} disabled />

          <label>Phone Number</label>
          <input
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
          />

          <label>Role</label>
          <input value={role} disabled />

          <button onClick={saveProfile}>
            Save Changes
          </button>
        </div>

        {/* Notifications */}
        <div className="settings-card">
          <h2>Notifications</h2>

          <label>
            <input
              type="checkbox"
              checked={emailNotify}
              onChange={()=>setEmailNotify(!emailNotify)}
            />
            Email Notifications
          </label>

          <label>
            <input
              type="checkbox"
              checked={platformNotify}
              onChange={()=>setPlatformNotify(!platformNotify)}
            />
            Platform Notifications
          </label>

          <label>
            <input
              type="checkbox"
              checked={liveReminder}
              onChange={()=>setLiveReminder(!liveReminder)}
            />
            Live Class Reminders
          </label>
        </div>

        {/* Subscription */}
        <div className="settings-card">
          <h2>Subscription</h2>

          {(["STEAM ONE","STEAM TWO","STEAM THREE"] as PlanKey[]).map(plan=>(
            <div key={plan} className="plan-status">
              <span>{plan}</span>
              <span className={paidPlans[plan] ? "paid" : "locked"}>
                {paidPlans[plan] ? "Unlocked" : "Locked"}
              </span>
            </div>
          ))}

          <button onClick={()=>window.location.href="/marketplace"}>
            Go to Marketplace
          </button>
        </div>

        {/* Security */}
        <div className="settings-card">
          <h2>Security</h2>

          <label>
            <input
              type="checkbox"
              checked={twoFA}
              onChange={()=>setTwoFA(!twoFA)}
            />
            Enable Two-Factor Authentication (Coming Soon)
          </label>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>

      </div>

    </div>
  );
}