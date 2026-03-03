import React, { useEffect, useMemo, useState } from "react";
import "./UsersReportPage.css";

type Role = "Teacher" | "Facilitator";
type Status = "Active" | "Suspended";
type Verify = "Verified" | "Unverified";

type UserRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  status: Status;
  verify: Verify;
  location: string;
  planPaid: "None" | "STEAM ONE" | "STEAM TWO" | "STEAM THREE";
  joinedISO: string;
  lastActiveISO: string;
  coursesCompleted: number;
  avgProgress: number; // 0-100
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

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
}

function toCsv(rows: Record<string, any>[], headers: string[]) {
  const esc = (v: any) => {
    const s = String(v ?? "");
    const needs = /[",\n]/.test(s);
    const safe = s.replace(/"/g, '""');
    return needs ? `"${safe}"` : safe;
  };

  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => esc(r[h])).join(",")),
  ].join("\n");

  return lines;
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function seedUsers(): UserRow[] {
  const now = Date.now();
  const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString();
  return [
    {
      id: "U-10021",
      fullName: "Oluwaseun Adeyemi",
      email: "oluwaseun.teacher@example.com",
      phone: "+234 803 000 1111",
      role: "Teacher",
      status: "Active",
      verify: "Verified",
      location: "Lagos, Nigeria",
      planPaid: "STEAM ONE",
      joinedISO: daysAgo(45),
      lastActiveISO: daysAgo(0.2),
      coursesCompleted: 1,
      avgProgress: 42,
    },
    {
      id: "U-10022",
      fullName: "Grace Nwankwo",
      email: "grace.facilitator@example.com",
      phone: "+234 806 222 3333",
      role: "Facilitator",
      status: "Active",
      verify: "Verified",
      location: "Abuja, Nigeria",
      planPaid: "None",
      joinedISO: daysAgo(80),
      lastActiveISO: daysAgo(1.2),
      coursesCompleted: 0,
      avgProgress: 0,
    },
    {
      id: "U-10023",
      fullName: "Ibrahim Kabiru",
      email: "ibrahim.teacher@example.com",
      phone: "+234 809 555 6666",
      role: "Teacher",
      status: "Active",
      verify: "Unverified",
      location: "Kano, Nigeria",
      planPaid: "STEAM TWO",
      joinedISO: daysAgo(20),
      lastActiveISO: daysAgo(0.6),
      coursesCompleted: 2,
      avgProgress: 68,
    },
    {
      id: "U-10024",
      fullName: "Chinaza Okeke",
      email: "chinaza.teacher@example.com",
      phone: "+234 701 888 9999",
      role: "Teacher",
      status: "Suspended",
      verify: "Unverified",
      location: "Enugu, Nigeria",
      planPaid: "None",
      joinedISO: daysAgo(10),
      lastActiveISO: daysAgo(9),
      coursesCompleted: 0,
      avgProgress: 0,
    },
    {
      id: "U-10025",
      fullName: "Tunde Adebayo",
      email: "tunde.facilitator@example.com",
      phone: "+234 705 444 1234",
      role: "Facilitator",
      status: "Active",
      verify: "Verified",
      location: "Ibadan, Nigeria",
      planPaid: "None",
      joinedISO: daysAgo(120),
      lastActiveISO: daysAgo(0.1),
      coursesCompleted: 0,
      avgProgress: 0,
    },
  ];
}

