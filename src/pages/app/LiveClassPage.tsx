import React, { useEffect, useMemo, useRef, useState } from "react";
import "./LiveClassPage.css";

type Role = "Teacher" | "Facilitator";
type ClassStatus = "LIVE" | "UPCOMING" | "COMPLETED";
type Level = "STEAM ONE" | "STEAM TWO" | "STEAM THREE";

type Session = {
  id: string;
  title: string;
  level: Level;
  facilitator: string;
  startISO: string;
  endISO: string;
  status: ClassStatus;
  meetLink: string; // placeholder
  roomCode: string;
  agenda: string[];
};

type ChatMsg = {
  id: string;
  name: string;
  role: "Teacher" | "Facilitator" | "System";
  timeISO: string;
  text: string;
};

const STORE = {
  role: "steam_one_live_role_v1",
  selected: "steam_one_live_selected_v1",
  chat: "steam_one_live_chat_v1",
  attendance: "steam_one_live_attendance_v1",
};

function formatLagosTime(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);
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

function durationLabel(startISO: string, endISO: string) {
  const s = +new Date(startISO);
  const e = +new Date(endISO);
  const mins = Math.max(1, Math.round((e - s) / 60000));
  if (mins < 60) return `${mins} mins`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function uid(prefix = "MSG") {
  return `${prefix}-${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
}

function seedSessions(): Session[] {
  const now = new Date();
  const addMin = (m: number) => new Date(now.getTime() + m * 60000).toISOString();
  const subMin = (m: number) => new Date(now.getTime() - m * 60000).toISOString();

  return [
    {
      id: "S-LIVE-001",
      title: "Live Class: Digital Teaching Foundations",
      level: "STEAM ONE",
      facilitator: "Facilitator Grace",
      startISO: subMin(20),
      endISO: addMin(40),
      status: "LIVE",
      meetLink: "https://meet.google.com/xxx-xxxx-xxx",
      roomCode: "STEAM1-LIVE",
      agenda: ["Welcome & attendance", "Teaching tools demo", "Mini activity", "Q&A"],
    },
    {
      id: "S-UP-002",
      title: "Workshop: Tech Integration for Lessons",
      level: "STEAM TWO",
      facilitator: "Facilitator Daniel",
      startISO: addMin(180),
      endISO: addMin(240),
      status: "UPCOMING",
      meetLink: "https://zoom.us/j/123456789",
      roomCode: "STEAM2-WORK",
      agenda: ["Warm-up", "Tools walkthrough", "Breakout practice", "Wrap-up"],
    },
    {
      id: "S-UP-003",
      title: "Masterclass: AI in Classroom Planning",
      level: "STEAM THREE",
      facilitator: "Facilitator Hannah",
      startISO: addMin(1440),
      endISO: addMin(1560),
      status: "UPCOMING",
      meetLink: "https://teams.microsoft.com/l/meetup-join/...",
      roomCode: "STEAM3-AI",
      agenda: ["AI workflows", "Ethics", "Rubrics & evaluation", "Assignments briefing"],
    },
    {
      id: "S-CMP-004",
      title: "Recorded: Assessment & Feedback Basics",
      level: "STEAM ONE",
      facilitator: "Facilitator Grace",
      startISO: subMin(3000),
      endISO: subMin(2940),
      status: "COMPLETED",
      meetLink: "#",
      roomCode: "STEAM1-REC",
      agenda: ["Intro", "Rubrics", "Feedback templates", "Closing"],
    },
  ];
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function saveJSON(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function LiveClassPage() {
  // Nigeria time
  const [lagosNow, setLagosNow] = useState(getLagosNowString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosNowString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Role (demo)
  const [role, setRole] = useState<Role>(() => {
    const r = localStorage.getItem(STORE.role);
    return r === "Teacher" ? "Teacher" : "Facilitator";
  });
  useEffect(() => localStorage.setItem(STORE.role, role), [role]);

  // Sessions
  const sessions = useMemo(() => seedSessions(), []);

  // Selected session
  const [selectedId, setSelectedId] = useState<string>(() => {
    return localStorage.getItem(STORE.selected) || sessions[0]?.id || "";
  });
  useEffect(() => localStorage.setItem(STORE.selected, selectedId), [selectedId]);

  const selected = useMemo(() => sessions.find((s) => s.id === selectedId) || sessions[0], [sessions, selectedId]);

  // Filters
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<Level | "All">("All");
  const [status, setStatus] = useState<ClassStatus | "All">("All");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return sessions
      .slice()
      .sort((a, b) => {
        // LIVE first, UPCOMING, COMPLETED
        const pr = (x: ClassStatus) => (x === "LIVE" ? 0 : x === "UPCOMING" ? 1 : 2);
        const pa = pr(a.status) - pr(b.status);
        if (pa !== 0) return pa;
        return +new Date(a.startISO) - +new Date(b.startISO);
      })
      .filter((s) => {
        if (level !== "All" && s.level !== level) return false;
        if (status !== "All" && s.status !== status) return false;
        if (!query) return true;
        const text = `${s.title} ${s.level} ${s.facilitator} ${s.id}`.toLowerCase();
        return text.includes(query);
      });
  }, [sessions, q, level, status]);

  // Attendance
  const [attendance, setAttendance] = useState<Record<string, boolean>>(() =>
    loadJSON<Record<string, boolean>>(STORE.attendance, {})
  );
  useEffect(() => saveJSON(STORE.attendance, attendance), [attendance]);

  // Chat
  const [chat, setChat] = useState<ChatMsg[]>(() =>
    loadJSON<ChatMsg[]>(STORE.chat, [
      {
        id: uid("SYS"),
        name: "System",
        role: "System",
        timeISO: new Date().toISOString(),
        text: "Welcome to Live Class. Be respectful and stay on topic.",
      },
    ])
  );
  useEffect(() => saveJSON(STORE.chat, chat), [chat]);

  const [chatText, setChatText] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, selectedId]);

  // Join modal
  const [joinOpen, setJoinOpen] = useState(false);
  const [agree, setAgree] = useState(false);

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 1800);
  };

  const openJoin = () => {
    setAgree(false);
    setJoinOpen(true);
  };

  const confirmJoin = () => {
    if (!agree) return showToast("Please accept class rules to continue.");
    setJoinOpen(false);
    // demo: mark attendance if live/upcoming
    setAttendance((prev) => ({ ...prev, [selected.id]: true }));
    setChat((prev) => [
      ...prev,
      {
        id: uid("SYS"),
        name: "System",
        role: "System",
        timeISO: new Date().toISOString(),
        text: `${role} joined the session: ${selected.title}`,
      },
    ]);
    showToast("✅ Joined class (demo). Attendance saved.");
  };

  const sendChat = () => {
    const text = chatText.trim();
    if (!text) return;
    const name = role === "Teacher" ? "Teacher User" : "Facilitator User";
    setChat((prev) => [
      ...prev,
      { id: uid(), name, role, timeISO: new Date().toISOString(), text },
    ]);
    setChatText("");
  };

  const clearChat = () => {
    setChat([
      {
        id: uid("SYS"),
        name: "System",
        role: "System",
        timeISO: new Date().toISOString(),
        text: "Chat cleared (demo).",
      },
    ]);
    showToast("Chat cleared.");
  };

  const completion = useMemo(() => {
    // demo completion for selected session
    const base = selected.status === "LIVE" ? 62 : selected.status === "UPCOMING" ? 0 : 100;
    const checked = attendance[selected.id] ? 10 : 0;
    return clamp(base + checked, 0, 100);
  }, [selected, attendance]);

  return (
    <div className="lc">
      {/* Sidebar */}
      <aside className="lcSide">
        <div className="lcBrand">
          <div className="lcMsLogo" aria-label="Microsoft Education logo" />
          <div className="lcBrandText">
            <div className="lcBrandTop">Microsoft Education</div>
            <div className="lcBrandName">
              <span className="lcBrandSteam">STEAM</span>{" "}
              <span className="lcBrandOne">ONE</span>{" "}
              <span className="lcBrandPlatform">Platform</span>
            </div>
          </div>
        </div>

        <div className="lcSideCard">
          <div className="lcSideTitle">Live Classes</div>
          <div className="lcSideSub">
            Join your scheduled classes, check attendance, access materials, and chat with facilitators.
          </div>
          <button className="lcBtn lcBtnPay" onClick={openJoin}>
            🎥 Join Selected
          </button>
        </div>

        <nav className="lcNav" aria-label="Navigation">
          <button className="lcNavItem">🏠 Dashboard</button>
          <button className="lcNavItem active">🎥 Live Classes</button>
          <button className="lcNavItem">📝 Assignments</button>
          <button className="lcNavItem">🧍 Attendance</button>
          <button className="lcNavItem">🏅 Certificates</button>
          <button className="lcNavItem">📣 Announcements</button>
          <button className="lcNavItem">💰 Earnings</button>
          <button className="lcNavItem">⚙ Settings</button>
        </nav>

        <div className="lcSideFooter">
          <div className="lcSideFooterRow">
            <span className="lcDot" /> <span>Aligned with ISTE • UNESCO ICT CFT • PISA</span>
          </div>
          <div className="lcSideFooterCopy">© 2026 STEAM ONE Platform</div>
        </div>
      </aside>

      {/* Main */}
      <section className="lcMain">
        {/* Header */}
        <header className="lcTop">
          <div>
            <div className="lcTitle">Live Class Center</div>
            <div className="lcSub">Manage upcoming sessions, join live classes, and access resources.</div>
            <div className="lcTime">
              Nigeria Time: <span className="lcTimeRed">{lagosNow}</span>
            </div>

            <div className="lcRoleRow">
              <span className="lcRoleLabel">Role</span>
              <div className="lcRoleTabs" role="tablist">
                <button className={`lcRoleTab ${role === "Teacher" ? "active" : ""}`} onClick={() => setRole("Teacher")}>
                  Teacher
                </button>
                <button
                  className={`lcRoleTab ${role === "Facilitator" ? "active" : ""}`}
                  onClick={() => setRole("Facilitator")}
                >
                  Facilitator
                </button>
              </div>

              <div className="lcPills">
                <span className="lcPill">
                  Attendance: <b>{attendance[selected?.id] ? "Checked-in" : "Not checked"}</b>
                </span>
                <span className="lcPill soft">
                  Status: <b>{selected?.status}</b>
                </span>
                <span className="lcPill soft2">
                  Completion: <b>{completion}%</b>
                </span>
              </div>
            </div>
          </div>

          <div className="lcTopRight">
            <div className="lcSearch">
              <span className="lcSearchIcon">🔎</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sessions..." />
            </div>

            <select value={level} onChange={(e) => setLevel(e.target.value as any)} aria-label="Level filter">
              <option value="All">All Levels</option>
              <option value="STEAM ONE">STEAM ONE</option>
              <option value="STEAM TWO">STEAM TWO</option>
              <option value="STEAM THREE">STEAM THREE</option>
            </select>

            <select value={status} onChange={(e) => setStatus(e.target.value as any)} aria-label="Status filter">
              <option value="All">All Status</option>
              <option value="LIVE">LIVE</option>
              <option value="UPCOMING">UPCOMING</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>

            <button className="lcIconBtn" onClick={() => showToast("Notifications (demo).")}>🔔</button>

            <button className="lcUserChip">
              <span className="lcUserAvatar" aria-hidden="true" />
              <span className="lcUserText">
                <span className="lcUserName">{role} User</span>
                <span className="lcUserRole">{role} Account</span>
              </span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="lcGrid">
          {/* Sessions list */}
          <div className="lcCard">
            <div className="lcCardHead">
              <div>
                <div className="lcH3">Sessions</div>
                <div className="lcHint">Select a session to see details and join.</div>
              </div>
              <button
                className="lcBtn lcBtnGhost"
                onClick={() => {
                  setQ("");
                  setLevel("All");
                  setStatus("All");
                  showToast("Filters cleared.");
                }}
              >
                Clear Filters
              </button>
            </div>

            <div className="lcList">
              {filtered.map((s) => {
                const active = s.id === selected?.id;
                return (
                  <button
                    key={s.id}
                    className={`lcItem ${active ? "active" : ""}`}
                    onClick={() => setSelectedId(s.id)}
                  >
                    <div className="lcItemTop">
                      <span className={`lcBadge ${s.status.toLowerCase()}`}>{s.status}</span>
                      <span className={`lcLevel ${s.level.replace(" ", "").toLowerCase()}`}>{s.level}</span>
                      <span className="lcDur">{durationLabel(s.startISO, s.endISO)}</span>
                    </div>
                    <div className="lcItemTitle">{s.title}</div>
                    <div className="lcItemSub">
                      <span>{formatLagosTime(s.startISO)}</span>
                      <span className="sep">•</span>
                      <span>{s.facilitator}</span>
                    </div>
                    <div className="lcItemFoot">
                      <span className={`lcCheck ${attendance[s.id] ? "on" : ""}`}>
                        {attendance[s.id] ? "✅ Attendance" : "⬜ Attendance"}
                      </span>
                      <span className="lcCode">Room: {s.roomCode}</span>
                    </div>
                  </button>
                );
              })}

              {filtered.length === 0 && <div className="lcEmpty">No sessions match your filters.</div>}
            </div>
          </div>

          {/* Details + materials */}
          <div className="lcStack">
            {/* Details */}
            <div className="lcCard">
              <div className="lcCardHead">
                <div>
                  <div className="lcH3">Session Details</div>
                  <div className="lcHint">Agenda, attendance, meeting link, and class actions.</div>
                </div>
                <div className="lcHeadActions">
                  <button className="lcBtn lcBtnPrimary" onClick={openJoin}>
                    {selected?.status === "COMPLETED" ? "▶ Watch Recording" : "Join Live"}
                  </button>
                  <button
                    className="lcBtn lcBtnPay"
                    onClick={() => {
                      setAttendance((prev) => ({ ...prev, [selected.id]: true }));
                      showToast("✅ Attendance checked-in.");
                    }}
                  >
                    🧾 Check-in
                  </button>
                </div>
              </div>

              <div className="lcDetails">
                <div className="lcDetailTop">
                  <div>
                    <div className="lcDetailTitle">{selected?.title}</div>
                    <div className="lcDetailMeta">
                      <span className={`lcLevel ${selected?.level.replace(" ", "").toLowerCase()}`}>{selected?.level}</span>
                      <span className="sep">•</span>
                      <span>{selected?.facilitator}</span>
                      <span className="sep">•</span>
                      <span>{formatLagosTime(selected?.startISO)}</span>
                    </div>
                  </div>
                  <div className="lcMiniBox">
                    <div className="lcMiniLabel">Room Code</div>
                    <div className="lcMiniValue mono">{selected?.roomCode}</div>
                  </div>
                </div>

                <div className="lcTwo">
                  <div className="lcPanel">
                    <div className="lcPanelTitle">Agenda</div>
                    <ul className="lcAgenda">
                      {selected?.agenda?.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                    <div className="lcProgress">
                      <div className="lcProgressTop">
                        <span>Completion (demo)</span>
                        <b>{completion}%</b>
                      </div>
                      <div className="lcBar">
                        <div className="lcBarFill" style={{ width: `${completion}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="lcPanel">
                    <div className="lcPanelTitle">Meeting</div>
                    <div className="lcMeetRow">
                      <span className="lcMeetLabel">Status</span>
                      <span className={`lcStatusPill ${selected?.status.toLowerCase()}`}>{selected?.status}</span>
                    </div>
                    <div className="lcMeetRow">
                      <span className="lcMeetLabel">Duration</span>
                      <b>{durationLabel(selected?.startISO, selected?.endISO)}</b>
                    </div>
                    <div className="lcMeetRow">
                      <span className="lcMeetLabel">Link</span>
                      <button
                        className="lcLinkBtn"
                        onClick={() => showToast("Meeting link opened (demo).")}
                      >
                        Open meeting link
                      </button>
                    </div>

                    <div className="lcRules">
                      <b>Class Rules</b>
                      <ul>
                        <li>Join on time and stay respectful.</li>
                        <li>Attendance is required for certificate eligibility.</li>
                        <li>No spamming or unrelated content in chat.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Materials + Chat */}
            <div className="lcRow2">
              <div className="lcCard">
                <div className="lcCardHead">
                  <div>
                    <div className="lcH3">Materials</div>
                    <div className="lcHint">Download resources (demo buttons).</div>
                  </div>
                </div>

                <div className="lcMaterials">
                  <div className="lcMat">
                    <div className="lcMatTitle">Lesson Slides</div>
                    <div className="lcMatSub">PDF / PPT export (demo)</div>
                    <button className="lcBtn lcBtnGhost" onClick={() => showToast("Downloading slides (demo).")}>
                      Download
                    </button>
                  </div>
                  <div className="lcMat">
                    <div className="lcMatTitle">Activity Sheet</div>
                    <div className="lcMatSub">Worksheet for class activity</div>
                    <button className="lcBtn lcBtnGhost" onClick={() => showToast("Downloading activity sheet (demo).")}>
                      Download
                    </button>
                  </div>
                  <div className="lcMat">
                    <div className="lcMatTitle">Assignment Brief</div>
                    <div className="lcMatSub">Submit after class</div>
                    <button className="lcBtn lcBtnGhost" onClick={() => showToast("Opening assignment brief (demo).")}>
                      Open
                    </button>
                  </div>

                  <div className="lcMatNote">
                    Tip: Backend will later serve real files using secure URLs and permissions.
                  </div>
                </div>
              </div>

              <div className="lcCard">
                <div className="lcCardHead">
                  <div>
                    <div className="lcH3">Live Chat</div>
                    <div className="lcHint">Chat is saved in localStorage (demo).</div>
                  </div>
                  <button className="lcBtn lcBtnGhost" onClick={clearChat}>Clear</button>
                </div>

                <div className="lcChat">
                  <div className="lcChatBody">
                    {chat.map((m) => {
                      const mine = (m.role === role) && m.role !== "System";
                      return (
                        <div key={m.id} className={`lcMsg ${mine ? "mine" : ""} ${m.role === "System" ? "sys" : ""}`}>
                          <div className="lcMsgTop">
                            <span className="lcMsgName">{m.name}</span>
                            <span className="lcMsgTime">
                              {new Intl.DateTimeFormat("en-NG", {
                                timeZone: "Africa/Lagos",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }).format(new Date(m.timeISO))}
                            </span>
                          </div>
                          <div className="lcMsgText">{m.text}</div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="lcChatInput">
                    <input
                      value={chatText}
                      onChange={(e) => setChatText(e.target.value)}
                      placeholder="Type a message…"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") sendChat();
                      }}
                    />
                    <button className="lcBtn lcBtnPrimary" onClick={sendChat}>Send</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="lcFooter">
          <div className="lcFooterLeft">
            <span className="lcFooterLogo" aria-hidden="true" />
            <span>© 2026 STEAM ONE Platform. All rights reserved.</span>
          </div>
          <div className="lcFooterLinks">
            <button className="lcLinkFoot" onClick={() => alert("Terms (demo)")}>Terms</button>
            <button className="lcLinkFoot" onClick={() => alert("Privacy (demo)")}>Privacy</button>
            <button className="lcLinkFoot" onClick={() => alert("Support (demo)")}>Support</button>
          </div>
        </footer>
      </section>

      {/* Join modal */}
      {joinOpen && (
        <div className="lcModalOverlay" role="dialog" aria-modal="true" aria-label="Join class modal">
          <div className="lcModal">
            <div className="lcModalHead">
              <div>
                <div className="lcModalTitle">
                  {selected.status === "COMPLETED" ? "Watch Recording" : "Join Live Class"}
                </div>
                <div className="lcModalSub">
                  <b>{selected.title}</b> • {selected.level} • {formatLagosTime(selected.startISO)}
                </div>
              </div>
              <button className="lcModalClose" onClick={() => setJoinOpen(false)} aria-label="Close">✕</button>
            </div>

            <div className="lcModalBody">
              <div className="lcJoinGrid">
                <div className="lcBlock">
                  <div className="lcBTitle">Session Access</div>
                  <div className="lcRow"><span>Status</span><b>{selected.status}</b></div>
                  <div className="lcRow"><span>Room Code</span><b className="mono">{selected.roomCode}</b></div>
                  <div className="lcRow"><span>Facilitator</span><b>{selected.facilitator}</b></div>
                  <div className="lcDivider" />
                  <div className="lcHintBox">
                    <b>Note:</b> Frontend demo. Backend will validate permissions and provide secure meeting links.
                  </div>

                  <label className="lcAgree">
                    <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                    <span>I accept the class rules and understand attendance may be required.</span>
                  </label>

                  <button className="lcBtn lcBtnPrimary" onClick={confirmJoin}>
                    {selected.status === "COMPLETED" ? "Play Recording" : "Join Now"}
                  </button>
                  <button className="lcBtn lcBtnGhost" onClick={() => setJoinOpen(false)}>Cancel</button>
                </div>

                <div className="lcBlock">
                  <div className="lcBTitle">Quick Actions</div>
                  <button
                    className="lcBtn lcBtnPay"
                    onClick={() => {
                      setAttendance((prev) => ({ ...prev, [selected.id]: true }));
                      showToast("Attendance checked-in.");
                    }}
                  >
                    🧾 Check-in Attendance
                  </button>
                  <button className="lcBtn lcBtnGhost" onClick={() => showToast("Opening materials (demo).")}>
                    📄 View Materials
                  </button>
                  <button className="lcBtn lcBtnGhost" onClick={() => showToast("Opening assignments (demo).")}>
                    📝 View Assignment
                  </button>

                  <div className="lcMiniWarn">
                    If you miss live class, you may watch recording (if provided) but attendance policies may apply.
                  </div>
                </div>
              </div>
            </div>

            <div className="lcModalFoot">
              <button className="lcBtn lcBtnGhost" onClick={() => setJoinOpen(false)}>Close</button>
              <button className="lcBtn lcBtnPrimary" onClick={confirmJoin}>Continue</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="lcToast">{toast}</div>}
    </div>
  );
}