import React, { useEffect, useMemo, useState } from "react";
import "./ContactAdminPage.css";

type Priority = "Low" | "Medium" | "High" | "Urgent";
type TicketStatus = "Open" | "In Review" | "Resolved" | "Closed";
type Category =
  | "Payment"
  | "Enrollment"
  | "Course Access"
  | "Certificate"
  | "Technical Issue"
  | "Account/Login"
  | "Marketplace"
  | "Other";

type Ticket = {
  id: string;
  ref: string;
  subject: string;
  category: Category;
  priority: Priority;
  status: TicketStatus;
  createdAt: string; // text for now
  lastUpdatedAt: string; // text
  requesterName: string;
  requesterEmail: string;
  message: string;
  attachments: string[]; // file names (demo)
  adminReply?: string;
  internalNote?: string;
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

function uid(prefix = "t") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function makeRef() {
  const rand = Math.random().toString(10).slice(2, 8);
  return `ADM-${new Date().getFullYear()}-${rand}`;
}

function nowTextLagos() {
  return new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export default function ContactAdminPage() {
  // Nigeria time
  const [lagosNow, setLagosNow] = useState(getLagosTimeString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Demo tickets
  const initialTickets: Ticket[] = useMemo(
    () => [
      {
        id: "tk1",
        ref: "ADM-2025-120981",
        subject: "Payment successful but course still locked",
        category: "Payment",
        priority: "High",
        status: "Open",
        createdAt: "Apr 22, 2025 • 10:08 AM",
        lastUpdatedAt: "Apr 22, 2025 • 10:08 AM",
        requesterName: "Chinedu Okafor",
        requesterEmail: "chinedu@example.com",
        message:
          "Hello Admin, I paid for STEAM ONE but I can’t access the modules. Please check and unlock my account. Thank you.",
        attachments: ["payment_receipt.png"],
        adminReply: "",
        internalNote: "Verify payment reference on backend (demo).",
      },
      {
        id: "tk2",
        ref: "ADM-2025-773201",
        subject: "Unable to login with Google",
        category: "Account/Login",
        priority: "Medium",
        status: "In Review",
        createdAt: "Apr 21, 2025 • 05:15 PM",
        lastUpdatedAt: "Apr 22, 2025 • 08:40 AM",
        requesterName: "Amina Yusuf",
        requesterEmail: "amina@example.com",
        message:
          "When I click Google login it redirects back but doesn’t sign me in. Please help.",
        attachments: [],
        adminReply: "Thanks Amina. We are checking the OAuth configuration. We will update you shortly (demo).",
        internalNote: "Check Google OAuth redirect URI and Vite env vars.",
      },
      {
        id: "tk3",
        ref: "ADM-2025-550021",
        subject: "Certificate verification failed",
        category: "Certificate",
        priority: "Low",
        status: "Resolved",
        createdAt: "Apr 18, 2025 • 12:10 PM",
        lastUpdatedAt: "Apr 19, 2025 • 09:00 AM",
        requesterName: "Fatima Abdullahi",
        requesterEmail: "fatima@example.com",
        message:
          "My verification code returns no record. I need it for my school HR documentation.",
        attachments: ["screenshot_error.jpg"],
        adminReply: "Resolved: record synced successfully. Please try again (demo).",
        internalNote: "Re-index certificate records.",
      },
    ],
    []
  );

  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  // Filters / search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TicketStatus>("All");
  const [categoryFilter, setCategoryFilter] = useState<"All" | Category>("All");
  const [priorityFilter, setPriorityFilter] = useState<"All" | Priority>("All");
  const [sortBy, setSortBy] = useState<"Newest" | "Oldest" | "Urgent First">("Newest");

  // Create ticket form
  const [name, setName] = useState("Teacher User");
  const [email, setEmail] = useState("teacher@example.com");
  const [category, setCategory] = useState<Category>("Technical Issue");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachNames, setAttachNames] = useState<string[]>([]);

  // Ticket details drawer
  const [activeId, setActiveId] = useState<string | null>(tickets[0]?.id ?? null);
  const active = useMemo(() => tickets.find((t) => t.id === activeId) ?? null, [tickets, activeId]);

  // Admin actions (demo)
  const [reply, setReply] = useState("");
  const [internalNote, setInternalNote] = useState("");

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === "Open").length;
    const review = tickets.filter((t) => t.status === "In Review").length;
    const resolved = tickets.filter((t) => t.status === "Resolved").length;
    const urgent = tickets.filter((t) => t.priority === "Urgent" && t.status !== "Closed").length;
    return { total, open, review, resolved, urgent };
  }, [tickets]);

  const filtered = useMemo(() => {
    const q = normalize(search);
    let list = tickets
      .filter((t) =>
        q
          ? (t.subject +
              " " +
              t.ref +
              " " +
              t.requesterName +
              " " +
              t.requesterEmail +
              " " +
              t.category +
              " " +
              t.priority).toLowerCase().includes(q)
          : true
      )
      .filter((t) => (statusFilter === "All" ? true : t.status === statusFilter))
      .filter((t) => (categoryFilter === "All" ? true : t.category === categoryFilter))
      .filter((t) => (priorityFilter === "All" ? true : t.priority === priorityFilter));

    if (sortBy === "Newest") list = list.slice().sort((a, b) => (a.id < b.id ? 1 : -1));
    if (sortBy === "Oldest") list = list.slice().sort((a, b) => (a.id > b.id ? 1 : -1));
    if (sortBy === "Urgent First") {
      const weight = (p: Priority) => (p === "Urgent" ? 3 : p === "High" ? 2 : p === "Medium" ? 1 : 0);
      list = list.slice().sort((a, b) => weight(b.priority) - weight(a.priority));
    }
    return list;
  }, [tickets, search, statusFilter, categoryFilter, priorityFilter, sortBy]);

  // Keep active ticket valid if filters remove it
  useEffect(() => {
    if (!activeId) return;
    const exists = filtered.some((t) => t.id === activeId);
    if (!exists && filtered.length) setActiveId(filtered[0].id);
    if (!filtered.length) setActiveId(null);
  }, [filtered, activeId]);

  const validateTicket = () => {
    if (!name.trim()) return "Name is required.";
    if (!email.trim() || !email.includes("@")) return "Valid email is required.";
    if (!subject.trim() || subject.trim().length < 5) return "Subject must be at least 5 characters.";
    if (!message.trim() || message.trim().length < 15) return "Message must be at least 15 characters.";
    return null;
  };

  const submitTicket = () => {
    const err = validateTicket();
    if (err) return showToast(err);

    const newTicket: Ticket = {
      id: uid("tk"),
      ref: makeRef(),
      subject: subject.trim(),
      category,
      priority,
      status: "Open",
      createdAt: nowTextLagos(),
      lastUpdatedAt: nowTextLagos(),
      requesterName: name.trim(),
      requesterEmail: email.trim(),
      message: message.trim(),
      attachments: attachNames.slice(),
      adminReply: "",
      internalNote: "",
    };

    setTickets((prev) => [newTicket, ...prev]);
    setActiveId(newTicket.id);

    // Reset only subject/message/attachments
    setSubject("");
    setMessage("");
    setAttachNames([]);
    showToast("✅ Ticket submitted to Admin (demo).");
  };

  const onAttachFiles = (files: FileList | null) => {
    if (!files || !files.length) return;
    const names = Array.from(files).map((f) => f.name);
    setAttachNames((prev) => {
      const merged = [...prev, ...names];
      return Array.from(new Set(merged)).slice(0, 5); // limit 5
    });
    showToast("📎 Attachment added (demo).");
  };

  const setStatus = (id: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, lastUpdatedAt: nowTextLagos() } : t))
    );
    showToast(`Status set to "${status}" (demo).`);
  };

  const saveReplyNote = () => {
    if (!active) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id !== active.id
          ? t
          : {
              ...t,
              adminReply: reply.trim() ? reply.trim() : t.adminReply,
              internalNote: internalNote.trim() ? internalNote.trim() : t.internalNote,
              lastUpdatedAt: nowTextLagos(),
              status: t.status === "Open" ? "In Review" : t.status,
            }
      )
    );
    setReply("");
    setInternalNote("");
    showToast("💾 Saved reply/notes (demo).");
  };

  const deleteTicket = (id: string) => {
    const ok = window.confirm("Delete this ticket?");
    if (!ok) return;
    setTickets((prev) => prev.filter((t) => t.id !== id));
    showToast("🗑️ Ticket deleted (demo).");
  };

  const priorityBadge = (p: Priority) => {
    const cls = p.toLowerCase().replace(" ", "");
    return <span className={`cadPriority ${cls}`}>{p}</span>;
  };

  return (
    <div className="cad">
      {/* Sidebar */}
      <aside className="cadSide">
        <div className="cadBrand">
          <div className="cadMsLogo" aria-label="Microsoft Education logo" />
          <div className="cadBrandText">
            <div className="cadBrandTop">Microsoft Education</div>
            <div className="cadBrandName">
              <span className="cadBrandSteam">STEAM</span>{" "}
              <span className="cadBrandOne">ONE</span>{" "}
              <span className="cadBrandPlatform">Platform</span>
            </div>
          </div>
        </div>

        <div className="cadSideCard">
          <div className="cadSideTitle">Contact Admin</div>
          <div className="cadSideSub">
            Submit support tickets, track responses, and resolve issues fast.
          </div>
          <button className="cadBtn cadBtnPay" onClick={() => showToast("Priority support (demo).")}>
            ⚡ Priority Support
          </button>
        </div>

        <nav className="cadNav" aria-label="Navigation">
          <button className="cadNavItem">🏠 Dashboard</button>
          <button className="cadNavItem">📚 Courses</button>
          <button className="cadNavItem">📝 Assignments</button>
          <button className="cadNavItem">🧍 Attendance</button>
          <button className="cadNavItem">🏅 Certificates</button>
          <button className="cadNavItem">📣 Announcements</button>
          <button className="cadNavItem active">🧑‍💻 Contact Admin</button>
          <button className="cadNavItem">⚙ Settings</button>
        </nav>

        <div className="cadSideFooter">
          <div className="cadSideFooterRow">
            <span className="cadDot" /> <span>Trusted by ISTE • UNESCO • PISA</span>
          </div>
          <div className="cadSideFooterCopy">© 2026 STEAM ONE Platform</div>
        </div>
      </aside>

      {/* Main */}
      <section className="cadMain">
        {/* Header */}
        <header className="cadTop">
          <div className="cadTopLeft">
            <div className="cadTitle">Contact Admin</div>
            <div className="cadSub">
              Raise an issue and get help from the STEAM ONE Platform admin team.
            </div>
            <div className="cadTime">
              Nigeria Time: <span className="cadTimeRed">{lagosNow}</span>
            </div>
          </div>

          <div className="cadTopRight">
            <div className="cadSearch">
              <span className="cadSearchIcon">🔎</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tickets (ref, subject, name...)"
                aria-label="Search tickets"
              />
            </div>

            <button className="cadIconBtn" aria-label="Notifications" title="Notifications">
              🔔 <span className="cadBadge">1</span>
            </button>
            <button className="cadIconBtn" aria-label="Messages" title="Messages">
              ✉️
            </button>

            <button className="cadUserChip" aria-label="User menu">
              <span className="cadUserMiniAvatar" aria-hidden="true" />
              <span className="cadUserText">
                <span className="cadUserName">Teacher Desk</span>
                <span className="cadUserRole">Support Requests</span>
              </span>
              <span className="cadCaret">▾</span>
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="cadStats">
          <div className="cadStat">
            <div className="cadStatIco">🎫</div>
            <div>
              <div className="cadStatLabel">Tickets</div>
              <div className="cadStatValue">{stats.total}</div>
            </div>
            <div className="cadStatHint">All</div>
          </div>
          <div className="cadStat">
            <div className="cadStatIco">🟦</div>
            <div>
              <div className="cadStatLabel">Open</div>
              <div className="cadStatValue">{stats.open}</div>
            </div>
            <div className="cadStatHint">New</div>
          </div>
          <div className="cadStat">
            <div className="cadStatIco">🟨</div>
            <div>
              <div className="cadStatLabel">In Review</div>
              <div className="cadStatValue">{stats.review}</div>
            </div>
            <div className="cadStatHint">Processing</div>
          </div>
          <div className="cadStat">
            <div className="cadStatIco">✅</div>
            <div>
              <div className="cadStatLabel">Resolved</div>
              <div className="cadStatValue">{stats.resolved}</div>
            </div>
            <div className="cadStatHint">Done</div>
          </div>
        </div>

        {/* Layout */}
        <div className="cadGrid">
          {/* Left: Form */}
          <div className="cadCard">
            <div className="cadCardHead">
              <div>
                <div className="cadH3">Submit a Ticket</div>
                <div className="cadHint">
                  Provide clear subject and message so Admin can solve it fast.
                </div>
              </div>
              <div className="cadCardActions">
                <button
                  className="cadBtn cadBtnGhost"
                  onClick={() => {
                    setSubject("");
                    setMessage("");
                    setAttachNames([]);
                    showToast("Form cleared.");
                  }}
                >
                  Clear
                </button>
                <button className="cadBtn cadBtnPrimary" onClick={submitTicket}>
                  Submit
                </button>
              </div>
            </div>

            <div className="cadForm">
              <div className="cadRow2">
                <label className="cadField">
                  <span>Your Name</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
                </label>
                <label className="cadField">
                  <span>Email</span>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
                </label>
              </div>

              <div className="cadRow3">
                <label className="cadField">
                  <span>Category</span>
                  <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
                    <option>Payment</option>
                    <option>Enrollment</option>
                    <option>Course Access</option>
                    <option>Certificate</option>
                    <option>Technical Issue</option>
                    <option>Account/Login</option>
                    <option>Marketplace</option>
                    <option>Other</option>
                  </select>
                </label>

                <label className="cadField">
                  <span>Priority</span>
                  <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </label>

                <div className="cadSla">
                  <div className="cadSlaTitle">Estimated Response</div>
                  <div className="cadSlaRow">
                    <span className="cadSlaChip">Low: 48hrs</span>
                    <span className="cadSlaChip">Medium: 24hrs</span>
                    <span className="cadSlaChip">High: 6hrs</span>
                    <span className="cadSlaChip">Urgent: 2hrs</span>
                  </div>
                </div>
              </div>

              <label className="cadField">
                <span>Subject</span>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Short summary of the issue"
                />
              </label>

              <label className="cadField">
                <span>Message</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  placeholder="Explain what happened, what you tried, and what you need..."
                />
              </label>

              <div className="cadAttach">
                <div className="cadAttachTop">
                  <div>
                    <div className="cadAttachTitle">Attachments</div>
                    <div className="cadAttachHint">Add up to 5 files (demo UI).</div>
                  </div>
                  <label className="cadAttachBtn">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => onAttachFiles(e.target.files)}
                      style={{ display: "none" }}
                    />
                    📎 Add Files
                  </label>
                </div>

                <div className="cadAttachList">
                  {attachNames.length === 0 ? (
                    <div className="cadAttachEmpty">No attachments yet.</div>
                  ) : (
                    attachNames.map((n) => (
                      <div className="cadFile" key={n}>
                        <span className="cadFileIco">📄</span>
                        <span className="cadFileName">{n}</span>
                        <button
                          className="cadFileRemove"
                          onClick={() => setAttachNames((prev) => prev.filter((x) => x !== n))}
                          aria-label="Remove attachment"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="cadFormFoot">
                <div className="cadFootNote">
                  <b>Tip:</b> Add payment receipt, screenshots, or exact error messages for faster resolution.
                </div>
                <button className="cadBtn cadBtnPay" onClick={submitTicket}>
                  Submit Ticket
                </button>
              </div>
            </div>
          </div>

          {/* Middle: Ticket list */}
          <div className="cadCard">
            <div className="cadCardHead">
              <div>
                <div className="cadH3">Tickets</div>
                <div className="cadHint">Click a ticket to view details and updates.</div>
              </div>
              <div className="cadCardActions">
                <label className="cadMiniSelect">
                  <span>Status</span>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                    <option value="All">All</option>
                    <option value="Open">Open</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </label>
                <label className="cadMiniSelect">
                  <span>Category</span>
                  <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as any)}>
                    <option value="All">All</option>
                    <option value="Payment">Payment</option>
                    <option value="Enrollment">Enrollment</option>
                    <option value="Course Access">Course Access</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Account/Login">Account/Login</option>
                    <option value="Marketplace">Marketplace</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label className="cadMiniSelect">
                  <span>Priority</span>
                  <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as any)}>
                    <option value="All">All</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </label>
                <label className="cadMiniSelect">
                  <span>Sort</span>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                    <option value="Newest">Newest</option>
                    <option value="Oldest">Oldest</option>
                    <option value="Urgent First">Urgent First</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="cadList">
              {filtered.map((t) => (
                <button
                  key={t.id}
                  className={`cadTicket ${t.id === activeId ? "active" : ""}`}
                  onClick={() => {
                    setActiveId(t.id);
                    setReply("");
                    setInternalNote("");
                  }}
                >
                  <div className="cadTicketTop">
                    <div className="cadTicketRef">{t.ref}</div>
                    <span className={`cadStatus ${t.status.toLowerCase().replace(" ", "")}`}>
                      {t.status}
                    </span>
                  </div>

                  <div className="cadTicketSubject">{t.subject}</div>

                  <div className="cadTicketMeta">
                    <span className="cadChip">{t.category}</span>
                    {priorityBadge(t.priority)}
                    <span className="cadTicketSmall">
                      {t.requesterName} • {t.requesterEmail}
                    </span>
                  </div>

                  <div className="cadTicketTimes">
                    <span>Created: <b>{t.createdAt}</b></span>
                    <span className="cadSep">•</span>
                    <span>Updated: <b>{t.lastUpdatedAt}</b></span>
                  </div>
                </button>
              ))}

              {filtered.length === 0 && <div className="cadEmpty">No tickets match your search/filters.</div>}
            </div>
          </div>

          {/* Right: Details drawer */}
          <div className="cadCard">
            <div className="cadCardHead">
              <div>
                <div className="cadH3">Ticket Details</div>
                <div className="cadHint">Admin replies will appear here (demo).</div>
              </div>
              <div className="cadCardActions">
                {active && (
                  <button className="cadBtn cadBtnDangerOutline" onClick={() => deleteTicket(active.id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>

            {!active ? (
              <div className="cadDetailsEmpty">Select a ticket to view details.</div>
            ) : (
              <div className="cadDetails">
                <div className="cadDetailsTop">
                  <div className="cadDetailsTitleRow">
                    <div className="cadDetailsTitle">{active.subject}</div>
                    <span className={`cadStatus ${active.status.toLowerCase().replace(" ", "")}`}>
                      {active.status}
                    </span>
                  </div>

                  <div className="cadDetailsMeta">
                    <span><b>{active.ref}</b></span>
                    <span className="cadSep">•</span>
                    <span>{active.category}</span>
                    <span className="cadSep">•</span>
                    <span>{priorityBadge(active.priority)}</span>
                  </div>

                  <div className="cadDetailsMeta">
                    Requester: <b>{active.requesterName}</b> ({active.requesterEmail})
                  </div>

                  <div className="cadDetailsTimes">
                    Created: <b>{active.createdAt}</b> • Updated: <b>{active.lastUpdatedAt}</b>
                  </div>
                </div>

                <div className="cadDetailsSection">
                  <div className="cadSectionTitle">User Message</div>
                  <div className="cadBubble">{active.message}</div>

                  <div className="cadAttachMini">
                    <div className="cadSectionTitle">Attachments</div>
                    {active.attachments.length === 0 ? (
                      <div className="cadMiniEmpty">No attachments.</div>
                    ) : (
                      <div className="cadMiniFiles">
                        {active.attachments.map((a) => (
                          <div className="cadMiniFile" key={a}>
                            <span>📎</span> <span>{a}</span>
                            <button className="cadMiniBtn" onClick={() => showToast("Download (demo).")}>
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="cadDetailsSection">
                  <div className="cadSectionTitle">Admin Reply</div>
                  <div className="cadBubble alt">{active.adminReply?.trim() ? active.adminReply : "No reply yet."}</div>
                </div>

                <div className="cadDetailsSection">
                  <div className="cadSectionTitle">Internal Note (Admin Only)</div>
                  <div className="cadBubble note">{active.internalNote?.trim() ? active.internalNote : "No internal notes."}</div>
                </div>

                <div className="cadDetailsSection">
                  <div className="cadSectionTitle">Admin Actions (Demo)</div>

                  <div className="cadActionGrid">
                    <label className="cadField">
                      <span>Update Status</span>
                      <select
                        value={active.status}
                        onChange={(e) => setStatus(active.id, e.target.value as TicketStatus)}
                      >
                        <option>Open</option>
                        <option>In Review</option>
                        <option>Resolved</option>
                        <option>Closed</option>
                      </select>
                    </label>

                    <div className="cadQuick">
                      <div className="cadQuickTitle">Quick Actions</div>
                      <div className="cadQuickBtns">
                        <button className="cadBtn cadBtnGhostSmall" onClick={() => setStatus(active.id, "In Review")}>
                          Mark In Review
                        </button>
                        <button className="cadBtn cadBtnPrimarySmall" onClick={() => setStatus(active.id, "Resolved")}>
                          Resolve
                        </button>
                        <button className="cadBtn cadBtnDangerSmall" onClick={() => setStatus(active.id, "Closed")}>
                          Close
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="cadReplyGrid">
                    <label className="cadField">
                      <span>Write Reply</span>
                      <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        rows={4}
                        placeholder="Type a professional reply to the user (demo)..."
                      />
                    </label>

                    <label className="cadField">
                      <span>Internal Note</span>
                      <textarea
                        value={internalNote}
                        onChange={(e) => setInternalNote(e.target.value)}
                        rows={4}
                        placeholder="Add internal notes for Admin team (demo)..."
                      />
                    </label>
                  </div>

                  <div className="cadActionsFoot">
                    <button className="cadBtn cadBtnGhost" onClick={() => { setReply(""); setInternalNote(""); }}>
                      Clear
                    </button>
                    <button className="cadBtn cadBtnPrimary" onClick={saveReplyNote}>
                      Save Reply/Notes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="cadFooter">
          <div className="cadFooterLeft">
            <span className="cadFooterLogo" aria-hidden="true" />
            <span>© 2026 STEAM ONE Platform. All rights reserved.</span>
          </div>
          <div className="cadFooterLinks">
            <button className="cadLinkBtn" onClick={() => alert("Terms (demo)")}>Terms</button>
            <button className="cadLinkBtn" onClick={() => alert("Privacy (demo)")}>Privacy</button>
            <button className="cadLinkBtn" onClick={() => alert("Support (demo)")}>Support</button>
          </div>
        </footer>
      </section>

      {toast && <div className="cadToast">{toast}</div>}
    </div>
  );
}