import React, { useEffect, useMemo, useState } from "react";
import "./AdminProfile.css";

type Role = "Super Admin" | "Admin" | "Finance Admin" | "Support Admin";
type SecurityLevel = "High" | "Medium" | "Low";

type AdminProfileData = {
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  department: string;
  region: string;
  office: string;
  securityLevel: SecurityLevel;
  twoFAEnabled: boolean;
  lastLogin: string;
  adminId: string;
};

type AuditItem = {
  id: string;
  action: string;
  date: string;
  status: "Success" | "Warning" | "Failed";
};

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

export default function AdminProfile() {
  // Mock admin data (replace with API later)
  const initialData: AdminProfileData = useMemo(
    () => ({
      fullName: "Mr. Daniel Okoye",
      email: "admin@steamone.ng",
      phone: "+234 801 234 5678",
      role: "Super Admin",
      department: "Platform Operations",
      region: "Nigeria",
      office: "Lagos HQ",
      securityLevel: "High",
      twoFAEnabled: true,
      lastLogin: "Today • 09:13 AM",
      adminId: "ADM-STEAM-0001",
    }),
    []
  );

  const [profile, setProfile] = useState<AdminProfileData>(initialData);
  const [savedToast, setSavedToast] = useState(false);

  // Nigeria time
  const [lagosNow, setLagosNow] = useState<string>(getLagosTimeString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Audit log (demo)
  const audit: AuditItem[] = useMemo(
    () => [
      { id: "a1", action: "Updated course pricing rules", date: "Apr 24, 2025 • 2:14 PM", status: "Success" },
      { id: "a2", action: "Exported payments report (Monthly)", date: "Apr 23, 2025 • 11:02 AM", status: "Warning" },
      { id: "a3", action: "Reset teacher password (Support)", date: "Apr 22, 2025 • 4:50 PM", status: "Success" },
      { id: "a4", action: "Failed login attempt detected", date: "Apr 21, 2025 • 9:18 PM", status: "Failed" },
    ],
    []
  );

  const onChange = (key: keyof AdminProfileData, value: string | boolean) => {
    setProfile((p) => ({ ...p, [key]: value as any }));
  };

  const saveProfile = () => {
    // frontend only (connect API later)
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 1800);
  };

  const resetPassword = () => alert("Reset password flow (demo)");
  const manage2FA = () => alert("Manage 2FA flow (demo)");
  const logoutAllSessions = () => alert("Logout all sessions (demo)");
  const openAudit = () => alert("Open full audit log (demo)");
  const openAdminSettings = () => alert("Open admin settings (demo)");
  const openSupport = () => alert("Open support desk (demo)");

  return (
    <div className="ap">
      {/* Sidebar (admin) */}
      <aside className="apSide">
        <div className="apBrand">
          <div className="apMsLogo" aria-label="Microsoft Education logo" />
          <div className="apBrandText">
            <div className="apBrandTop">Microsoft Education</div>
            <div className="apBrandName">
              <span className="apBrandSteam">STEAM</span> <span className="apBrandOne">ONE</span>{" "}
              <span className="apBrandPlatform">Platform</span>
            </div>
          </div>
        </div>

        <div className="apProfileCard">
          <div className="apAvatar" aria-hidden="true" />
          <div className="apName">{profile.fullName}</div>
          <div className="apRole">{profile.role}</div>
          <div className="apMiniRow">
            <span className="apPill strong">Admin ID</span>
            <span className="apMiniVal">{profile.adminId}</span>
          </div>
          <div className="apMiniRow">
            <span className="apPill">Security</span>
            <span className={`apSec ${profile.securityLevel.toLowerCase()}`}>{profile.securityLevel}</span>
          </div>
          <div className="apMiniRow">
            <span className="apPill">2FA</span>
            <span className={`apFlag ${profile.twoFAEnabled ? "on" : "off"}`}>
              {profile.twoFAEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>

        <nav className="apNav" aria-label="Admin navigation">
          <button className="apNavItem">🏠 Admin Dashboard</button>
          <button className="apNavItem">👥 Users</button>
          <button className="apNavItem">📚 Courses</button>
          <button className="apNavItem">💳 Payments</button>
          <button className="apNavItem">📊 Reports</button>
          <button className="apNavItem">🛡 Security</button>
          <button className="apNavItem active">👤 Admin Profile</button>
          <button className="apNavItem">⚙ Settings</button>
          <button className="apNavItem">🧾 Audit Logs</button>
          <button className="apNavItem">🆘 Support</button>
        </nav>

        <div className="apSideHelp">
          <div className="apHelpTitle">Need Help?</div>
          <div className="apHelpText">Open support desk for urgent platform issues.</div>
          <button className="apBtn apBtnPay" onClick={openSupport}>
            Contact Support
          </button>
        </div>

        <div className="apSideFooter">
          <div className="apSideFooterRow">
            <span className="apDot" /> <span>Trusted by ISTE • UNESCO • PISA</span>
          </div>
          <div className="apSideFooterCopy">© 2026 STEAM ONE Platform</div>
        </div>
      </aside>

      {/* Main */}
      <section className="apMain">
        {/* Top bar */}
        <header className="apTop">
          <div className="apTopLeft">
            <div className="apTitleRow">
              <div>
                <div className="apTitle">Admin Profile</div>
                <div className="apSub">
                  Manage your identity, permissions, security, and organization settings.
                </div>
              </div>

              <div className="apTime">
                Nigeria Time: <span className="apTimeRed">{lagosNow}</span>
              </div>
            </div>
          </div>

          <div className="apTopRight">
            <button className="apIconBtn" aria-label="Notifications" title="Notifications">
              🔔 <span className="apBadge">3</span>
            </button>
            <button className="apIconBtn" aria-label="Messages" title="Messages">
              ✉️
            </button>
            <button className="apUserChip" aria-label="User menu">
              <span className="apUserMiniAvatar" aria-hidden="true" />
              <span className="apUserText">
                <span className="apUserName">{profile.fullName}</span>
                <span className="apUserRole">{profile.role}</span>
              </span>
              <span className="apCaret">▾</span>
            </button>
          </div>
        </header>

        {/* Summary cards */}
        <div className="apStats">
          <div className="apStat">
            <div className="apStatIco">🛡</div>
            <div>
              <div className="apStatLabel">Security Level</div>
              <div className="apStatValue">{profile.securityLevel}</div>
            </div>
            <div className="apStatHint">Privileges & access scope</div>
          </div>

          <div className="apStat">
            <div className="apStatIco">🔐</div>
            <div>
              <div className="apStatLabel">2FA Status</div>
              <div className="apStatValue">{profile.twoFAEnabled ? "Enabled" : "Disabled"}</div>
            </div>
            <div className="apStatHint">Recommended: enabled</div>
          </div>

          <div className="apStat">
            <div className="apStatIco">🕒</div>
            <div>
              <div className="apStatLabel">Last Login</div>
              <div className="apStatValue">{profile.lastLogin}</div>
            </div>
            <div className="apStatHint">Monitor unusual activity</div>
          </div>

          <div className="apStat">
            <div className="apStatIco">🧾</div>
            <div>
              <div className="apStatLabel">Audit Signals</div>
              <div className="apStatValue">4 Events</div>
            </div>
            <div className="apStatHint">Recent admin actions</div>
          </div>
        </div>

        {/* Layout grid */}
        <div className="apGrid">
          {/* Left: Identity & Contact */}
          <div className="apCard">
            <div className="apCardHead">
              <div>
                <div className="apH3">Identity & Contact</div>
                <div className="apHint">Keep admin details accurate for verification & support.</div>
              </div>
              <button className="apLinkBtn" onClick={openAdminSettings}>Admin Settings</button>
            </div>

            <div className="apForm">
              <label className="apField">
                <span>Full Name</span>
                <input
                  value={profile.fullName}
                  onChange={(e) => onChange("fullName", e.target.value)}
                  placeholder="Full name"
                />
              </label>

              <label className="apField">
                <span>Email</span>
                <input
                  value={profile.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  placeholder="Email address"
                  type="email"
                />
              </label>

              <label className="apField">
                <span>Phone</span>
                <input
                  value={profile.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  placeholder="+234..."
                />
              </label>

              <div className="apRow2">
                <label className="apField">
                  <span>Role</span>
                  <select value={profile.role} onChange={(e) => onChange("role", e.target.value)}>
                    <option>Super Admin</option>
                    <option>Admin</option>
                    <option>Finance Admin</option>
                    <option>Support Admin</option>
                  </select>
                </label>

                <label className="apField">
                  <span>Department</span>
                  <input
                    value={profile.department}
                    onChange={(e) => onChange("department", e.target.value)}
                    placeholder="Platform Operations"
                  />
                </label>
              </div>

              <div className="apRow2">
                <label className="apField">
                  <span>Region</span>
                  <input
                    value={profile.region}
                    onChange={(e) => onChange("region", e.target.value)}
                    placeholder="Nigeria"
                  />
                </label>

                <label className="apField">
                  <span>Office</span>
                  <input
                    value={profile.office}
                    onChange={(e) => onChange("office", e.target.value)}
                    placeholder="Lagos HQ"
                  />
                </label>
              </div>

              <div className="apActions">
                <button className="apBtn apBtnGhost" onClick={() => setProfile(initialData)}>
                  Reset
                </button>
                <button className="apBtn apBtnPrimary" onClick={saveProfile}>
                  Save Changes
                </button>
              </div>

              {savedToast && <div className="apToast">✅ Profile saved (demo)</div>}
            </div>
          </div>

          {/* Right: Security */}
          <div className="apCard">
            <div className="apCardHead">
              <div>
                <div className="apH3">Security & Access</div>
                <div className="apHint">Protect the platform with secure admin controls.</div>
              </div>
            </div>

            <div className="apSecurity">
              <div className="apSecBox">
                <div className="apSecTitle">Two-Factor Authentication (2FA)</div>
                <div className="apSecSub">
                  Strongly recommended for all Admin accounts.
                </div>

                <div className="apToggleRow">
                  <div className="apToggleMeta">
                    <div className="apToggleLabel">2FA Status</div>
                    <div className={`apFlag ${profile.twoFAEnabled ? "on" : "off"}`}>
                      {profile.twoFAEnabled ? "Enabled" : "Disabled"}
                    </div>
                  </div>

                  <button className="apBtn apBtnPay" onClick={manage2FA}>
                    Manage 2FA
                  </button>
                </div>
              </div>

              <div className="apSecBox">
                <div className="apSecTitle">Password & Sessions</div>
                <div className="apSecSub">Reset credentials and control active sessions.</div>

                <div className="apSecActions">
                  <button className="apBtn apBtnPrimary" onClick={resetPassword}>
                    Reset Password
                  </button>
                  <button className="apBtn apBtnDanger" onClick={logoutAllSessions}>
                    Logout All Sessions
                  </button>
                </div>

                <div className="apMiniInfo">
                  Tip: rotate passwords periodically and avoid shared admin accounts.
                </div>
              </div>

              <div className="apSecBox">
                <div className="apSecTitle">Access Summary</div>
                <div className="apSecSub">Your current admin scope & risk rating.</div>

                <div className="apAccessGrid">
                  <div className="apAccessItem">
                    <div className="apAccessLabel">Security Level</div>
                    <div className={`apAccessValue ${profile.securityLevel.toLowerCase()}`}>{profile.securityLevel}</div>
                  </div>
                  <div className="apAccessItem">
                    <div className="apAccessLabel">Admin ID</div>
                    <div className="apAccessValue">{profile.adminId}</div>
                  </div>
                  <div className="apAccessItem">
                    <div className="apAccessLabel">Role</div>
                    <div className="apAccessValue">{profile.role}</div>
                  </div>
                  <div className="apAccessItem">
                    <div className="apAccessLabel">Risk Status</div>
                    <div className="apAccessValue good">Normal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audit log */}
          <div className="apCard apSpan2">
            <div className="apCardHead">
              <div>
                <div className="apH3">Recent Admin Activity</div>
                <div className="apHint">Last recorded actions for accountability and security.</div>
              </div>
              <button className="apBtn apBtnGhostSmall" onClick={openAudit}>View Full Audit</button>
            </div>

            <div className="apTable">
              <div className="apTr apTh">
                <div>Action</div>
                <div>Date</div>
                <div>Status</div>
              </div>

              {audit.map((x) => (
                <div className="apTr" key={x.id}>
                  <div className="apTdTitle">{x.action}</div>
                  <div>{x.date}</div>
                  <div>
                    <span className={`apStatus ${x.status.toLowerCase()}`}>{x.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="apAuditNote">
              Note: audit logs are immutable after backend integration. Keep records for compliance and trust.
            </div>
          </div>

          {/* Organization Settings (demo cards) */}
          <div className="apCard apSpan2">
            <div className="apCardHead">
              <div>
                <div className="apH3">Organization Controls</div>
                <div className="apHint">High-level settings used by your platform administrators.</div>
              </div>
            </div>

            <div className="apOrgGrid">
              <div className="apOrgCard">
                <div className="apOrgIcon">🏫</div>
                <div className="apOrgTitle">Brand & Compliance</div>
                <div className="apOrgSub">
                  Ensure Microsoft Education branding is shown and standards are listed (ISTE, UNESCO ICT CFT, PISA).
                </div>
                <button className="apBtn apBtnGhostSmall" onClick={() => alert("Open branding controls (demo)")}>
                  Manage
                </button>
              </div>

              <div className="apOrgCard">
                <div className="apOrgIcon">💳</div>
                <div className="apOrgTitle">Payments & Gateways</div>
                <div className="apOrgSub">
                  Configure Paystack / Flutterwave / Stripe keys (backend). Control payouts and reconciliation.
                </div>
                <button className="apBtn apBtnGhostSmall" onClick={() => alert("Open payment settings (demo)")}>
                  Manage
                </button>
              </div>

              <div className="apOrgCard">
                <div className="apOrgIcon">👥</div>
                <div className="apOrgTitle">Roles & Permissions</div>
                <div className="apOrgSub">
                  Define what Admins, Facilitators, and Teachers can access. Audit permission changes.
                </div>
                <button className="apBtn apBtnGhostSmall" onClick={() => alert("Open roles & permissions (demo)")}>
                  Manage
                </button>
              </div>

              <div className="apOrgCard">
                <div className="apOrgIcon">🧾</div>
                <div className="apOrgTitle">Reports & Exports</div>
                <div className="apOrgSub">
                  Generate monthly reports for enrollments, course completion, and payments. Export to CSV/PDF.
                </div>
                <button className="apBtn apBtnGhostSmall" onClick={() => alert("Open reporting center (demo)")}>
                  Manage
                </button>
              </div>
            </div>
          </div>

          {/* Bottom quick actions */}
          <div className="apCard apSpan2">
            <div className="apCardHead">
              <div>
                <div className="apH3">Quick Admin Actions</div>
                <div className="apHint">Fast controls to keep operations running smoothly.</div>
              </div>
            </div>

            <div className="apQuickRow">
              <button className="apQuick" onClick={() => alert("Create admin user (demo)")}>
                <span className="apQuickIcon">➕</span>
                <span className="apQuickTitle">Create Admin</span>
                <span className="apQuickSub">Add another admin account</span>
              </button>

              <button className="apQuick" onClick={() => alert("Open verification queue (demo)")}>
                <span className="apQuickIcon">✅</span>
                <span className="apQuickTitle">Verification Queue</span>
                <span className="apQuickSub">Verify teachers & facilitators</span>
              </button>

              <button className="apQuick" onClick={() => alert("Open incident center (demo)")}>
                <span className="apQuickIcon">🚨</span>
                <span className="apQuickTitle">Incident Center</span>
                <span className="apQuickSub">Handle platform issues</span>
              </button>

              <button className="apQuick" onClick={() => alert("Open backups & restore (demo)")}>
                <span className="apQuickIcon">💾</span>
                <span className="apQuickTitle">Backups</span>
                <span className="apQuickSub">Data safety controls</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="apFooter">
          <div className="apFooterLeft">
            <span className="apFooterLogo" aria-hidden="true" />
            <span>© 2026 STEAM ONE Platform. All rights reserved.</span>
          </div>
          <div className="apFooterLinks">
            <button className="apLinkBtn" onClick={() => alert("Terms (demo)")}>Terms of Service</button>
            <button className="apLinkBtn" onClick={() => alert("Privacy (demo)")}>Privacy Policy</button>
            <button className="apLinkBtn" onClick={() => alert("Support (demo)")}>Support</button>
          </div>
        </footer>
      </section>
    </div>
  );
}