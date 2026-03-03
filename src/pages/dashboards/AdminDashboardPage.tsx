import React, { useEffect, useMemo, useState } from "react";
import "./AdminDashboardPage.css";
import { clearAdminSession } from "../../utils/authStore";
import {
  countAdminUnread,
  exportTicketsCsv,
  getTickets,
  type Ticket,
} from "../../utils/ticketStore";

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

function fmtMoneyNGN(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export default function AdminDashboardPage() {
  // Nigeria time
  const [lagosNow, setLagosNow] = useState(getLagosTimeString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Realtime-ish unread badge + tickets preview
  const [unread, setUnread] = useState<number>(countAdminUnread());
  const [tickets, setTickets] = useState<Ticket[]>(getTickets());

  useEffect(() => {
    const t = setInterval(() => {
      setUnread(countAdminUnread());
      setTickets(getTickets());
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Search
  const [q, setQ] = useState("");

  // Demo datasets (backend later)
  const recentPayments = useMemo(
    () => [
      { user: "Teacher A.", amount: 15000, date: "2026-03-01T10:12:00.000Z", method: "Paystack", plan: "STEAM ONE" },
      { user: "Teacher B.", amount: 20000, date: "2026-03-01T11:24:00.000Z", method: "Flutterwave", plan: "STEAM TWO" },
      { user: "Teacher C.", amount: 25000, date: "2026-03-02T07:45:00.000Z", method: "Card", plan: "STEAM THREE" },
      { user: "Teacher D.", amount: 15000, date: "2026-03-02T09:15:00.000Z", method: "Paystack", plan: "STEAM ONE" },
    ],
    []
  );

  const pendingRequests = useMemo(
    () => [
      { name: "Recruiter – Bright Future School", date: "2026-03-02", action: "Review" },
      { name: "Teacher Contact Request", date: "2026-03-01", action: "Approve" },
      { name: "Marketplace Verification", date: "2026-03-01", action: "Verify" },
    ],
    []
  );

  // Ticket analytics
  const ticketStats = useMemo(() => {
    const all = tickets;
    const total = all.length;
    const open = all.filter((t) => t.status === "Open").length;
    const prog = all.filter((t) => t.status === "In Progress").length;
    const closed = all.filter((t) => t.status === "Closed").length;

    const hi = all.filter((t) => t.priority === "High").length;
    const med = all.filter((t) => t.priority === "Medium").length;
    const low = all.filter((t) => t.priority === "Low").length;

    return { total, open, prog, closed, hi, med, low };
  }, [tickets]);

  // Payment analytics (demo)
  const revenue = useMemo(() => recentPayments.reduce((s, p) => s + p.amount, 0), [recentPayments]);
  const enrollments = useMemo(() => 589, []);
  const certificatesIssued = useMemo(() => 492, []);
  const pending = useMemo(() => 41, []);

  const filteredTickets = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = tickets.slice(0, 12);
    if (!query) return list;
    return list.filter((t) => `${t.id} ${t.subject} ${t.userEmail}`.toLowerCase().includes(query));
  }, [tickets, q]);

  function go(path: string) {
    window.location.href = path;
  }

  function logout() {
    clearAdminSession();
    window.location.href = "/admin/login";
  }

  return (
    <div className="ad">
      {/* Sidebar */}
      <aside className="adSide">
        <div className="adBrand">
          <div className="adMsLogo" aria-label="Microsoft Education logo" />
          <div className="adBrandText">
            <div className="adBrandTop">Microsoft Education</div>
            <div className="adBrandName">
              <span className="adSteam">STEAM</span> <span className="adOne">ONE</span>{" "}
              <span className="adPlat">Platform</span>
            </div>
          </div>
        </div>

        <div className="adSideCard">
          <div className="adSideTitle">Admin Console</div>
          <div className="adSideSub">
            Monitor platform performance, payments, tickets, verification and reports.
          </div>

          <div className="adSideTime">
            Nigeria Time: <span className="adTimeRed">{lagosNow}</span>
          </div>

          <button className="adBtn adBtnPrimary" onClick={() => go("/admin/tickets")}>
            🎟 Support Tickets{" "}
            {unread > 0 && <span className="adBadge">{unread}</span>}
          </button>

          <button className="adBtn adBtnGhost" onClick={() => exportTicketsCsv()}>
            🧾 Export Tickets CSV
          </button>
        </div>

        <nav className="adNav" aria-label="Admin navigation">
          <button className="adNavItem active" onClick={() => go("/admin/dashboard")}>🏠 Dashboard</button>
          <button className="adNavItem" onClick={() => go("/admin/tickets")}>
            🎟 Ticket Management {unread > 0 && <span className="adNavBadge">{unread}</span>}
          </button>
          <button className="adNavItem" onClick={() => alert("Users (backend later)")}>👥 Users</button>
          <button className="adNavItem" onClick={() => alert("Enrollments (backend later)")}>🧾 Enrollments</button>
          <button className="adNavItem" onClick={() => alert("Courses (backend later)")}>📚 Courses</button>
          <button className="adNavItem" onClick={() => alert("Marketplace (backend later)")}>🛒 Marketplace</button>
          <button className="adNavItem" onClick={() => alert("Payments (backend later)")}>💳 Payments</button>
          <button className="adNavItem" onClick={() => alert("Certificates (backend later)")}>🏅 Certificates</button>
          <button className="adNavItem" onClick={() => alert("Contact Requests (backend later)")}>📨 Contact Requests</button>
          <button className="adNavItem" onClick={() => alert("Recruiting (backend later)")}>🧲 Recruiting</button>
          <button className="adNavItem" onClick={() => alert("Consulting Leads (backend later)")}>🧠 Consulting Leads</button>
          <button className="adNavItem" onClick={() => alert("Emails (backend later)")}>📧 Emails</button>
          <button className="adNavItem" onClick={() => alert("Reports (backend later)")}>📈 Reports</button>
          <button className="adNavItem" onClick={() => go("/settings")}>⚙ Settings</button>
        </nav>

        <div className="adUser">
          <div className="adUserAvatar" aria-hidden="true" />
          <div className="adUserMeta">
            <div className="adUserName">Admin</div>
            <div className="adUserEmail">admin@steamoneplatform.com</div>
          </div>
          <button className="adLogout" onClick={logout} title="Logout">
            ⎋
          </button>
        </div>

        <div className="adSideFooter">
          <div className="adFootRow"><span className="adDot" /> ISTE • UNESCO ICT CFT • PISA</div>
          <div className="adFootCopy">© 2026 STEAM ONE Platform</div>
        </div>
      </aside>

      {/* Main */}
      <main className="adMain">
        {/* Header */}
        <header className="adTop">
          <div className="adTopLeft">
            <div className="adTitle">Welcome back, Admin</div>
            <div className="adSub">
              Platform snapshot: revenue, enrollments, certifications, and support operations.
            </div>
          </div>

          <div className="adTopRight">
            <div className="adSearch">
              <span className="adSearchIcon">🔎</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search tickets by ID, subject, email..."
              />
            </div>

            <button className="adIconBtn" onClick={() => go("/admin/tickets")} title="Tickets">
              🎟 {unread > 0 && <span className="adIconBadge">{unread}</span>}
            </button>
          </div>
        </header>

        {/* Stats */}
        <section className="adStats">
          <div className="adStat">
            <div className="adStatIco">💰</div>
            <div>
              <div className="adStatLabel">Revenue (Demo)</div>
              <div className="adStatValue">{fmtMoneyNGN(revenue)}</div>
            </div>
            <div className="adStatHint">This week</div>
          </div>

          <div className="adStat">
            <div className="adStatIco">🧾</div>
            <div>
              <div className="adStatLabel">New Enrollments</div>
              <div className="adStatValue">{enrollments}</div>
            </div>
            <div className="adStatHint">+8.2%</div>
          </div>

          <div className="adStat">
            <div className="adStatIco">🏅</div>
            <div>
              <div className="adStatLabel">Certificates Issued</div>
              <div className="adStatValue">{certificatesIssued}</div>
            </div>
            <div className="adStatHint">Verified</div>
          </div>

          <div className="adStat">
            <div className="adStatIco">⏳</div>
            <div>
              <div className="adStatLabel">Pending Requests</div>
              <div className="adStatValue">{pending}</div>
            </div>
            <div className="adStatHint">Needs review</div>
          </div>
        </section>

        {/* Admin statistics panel */}
        <section className="adPanel">
          <div className="adPanelHead">
            <div>
              <div className="adH3">Support Analytics</div>
              <div className="adHint">Ticket volume, status, and urgency overview.</div>
            </div>
            <div className="adPanelActions">
              <button className="adBtn adBtnGhost" onClick={() => go("/admin/tickets")}>Open Ticket Manager</button>
              <button className="adBtn adBtnPrimary" onClick={() => exportTicketsCsv()}>Export CSV</button>
            </div>
          </div>

          <div className="adMiniStats">
            <div className="adMini">
              <div className="k">Total Tickets</div>
              <div className="v">{ticketStats.total}</div>
            </div>
            <div className="adMini">
              <div className="k">Open</div>
              <div className="v">{ticketStats.open}</div>
            </div>
            <div className="adMini">
              <div className="k">In Progress</div>
              <div className="v">{ticketStats.prog}</div>
            </div>
            <div className="adMini">
              <div className="k">Closed</div>
              <div className="v">{ticketStats.closed}</div>
            </div>
            <div className="adMini">
              <div className="k">High Priority</div>
              <div className="v">{ticketStats.hi}</div>
            </div>
            <div className="adMini">
              <div className="k">Unread</div>
              <div className="v">{unread}</div>
            </div>
          </div>

          <div className="adChart">
            <div className="adChartTitle">Revenue Overview (Placeholder)</div>
            <div className="adChartBox">
              Connect chart library later (Recharts/Chart.js). Panel ready for backend data.
            </div>
          </div>
        </section>

        {/* Tables */}
        <section className="adGrid">
          {/* Tickets */}
          <div className="adCard">
            <div className="adCardHead">
              <div>
                <div className="adH3">Latest Tickets</div>
                <div className="adHint">New requests show as unread. Click to manage.</div>
              </div>
              <button className="adBtn adBtnGhost" onClick={() => go("/admin/tickets")}>
                View All
              </button>
            </div>

            <div className="adList">
              {filteredTickets.length === 0 && (
                <div className="adEmpty">No tickets yet.</div>
              )}

              {filteredTickets.map((t) => (
                <button
                  key={t.id}
                  className={`adTicket ${t.adminUnread ? "unread" : ""}`}
                  onClick={() => go("/admin/tickets")}
                  title="Open Ticket Manager"
                >
                  <div className="adTicketLeft">
                    <div className="adTicketTop">
                      <span className="adTicketId">{t.id}</span>
                      {t.adminUnread && <span className="adNewDot">●</span>}
                      <span className={`adPill ${t.priority.toLowerCase()}`}>{t.priority}</span>
                      <span className={`adPill status ${t.status.replace(" ", "").toLowerCase()}`}>{t.status}</span>
                    </div>
                    <div className="adTicketSub">{t.subject}</div>
                    <div className="adTicketMeta">
                      {t.userEmail} • {fmtDate(t.createdAtISO)}
                    </div>
                  </div>
                  <div className="adTicketRight">›</div>
                </button>
              ))}
            </div>
          </div>

          {/* Payments */}
          <div className="adCard">
            <div className="adCardHead">
              <div>
                <div className="adH3">Recent Payments</div>
                <div className="adHint">Demo data. Replace with backend transactions.</div>
              </div>
              <button className="adBtn adBtnGhost" onClick={() => alert("Payments page (backend later)")}>
                Payments
              </button>
            </div>

            <div className="adTableWrap">
              <table className="adTable">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Plan</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((p, i) => (
                    <tr key={i}>
                      <td>{p.user}</td>
                      <td>{p.plan}</td>
                      <td>{p.method}</td>
                      <td><b>{fmtMoneyNGN(p.amount)}</b></td>
                      <td className="muted">{fmtDate(p.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending */}
          <div className="adCard">
            <div className="adCardHead">
              <div>
                <div className="adH3">Pending Reviews</div>
                <div className="adHint">Contact requests, verification, recruiting approvals.</div>
              </div>
              <button className="adBtn adBtnGhost" onClick={() => alert("Requests page (backend later)")}>
                Manage
              </button>
            </div>

            <div className="adReq">
              {pendingRequests.map((r, i) => (
                <div className="adReqRow" key={i}>
                  <div>
                    <div className="adReqName">{r.name}</div>
                    <div className="adReqMeta muted">{r.date}</div>
                  </div>
                  <button className="adBtn adBtnPrimary" onClick={() => alert("Action (backend later)")}>
                    {r.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="adFooter">
          <div>© 2026 STEAM ONE Platform • Admin Console</div>
          <div className="muted">Microsoft Education • ISTE • UNESCO ICT CFT • PISA</div>
        </footer>
      </main>
    </div>
  );
}