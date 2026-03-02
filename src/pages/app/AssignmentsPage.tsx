import React, { useEffect, useMemo, useState } from "react";
import "./AssignmentsPage.css";

type Track = "STEAM ONE" | "STEAM TWO" | "STEAM THREE";
type Status = "Draft" | "Published" | "Closed";
type Priority = "Normal" | "High";

type Assignment = {
  id: string;
  title: string;
  description: string;
  track: Track;
  module: string;
  status: Status;
  priority: Priority;
  points: number;
  dueDate: string; // text for now (backend later)
  createdAt: string;
  author: string;

  submissionsTotal: number;
  submissionsReceived: number;
  graded: number;
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

function uid(prefix = "asg") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function pct(received: number, total: number) {
  if (!total) return 0;
  return clamp(Math.round((received / total) * 100), 0, 100);
}
function pct2(a: number, b: number) {
  if (!b) return 0;
  return clamp(Math.round((a / b) * 100), 0, 100);
}

export default function AssignmentsPage() {
  // Nigeria time
  const [lagosNow, setLagosNow] = useState(getLagosTimeString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Mock assignments
  const initial: Assignment[] = useMemo(
    () => [
      {
        id: "asg1",
        title: "Module 2: Lesson Plan Submission",
        description:
          "Upload a 40-minute lesson plan using STEAM methods. Include objectives, tools, differentiated instruction, and assessment rubric.",
        track: "STEAM ONE",
        module: "Module 2",
        status: "Published",
        priority: "High",
        points: 20,
        dueDate: "Apr 28, 2025 • 11:59 PM",
        createdAt: "Apr 20, 2025 • 10:05 AM",
        author: "Facilitator Desk",
        submissionsTotal: 120,
        submissionsReceived: 87,
        graded: 36,
      },
      {
        id: "asg2",
        title: "Classroom Technology Integration Plan",
        description:
          "Design a short technology integration plan for a topic of your choice. Include tools, usage flow, and classroom management strategy.",
        track: "STEAM TWO",
        module: "Module 1",
        status: "Published",
        priority: "Normal",
        points: 25,
        dueDate: "May 02, 2025 • 11:59 PM",
        createdAt: "Apr 18, 2025 • 3:40 PM",
        author: "Ms. Aisha Bello",
        submissionsTotal: 96,
        submissionsReceived: 44,
        graded: 14,
      },
      {
        id: "asg3",
        title: "AI Ethics Reflection (Short Essay)",
        description:
          "Write 500–700 words on responsible AI use in education. Address bias, student privacy, and assessment integrity.",
        track: "STEAM THREE",
        module: "Module 1",
        status: "Draft",
        priority: "Normal",
        points: 30,
        dueDate: "May 08, 2025 • 11:59 PM",
        createdAt: "Apr 22, 2025 • 9:12 AM",
        author: "Platform Admin",
        submissionsTotal: 64,
        submissionsReceived: 0,
        graded: 0,
      },
      {
        id: "asg4",
        title: "Quiz: Digital Tools Basics",
        description:
          "Complete the quiz and upload a screenshot of your score. Minimum pass: 70%.",
        track: "STEAM ONE",
        module: "Module 1",
        status: "Closed",
        priority: "Normal",
        points: 10,
        dueDate: "Apr 19, 2025 • 11:59 PM",
        createdAt: "Apr 12, 2025 • 8:20 AM",
        author: "Facilitator Desk",
        submissionsTotal: 120,
        submissionsReceived: 120,
        graded: 120,
      },
    ],
    []
  );

  const [assignments, setAssignments] = useState<Assignment[]>(initial);

  // Filters
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState<"All" | Track>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All");
  const [priorityFilter, setPriorityFilter] = useState<"All" | Priority>("All");
  const [sortBy, setSortBy] = useState<"Newest" | "Due Soon" | "Most Submissions">("Newest");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let arr = assignments
      .filter((a) => (q ? (a.title + " " + a.description + " " + a.module).toLowerCase().includes(q) : true))
      .filter((a) => (trackFilter === "All" ? true : a.track === trackFilter))
      .filter((a) => (statusFilter === "All" ? true : a.status === statusFilter))
      .filter((a) => (priorityFilter === "All" ? true : a.priority === priorityFilter));

    if (sortBy === "Newest") {
      arr = arr.slice().sort((x, y) => (x.createdAt < y.createdAt ? 1 : -1));
    } else if (sortBy === "Due Soon") {
      // dueDate is text; this is demo sorting by string
      arr = arr.slice().sort((x, y) => (x.dueDate > y.dueDate ? 1 : -1));
    } else if (sortBy === "Most Submissions") {
      arr = arr.slice().sort((x, y) => y.submissionsReceived - x.submissionsReceived);
    }
    return arr;
  }, [assignments, search, trackFilter, statusFilter, priorityFilter, sortBy]);

  const stats = useMemo(() => {
    const total = assignments.length;
    const published = assignments.filter((x) => x.status === "Published").length;
    const draft = assignments.filter((x) => x.status === "Draft").length;
    const closed = assignments.filter((x) => x.status === "Closed").length;

    const allSub = assignments.reduce((s, a) => s + a.submissionsTotal, 0);
    const rec = assignments.reduce((s, a) => s + a.submissionsReceived, 0);
    const grd = assignments.reduce((s, a) => s + a.graded, 0);

    return { total, published, draft, closed, allSub, rec, grd };
  }, [assignments]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [fTitle, setFTitle] = useState("");
  const [fDesc, setFDesc] = useState("");
  const [fTrack, setFTrack] = useState<Track>("STEAM ONE");
  const [fModule, setFModule] = useState("Module 1");
  const [fStatus, setFStatus] = useState<Status>("Published");
  const [fPriority, setFPriority] = useState<Priority>("Normal");
  const [fPoints, setFPoints] = useState<number>(20);
  const [fDue, setFDue] = useState("");

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    setFTitle("");
    setFDesc("");
    setFTrack("STEAM ONE");
    setFModule("Module 1");
    setFStatus("Published");
    setFPriority("Normal");
    setFPoints(20);
    setFDue("");
    setModalOpen(true);
  };

  const openEdit = (a: Assignment) => {
    setMode("edit");
    setEditingId(a.id);
    setFTitle(a.title);
    setFDesc(a.description);
    setFTrack(a.track);
    setFModule(a.module);
    setFStatus(a.status);
    setFPriority(a.priority);
    setFPoints(a.points);
    setFDue(a.dueDate);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const validate = () => {
    if (!fTitle.trim()) return "Title is required.";
    if (fTitle.trim().length < 6) return "Title must be at least 6 characters.";
    if (!fDesc.trim()) return "Description is required.";
    if (fDesc.trim().length < 25) return "Description must be at least 25 characters.";
    if (!fModule.trim()) return "Module is required.";
    if (!fDue.trim()) return "Due date is required (text for now).";
    if (!Number.isFinite(fPoints) || fPoints <= 0) return "Points must be greater than 0.";
    return null;
  };

  const nowStamp = () => {
    const d = new Date();
    const date = new Intl.DateTimeFormat("en-NG", {
      timeZone: "Africa/Lagos",
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(d);
    const time = new Intl.DateTimeFormat("en-NG", {
      timeZone: "Africa/Lagos",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(d);
    return `${date} • ${time}`;
  };

  const save = () => {
    const err = validate();
    if (err) return showToast(err);

    if (mode === "create") {
      const totalGuess =
        fTrack === "STEAM ONE" ? 120 : fTrack === "STEAM TWO" ? 96 : 64;

      const item: Assignment = {
        id: uid(),
        title: fTitle.trim(),
        description: fDesc.trim(),
        track: fTrack,
        module: fModule.trim(),
        status: fStatus,
        priority: fPriority,
        points: Math.round(fPoints),
        dueDate: fDue.trim(),
        createdAt: nowStamp(),
        author: "Facilitator Desk",
        submissionsTotal: totalGuess,
        submissionsReceived: 0,
        graded: 0,
      };
      setAssignments((prev) => [item, ...prev]);
      closeModal();
      showToast("✅ Assignment created (demo).");
      return;
    }

    if (!editingId) return;
    setAssignments((prev) =>
      prev.map((a) =>
        a.id !== editingId
          ? a
          : {
              ...a,
              title: fTitle.trim(),
              description: fDesc.trim(),
              track: fTrack,
              module: fModule.trim(),
              status: fStatus,
              priority: fPriority,
              points: Math.round(fPoints),
              dueDate: fDue.trim(),
            }
      )
    );
    closeModal();
    showToast("✅ Assignment updated (demo).");
  };

  const remove = (id: string) => {
    const ok = window.confirm("Delete this assignment?");
    if (!ok) return;
    setAssignments((prev) => prev.filter((x) => x.id !== id));
    showToast("🗑️ Deleted (demo).");
  };

  const duplicate = (a: Assignment) => {
    const copy: Assignment = {
      ...a,
      id: uid("copy"),
      title: `${a.title} (Copy)`,
      status: "Draft",
      submissionsReceived: 0,
      graded: 0,
      createdAt: nowStamp(),
      author: "Facilitator Desk",
    };
    setAssignments((prev) => [copy, ...prev]);
    showToast("📄 Duplicated as Draft (demo).");
  };

  const closeAssignment = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Closed" } : a))
    );
    showToast("🔒 Assignment closed (demo).");
  };

  const publishAssignment = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Published" } : a))
    );
    showToast("🚀 Published (demo).");
  };

  const simulateSubmission = (id: string) => {
    // demo to show progress changes
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        if (a.status !== "Published") return a;
        const next = clamp(a.submissionsReceived + 5, 0, a.submissionsTotal);
        return { ...a, submissionsReceived: next };
      })
    );
    showToast("📥 Submissions updated (demo).");
  };

  const simulateGrading = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const next = clamp(a.graded + 4, 0, a.submissionsReceived);
        return { ...a, graded: next };
      })
    );
    showToast("📝 Grading updated (demo).");
  };

  return (
    <div className="asg">
      {/* Sidebar */}
      <aside className="asgSide">
        <div className="asgBrand">
          <div className="asgMsLogo" aria-label="Microsoft Education logo" />
          <div className="asgBrandText">
            <div className="asgBrandTop">Microsoft Education</div>
            <div className="asgBrandName">
              <span className="asgBrandSteam">STEAM</span>{" "}
              <span className="asgBrandOne">ONE</span>{" "}
              <span className="asgBrandPlatform">Platform</span>
            </div>
          </div>
        </div>

        <div className="asgSideCard">
          <div className="asgSideTitle">Assignments</div>
          <div className="asgSideSub">
            Create and manage assignments for all tracks. Track submissions and grading progress.
          </div>
          <button className="asgBtn asgBtnPay" onClick={openCreate}>
            ＋ Create Assignment
          </button>
        </div>

        <nav className="asgNav" aria-label="Navigation">
          <button className="asgNavItem">🏠 Dashboard</button>
          <button className="asgNavItem">📚 Courses</button>
          <button className="asgNavItem active">📝 Assignments</button>
          <button className="asgNavItem">🎥 Live Sessions</button>
          <button className="asgNavItem">📣 Announcements</button>
          <button className="asgNavItem">📊 Reports</button>
          <button className="asgNavItem">⚙ Settings</button>
        </nav>

        <div className="asgSideFooter">
          <div className="asgSideFooterRow">
            <span className="asgDot" /> <span>Trusted by ISTE • UNESCO • PISA</span>
          </div>
          <div className="asgSideFooterCopy">© 2026 STEAM ONE Platform</div>
        </div>
      </aside>

      {/* Main */}
      <section className="asgMain">
        {/* Topbar */}
        <header className="asgTop">
          <div className="asgTopLeft">
            <div className="asgTitle">Assignments Center</div>
            <div className="asgSub">
              Plan tasks, publish to learners, and monitor submissions in one place.
            </div>
            <div className="asgTime">
              Nigeria Time: <span className="asgTimeRed">{lagosNow}</span>
            </div>
          </div>

          <div className="asgTopRight">
            <div className="asgSearch">
              <span className="asgSearchIcon">🔎</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assignments..."
                aria-label="Search assignments"
              />
            </div>

            <button className="asgIconBtn" aria-label="Notifications" title="Notifications">
              🔔 <span className="asgBadge">5</span>
            </button>
            <button className="asgIconBtn" aria-label="Messages" title="Messages">
              ✉️
            </button>

            <button className="asgUserChip" aria-label="User menu">
              <span className="asgUserMiniAvatar" aria-hidden="true" />
              <span className="asgUserText">
                <span className="asgUserName">Facilitator Desk</span>
                <span className="asgUserRole">Program Delivery</span>
              </span>
              <span className="asgCaret">▾</span>
            </button>
          </div>
        </header>

        {/* Summary */}
        <div className="asgStats">
          <div className="asgStat">
            <div className="asgStatIco">📝</div>
            <div>
              <div className="asgStatLabel">Total</div>
              <div className="asgStatValue">{stats.total}</div>
            </div>
            <div className="asgStatHint">All assignments</div>
          </div>

          <div className="asgStat">
            <div className="asgStatIco">🚀</div>
            <div>
              <div className="asgStatLabel">Published</div>
              <div className="asgStatValue">{stats.published}</div>
            </div>
            <div className="asgStatHint">Visible to learners</div>
          </div>

          <div className="asgStat">
            <div className="asgStatIco">🧾</div>
            <div>
              <div className="asgStatLabel">Draft</div>
              <div className="asgStatValue">{stats.draft}</div>
            </div>
            <div className="asgStatHint">Not visible yet</div>
          </div>

          <div className="asgStat">
            <div className="asgStatIco">✅</div>
            <div>
              <div className="asgStatLabel">Graded</div>
              <div className="asgStatValue">{stats.grd}</div>
            </div>
            <div className="asgStatHint">Across all tasks</div>
          </div>
        </div>

        {/* Filters */}
        <div className="asgCard">
          <div className="asgCardHead">
            <div>
              <div className="asgH3">Filter & Sort</div>
              <div className="asgHint">Find assignments by track, status, priority, or due date.</div>
            </div>

            <div className="asgCardActions">
              <button
                className="asgBtn asgBtnGhost"
                onClick={() => {
                  setSearch("");
                  setTrackFilter("All");
                  setStatusFilter("All");
                  setPriorityFilter("All");
                  setSortBy("Newest");
                  showToast("Filters reset.");
                }}
              >
                Reset
              </button>
              <button className="asgBtn asgBtnPrimary" onClick={openCreate}>
                ＋ New Assignment
              </button>
            </div>
          </div>

          <div className="asgFilters">
            <label className="asgSelect">
              <span>Track</span>
              <select value={trackFilter} onChange={(e) => setTrackFilter(e.target.value as any)}>
                <option value="All">All</option>
                <option value="STEAM ONE">STEAM ONE</option>
                <option value="STEAM TWO">STEAM TWO</option>
                <option value="STEAM THREE">STEAM THREE</option>
              </select>
            </label>

            <label className="asgSelect">
              <span>Status</span>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                <option value="All">All</option>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Closed">Closed</option>
              </select>
            </label>

            <label className="asgSelect">
              <span>Priority</span>
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as any)}>
                <option value="All">All</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </select>
            </label>

            <label className="asgSelect">
              <span>Sort</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                <option value="Newest">Newest</option>
                <option value="Due Soon">Due Soon</option>
                <option value="Most Submissions">Most Submissions</option>
              </select>
            </label>

            <div className="asgInlineInfo">
              Showing <b>{filtered.length}</b> of <b>{assignments.length}</b>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="asgList">
          {filtered.map((a) => {
            const subPct = pct(a.submissionsReceived, a.submissionsTotal);
            const gradePct = pct2(a.graded, Math.max(1, a.submissionsReceived));
            return (
              <article className="asgItem" key={a.id}>
                <div className="asgItemTop">
                  <div className="asgItemLeft">
                    <div className="asgTitleRow">
                      <h4 className="asgItemTitle">{a.title}</h4>
                      <span className={`asgPriority ${a.priority.toLowerCase()}`}>{a.priority}</span>
                      <span className={`asgStatus ${a.status.toLowerCase()}`}>{a.status}</span>
                    </div>

                    <div className="asgMeta">
                      <span className={`asgTrack ${a.track.replace(" ", "").toLowerCase()}`}>{a.track}</span>
                      <span className="asgMetaSep">•</span>
                      <span><b>{a.module}</b></span>
                      <span className="asgMetaSep">•</span>
                      <span>Points: <b>{a.points}</b></span>
                      <span className="asgMetaSep">•</span>
                      <span>Due: <b>{a.dueDate}</b></span>
                    </div>

                    <p className="asgDesc">{a.description}</p>

                    <div className="asgBy">
                      Created by <b>{a.author}</b> • {a.createdAt}
                    </div>
                  </div>

                  <div className="asgItemRight">
                    <div className="asgStatBox">
                      <div className="asgBoxHead">
                        <div className="asgBoxTitle">Submissions</div>
                        <div className="asgBoxVal">
                          {a.submissionsReceived}/{a.submissionsTotal}
                        </div>
                      </div>
                      <div className="asgBar">
                        <div className="asgFill" style={{ width: `${subPct}%` }} />
                      </div>
                      <div className="asgBoxHint">{subPct}% received</div>
                    </div>

                    <div className="asgStatBox">
                      <div className="asgBoxHead">
                        <div className="asgBoxTitle">Grading</div>
                        <div className="asgBoxVal">
                          {a.graded}/{a.submissionsReceived || 0}
                        </div>
                      </div>
                      <div className="asgBar">
                        <div className="asgFill2" style={{ width: `${gradePct}%` }} />
                      </div>
                      <div className="asgBoxHint">{gradePct}% graded</div>
                    </div>

                    <div className="asgBtns">
                      <button className="asgBtn asgBtnGhostSmall" onClick={() => alert("Open details (demo)")}>
                        View
                      </button>
                      <button className="asgBtn asgBtnGhostSmall" onClick={() => openEdit(a)}>
                        Edit
                      </button>
                      <button className="asgBtn asgBtnGhostSmall" onClick={() => duplicate(a)}>
                        Duplicate
                      </button>

                      {a.status !== "Published" && (
                        <button className="asgBtn asgBtnPrimarySmall" onClick={() => publishAssignment(a.id)}>
                          Publish
                        </button>
                      )}

                      {a.status === "Published" && (
                        <button className="asgBtn asgBtnPaySmall" onClick={() => simulateSubmission(a.id)}>
                          + Submissions
                        </button>
                      )}

                      <button className="asgBtn asgBtnPaySmall" onClick={() => simulateGrading(a.id)}>
                        + Grading
                      </button>

                      {a.status !== "Closed" && (
                        <button className="asgBtn asgBtnDangerSmall" onClick={() => closeAssignment(a.id)}>
                          Close
                        </button>
                      )}

                      <button className="asgBtn asgBtnDangerOutlineSmall" onClick={() => remove(a.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {filtered.length === 0 && (
            <div className="asgEmpty">No assignments match your search/filters.</div>
          )}
        </div>

        <footer className="asgFooter">
          <div className="asgFooterLeft">
            <span className="asgFooterLogo" aria-hidden="true" />
            <span>© 2026 STEAM ONE Platform. All rights reserved.</span>
          </div>
          <div className="asgFooterLinks">
            <button className="asgLinkBtn" onClick={() => alert("Terms (demo)")}>Terms</button>
            <button className="asgLinkBtn" onClick={() => alert("Privacy (demo)")}>Privacy</button>
            <button className="asgLinkBtn" onClick={() => alert("Support (demo)")}>Support</button>
          </div>
        </footer>
      </section>

      {/* Modal */}
      {modalOpen && (
        <div className="asgModalOverlay" role="dialog" aria-modal="true" aria-label="Assignment modal">
          <div className="asgModal">
            <div className="asgModalHead">
              <div>
                <div className="asgModalTitle">
                  {mode === "create" ? "Create Assignment" : "Edit Assignment"}
                </div>
                <div className="asgModalSub">
                  Set track, module, points, and due date. Status controls visibility.
                </div>
              </div>
              <button className="asgModalClose" onClick={closeModal} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="asgModalBody">
              <label className="asgField">
                <span>Title</span>
                <input value={fTitle} onChange={(e) => setFTitle(e.target.value)} placeholder="Assignment title" />
              </label>

              <label className="asgField">
                <span>Description</span>
                <textarea
                  value={fDesc}
                  onChange={(e) => setFDesc(e.target.value)}
                  placeholder="Write clear instructions, rubric expectations, file formats..."
                  rows={6}
                />
              </label>

              <div className="asgRow4">
                <label className="asgField">
                  <span>Track</span>
                  <select value={fTrack} onChange={(e) => setFTrack(e.target.value as Track)}>
                    <option>STEAM ONE</option>
                    <option>STEAM TWO</option>
                    <option>STEAM THREE</option>
                  </select>
                </label>

                <label className="asgField">
                  <span>Module</span>
                  <input value={fModule} onChange={(e) => setFModule(e.target.value)} placeholder="Module 1" />
                </label>

                <label className="asgField">
                  <span>Status</span>
                  <select value={fStatus} onChange={(e) => setFStatus(e.target.value as Status)}>
                    <option>Published</option>
                    <option>Draft</option>
                    <option>Closed</option>
                  </select>
                </label>

                <label className="asgField">
                  <span>Priority</span>
                  <select value={fPriority} onChange={(e) => setFPriority(e.target.value as Priority)}>
                    <option>Normal</option>
                    <option>High</option>
                  </select>
                </label>
              </div>

              <div className="asgRow2">
                <label className="asgField">
                  <span>Points</span>
                  <input
                    type="number"
                    value={fPoints}
                    onChange={(e) => setFPoints(Number(e.target.value))}
                    min={1}
                  />
                </label>

                <label className="asgField">
                  <span>Due Date (text for now)</span>
                  <input
                    value={fDue}
                    onChange={(e) => setFDue(e.target.value)}
                    placeholder="e.g., May 02, 2025 • 11:59 PM"
                  />
                  <div className="asgMiniHint">
                    Backend will later store a real datetime. For now we keep it as text.
                  </div>
                </label>
              </div>

              <div className="asgPreview">
                <div className="asgPreviewTitle">Preview</div>
                <div className="asgPreviewCard">
                  <div className="asgPreviewTop">
                    <div className="asgPreviewH">{fTitle || "Assignment title..."}</div>
                    <div className="asgPreviewChips">
                      <span className={`asgTrack ${fTrack.replace(" ", "").toLowerCase()}`}>{fTrack}</span>
                      <span className={`asgPriority ${fPriority.toLowerCase()}`}>{fPriority}</span>
                      <span className={`asgStatus ${fStatus.toLowerCase()}`}>{fStatus}</span>
                    </div>
                  </div>
                  <div className="asgPreviewMeta">
                    Module: <b>{fModule || "Module 1"}</b> • Points: <b>{fPoints || 0}</b> • Due:{" "}
                    <b>{fDue || "Set due date..."}</b>
                  </div>
                  <div className="asgPreviewMsg">{fDesc || "Write instructions here..."}</div>
                </div>
              </div>
            </div>

            <div className="asgModalFoot">
              <button className="asgBtn asgBtnGhost" onClick={closeModal}>
                Cancel
              </button>
              <button className="asgBtn asgBtnPrimary" onClick={save}>
                {mode === "create" ? "Create" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="asgToast">{toast}</div>}
    </div>
  );
}