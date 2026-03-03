import React, { useEffect, useMemo, useRef, useState } from "react";
import "./UserProfilePage.css";
import { getRole, clearSession } from "../utils/authStore";

type Role = "teacher" | "facilitator";

type UserProfile = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  role: Role;
  bio: string;
  skills: string[];
  school: string;
  experienceYears: string;
  verifiedEmail: boolean;
  avatarDataUrl?: string;
  createdAtISO: string;
};

const LS_PROFILE = "steam_user_profile_v1";
const LS_EMAIL = "steam_user_email";
const LS_VERIFIED = "steam_email_verified_v1";

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

function safeParse<T>(raw: string | null): T | null {
  try {
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function getDefaultProfile(): UserProfile {
  const role = (getRole() === "facilitator" ? "facilitator" : "teacher") as Role;
  const email = localStorage.getItem(LS_EMAIL) || (role === "teacher" ? "teacher@example.com" : "facilitator@example.com");
  const verified = localStorage.getItem(LS_VERIFIED) === "1";

  return {
    fullName: role === "teacher" ? "Teacher User" : "Facilitator User",
    email,
    phone: "+234 000 000 0000",
    location: "Lagos, Nigeria",
    role,
    bio:
      role === "teacher"
        ? "Passionate educator building modern STEAM learning experiences aligned with ISTE and UNESCO ICT CFT."
        : "Certified facilitator supporting teachers with structured training and classroom-ready technology integration.",
    skills: role === "teacher" ? ["Lesson Planning", "Classroom Management", "Digital Tools"] : ["Mentorship", "Training", "Learning Design"],
    school: role === "teacher" ? "Primary/Secondary School" : "STEAM ONE Faculty",
    experienceYears: role === "teacher" ? "2" : "5",
    verifiedEmail: verified,
    createdAtISO: new Date().toISOString(),
  };
}

export default function UserProfilePage() {
  const role = (getRole() === "facilitator" ? "facilitator" : "teacher") as Role;

  // Nigeria time
  const [lagosNow, setLagosNow] = useState(getLagosTimeString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Load profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const existing = safeParse<UserProfile>(localStorage.getItem(LS_PROFILE));
    const base = existing || getDefaultProfile();
    // Always force role to current session role (for safety)
    return { ...base, role };
  });

  // Form state
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile>(profile);

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 1800);
  };

  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // keep draft synced when profile changes
    setDraft(profile);
  }, [profile]);

  const accountLabel = useMemo(() => (role === "teacher" ? "Teacher Account" : "Facilitator Account"), [role]);

  const completion = useMemo(() => {
    const fields = [
      draft.fullName,
      draft.email,
      draft.phone,
      draft.location,
      draft.bio,
      draft.school,
      draft.experienceYears,
    ];
    const filled = fields.filter((x) => String(x || "").trim().length > 0).length;
    const base = Math.round((filled / fields.length) * 100);
    const skillsBonus = draft.skills.length ? 10 : 0;
    return Math.min(100, base + skillsBonus);
  }, [draft]);

  function save() {
    const clean: UserProfile = {
      ...draft,
      role,
      email: draft.email.trim(),
      fullName: draft.fullName.trim(),
      phone: draft.phone.trim(),
      location: draft.location.trim(),
      school: draft.school.trim(),
      bio: draft.bio.trim(),
      verifiedEmail: localStorage.getItem(LS_VERIFIED) === "1",
    };

    localStorage.setItem(LS_PROFILE, JSON.stringify(clean));
    localStorage.setItem(LS_EMAIL, clean.email);

    setProfile(clean);
    setEditing(false);
    showToast("✅ Profile saved (demo).");
  }

  function cancel() {
    setDraft(profile);
    setEditing(false);
    showToast("Changes cancelled.");
  }

  function onPickAvatar() {
    fileRef.current?.click();
  }

  function onAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    // Frontend preview only (backend will upload later)
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result || "");
      setDraft((p) => ({ ...p, avatarDataUrl: url }));
      showToast("Avatar updated (preview).");
    };
    reader.readAsDataURL(f);
  }

  function simulateVerifyEmail() {
    // placeholder for backend email verification
    localStorage.setItem(LS_VERIFIED, "1");
    setDraft((p) => ({ ...p, verifiedEmail: true }));
    setProfile((p) => ({ ...p, verifiedEmail: true }));
    showToast("📧 Email verified (simulation).");
  }

  function changePassword() {
    alert("🔐 Change password (placeholder). Backend will handle this.");
  }

  function go(path: string) {
    window.location.href = path;
  }

  function logout() {
    clearSession();
    window.location.href = "/login";
  }

  const dashPath = role === "teacher" ? "/teacher/dashboard" : "/facilitator/dashboard";

  return (
    <div className="up">
      {/* Sidebar */}
      <aside className="upSide">
        <div className="upBrand">
          <div className="upMsLogo" aria-label="Microsoft Education logo" />
          <div className="upBrandText">
            <div className="upBrandTop">Microsoft Education</div>
            <div className="upBrandName">
              <span className="upBrandSteam">STEAM</span>{" "}
              <span className="upBrandOne">ONE</span>{" "}
              <span className="upBrandPlatform">Platform</span>
            </div>
          </div>
        </div>

        <div className="upSideCard">
          <div className="upSideTitle">User Profile</div>
          <div className="upSideSub">Manage your account, preferences, and verification.</div>

          <div className="upTime">
            Nigeria Time: <span className="upTimeRed">{lagosNow}</span>
          </div>

          <div className="upProgress">
            <div className="upProgressTop">
              <span>Profile completion</span>
              <b>{completion}%</b>
            </div>
            <div className="upBar">
              <div className="upFill" style={{ width: `${completion}%` }} />
            </div>
          </div>

          <div className="upQuick">
            <button className="upBtn upBtnPrimary" onClick={() => go(dashPath)}>🏠 Dashboard</button>
            <button className="upBtn upBtnGhost" onClick={() => go("/support")}>🧑‍💻 Support Center</button>
            <button className="upBtn upBtnGhost" onClick={() => go("/settings")}>⚙ Settings</button>
          </div>
        </div>

        <nav className="upNav">
          <button className="upNavItem active">👤 Profile</button>
          <button className="upNavItem" onClick={() => go("/notifications")}>🔔 Notifications</button>
          <button className="upNavItem" onClick={() => go("/messaging")}>💬 Messaging</button>
          <button className="upNavItem" onClick={() => go("/certificates")}>🏅 Certificates</button>
          <button className="upNavItem" onClick={() => go("/courses")}>📚 Courses</button>
        </nav>

        <div className="upSideFooter">
          <div className="upFootRow"><span className="upDot" /> ISTE • UNESCO ICT CFT • PISA</div>
          <div className="upFootCopy">© 2026 STEAM ONE Platform</div>
        </div>
      </aside>

      {/* Main */}
      <main className="upMain">
        <header className="upTop">
          <div>
            <div className="upTitle">My Profile</div>
            <div className="upSub">
              {accountLabel} • Update your details (frontend-only). Backend will validate later.
            </div>
          </div>

          <div className="upTopActions">
            {!editing ? (
              <button className="upBtn upBtnPrimary" onClick={() => setEditing(true)}>✏ Edit Profile</button>
            ) : (
              <>
                <button className="upBtn upBtnPrimary" onClick={save}>Save</button>
                <button className="upBtn upBtnGhost" onClick={cancel}>Cancel</button>
              </>
            )}
            <button className="upBtn upBtnDanger" onClick={logout}>Logout</button>
          </div>
        </header>

        <section className="upGrid">
          {/* Profile card */}
          <div className="upCard">
            <div className="upCardHead">
              <div>
                <div className="upH3">Profile Details</div>
                <div className="upHint">This information will be used for certificates, marketplace and recruiting.</div>
              </div>
              <div className="upStatus">
                <span className={`upVerify ${draft.verifiedEmail ? "ok" : ""}`}>
                  {draft.verifiedEmail ? "✅ Email Verified" : "⚠ Email Not Verified"}
                </span>
                {!draft.verifiedEmail && (
                  <button className="upBtn upBtnGhostSmall" onClick={simulateVerifyEmail}>
                    Verify (Demo)
                  </button>
                )}
              </div>
            </div>

            <div className="upProfileRow">
              <div className="upAvatarWrap">
                <div className="upAvatar">
                  {draft.avatarDataUrl ? (
                    <img src={draft.avatarDataUrl} alt="avatar" />
                  ) : (
                    <div className="upAvatarPlaceholder" aria-hidden="true" />
                  )}
                </div>

                <input
                  ref={fileRef}
                  className="upHiddenFile"
                  type="file"
                  accept="image/*"
                  onChange={onAvatarFile}
                />

                <button
                  className="upBtn upBtnGhost"
                  onClick={onPickAvatar}
                  disabled={!editing}
                  title={editing ? "Upload avatar" : "Enable edit mode first"}
                >
                  📷 Upload Avatar
                </button>

                <div className="upMiniNote">Avatar preview only. Backend will upload later.</div>
              </div>

              <div className="upForm">
                <div className="upFieldRow">
                  <label className="upField">
                    <span>Full Name</span>
                    <input
                      value={draft.fullName}
                      onChange={(e) => setDraft((p) => ({ ...p, fullName: e.target.value }))}
                      disabled={!editing}
                    />
                  </label>

                  <label className="upField">
                    <span>Role</span>
                    <input value={draft.role === "teacher" ? "Teacher" : "Facilitator"} disabled />
                  </label>
                </div>

                <div className="upFieldRow">
                  <label className="upField">
                    <span>Email</span>
                    <input
                      value={draft.email}
                      onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))}
                      disabled={!editing}
                    />
                  </label>

                  <label className="upField">
                    <span>Phone</span>
                    <input
                      value={draft.phone}
                      onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
                      disabled={!editing}
                    />
                  </label>
                </div>

                <label className="upField">
                  <span>Location</span>
                  <input
                    value={draft.location}
                    onChange={(e) => setDraft((p) => ({ ...p, location: e.target.value }))}
                    disabled={!editing}
                  />
                </label>

                <div className="upFieldRow">
                  <label className="upField">
                    <span>School / Organization</span>
                    <input
                      value={draft.school}
                      onChange={(e) => setDraft((p) => ({ ...p, school: e.target.value }))}
                      disabled={!editing}
                    />
                  </label>

                  <label className="upField">
                    <span>Experience (Years)</span>
                    <input
                      value={draft.experienceYears}
                      onChange={(e) => setDraft((p) => ({ ...p, experienceYears: e.target.value }))}
                      disabled={!editing}
                    />
                  </label>
                </div>

                <label className="upField">
                  <span>Bio</span>
                  <textarea
                    value={draft.bio}
                    onChange={(e) => setDraft((p) => ({ ...p, bio: e.target.value }))}
                    disabled={!editing}
                    rows={5}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="upStack">
            {/* Skills */}
            <div className="upCard">
              <div className="upCardHead">
                <div>
                  <div className="upH3">Skills</div>
                  <div className="upHint">Used for recruiting and marketplace visibility.</div>
                </div>
              </div>

              <div className="upSkills">
                {draft.skills.map((s) => (
                  <span key={s} className="upSkill">{s}</span>
                ))}
              </div>

              <div className="upSkillEdit">
                <input
                  placeholder="Add skill then press Enter"
                  disabled={!editing}
                  onKeyDown={(e) => {
                    if (!editing) return;
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = (e.currentTarget.value || "").trim();
                      if (!val) return;
                      if (draft.skills.includes(val)) return showToast("Skill already added.");
                      setDraft((p) => ({ ...p, skills: [...p.skills, val].slice(0, 12) }));
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <button
                  className="upBtn upBtnGhostSmall"
                  disabled={!editing || draft.skills.length === 0}
                  onClick={() => setDraft((p) => ({ ...p, skills: [] }))}
                >
                  Clear
                </button>
              </div>

              {editing && draft.skills.length > 0 && (
                <div className="upSkillRemove">
                  <div className="upMiniNote">Click a skill to remove.</div>
                  <div className="upSkills clickable">
                    {draft.skills.map((s) => (
                      <button
                        key={s}
                        className="upSkillBtn"
                        onClick={() => setDraft((p) => ({ ...p, skills: p.skills.filter((x) => x !== s) }))}
                      >
                        {s} ✕
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Preferences + Security */}
            <div className="upCard">
              <div className="upCardHead">
                <div>
                  <div className="upH3">Preferences & Security</div>
                  <div className="upHint">Frontend placeholders. Backend will apply real security.</div>
                </div>
              </div>

              <div className="upPrefs">
                <label className="upToggle">
                  <input type="checkbox" defaultChecked />
                  <span>Email notifications</span>
                </label>

                <label className="upToggle">
                  <input type="checkbox" />
                  <span>SMS notifications</span>
                </label>

                <label className="upToggle">
                  <input type="checkbox" />
                  <span>Dark mode (placeholder)</span>
                </label>

                <div className="upSecurity">
                  <button className="upBtn upBtnPrimary" onClick={changePassword}>
                    🔐 Change Password
                  </button>
                  <button className="upBtn upBtnGhost" onClick={() => alert("2FA placeholder (backend later)")}>
                    🛡 Enable 2FA (Demo)
                  </button>
                </div>

                <div className="upMiniNote">
                  Note: For production, use backend auth + secure sessions. This page is backend-ready.
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="upCard">
              <div className="upCardHead">
                <div>
                  <div className="upH3">Quick Actions</div>
                  <div className="upHint">Fast navigation to key modules.</div>
                </div>
              </div>

              <div className="upQuickGrid">
                <button className="upQuickCard" onClick={() => go("/course-marketplace")}>
                  <div className="ico">🛒</div>
                  <div>
                    <div className="t">Course Marketplace</div>
                    <div className="d">Find and pay for certification plans.</div>
                  </div>
                </button>

                <button className="upQuickCard" onClick={() => go("/contact-admin")}>
                  <div className="ico">🧑‍💻</div>
                  <div>
                    <div className="t">Contact Admin</div>
                    <div className="d">Send requests and messages.</div>
                  </div>
                </button>

                <button className="upQuickCard" onClick={() => go("/certificates")}>
                  <div className="ico">🏅</div>
                  <div>
                    <div className="t">Certificates</div>
                    <div className="d">View eligibility and downloads.</div>
                  </div>
                </button>

                <button className="upQuickCard" onClick={() => go("/settings")}>
                  <div className="ico">⚙</div>
                  <div>
                    <div className="t">Settings</div>
                    <div className="d">Manage preferences and platform options.</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="upFooter">
          <div>© 2026 STEAM ONE Platform</div>
          <div className="muted">Microsoft Education • ISTE • UNESCO ICT CFT • PISA</div>
        </footer>
      </main>

      {toast && <div className="upToast">{toast}</div>}
    </div>
  );
}