export default function UsersReportPage() {
  // Nigeria time
  const [lagosNow, setLagosNow] = useState(getLagosTimeString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Data (demo - backend later)
  const [users, setUsers] = useState<UserRow[]>(() => seedUsers());

  // Filters
  const [q, setQ] = useState("");
  const [role, setRole] = useState<"All" | Role>("All");
  const [status, setStatus] = useState<"All" | Status>("All");
  const [verify, setVerify] = useState<"All" | Verify>("All");
  const [plan, setPlan] = useState<"All" | UserRow["planPaid"]>("All");
  const [sort, setSort] = useState<"Newest" | "Last Active" | "Progress" | "Completed">("Last Active");

  // Bulk selection
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 1800);
  };

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = users
      .filter((u) => {
        if (!query) return true;
        const text = `${u.id} ${u.fullName} ${u.email} ${u.phone} ${u.location} ${u.role}`.toLowerCase();
        return text.includes(query);
      })
      .filter((u) => (role === "All" ? true : u.role === role))
      .filter((u) => (status === "All" ? true : u.status === status))
      .filter((u) => (verify === "All" ? true : u.verify === verify))
      .filter((u) => (plan === "All" ? true : u.planPaid === plan));

    if (sort === "Newest") list = list.slice().sort((a, b) => (b.joinedISO > a.joinedISO ? 1 : -1));
    if (sort === "Last Active") list = list.slice().sort((a, b) => (b.lastActiveISO > a.lastActiveISO ? 1 : -1));
    if (sort === "Progress") list = list.slice().sort((a, b) => b.avgProgress - a.avgProgress);
    if (sort === "Completed") list = list.slice().sort((a, b) => b.coursesCompleted - a.coursesCompleted);

    return list;
  }, [users, q, role, status, verify, plan, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    setPage((p) => clamp(p, 1, pages));
  }, [pages]);

  const view = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const selectedIds = useMemo(() => Object.keys(selected).filter((k) => selected[k]), [selected]);
  const allOnPageSelected = useMemo(
    () => view.length > 0 && view.every((u) => selected[u.id]),
    [view, selected]
  );

  const kpis = useMemo(() => {
    const total = filtered.length;
    const teachers = filtered.filter((u) => u.role === "Teacher").length;
    const facilitators = filtered.filter((u) => u.role === "Facilitator").length;
    const verifiedCount = filtered.filter((u) => u.verify === "Verified").length;
    const activeCount = filtered.filter((u) => u.status === "Active").length;
    return { total, teachers, facilitators, verifiedCount, activeCount };
  }, [filtered]);

  function toggleAllOnPage() {
    const next: Record<string, boolean> = { ...selected };
    if (allOnPageSelected) {
      view.forEach((u) => (next[u.id] = false));
    } else {
      view.forEach((u) => (next[u.id] = true));
    }
    setSelected(next);
  }

  function toggleOne(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function updateUser(id: string, patch: Partial<UserRow>) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  }

  function bulkVerify() {
    if (selectedIds.length === 0) return showToast("Select at least one user.");
    selectedIds.forEach((id) => updateUser(id, { verify: "Verified" }));
    showToast(`✅ Verified ${selectedIds.length} user(s).`);
  }

  function bulkSuspend() {
    if (selectedIds.length === 0) return showToast("Select at least one user.");
    selectedIds.forEach((id) => updateUser(id, { status: "Suspended" }));
    showToast(`⛔ Suspended ${selectedIds.length} user(s).`);
  }

  function bulkActivate() {
    if (selectedIds.length === 0) return showToast("Select at least one user.");
    selectedIds.forEach((id) => updateUser(id, { status: "Active" }));
    showToast(`✅ Activated ${selectedIds.length} user(s).`);
  }

  function exportAllFiltered() {
    const headers = [
      "id",
      "fullName",
      "email",
      "phone",
      "role",
      "status",
      "verify",
      "location",
      "planPaid",
      "joinedISO",
      "lastActiveISO",
      "coursesCompleted",
      "avgProgress",
    ];
    const rows = filtered.map((u) => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      phone: u.phone,
      role: u.role,
      status: u.status,
      verify: u.verify,
      location: u.location,
      planPaid: u.planPaid,
      joinedISO: u.joinedISO,
      lastActiveISO: u.lastActiveISO,
      coursesCompleted: u.coursesCompleted,
      avgProgress: u.avgProgress,
    }));
    downloadCsv("users_report_filtered.csv", toCsv(rows, headers));
    showToast("🧾 Exported filtered report (CSV).");
  }

  function exportSelected() {
    if (selectedIds.length === 0) return showToast("Select at least one user.");
    const headers = ["id", "fullName", "email", "role", "status", "verify", "planPaid", "avgProgress"];
    const rows = users
      .filter((u) => selectedIds.includes(u.id))
      .map((u) => ({
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        status: u.status,
        verify: u.verify,
        planPaid: u.planPaid,
        avgProgress: u.avgProgress,
      }));
    downloadCsv("users_report_selected.csv", toCsv(rows, headers));
    showToast("🧾 Exported selected users (CSV).");
  }

  function addDemoUser() {
    const newUser: UserRow = {
      id: uid("U"),
      fullName: "New User (Demo)",
      email: `new.user.${Math.random().toString(16).slice(2, 6)}@example.com`,
      phone: "+234 700 000 0000",
      role: Math.random() > 0.5 ? "Teacher" : "Facilitator",
      status: "Active",
      verify: "Unverified",
      location: "Nigeria",
      planPaid: "None",
      joinedISO: new Date().toISOString(),
      lastActiveISO: new Date().toISOString(),
      coursesCompleted: 0,
      avgProgress: 0,
    };
    setUsers((p) => [newUser, ...p]);
    showToast("➕ Demo user added.");
  }

  function resetFilters() {
    setQ("");
    setRole("All");
    setStatus("All");
    setVerify("All");
    setPlan("All");
    setSort("Last Active");
    showToast("Filters reset.");
  }

  function go(path: string) {
    window.location.href = path;
  }

  return (
    <div className="ur">
      {/* Sidebar */}
      <aside className="urSide">
        <div className="urBrand">
          <div className="urMsLogo" aria-label="Microsoft Education logo" />
          <div className="urBrandText">
            <div className="urBrandTop">Microsoft Education</div>
            <div className="urBrandName">
              <span className="urSteam">STEAM</span> <span className="urOne">ONE</span>{" "}
              <span className="urPlat">Platform</span>
            </div>
          </div>
        </div>

        <div className="urSideCard">
          <div className="urSideTitle">Users Report</div>
          <div className="urSideSub">Admin analytics for users, verification and engagement.</div>

          <div className="urTime">
            Nigeria Time: <span className="urTimeRed">{lagosNow}</span>
          </div>

          <button className="urBtn urBtnPrimary" onClick={exportAllFiltered}>🧾 Export Filtered CSV</button>
          <button className="urBtn urBtnGhost" onClick={exportSelected}>📦 Export Selected CSV</button>
          <button className="urBtn urBtnGhost" onClick={addDemoUser}>➕ Add Demo User</button>
        </div>

        <nav className="urNav">
          <button className="urNavItem" onClick={() => go("/admin/dashboard")}>🏠 Admin Dashboard</button>
          <button className="urNavItem active">👥 Users Report</button>
          <button className="urNavItem" onClick={() => go("/admin/tickets")}>🎟 Tickets</button>
          <button className="urNavItem" onClick={() => go("/settings")}>⚙ Settings</button>
        </nav>

        <div className="urSideFooter">
          <div className="urFootRow"><span className="urDot" /> ISTE • UNESCO ICT CFT • PISA</div>
          <div className="urFootCopy">© 2026 STEAM ONE Platform</div>
        </div>
      </aside>

      {/* Main */}
      <main className="urMain">
        <header className="urTop">
          <div>
            <div className="urTitle">Users Report & Analytics</div>
            <div className="urSub">
              Search, filter and export users. All logic is frontend demo — backend will replace data source.
            </div>
          </div>

          <div className="urTopRight">
            <div className="urSearch">
              <span className="urSearchIcon">🔎</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, email, phone, ID, location..."
              />
            </div>
          </div>
        </header>

        {/* KPIs */}
        <section className="urStats">
          <div className="urStat">
            <div className="urStatIco">👥</div>
            <div>
              <div className="urStatLabel">Total Users</div>
              <div className="urStatValue">{kpis.total}</div>
            </div>
            <div className="urStatHint">Filtered</div>
          </div>

          <div className="urStat">
            <div className="urStatIco">👩‍🏫</div>
            <div>
              <div className="urStatLabel">Teachers</div>
              <div className="urStatValue">{kpis.teachers}</div>
            </div>
            <div className="urStatHint">Filtered</div>
          </div>

          <div className="urStat">
            <div className="urStatIco">🧑‍🏫</div>
            <div>
              <div className="urStatLabel">Facilitators</div>
              <div className="urStatValue">{kpis.facilitators}</div>
            </div>
            <div className="urStatHint">Filtered</div>
          </div>

          <div className="urStat">
            <div className="urStatIco">✅</div>
            <div>
              <div className="urStatLabel">Verified</div>
              <div className="urStatValue">{kpis.verifiedCount}</div>
            </div>
            <div className="urStatHint">Email</div>
          </div>

          <div className="urStat">
            <div className="urStatIco">🟢</div>
            <div>
              <div className="urStatLabel">Active</div>
              <div className="urStatValue">{kpis.activeCount}</div>
            </div>
            <div className="urStatHint">Accounts</div>
          </div>
        </section>

        {/* Filters */}
        <section className="urCard">
          <div className="urCardHead">
            <div>
              <div className="urH3">Filters</div>
              <div className="urHint">Refine your report then export to CSV.</div>
            </div>

            <div className="urCardActions">
              <button className="urBtn urBtnGhost" onClick={resetFilters}>Reset</button>
              <button className="urBtn urBtnPrimary" onClick={exportAllFiltered}>Export CSV</button>
            </div>
          </div>

          <div className="urFilters">
            <label className="urSelect">
              <span>Role</span>
              <select value={role} onChange={(e) => setRole(e.target.value as any)}>
                <option value="All">All</option>
                <option value="Teacher">Teacher</option>
                <option value="Facilitator">Facilitator</option>
              </select>
            </label>

            <label className="urSelect">
              <span>Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </label>

            <label className="urSelect">
              <span>Verification</span>
              <select value={verify} onChange={(e) => setVerify(e.target.value as any)}>
                <option value="All">All</option>
                <option value="Verified">Verified</option>
                <option value="Unverified">Unverified</option>
              </select>
            </label>

            <label className="urSelect">
              <span>Plan Paid</span>
              <select value={plan} onChange={(e) => setPlan(e.target.value as any)}>
                <option value="All">All</option>
                <option value="None">None</option>
                <option value="STEAM ONE">STEAM ONE</option>
                <option value="STEAM TWO">STEAM TWO</option>
                <option value="STEAM THREE">STEAM THREE</option>
              </select>
            </label>

            <label className="urSelect">
              <span>Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as any)}>
                <option value="Last Active">Last Active</option>
                <option value="Newest">Newest</option>
                <option value="Progress">Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </label>

            <div className="urInline">
              Showing <b>{filtered.length}</b> users
            </div>
          </div>
        </section>

        {/* Bulk actions + table */}
        <section className="urCard">
          <div className="urCardHead">
            <div>
              <div className="urH3">Users Table</div>
              <div className="urHint">Select users for bulk actions (verify, suspend, export).</div>
            </div>

            <div className="urBulk">
              <div className="urBulkInfo">
                Selected: <b>{selectedIds.length}</b>
              </div>
              <button className="urBtn urBtnGhostSmall" onClick={bulkVerify}>✅ Verify</button>
              <button className="urBtn urBtnGhostSmall" onClick={bulkActivate}>🟢 Activate</button>
              <button className="urBtn urBtnDangerSmall" onClick={bulkSuspend}>⛔ Suspend</button>
              <button className="urBtn urBtnPrimary" onClick={exportSelected}>Export Selected</button>
            </div>
          </div>

          <div className="urTableWrap">
            <table className="urTable">
              <thead>
                <tr>
                  <th style={{ width: 44 }}>
                    <input type="checkbox" checked={allOnPageSelected} onChange={toggleAllOnPage} />
                  </th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Verify</th>
                  <th>Plan</th>
                  <th>Progress</th>
                  <th>Joined</th>
                  <th>Last Active</th>
                  <th style={{ width: 180 }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {view.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={!!selected[u.id]}
                        onChange={() => toggleOne(u.id)}
                      />
                    </td>

                    <td>
                      <div className="urUserCell">
                        <div className="urAvatar" aria-hidden="true" />
                        <div>
                          <div className="urName">{u.fullName}</div>
                          <div className="urMeta">
                            {u.email} • {u.phone} • <span className="muted">{u.location}</span>
                          </div>
                          <div className="urId">{u.id}</div>
                        </div>
                      </div>
                    </td>

                    <td><span className={`urPill role ${u.role.toLowerCase()}`}>{u.role}</span></td>
                    <td><span className={`urPill status ${u.status.toLowerCase()}`}>{u.status}</span></td>
                    <td><span className={`urPill ver ${u.verify.toLowerCase()}`}>{u.verify}</span></td>
                    <td><span className={`urPill plan ${u.planPaid === "None" ? "none" : "paid"}`}>{u.planPaid}</span></td>

                    <td>
                      <div className="urProg">
                        <div className="urProgTop">
                          <span className="muted">Avg</span> <b>{u.avgProgress}%</b>
                        </div>
                        <div className="urBar">
                          <div className="urFill" style={{ width: `${clamp(u.avgProgress, 0, 100)}%` }} />
                        </div>
                        <div className="urMini muted">{u.coursesCompleted} completed</div>
                      </div>
                    </td>

                    <td className="muted">{fmtDate(u.joinedISO)}</td>
                    <td className="muted">{fmtDate(u.lastActiveISO)}</td>

                    <td>
                      <div className="urActions">
                        <button
                          className="urBtn urBtnGhostSmall"
                          onClick={() => alert("Open user profile (backend later)")}
                        >
                          View
                        </button>

                        {u.verify !== "Verified" ? (
                          <button
                            className="urBtn urBtnGhostSmall"
                            onClick={() => {
                              updateUser(u.id, { verify: "Verified" });
                              showToast(`✅ Verified ${u.fullName}`);
                            }}
                          >
                            Verify
                          </button>
                        ) : (
                          <button className="urBtn urBtnGhostSmall" onClick={() => showToast("Already verified.")}>
                            Verified
                          </button>
                        )}

                        {u.status === "Active" ? (
                          <button
                            className="urBtn urBtnDangerSmall"
                            onClick={() => {
                              updateUser(u.id, { status: "Suspended" });
                              showToast(`⛔ Suspended ${u.fullName}`);
                            }}
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            className="urBtn urBtnGhostSmall"
                            onClick={() => {
                              updateUser(u.id, { status: "Active" });
                              showToast(`🟢 Activated ${u.fullName}`);
                            }}
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {view.length === 0 && (
                  <tr>
                    <td colSpan={10}>
                      <div className="urEmpty">No users match your filters.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="urPager">
            <button className="urBtn urBtnGhostSmall" disabled={page <= 1} onClick={() => setPage(1)}>
              ⏮ First
            </button>
            <button className="urBtn urBtnGhostSmall" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              ◀ Prev
            </button>

            <div className="urPageInfo">
              Page <b>{page}</b> of <b>{pages}</b>
            </div>

            <button className="urBtn urBtnGhostSmall" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
              Next ▶
            </button>
            <button className="urBtn urBtnGhostSmall" disabled={page >= pages} onClick={() => setPage(pages)}>
              Last ⏭
            </button>
          </div>
        </section>

        <footer className="urFooter">
          <div>© 2026 STEAM ONE Platform • Users Report</div>
          <div className="muted">Microsoft Education • ISTE • UNESCO ICT CFT • PISA</div>
        </footer>
      </main>

      {toast && <div className="urToast">{toast}</div>}
    </div>
  );
}