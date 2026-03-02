import React, { useEffect, useMemo, useState } from "react";
import "./FacilitatorDashboard.css";

type TaskStatus = "Open" | "In Review" | "Approved" | "Rejected";
type SessionStatus = "Scheduled" | "Live" | "Completed";

type Stat = { label: string; value: string; icon: string; hint?: string };
type Course = {
  id: string;
  title: string;
  level: "STEAM ONE" | "STEAM TWO" | "STEAM THREE";
  learners: number;
  progress: number; // 0..100
  status: "Active" | "Draft" | "Paused";
};
type ReviewTask = {
  id: string;
  title: string;
  course: string;
  submittedBy: string;
  due: string;
  status: TaskStatus;
};
type Session = {
  id: string;
  title: string;
  date: string;
  time: string;
  status: SessionStatus;
};
type Student = {
  id: string;
  name: string;
  track: "STEAM ONE" | "STEAM TWO" | "STEAM THREE";
  attendance: number; // %
  lastActive: string;
};
type Announcement = {
  id: string;
  title: string;
  audience: string;
  date: string;
};

const formatNaira = (n: number) =>
  "₦" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

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

export default function FacilitatorDashboard() {
  // Mock facilitator profile (replace from auth later)
  const facilitator = useMemo(
    () => ({
      name: "Ms. Aisha Bello",
      role: "Facilitator • Program Delivery",
      verified: true,
      region: "Nigeria",
    }),
    []
  );

  // Nigeria time
  const [lagosNow, setLagosNow] = useState<string>(getLagosTimeString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Top stats
  const stats: Stat[] = useMemo(
    () => [
      { label: "Active Cohorts", value: "3", icon: "👥", hint: "Cohorts running now" },
      { label: "Learners Supported", value: "286", icon: "🎓", hint: "Across all tracks" },
      { label: "Submissions To Review", value: "19", icon: "📝", hint: "Needs your action" },
      { label: "Upcoming Sessions", value: "5", icon: "📅", hint: "This week" },
    ],
    []
  );

  // Courses/cohorts
  const courses: Course[] = useMemo(
    () => [
      { id: "c1", title: "Digital Teaching Foundations", level: "STEAM ONE", learners: 124, progress: 72, status: "Active" },
      { id: "c2", title: "Technology Integration Practicum", level: "STEAM TWO", learners: 98, progress: 55, status: "Active" },
      { id: "c3", title: "AI & Robotics Masterclass", level: "STEAM THREE", learners: 64, progress: 18, status: "Draft" },
    ],
    []
  );

  // Review queue
  const reviewTasks: ReviewTask[] = useMemo(
    () => [
      { id: "r1", title: "Module 2: Lesson Plan Upload", course: "STEAM ONE", submittedBy: "Chinwe Okafor", due: "Apr 26, 2025", status: "In Review" },
      { id: "r2", title: "Quiz: Classroom Tech Basics", course: "STEAM TWO", submittedBy: "David Adeyemi", due: "Apr 25, 2025", status: "Open" },
      { id: "r3", title: "Project: Robotics Mini Build", course: "STEAM THREE", submittedBy: "Grace Musa", due: "May 05, 2025", status: "Open" },
      { id: "r4", title: "Reflection: AI Ethics in Education", course: "STEAM THREE", submittedBy: "Samuel James", due: "May 03, 2025", status: "In Review" },
    ],
    []
  );

  // Sessions
  const sessions: Session[] = useMemo(
    () => [
      { id: "s1", title: "Live Class: Tech Tools for Teaching", date: "Apr 26, 2025", time: "10:00 AM", status: "Scheduled" },
      { id: "s2", title: "Q&A: Assessment & Rubrics", date: "Apr 30, 2025", time: "2:00 PM", status: "Scheduled" },
      { id: "s3", title: "Workshop: Robotics Lab Safety", date: "May 03, 2025", time: "11:00 AM", status: "Scheduled" },
    ],
    []
  );

  // Students roster
  const students: Student[] = useMemo(
    () => [
      { id: "u1", name: "Sophia Lee", track: "STEAM TWO", attendance: 92, lastActive: "Today" },
      { id: "u2", name: "Mark Johnson", track: "STEAM ONE", attendance: 85, lastActive: "Yesterday" },
      { id: "u3", name: "Daniel Brown", track: "STEAM THREE", attendance: 78, lastActive: "2 days ago" },
      { id: "u4", name: "Fatima Sani", track: "STEAM TWO", attendance: 88, lastActive: "Today" },
    ],
    []
  );

  // Announcements
  const announcements: Announcement[] = useMemo(
    () => [
      { id: "a1", title: "Week 2: Project Guidance & Rubrics", audience: "All Learners", date: "Apr 22, 2025" },
      { id: "a2", title: "STEAM TWO: Required Tools Checklist", audience: "STEAM TWO", date: "Apr 21, 2025" },
      { id: "a3", title: "STEAM THREE: AI Lab Orientation", audience: "STEAM THREE", date: "Apr 20, 2025" },
    ],
    []
  );

  // Earnings snapshot (demo)
  const earnings = useMemo(
    () => ({
      total: 345000,
      pending: 75000,
      paid: 270000,
      changePct: 12.5,
    }),
    []
  );

  // Search / filters (UI only)
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState<"All" | "STEAM ONE" | "STEAM TWO" | "STEAM THREE">("All");

  const filteredStudents = useMemo(() => {
    const s = search.trim().toLowerCase();
    return students.filter((x) => {
      const okTrack = trackFilter === "All" ? true : x.track === trackFilter;
      const okSearch = s ? x.name.toLowerCase().includes(s) : true;
      return okTrack && okSearch;
    });
  }, [students, search, trackFilter]);

  // Actions (demo placeholders)
  const onQuickAction = (key: string) => alert(`${key} (demo)`);
  const onTaskAction = (id: string, action: "Approve" | "Reject" | "Open") =>
    alert(`${action} task ${id} (demo)`);
  const onSessionAction = (id: string, action: "Start" | "Join" | "Reschedule") =>
    alert(`${action} session ${id} (demo)`);

  return (
    <div className="fdb">
      {/* Sidebar */}
      <aside className="fdbSide">
        <div className="fdbBrand">
          <div className="fdbMsLogo" aria-label="Microsoft Education logo" />
          <div className="fdbBrandText">
            <div className="fdbBrandTop">Microsoft Education</div>
            <div className="fdbBrandName">
              <span className="fdbBrandSteam">STEAM</span> <span className="fdbBrandOne">ONE</span>{" "}
              <span className="fdbBrandPlatform">Platform</span>
            </div>
          </div>
        </div>

        <div className="fdbProfile">
          <div className="fdbAvatar" aria-hidden="true" />
          <div className="fdbProfileName">{facilitator.name}</div>
          <div className="fdbProfileRole">{facilitator.role}</div>
          {facilitator.verified && <div className="fdbVerified">✔ Verified Facilitator</div>}
          <div className="fdbProfileTag">Region: {facilitator.region}</div>
        </div>

        <nav className="fdbNav" aria-label="Facilitator navigation">
          <button className="fdbNavItem active">🧭 Overview</button>
          <button className="fdbNavItem">👥 Cohorts</button>
          <button className="fdbNavItem">📚 Courses</button>
          <button className="fdbNavItem">📝 Review Queue</button>
          <button className="fdbNavItem">🎥 Live Sessions</button>
          <button className="fdbNavItem">📊 Reports</button>
          <button className="fdbNavItem">📦 Resources</button>
          <button className="fdbNavItem">📣 Announcements</button>
          <button className="fdbNavItem">💬 Messages</button>
          <button className="fdbNavItem">🗓 Calendar</button>
          <button className="fdbNavItem">💰 Earnings</button>
          <button className="fdbNavItem">⚙ Settings</button>
        </nav>

        <div className="fdbHelpCard">
          <div className="fdbHelpTitle">Facilitator Tools</div>
          <div className="fdbHelpText">Quick actions for delivery, reviews, and announcements.</div>
          <div className="fdbHelpBtns">
            <button className="fdbBtn fdbBtnPay" onClick={() => onQuickAction("Create Announcement")}>
              ＋ Announcement
            </button>
            <button className="fdbBtn fdbBtnGhost" onClick={() => onQuickAction("Open Support Tickets")}>
              Support Tickets
            </button>
          </div>
        </div>

        <div className="fdbSideFooter">
          <div className="fdbSideFooterRow">
            <span className="fdbDot" /> <span>Trusted by ISTE • UNESCO • PISA</span>
          </div>
          <div className="fdbSideFooterCopy">© 2026 STEAM ONE Platform</div>
        </div>
      </aside>

      {/* Main */}
      <section className="fdbMain">
        {/* Topbar */}
        <header className="fdbTop">
          <div className="fdbTopLeft">
            <div className="fdbWelcome">
              <div className="fdbWelcomeTitle">
                Facilitator Dashboard • <span className="fdbAccent">{facilitator.name}</span>
              </div>
              <div className="fdbWelcomeSub">Manage cohorts, review submissions, and run live sessions.</div>
            </div>
            <div className="fdbTime">
              Nigeria Time: <span className="fdbTimeRed">{lagosNow}</span>
            </div>
          </div>

          <div className="fdbTopRight">
            <div className="fdbSearch">
              <span className="fdbSearchIcon">🔎</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search learners..."
                aria-label="Search learners"
              />
            </div>

            <div className="fdbSelectWrap" aria-label="Track filter">
              <select value={trackFilter} onChange={(e) => setTrackFilter(e.target.value as any)}>
                <option value="All">All Tracks</option>
                <option value="STEAM ONE">STEAM ONE</option>
                <option value="STEAM TWO">STEAM TWO</option>
                <option value="STEAM THREE">STEAM THREE</option>
              </select>
            </div>

            <button className="fdbIconBtn" title="Notifications" aria-label="Notifications">
              🔔 <span className="fdbBadge">6</span>
            </button>
            <button className="fdbIconBtn" title="Messages" aria-label="Messages">
              ✉️
            </button>

            <button className="fdbUserChip" aria-label="User menu">
              <span className="fdbUserMiniAvatar" aria-hidden="true" />
              <span className="fdbUserText">
                <span className="fdbUserName">{facilitator.name}</span>
                <span className="fdbUserRole">Facilitator</span>
              </span>
              <span className="fdbCaret">▾</span>
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="fdbStats">
          {stats.map((s) => (
            <div className="fdbStatCard" key={s.label}>
              <div className="fdbStatIcon" aria-hidden="true">
                {s.icon}
              </div>
              <div className="fdbStatMeta">
                <div className="fdbStatLabel">{s.label}</div>
                <div className="fdbStatValue">{s.value}</div>
              </div>
              {s.hint && <div className="fdbStatHint">{s.hint}</div>}
            </div>
          ))}
        </div>

        {/* Quick Actions + Earnings */}
        <div className="fdbRow2">
          <div className="fdbCard">
            <div className="fdbCardRow">
              <h3 className="fdbH3">Quick Actions</h3>
              <button className="fdbLinkBtn" onClick={() => onQuickAction("View all actions")}>
                View All
              </button>
            </div>

            <div className="fdbQuickGrid">
              <button className="fdbQuick" onClick={() => onQuickAction("Create Live Session")}>
                <span className="fdbQuickIco">🎥</span>
                <span className="fdbQuickTitle">Create Live Session</span>
                <span className="fdbQuickSub">Schedule or go live</span>
              </button>

              <button className="fdbQuick" onClick={() => onQuickAction("Open Review Queue")}>
                <span className="fdbQuickIco">📝</span>
                <span className="fdbQuickTitle">Review Submissions</span>
                <span className="fdbQuickSub">Approve / reject tasks</span>
              </button>

              <button className="fdbQuick" onClick={() => onQuickAction("Manage Cohorts")}>
                <span className="fdbQuickIco">👥</span>
                <span className="fdbQuickTitle">Manage Cohorts</span>
                <span className="fdbQuickSub">Enrollment & progress</span>
              </button>

              <button className="fdbQuick" onClick={() => onQuickAction("Upload Resources")}>
                <span className="fdbQuickIco">📦</span>
                <span className="fdbQuickTitle">Upload Resources</span>
                <span className="fdbQuickSub">PDFs, links, templates</span>
              </button>
            </div>
          </div>

          <div className="fdbCard">
            <div className="fdbCardRow">
              <h3 className="fdbH3">Earnings Snapshot</h3>
              <button className="fdbBtn fdbBtnPrimarySmall" onClick={() => onQuickAction("View payments")}>
                View Payments
              </button>
            </div>

            <div className="fdbEarnings">
              <div className="fdbEarnBox">
                <div className="fdbEarnLabel">Total Earnings</div>
                <div className="fdbEarnValue">{formatNaira(earnings.total)}</div>
                <div className="fdbEarnHint">+{earnings.changePct}% this month</div>
              </div>

              <div className="fdbEarnSplit">
                <div className="fdbEarnMini">
                  <div className="fdbEarnMiniLabel">Pending</div>
                  <div className="fdbEarnMiniVal">{formatNaira(earnings.pending)}</div>
                </div>
                <div className="fdbEarnMini">
                  <div className="fdbEarnMiniLabel">Paid</div>
                  <div className="fdbEarnMiniVal">{formatNaira(earnings.paid)}</div>
                </div>
              </div>

              <div className="fdbEarnChart">
                <div className="fdbChartBar" style={{ height: "40%" }} />
                <div className="fdbChartBar" style={{ height: "55%" }} />
                <div className="fdbChartBar" style={{ height: "35%" }} />
                <div className="fdbChartBar" style={{ height: "70%" }} />
                <div className="fdbChartBar" style={{ height: "60%" }} />
                <div className="fdbChartBar" style={{ height: "78%" }} />
              </div>

              <div className="fdbEarnMonths">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="fdbGrid2">
          {/* Courses */}
          <div className="fdbCard">
            <div className="fdbCardRow">
              <h3 className="fdbH3">Cohorts & Courses</h3>
              <button className="fdbLinkBtn" onClick={() => onQuickAction("View courses")}>
                View All
              </button>
            </div>

            <div className="fdbCourseList">
              {courses.map((c) => (
                <div className="fdbCourse" key={c.id}>
                  <div className="fdbCourseLeft">
                    <div className="fdbCourseIcon" aria-hidden="true">📚</div>
                    <div>
                      <div className="fdbCourseTitle">{c.title}</div>
                      <div className="fdbCourseMeta">
                        <span className={`fdbPill ${c.level.replace(" ", "").toLowerCase()}`}>{c.level}</span>
                        <span className="fdbMetaText">{c.learners} learners</span>
                        <span className={`fdbStatus ${c.status.toLowerCase()}`}>{c.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="fdbCourseRight">
                    <div className="fdbProgTop">
                      <span className="fdbProgLabel">Progress</span>
                      <span className="fdbProgVal">{c.progress}%</span>
                    </div>
                    <div className="fdbProgBar">
                      <div className="fdbProgFill" style={{ width: `${c.progress}%` }} />
                    </div>
                    <div className="fdbCourseBtns">
                      <button className="fdbBtn fdbBtnGhostSmall" onClick={() => onQuickAction(`Open ${c.id}`)}>
                        Open
                      </button>
                      <button className="fdbBtn fdbBtnPaySmall" onClick={() => onQuickAction(`Manage ${c.id}`)}>
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sessions */}
          <div className="fdbCard">
            <div className="fdbCardRow">
              <h3 className="fdbH3">Live Sessions</h3>
              <button className="fdbBtn fdbBtnPrimarySmall" onClick={() => onQuickAction("Schedule session")}>
                Schedule New
              </button>
            </div>

            <div className="fdbSessions">
              {sessions.map((s) => (
                <div className="fdbSession" key={s.id}>
                  <div className="fdbSessionIcon" aria-hidden="true">🎥</div>
                  <div className="fdbSessionBody">
                    <div className="fdbSessionTitle">{s.title}</div>
                    <div className="fdbSessionMeta">
                      {s.date} • <span className="fdbStrong">{s.time}</span>
                    </div>
                    <div className={`fdbSessionTag ${s.status.toLowerCase()}`}>{s.status}</div>
                  </div>
                  <div className="fdbSessionBtns">
                    <button className="fdbBtn fdbBtnGhostSmall" onClick={() => onSessionAction(s.id, "Reschedule")}>
                      Reschedule
                    </button>
                    <button className="fdbBtn fdbBtnPaySmall" onClick={() => onSessionAction(s.id, "Start")}>
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Queue */}
          <div className="fdbCard">
            <div className="fdbCardRow">
              <h3 className="fdbH3">Review Queue</h3>
              <button className="fdbLinkBtn" onClick={() => onQuickAction("Open review queue")}>
                View All
              </button>
            </div>

            <div className="fdbTable">
              <div className="fdbTr fdbTh">
                <div>Task</div>
                <div>Submitted By</div>
                <div>Due</div>
                <div>Status</div>
                <div>Action</div>
              </div>

              {reviewTasks.map((t) => (
                <div className="fdbTr" key={t.id}>
                  <div className="fdbTdTitle">
                    <div className="fdbTaskTitle">{t.title}</div>
                    <div className="fdbTaskMeta">{t.course}</div>
                  </div>
                  <div>{t.submittedBy}</div>
                  <div>{t.due}</div>
                  <div>
                    <span className={`fdbStatus ${t.status.replace(" ", "").toLowerCase()}`}>{t.status}</span>
                  </div>
                  <div className="fdbActions">
                    <button className="fdbBtn fdbBtnGhostSmall" onClick={() => onTaskAction(t.id, "Open")}>
                      Open
                    </button>
                    <button className="fdbBtn fdbBtnPrimarySmall" onClick={() => onTaskAction(t.id, "Approve")}>
                      Approve
                    </button>
                    <button className="fdbBtn fdbBtnDangerSmall" onClick={() => onTaskAction(t.id, "Reject")}>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="fdbNotice">
              Tip: keep reviews consistent with the rubric; approvals unlock certificates (backend integration later).
            </div>
          </div>

          {/* Learners */}
          <div className="fdbCard">
            <div className="fdbCardRow">
              <h3 className="fdbH3">Learner Support</h3>
              <button className="fdbLinkBtn" onClick={() => onQuickAction("View learners")}>
                View All
              </button>
            </div>

            <div className="fdbLearners">
              {filteredStudents.map((u) => (
                <div className="fdbLearner" key={u.id}>
                  <div className="fdbLearnerAvatar" aria-hidden="true" />
                  <div className="fdbLearnerBody">
                    <div className="fdbLearnerTop">
                      <div className="fdbLearnerName">{u.name}</div>
                      <span className={`fdbPill ${u.track.replace(" ", "").toLowerCase()}`}>{u.track}</span>
                    </div>

                    <div className="fdbLearnerMeta">
                      <span>Attendance: <b>{u.attendance}%</b></span>
                      <span className="fdbDotSep">•</span>
                      <span>Last active: <b>{u.lastActive}</b></span>
                    </div>

                    <div className="fdbLearnerBtns">
                      <button className="fdbBtn fdbBtnGhostSmall" onClick={() => onQuickAction(`Message ${u.name}`)}>
                        Message
                      </button>
                      <button className="fdbBtn fdbBtnPaySmall" onClick={() => onQuickAction(`Support case for ${u.name}`)}>
                        Open Case
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredStudents.length === 0 && (
                <div className="fdbEmpty">No learners match your search/filter.</div>
              )}
            </div>
          </div>

          {/* Announcements */}
          <div className="fdbCard">
            <div className="fdbCardRow">
              <h3 className="fdbH3">Announcements</h3>
              <button className="fdbBtn fdbBtnPaySmall" onClick={() => onQuickAction("Create announcement")}>
                ＋ Create
              </button>
            </div>

            <div className="fdbAnnList">
              {announcements.map((a) => (
                <div className="fdbAnn" key={a.id}>
                  <div className="fdbAnnIcon" aria-hidden="true">📣</div>
                  <div className="fdbAnnBody">
                    <div className="fdbAnnTitle">{a.title}</div>
                    <div className="fdbAnnMeta">
                      Audience: <b>{a.audience}</b> • {a.date}
                    </div>
                  </div>
                  <button className="fdbBtn fdbBtnGhostSmall" onClick={() => onQuickAction(`Edit announcement ${a.id}`)}>
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="fdbFooter">
          <div className="fdbFooterLeft">
            <span className="fdbFooterLogo" aria-hidden="true" />
            <span>© 2026 STEAM ONE Platform. All rights reserved.</span>
          </div>
          <div className="fdbFooterLinks">
            <button className="fdbLinkBtn" onClick={() => onQuickAction("Terms")}>Terms of Service</button>
            <button className="fdbLinkBtn" onClick={() => onQuickAction("Privacy")}>Privacy Policy</button>
            <button className="fdbLinkBtn" onClick={() => onQuickAction("Support")}>Support</button>
          </div>
        </footer>
      </section>
    </div>
  );
}