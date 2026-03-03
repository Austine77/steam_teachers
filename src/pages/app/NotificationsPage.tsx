import React, { useEffect, useMemo, useState } from "react";
import "./NotificationsPage.css";

type Role = "Teacher" | "Facilitator" | "Admin";
type NotifType =
  | "ContactRequest"
  | "Announcement"
  | "Assignment"
  | "LiveClass"
  | "Payment"
  | "System";

type Priority = "High" | "Normal" | "Low";

type NotificationItem = {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  timeISO: string;
  priority: Priority;
  read: boolean;

  // Optional: who sent it & deep-link target
  fromRole?: Role;
  fromName?: string;
  fromPhone?: string;
  linkLabel?: string;
  linkHref?: string;
};

const STORE_KEY = "steam_one_notifications_v1";
const ROLE_KEY = "steam_one_notifications_role_v1";

function uid(prefix = "NTF") {
  return `${prefix}-${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
}

function getLagosNowString() {
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

function fmtWhen(iso: string) {
  return new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

function loadStore(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return seedNotifications();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedNotifications();
  } catch {
    return seedNotifications();
  }
}

function saveStore(items: NotificationItem[]) {
  localStorage.setItem(STORE_KEY, JSON.stringify(items));
}

function seedNotifications(): NotificationItem[] {
  const now = new Date();
  const subMin = (m: number) => new Date(now.getTime() - m * 60000).toISOString();
  return [
    {
      id: uid(),
      type: "Announcement",
      title: "New Announcement: Weekly Schedule",
      message: "Please review this week’s learning schedule and confirm your live class attendance.",
      timeISO: subMin(35),
      priority: "Normal",
      read: false,
      linkLabel: "Open Announcements",
      linkHref: "/announcements",
    },
    {
      id: uid(),
      type: "LiveClass",
      title: "Live Class Starting Soon",
      message: "Your STEAM ONE live class starts in 30 minutes. Click to join.",
      timeISO: subMin(80),
      priority: "High",
      read: true,
      linkLabel: "Go to Live Class",
      linkHref: "/live-class",
    },
    {
      id: uid(),
      type: "Payment",
      title: "Payment Status Update",
      message: "Your payment is confirmed. Course access is now active.",
      timeISO: subMin(210),
      priority: "Normal",
      read: true,
      linkLabel: "Open Courses",
      linkHref: "/courses",
    },
    {
      id: uid(),
      type: "System",
      title: "Profile Reminder",
      message: "Complete your profile to improve verification and certification eligibility.",
      timeISO: subMin(520),
      priority: "Low",
      read: false,
      linkLabel: "Go to Profile",
      linkHref: "/profile",
    },
  ];
}

/**
 * ✅ Teacher -> Facilitator notification bridge (frontend only)
 * If a teacher opens a link that contains ?contact=1&teacherName=... it will create a new notification.
 * This mimics sending a notification to facilitator dashboard without backend.
 */
function maybeCreateContactNotification(role: Role, setItems: React.Dispatch<React.SetStateAction<NotificationItem[]>>) {
  try {
    const url = new URL(window.location.href);
    const contact = url.searchParams.get("contact");
    if (contact !== "1") return;

    // Only facilitators should receive this notification
    if (role !== "Facilitator") return;

    const teacherName = url.searchParams.get("teacherName") || "Teacher";
    const teacherPhone = url.searchParams.get("teacherPhone") || "";
    const requestNote = url.searchParams.get("note") || "A teacher wants to contact you.";

    // Create notification
    const item: NotificationItem = {
      id: uid("CR"),
      type: "ContactRequest",
      title: "New Contact Request",
      message: `${teacherName} sent a contact request. ${requestNote}`,
      timeISO: new Date().toISOString(),
      priority: "High",
      read: false,
      fromRole: "Teacher",
      fromName: teacherName,
      fromPhone: teacherPhone,
      linkLabel: teacherPhone ? "Open WhatsApp (demo)" : "Open Messaging",
      linkHref: teacherPhone ? `https://wa.me/${teacherPhone.replace(/\D/g, "")}` : "/messaging",
    };

    setItems((prev) => {
      // prevent duplicates if user refreshes
      const exists = prev.some(
        (p) => p.type === "ContactRequest" && p.fromName === teacherName && p.message.includes(requestNote)
      );
      if (exists) return prev;

      const next = [item, ...prev];
      saveStore(next);
      return next;
    });

    // Clean URL so it doesn’t re-add on refresh
    url.searchParams.delete("contact");
    url.searchParams.delete("teacherName");
    url.searchParams.delete("teacherPhone");
    url.searchParams.delete("note");
    window.history.replaceState({}, document.title, url.toString());
  } catch {
    // ignore
  }
}

