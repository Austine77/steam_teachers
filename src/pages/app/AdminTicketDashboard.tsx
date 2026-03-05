import React, { useEffect, useMemo, useState } from "react";
import "./AdminTicketDashboard.css";
import {
  getTickets,
  updateTicket,
  markAdminRead,
  countAdminUnread,
  exportTicketsCsv,
  type Ticket,
  type Status,
  type Priority,
} from "../../utils/ticketStore";

type FilterStatus = "All" | Status;
type FilterPriority = "All" | Priority;

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-NG");
  } catch {
    return iso;
  }
}

function badgeClass(p: Priority) {
  if (p === "High") return "high";
  if (p === "Medium") return "medium";
  return "low";
}

export default function AdminTicketDashboard() {
  const [tickets, setTicketsState] = useState<Ticket[]>(getTickets());
  const [unread, setUnread] = useState(countAdminUnread());

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<FilterStatus>("All");
  const [priority, setPriority] = useState<FilterPriority>("All");

  const [openId, setOpenId] = useState<string | null>(null);
  const selected = useMemo(() => tickets.find(t => t.id === openId) || null, [tickets, openId]);

  // realtime-ish sync: refresh tickets + unread badge every 1s (frontend simulation)
  useEffect(() => {
    const t = setInterval(() => {
      setTicketsState(getTickets());
      setUnread(countAdminUnread());
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return tickets
      .filter(t => (query ? `${t.id} ${t.subject} ${t.userEmail}`.toLowerCase().includes(query) : true))
      .filter(t => (status === "All" ? true : t.status === status))
      .filter(t => (priority === "All" ? true : t.priority === priority));
  }, [tickets, q, status, priority]);

  // analytics
  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === "Open").length;
    const prog = tickets.filter(t => t.status === "In Progress").length;
    const closed = tickets.filter(t => t.status === "Closed").length;

    const hi = tickets.filter(t => t.priority === "High").length;
    const med = tickets.filter(t => t.priority === "Medium").length;
    const low = tickets.filter(t => t.priority === "Low").length;

    const withFiles = tickets.filter(t => !!t.attachmentName).length;

    // average first response time simulation: if admin ever replied
    const responded = tickets.filter(t => t.messages.some(m => m.sender === "admin"));
    let avgMins = 0;
    if (responded.length) {
      const mins = responded.map(t => {
        const firstAdmin = t.messages.find(m => m.sender === "admin");
        if (!firstAdmin) return 0;
        const a = new Date(t.createdAtISO).getTime();
        const b = new Date(firstAdmin.timeISO).getTime();
        return Math.max(0, Math.round((b - a) / 60000));
      });
      avgMins = Math.round(mins.reduce((s, x) => s + x, 0) / mins.length);
    }

    return {
      total, open, prog, closed,
      hi, med, low,
      unread,
      withFiles,
      avgMins,
    };
  }, [tickets, unread]);

  function openTicket(id: string) {
    setOpenId(id);
    markAdminRead(id);
    setUnread(countAdminUnread());
    setTicketsState(getTickets());
  }

  function setTicketStatus(t: Ticket, next: Status) {
    const updated: Ticket = { ...t, status: next, updatedAtISO: new Date().toISOString() };
    updateTicket(updated);
    setTicketsState(getTickets());
  }

  function replyToTicket(t: Ticket) {
    const text = prompt("Type admin reply:");
    if (!text) return;

    const updated: Ticket = {
      ...t,
      status: "In Progress",
      updatedAtISO: new Date().toISOString(),
      messages: [
        ...t.messages,
        { sender: "admin", text, timeISO: new Date().toISOString() },
      ],
      // admin has replied; still keep unread false
      adminUnread: false,
    };

    updateTicket(updated);
    setTicketsState(getTickets());

    // Email + notification simulation
    alert("📧 Email sent to user (simulation).");
    console.log("Email simulation:", { to: t.userEmail, subject: `Reply on ${t.id}`, body: text });
  }

  function closeTicket(t: Ticket) {
    const ok = confirm(`Close ticket ${t.id}?`);
    if (!ok) return;
    setTicketStatus(t, "Closed");

    alert("📧 Ticket closed email sent (simulation).");
    console.log("Email simulation:", { to: t.userEmail, subject: `Ticket Closed ${t.id}`, body: "Your ticket has been closed." });
  }

  return (
    <div className="atd">
      <header className="atdTop">
        <div>
          <div className="atdTitle">Admin Ticket Management</div>
          <div className="atdSub">Monitor, respond, and close support tickets. Analytics included.</div>
        </div>

        <div className="atdTopActions">
          <button className="atdBtn atdBtnGhost" onClick={() => exportTicketsCsv()}>
            🧾 Export CSV
          </button>

          <button className="atdBtn atdBtnPrimary" onClick={() => window.location.href = "/admin/dashboard"}>
            Back to Admin
          </button>

          <div className="atdUnread">
            🔔 New Tickets <span className="atdUnreadBadge">{stats.unread}</span>
          </div>
        </div>
      </header>

      {/* Stats panel */}
      <div className="atdStats">
        <div className="atdStat"><div className="k">Total</div><div className="v">{stats.total}</div><div className="h">All tickets</div></div>
        <div className="atdStat"><div className="k">Open</div><div className="v">{stats.open}</div><div className="h">Need action</div></div>
        <div className="atdStat"><div className="k">In Progress</div><div className="v">{stats.prog}</div><div className="h">Being handled</div></div>
        <div className="atdStat"><div className="k">Closed</div><div className="v">{stats.closed}</div><div className="h">Resolved</div></div>

        <div className="atdStat"><div className="k">High Priority</div><div className="v">{stats.hi}</div><div className="h">Urgent</div></div>
        <div className="atdStat"><div className="k">With Files</div><div className="v">{stats.withFiles}</div><div className="h">Attachments</div></div>
        <div className="atdStat"><div className="k">Avg First Reply</div><div className="v">{stats.avgMins}m</div><div className="h">Simulation</div></div>
        <div className="atdStat"><div className="k">Unread</div><div className="v">{stats.unread}</div><div className="h">New</div></div>
      </div>

      {/* Filters */}
      <div className="atdFilters">
        <div className="atdSearch">
          <span>🔎</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by ID, subject, email..." />
        </div>

        <label className="atdSelect">
          <span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as FilterStatus)}>
            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </label>

        <label className="atdSelect">
          <span>Priority</span>
          <select value={priority} onChange={(e) => setPriority(e.target.value as FilterPriority)}>
            <option value="All">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>

        <div className="atdCount">
          Showing <b>{filtered.length}</b> / <b>{tickets.length}</b>
        </div>
      </div>

      {/* Table */}
      <div className="atdTableWrap">
        <table className="atdTable">
          <thead>
            <tr>
              <th>New</th>
              <th>Ticket</th>
              <th>User</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(t => (
              <tr key={t.id} className={t.adminUnread ? "unread" : ""}>
                <td>{t.adminUnread ? "●" : ""}</td>
                <td>
                  <button className="atdLink" onClick={() => openTicket(t.id)}>
                    {t.id}
                  </button>
                  <div className="atdSmall">{t.subject}</div>
                  {t.attachmentName && <div className="atdAttach">📎 {t.attachmentName}</div>}
                </td>
                <td>
                  <div className="atdSmall">{t.userEmail}</div>
                  <div className="atdTiny">{t.userRole || ""}</div>
                </td>
                <td><span className={`atdPill ${badgeClass(t.priority)}`}>{t.priority}</span></td>
                <td><span className={`atdPill status ${t.status.replace(" ", "").toLowerCase()}`}>{t.status}</span></td>
                <td className="atdTiny">{fmtDate(t.createdAtISO)}</td>
                <td className="atdTiny">{fmtDate(t.updatedAtISO)}</td>
                <td>
                  <div className="atdRowBtns">
                    <button className="atdBtnMini" onClick={() => openTicket(t.id)}>View</button>
                    <button className="atdBtnMini" onClick={() => replyToTicket(t)}>Reply</button>
                    <button className="atdBtnMini danger" onClick={() => closeTicket(t)}>Close</button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="atdEmpty">No tickets match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Ticket chat modal */}
      {selected && (
        <div className="atdModalOverlay" role="dialog" aria-modal="true">
          <div className="atdModal">
            <div className="atdModalHead">
              <div>
                <div className="atdModalTitle">{selected.id}</div>
                <div className="atdModalSub">
                  {selected.subject} • {selected.userEmail} • <b>{selected.status}</b>
                </div>
              </div>
              <button className="atdClose" onClick={() => setOpenId(null)}>✕</button>
            </div>

            <div className="atdModalBody">
              <div className="atdChat">
                {selected.messages.map((m, idx) => (
                  <div key={idx} className={`atdMsg ${m.sender === "admin" ? "admin" : "user"}`}>
                    <div className="bubble">{m.text}</div>
                    <div className="meta">{m.sender.toUpperCase()} • {fmtDate(m.timeISO)}</div>
                  </div>
                ))}
              </div>

              <div className="atdModalActions">
                <button className="atdBtn atdBtnGhost" onClick={() => setTicketStatus(selected, "Open")}>Set Open</button>
                <button className="atdBtn atdBtnPrimary" onClick={() => replyToTicket(selected)}>Reply</button>
                <button className="atdBtn atdBtnDanger" onClick={() => closeTicket(selected)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="atdFooter">
        © 2026 STEAM ONE Platform • Admin Support Center
      </footer>
    </div>
  );
}