import React, { useEffect, useMemo, useState } from "react";
import "./AttendancePage.css";

type Track = "STEAM ONE" | "STEAM TWO" | "STEAM THREE";
type SessionType = "Live Class" | "Workshop" | "Webinar";
type SessionStatus = "Upcoming" | "Live" | "Completed";

type AttendanceMark = "Present" | "Late" | "Absent" | "Excused";

type Learner = {
  id: string;
  name: string;
  email: string;
  track: Track;
  mark: AttendanceMark;
};

type Session = {
  id: string;
  title: string;
  type: SessionType;
  track: Track;
  status: SessionStatus;
  facilitator: string;
  startTime: string; // text for now
  durationMins: number;
  meetingLink: string;
  expectedCount: number;
  attendedCount: number;
  notes: string;
  roster: Learner[];
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

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const pct = (a: number, b: number) => (b ? clamp(Math.round((a / b) * 100), 0, 100) : 0);

function uid(prefix = "att") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function normalize(q: string) {
  return q.trim().toLowerCase();
}

export default function AttendancePage() {
  // Nigeria time
  const [lagosNow, setLagosNow] = useState(getLagosTimeString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Demo sessions
  const initialSessions: Session[] = useMemo(() => {
    const rosterOne: Learner[] = [
      { id: "l1", name: "Chinedu Okafor", email: "chinedu@example.com", track: "STEAM ONE", mark: "Present" },
      { id: "l2", name: "Amina Yusuf", email: "amina@example.com", track: "STEAM ONE", mark: "Late" },
      { id: "l3", name: "Blessing Eze", email: "blessing@example.com", track: "STEAM ONE", mark: "Absent" },
      { id: "l4", name: "Michael Adeyemi", email: "michael@example.com", track: "STEAM ONE", mark: "Present" },
      { id: "l5", name: "Hauwa Ibrahim", email: "hauwa@example.com", track: "STEAM ONE", mark: "Excused" },
    ];

    const rosterTwo: Learner[] = [
      { id: "l6", name: "Tunde Akinola", email: "tunde@example.com", track: "STEAM TWO", mark: "Present" },
      { id: "l7", name: "Khadija Musa", email: "khadija@example.com", track: "STEAM TWO", mark: "Present" },
      { id: "l8", name: "Samuel Nwosu", email: "samuel@example.com", track: "STEAM TWO", mark: "Absent" },
      { id: "l9", name: "Ngozi Ibe", email: "ngozi@example.com", track: "STEAM TWO", mark: "Late" },
    ];

    const rosterThree: Learner[] = [
      { id: "l10", name: "Fatima Abdullahi", email: "fatima@example.com", track: "STEAM THREE", mark: "Present" },
      { id: "l11", name: "Ifeanyi Umeh", email: "ifeanyi@example.com", track: "STEAM THREE", mark: "Present" },
      { id: "l12", name: "Grace Ojo", email: "grace@example.com", track: "STEAM THREE", mark: "Present" },
    ];

    return [
      {
        id: "s1",
        title: "Orientation: How the STEAM ONE Program Works",
        type: "Live Class",
        track: "STEAM ONE",
        status: "Completed",
        facilitator: "Facilitator Desk",
        startTime: "Apr 20, 2025 • 10:00 AM",
        durationMins: 60,
        meetingLink: "https://meet.example.com/steamone-orientation",
        expectedCount: 120,
        attendedCount: 98,
        notes: "Covered program overview, grading criteria, and project schedule.",
        roster: rosterOne,
      },
      {
        id: "s2",
        title: "Workshop: Technology Integration (Lesson Delivery)",
        type: "Workshop",
        track: "STEAM TWO",
        status: "Live",
        facilitator: "Ms. Aisha Bello",
        startTime: "Apr 24, 2025 • 11:00 AM",
        durationMins: 90,
        meetingLink: "https://meet.example.com/steamtwo-workshop",
        expectedCount: 96,
        attendedCount: 54,
        notes: "Hands-on tools, classroom workflow, and engagement strategies.",
        roster: rosterTwo,
      },
      {
        id: "s3",
        title: "Webinar: AI in Education — Ethics & Privacy",
        type: "Webinar",
        track: "STEAM THREE",
        status: "Upcoming",
        facilitator: "Platform Admin",
        startTime: "Apr 26, 2025 • 04:00 PM",
        durationMins: 75,
        meetingLink: "https://meet.example.com/steamthree-ai-webinar",
        expectedCount: 64,
        attendedCount: 0,
        notes: "Discuss bias, privacy, and responsible AI adoption in schools.",
        roster: rosterThree.map((x) => ({ ...x, mark: "Absent" as AttendanceMark })),
      },
    ];
  }, []);

  const [sessions, setSessions] = useState<Session[]>(initialSessions);

  // Filters / search
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState<"All" | Track>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | SessionStatus>("All");
  const [typeFilter, setTypeFilter] = useState<"All" | SessionType>("All");
  const [sortBy, setSortBy] = useState<"Soonest" | "Newest" | "Highest Attendance">("Soonest");

  // Date range (text, backend later)
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(search);
    let list = sessions
      .filter((s) => (q ? (s.title + " " + s.facilitator + " " + s.track).toLowerCase().includes(q) : true))
      .filter((s) => (trackFilter === "All" ? true : s.track === trackFilter))
      .filter((s) => (statusFilter === "All" ? true : s.status === statusFilter))
      .filter((s) => (typeFilter === "All" ? true : s.type === typeFilter));

    // demo: dateFrom/dateTo are not parsed, but stored for later integration
    if (sortBy === "Newest") {
      list = list.slice().sort((a, b) => (a.startTime < b.startTime ? 1 : -1));
    } else if (sortBy === "Soonest") {
      list = list.slice().sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
    } else {
      list = list.slice().sort((a, b) => pct(b.attendedCount, b.expectedCount) - pct(a.attendedCount, a.expectedCount));
    }
    return list;
  }, [sessions, search, trackFilter, statusFilter, typeFilter, sortBy]);

  // Stats
  const stats = useMemo(() => {
    const total = sessions.length;
    const upcoming = sessions.filter((x) => x.status === "Upcoming").length;
    const live = sessions.filter((x) => x.status === "Live").length;
    const completed = sessions.filter((x) => x.status === "Completed").length;
    const expected = sessions.reduce((s, x) => s + x.expectedCount, 0);
    const attended = sessions.reduce((s, x) => s + x.attendedCount, 0);
    return { total, upcoming, live, completed, expected, attended, rate: pct(attended, expected) };
  }, [sessions]);

  // Modal (take attendance)
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) ?? null,
    [sessions, activeSessionId]
  );

  const [localRoster, setLocalRoster] = useState<Learner[]>([]);
  const [localNotes, setLocalNotes] = useState("");

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const openAttendance = (s: Session) => {
    setActiveSessionId(s.id);
    // clone roster for editing
    setLocalRoster(s.roster.map((x) => ({ ...x })));
    setLocalNotes(s.notes);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const setMark = (learnerId: string, mark: AttendanceMark) => {
    setLocalRoster((prev) => prev.map((x) => (x.id === learnerId ? { ...x, mark } : x)));
  };

  const markAll = (mark: AttendanceMark) => {
    setLocalRoster((prev) => prev.map((x) => ({ ...x, mark })));
  };

  const saveAttendance = () => {
    if (!activeSession) return;
    const presentCount = localRoster.filter((x) => x.mark === "Present" || x.mark === "Late").length;

    setSessions((prev) =>
      prev.map((s) =>
        s.id !== activeSession.id
          ? s
          : {
              ...s,
              roster: localRoster,
              notes: localNotes,
              attendedCount: clamp(presentCount, 0, s.expectedCount),
            }
      )
    );

    setModalOpen(false);
    showToast("✅ Attendance saved (demo).");
  };

  const exportAttendance = (s: Session) => {
    // Demo export as simple text download
    const rows = s.roster.map((r) => `${r.name}, ${r.email}, ${r.track}, ${r.mark}`).join("\n");
    const content = `Session: ${s.title}\nTrack: ${s.track}\nTime: ${s.startTime}\n\nRoster:\n${rows}\n`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${s.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("📤 Exported attendance (demo).");
  };

  const addSessionDemo = () => {
    const newSession: Session = {
      id: uid("session"),
      title: "Live Class: Classroom Engagement Techniques",
      type: "Live Class",
      track: "STEAM ONE",
      status: "Upcoming",
      facilitator: "Facilitator Desk",
      startTime: "Apr 30, 2025 • 02:00 PM",
      durationMins: 60,
      meetingLink: "https://meet.example.com/new-session",
      expectedCount: 120,
      attendedCount: 0,
      notes: "Planned session on engagement and learner motivation.",
      roster: [
        { id: uid("lrn"), name: "Demo Learner 1", email: "demo1@example.com", track: "STEAM ONE", mark: "Absent" },
        { id: uid("lrn"), name: "Demo Learner 2", email: "demo2@example.com", track: "STEAM ONE", mark: "Absent" },
      ],
    };
    setSessions((prev) => [newSession, ...prev]);
    showToast("➕ Session added (demo).");
  };

  return (
    <div className="att">
      {/* Sidebar */}
      <aside className="attSide">
        <div className="attBrand">
          <div className="attMsLogo" aria-label="Microsoft Education logo" />
          <div className="attBrandText">
            <div className="attBrandTop">Microsoft Education</div>
            <div className="attBrandName">
              <span className="attBrandSteam">STEAM</span> <span className="attBrandOne">ONE</span>{" "}
              <span className="attBrandPlatform">Platform</span>
            </div>
          </div>
        </div>

        <div className="attSideCard">
          <div className="attSideTitle">Attendance</div>
          <div className="attSideSub">
            Track learner participation across sessions and programs. Save records for accountability.
          </div>
          <button className="attBtn attBtnPay" onClick={addSessionDemo}>
            ＋ Add Session (Demo)
          </button>
        </div>

        <nav className="attNav" aria-label="Navigation">
          <button className="attNavItem">🏠 Dashboard</button>
          <button className="attNavItem">📚 Courses</button>
          <button className="attNavItem">📝 Assignments</button>
          <button className="attNavItem active">🧍 Attendance</button>
          <button className="attNavItem">🎥 Live Sessions</button>
          <button className="attNavItem">📣 Announcements</button>
          <button className="attNavItem">📊 Reports</button>
          <button className="attNavItem">⚙ Settings</button>
        </nav>

        <div className="attSideFooter">
          <div className="attSideFooterRow">
            <span className="attDot" /> <span>Trusted by ISTE • UNESCO • PISA</span>
          </div>
          <div className="attSideFooterCopy">© 2026 STEAM ONE Platform</div>
        </div>
      </aside>

      {/* Main */}
      <section className="attMain">
        {/* Top */}
        <header className="attTop">
          <div className="attTopLeft">
            <div className="attTitle">Attendance Center</div>
            <div className="attSub">Manage session participation, records, and export attendance lists.</div>
            <div className="attTime">
              Nigeria Time: <span className="attTimeRed">{lagosNow}</span>
            </div>
          </div>

          <div className="attTopRight">
            <div className="attSearch">
              <span className="attSearchIcon">🔎</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sessions..."
                aria-label="Search sessions"
              />
            </div>

            <button className="attIconBtn" aria-label="Notifications" title="Notifications">
              🔔 <span className="attBadge">2</span>
            </button>
            <button className="attIconBtn" aria-label="Messages" title="Messages">
              ✉️
            </button>

            <button className="attUserChip" aria-label="User menu">
              <span className="attUserMiniAvatar" aria-hidden="true" />
              <span className="attUserText">
                <span className="attUserName">Facilitator Desk</span>
                <span className="attUserRole">Program Delivery</span>
              </span>
              <span className="attCaret">▾</span>
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="attStats">
          <div className="attStat">
            <div className="attStatIco">📅</div>
            <div>
              <div className="attStatLabel">Sessions</div>
              <div className="attStatValue">{stats.total}</div>
            </div>
            <div className="attStatHint">All records</div>
          </div>

          <div className="attStat">
            <div className="attStatIco">🟢</div>
            <div>
              <div className="attStatLabel">Live</div>
              <div className="attStatValue">{stats.live}</div>
            </div>
            <div className="attStatHint">In progress</div>
          </div>

          <div className="attStat">
            <div className="attStatIco">🕒</div>
            <div>
              <div className="attStatLabel">Upcoming</div>
              <div className="attStatValue">{stats.upcoming}</div>
            </div>
            <div className="attStatHint">Scheduled</div>
          </div>

          <div className="attStat">
            <div className="attStatIco">✅</div>
            <div>
              <div className="attStatLabel">Overall Rate</div>
              <div className="attStatValue">{stats.rate}%</div>
            </div>
            <div className="attStatHint">
              {stats.attended}/{stats.expected} attended
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="attCard">
          <div className="attCardHead">
            <div>
              <div className="attH3">Filters</div>
              <div className="attHint">Filter by track, session type, status, and date range (text for now).</div>
            </div>

            <div className="attCardActions">
              <button
                className="attBtn attBtnGhost"
                onClick={() => {
                  setSearch("");
                  setTrackFilter("All");
                  setStatusFilter("All");
                  setTypeFilter("All");
                  setSortBy("Soonest");
                  setDateFrom("");
                  setDateTo("");
                  showToast("Filters reset.");
                }}
              >
                Reset
              </button>
              <button className="attBtn attBtnPrimary" onClick={() => showToast("Report generation (demo).")}>
                Generate Report
              </button>
            </div>
          </div>

          <div className="attFilters">
            <label className="attSelect">
              <span>Track</span>
              <select value={trackFilter} onChange={(e) => setTrackFilter(e.target.value as any)}>
                <option value="All">All</option>
                <option value="STEAM ONE">STEAM ONE</option>
                <option value="STEAM TWO">STEAM TWO</option>
                <option value="STEAM THREE">STEAM THREE</option>
              </select>
            </label>

            <label className="attSelect">
              <span>Type</span>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}>
                <option value="All">All</option>
                <option value="Live Class">Live Class</option>
                <option value="Workshop">Workshop</option>
                <option value="Webinar">Webinar</option>
              </select>
            </label>

            <label className="attSelect">
              <span>Status</span>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                <option value="All">All</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Live">Live</option>
                <option value="Completed">Completed</option>
              </select>
            </label>

            <label className="attSelect">
              <span>Sort</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                <option value="Soonest">Soonest</option>
                <option value="Newest">Newest</option>
                <option value="Highest Attendance">Highest Attendance</option>
              </select>
            </label>

            <label className="attInput">
              <span>Date From</span>
              <input value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} placeholder="e.g., Apr 01, 2025" />
            </label>

            <label className="attInput">
              <span>Date To</span>
              <input value={dateTo} onChange={(e) => setDateTo(e.target.value)} placeholder="e.g., Apr 30, 2025" />
            </label>

            <div className="attInlineInfo">
              Showing <b>{filtered.length}</b> of <b>{sessions.length}</b>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="attList">
          {filtered.map((s) => {
            const rate = pct(s.attendedCount, s.expectedCount);
            return (
              <article className="attItem" key={s.id}>
                <div className="attItemTop">
                  <div className="attLeft">
                    <div className="attTitleRow">
                      <h4 className="attItemTitle">{s.title}</h4>
                      <span className={`attStatus ${s.status.toLowerCase()}`}>{s.status}</span>
                      <span className={`attType ${s.type.replace(" ", "").toLowerCase()}`}>{s.type}</span>
                      <span className={`attTrack ${s.track.replace(" ", "").toLowerCase()}`}>{s.track}</span>
                    </div>

                    <div className="attMeta">
                      <span>Facilitator: <b>{s.facilitator}</b></span>
                      <span className="attSep">•</span>
                      <span>Start: <b>{s.startTime}</b></span>
                      <span className="attSep">•</span>
                      <span>Duration: <b>{s.durationMins} mins</b></span>
                      <span className="attSep">•</span>
                      <span>Expected: <b>{s.expectedCount}</b></span>
                    </div>

                    <div className="attNotes">
                      <b>Notes:</b> {s.notes}
                    </div>

                    <div className="attMeetRow">
                      <span className="attMeetLabel">Meeting:</span>
                      <span className="attMeetLink">{s.meetingLink}</span>
                    </div>
                  </div>

                  <div className="attRight">
                    <div className="attRateBox" title="Attendance rate">
                      <div className="attRateTop">
                        <div className="attRateLabel">Attendance</div>
                        <div className="attRateValue">{rate}%</div>
                      </div>
                      <div className="attBar">
                        <div className="attFill" style={{ width: `${rate}%` }} />
                      </div>
                      <div className="attRateHint">
                        {s.attendedCount}/{s.expectedCount} present/late
                      </div>
                    </div>

                    <div className="attBtns">
                      <button className="attBtn attBtnGhostSmall" onClick={() => alert("Open roster view (demo)")}>
                        View
                      </button>
                      <button className="attBtn attBtnPrimarySmall" onClick={() => openAttendance(s)}>
                        Take Attendance
                      </button>
                      <button className="attBtn attBtnPaySmall" onClick={() => exportAttendance(s)}>
                        Export
                      </button>
                      <button className="attBtn attBtnDangerOutlineSmall" onClick={() => showToast("Session deleted (demo).")}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {filtered.length === 0 && <div className="attEmpty">No sessions match your search/filters.</div>}
        </div>

        <footer className="attFooter">
          <div className="attFooterLeft">
            <span className="attFooterLogo" aria-hidden="true" />
            <span>© 2026 STEAM ONE Platform. All rights reserved.</span>
          </div>
          <div className="attFooterLinks">
            <button className="attLinkBtn" onClick={() => alert("Terms (demo)")}>Terms</button>
            <button className="attLinkBtn" onClick={() => alert("Privacy (demo)")}>Privacy</button>
            <button className="attLinkBtn" onClick={() => alert("Support (demo)")}>Support</button>
          </div>
        </footer>
      </section>

      {/* Attendance Modal */}
      {modalOpen && activeSession && (
        <div className="attModalOverlay" role="dialog" aria-modal="true" aria-label="Take attendance">
          <div className="attModal">
            <div className="attModalHead">
              <div>
                <div className="attModalTitle">Take Attendance</div>
                <div className="attModalSub">
                  {activeSession.title} • {activeSession.track} • {activeSession.startTime}
                </div>
              </div>
              <button className="attModalClose" onClick={closeModal} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="attModalBody">
              <div className="attModalTools">
                <div className="attToolGroup">
                  <div className="attToolTitle">Quick Mark</div>
                  <div className="attToolBtns">
                    <button className="attBtn attBtnGhostSmall" onClick={() => markAll("Present")}>All Present</button>
                    <button className="attBtn attBtnGhostSmall" onClick={() => markAll("Late")}>All Late</button>
                    <button className="attBtn attBtnGhostSmall" onClick={() => markAll("Absent")}>All Absent</button>
                    <button className="attBtn attBtnGhostSmall" onClick={() => markAll("Excused")}>All Excused</button>
                  </div>
                </div>

                <div className="attToolGroup">
                  <div className="attToolTitle">Session Notes</div>
                  <textarea
                    className="attNotesArea"
                    value={localNotes}
                    onChange={(e) => setLocalNotes(e.target.value)}
                    rows={4}
                    placeholder="Add notes about the session..."
                  />
                </div>
              </div>

              <div className="attRoster">
                <div className="attRosterHead">
                  <div className="attRosterTitle">Roster</div>
                  <div className="attRosterMeta">
                    Expected: <b>{activeSession.expectedCount}</b> • Marked: <b>{localRoster.length}</b>
                  </div>
                </div>

                <div className="attRosterTable">
                  <div className="attRow attRowHead">
                    <div>Learner</div>
                    <div>Email</div>
                    <div>Track</div>
                    <div>Mark</div>
                  </div>

                  {localRoster.map((r) => (
                    <div className="attRow" key={r.id}>
                      <div className="attLearner">
                        <span className="attAvatar" aria-hidden="true" />
                        <span className="attLearnerText">
                          <span className="attLearnerName">{r.name}</span>
                          <span className="attLearnerSub">ID: {r.id}</span>
                        </span>
                      </div>
                      <div className="attEmail">{r.email}</div>
                      <div>
                        <span className={`attTrack ${r.track.replace(" ", "").toLowerCase()}`}>{r.track}</span>
                      </div>
                      <div className="attMarkCell">
                        <select value={r.mark} onChange={(e) => setMark(r.id, e.target.value as AttendanceMark)}>
                          <option>Present</option>
                          <option>Late</option>
                          <option>Absent</option>
                          <option>Excused</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="attModalHint">
                  Present + Late count as "attended" in stats. Backend will later calculate real totals.
                </div>
              </div>
            </div>

            <div className="attModalFoot">
              <button className="attBtn attBtnGhost" onClick={closeModal}>Cancel</button>
              <button className="attBtn attBtnPrimary" onClick={saveAttendance}>Save Attendance</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="attToast">{toast}</div>}
    </div>
  );
}