export default function NotificationsPage() {
  // Nigeria time
  const [lagosNow, setLagosNow] = useState(getLagosNowString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosNowString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Role (demo)
  const [role, setRole] = useState<Role>(() => {
    const r = localStorage.getItem(ROLE_KEY);
    return r === "Facilitator" ? "Facilitator" : r === "Admin" ? "Admin" : "Teacher";
  });
  useEffect(() => localStorage.setItem(ROLE_KEY, role), [role]);

  // Notifications
  const [items, setItems] = useState<NotificationItem[]>(() => loadStore());

  useEffect(() => {
    saveStore(items);
  }, [items]);

  // ✅ Create facilitator notification when teacher link is received
  useEffect(() => {
    maybeCreateContactNotification(role, setItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  // Filters
  const [q, setQ] = useState("");
  const [type, setType] = useState<NotifType | "All">("All");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [priority, setPriority] = useState<Priority | "All">("All");

  const unreadCount = useMemo(() => items.filter((i) => !i.read).length, [items]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items
      .slice()
      .sort((a, b) => {
        // unread first, then newest
        if (a.read !== b.read) return a.read ? 1 : -1;
        return +new Date(b.timeISO) - +new Date(a.timeISO);
      })
      .filter((n) => {
        if (type !== "All" && n.type !== type) return false;
        if (priority !== "All" && n.priority !== priority) return false;
        if (unreadOnly && n.read) return false;
        if (!query) return true;
        const text = `${n.title} ${n.message} ${n.type} ${n.priority} ${n.fromName ?? ""}`.toLowerCase();
        return text.includes(query);
      });
  }, [items, q, type, priority, unreadOnly]);

  const markAllRead = () => {
    setItems((prev) => prev.map((p) => ({ ...p, read: true })));
  };

  const clearRead = () => {
    setItems((prev) => prev.filter((p) => !p.read));
  };

  const resetDemo = () => {
    const seeded = seedNotifications();
    setItems(seeded);
    setQ("");
    setType("All");
    setPriority("All");
    setUnreadOnly(false);
  };

  const addDemoContactRequest = () => {
    if (role !== "Facilitator") return;
    const item: NotificationItem = {
      id: uid("CR"),
      type: "ContactRequest",
      title: "New Contact Request",
      message: "Teacher user requested facilitator support for course access (demo).",
      timeISO: new Date().toISOString(),
      priority: "High",
      read: false,
      fromRole: "Teacher",
      fromName: "Teacher User",
      fromPhone: "2347072639424",
      linkLabel: "Open WhatsApp (demo)",
      linkHref: "https://wa.me/2347072639424",
    };
    setItems((prev) => [item, ...prev]);
  };

  const openLink = (href?: string) => {
    if (!href) return;
    // if whatsapp link, open new tab
    if (href.startsWith("http")) window.open(href, "_blank", "noopener,noreferrer");
    else window.location.href = href;
  };

  const toggleRead = (id: string) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, read: !p.read } : p)));
  };

  const removeOne = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="np">
      {/* Sidebar */}
      <aside className="npSide">
        <div className="npBrand">
          <div className="npMsLogo" aria-label="Microsoft Education logo" />
          <div className="npBrandText">
            <div className="npBrandTop">Microsoft Education</div>
            <div className="npBrandName">
              <span className="npBrandSteam">STEAM</span>{" "}
              <span className="npBrandOne">ONE</span>{" "}
              <span className="npBrandPlatform">Platform</span>
            </div>
          </div>
        </div>

        <div className="npSideCard">
          <div className="npSideTitle">Notifications</div>
          <div className="npSideSub">
            Get updates for live classes, payments, announcements, and contact requests.
          </div>
          <div className="npCountRow">
            <span className="npCountPill">
              Unread: <b>{unreadCount}</b>
            </span>
            <button className="npBtn npBtnPay" onClick={markAllRead}>
              Mark all read
            </button>
          </div>
        </div>

        <nav className="npNav" aria-label="Navigation">
          <button className="npNavItem">🏠 Dashboard</button>
          <button className="npNavItem active">🔔 Notifications</button>
          <button className="npNavItem">💬 Messaging</button>
          <button className="npNavItem">🎥 Live Classes</button>
          <button className="npNavItem">📣 Announcements</button>
          <button className="npNavItem">⚙ Settings</button>
        </nav>

        <div className="npSideFooter">
          <div className="npSideFooterRow">
            <span className="npDot" /> <span>Aligned with ISTE • UNESCO ICT CFT • PISA</span>
          </div>
          <div className="npSideFooterCopy">© 2026 STEAM ONE Platform</div>
        </div>
      </aside>

      {/* Main */}
      <section className="npMain">
        <header className="npTop">
          <div>
            <div className="npTitle">Notifications Center</div>
            <div className="npSub">Manage updates and requests across the platform.</div>
            <div className="npTime">
              Nigeria Time: <span className="npTimeRed">{lagosNow}</span>
            </div>

            <div className="npRoleRow">
              <span className="npRoleLabel">View as</span>
              <div className="npRoleTabs">
                {(["Teacher", "Facilitator", "Admin"] as Role[]).map((r) => (
                  <button
                    key={r}
                    className={`npRoleTab ${role === r ? "active" : ""}`}
                    onClick={() => setRole(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {role === "Facilitator" && (
                <button className="npBtn npBtnPrimary" onClick={addDemoContactRequest}>
                  ➕ Demo Contact Request
                </button>
              )}

              <button className="npBtn npBtnGhost" onClick={resetDemo}>
                Reset Demo
              </button>
            </div>
          </div>

          <div className="npTopRight">
            <div className="npSearch">
              <span className="npSearchIcon">🔎</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notifications..." />
            </div>

            <select value={type} onChange={(e) => setType(e.target.value as any)} aria-label="Type filter">
              <option value="All">All Types</option>
              <option value="ContactRequest">Contact Requests</option>
              <option value="Announcement">Announcements</option>
              <option value="LiveClass">Live Classes</option>
              <option value="Assignment">Assignments</option>
              <option value="Payment">Payments</option>
              <option value="System">System</option>
            </select>

            <select value={priority} onChange={(e) => setPriority(e.target.value as any)} aria-label="Priority filter">
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
            </select>

            <label className="npToggle">
              <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} />
              <span>Unread only</span>
            </label>

            <button className="npBtn npBtnGhost" onClick={clearRead}>
              Clear read
            </button>

            <div className="npUserChip">
              <span className="npUserAvatar" aria-hidden="true" />
              <span className="npUserText">
                <span className="npUserName">{role} User</span>
                <span className="npUserRole">{role} Account</span>
              </span>
            </div>
          </div>
        </header>

        {/* List */}
        <div className="npCard">
          <div className="npCardHead">
            <div>
              <div className="npH3">All Notifications</div>
              <div className="npHint">
                {role === "Facilitator"
                  ? "You will receive Teacher contact requests here when teachers click the contact button."
                  : "Your activity updates appear here."}
              </div>
            </div>
          </div>

          <div className="npList">
            {filtered.map((n) => (
              <div key={n.id} className={`npItem ${n.read ? "read" : ""}`}>
                <div className="npItemLeft">
                  <div className={`npIco ${n.type}`}>
                    {n.type === "ContactRequest" ? "👤" :
                     n.type === "Announcement" ? "📣" :
                     n.type === "LiveClass" ? "🎥" :
                     n.type === "Assignment" ? "📝" :
                     n.type === "Payment" ? "💳" : "⚙"}
                  </div>

                  <div className="npItemText">
                    <div className="npItemTop">
                      <div className="npItemTitle">{n.title}</div>
                      <span className={`npP ${n.priority.toLowerCase()}`}>{n.priority}</span>
                      {!n.read && <span className="npUnreadDot" />}
                    </div>

                    <div className="npItemMsg">{n.message}</div>

                    <div className="npMeta">
                      <span className="npType">{n.type}</span>
                      <span className="sep">•</span>
                      <span>{fmtWhen(n.timeISO)}</span>
                      {n.fromName && (
                        <>
                          <span className="sep">•</span>
                          <span>From: <b>{n.fromName}</b></span>
                        </>
                      )}
                    </div>

                    {(n.linkHref || n.fromPhone) && (
                      <div className="npActions">
                        {n.linkHref && (
                          <button className="npBtn npBtnPrimary" onClick={() => openLink(n.linkHref)}>
                            {n.linkLabel || "Open"}
                          </button>
                        )}
                        <button className="npBtn npBtnGhost" onClick={() => toggleRead(n.id)}>
                          {n.read ? "Mark unread" : "Mark read"}
                        </button>
                        <button className="npBtn npBtnGhost danger" onClick={() => removeOne(n.id)}>
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="npEmpty">
                No notifications match your filters.
              </div>
            )}
          </div>
        </div>

        <footer className="npFooter">
          <div className="npFooterLeft">
            <span className="npFooterLogo" aria-hidden="true" />
            <span>© 2026 STEAM ONE Platform. All rights reserved.</span>
          </div>
          <div className="npFooterLinks">
            <button className="npLinkBtn" onClick={() => alert("Terms (demo)")}>Terms</button>
            <button className="npLinkBtn" onClick={() => alert("Privacy (demo)")}>Privacy</button>
            <button className="npLinkBtn" onClick={() => alert("Support (demo)")}>Support</button>
          </div>
        </footer>
      </section>
    </div>
  );
}