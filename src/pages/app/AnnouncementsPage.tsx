import React, { useEffect, useMemo, useState } from "react";
import "./AnnouncementsPage.css";

type Audience =
  | "All Users"
  | "Teachers"
  | "Facilitators"
  | "Admins"
  | "STEAM ONE"
  | "STEAM TWO"
  | "STEAM THREE";

type Status = "Published" | "Draft" | "Scheduled";

type Priority = "Normal" | "High" | "Urgent";

type Announcement = {
  id: string;
  title: string;
  message: string;
  audience: Audience;
  status: Status;
  priority: Priority;
  author: string;
  createdAt: string;
  scheduledFor?: string;
  readRate: number; // %
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

function uid(prefix = "ann") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function AnnouncementsPage() {
  // Nigeria time
  const [lagosNow, setLagosNow] = useState<string>(getLagosTimeString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Demo announcements
  const initialAnnouncements: Announcement[] = useMemo(
    () => [
      {
        id: "a1",
        title: "Week 2: Project Guidance & Rubrics",
        message:
          "Please review the Week 2 project rubric. Submit your deliverables before the deadline. Use the resources section for templates and examples.",
        audience: "All Users",
        status: "Published",
        priority: "High",
        author: "Admin Team",
        createdAt: "Apr 24, 2025 • 10:15 AM",
        readRate: 78,
      },
      {
        id: "a2",
        title: "STEAM TWO: Required Tools Checklist",
        message:
          "Ensure you have access to a laptop, stable internet, and the recommended classroom tools. A checklist is available in Resources.",
        audience: "STEAM TWO",
        status: "Published",
        priority: "Normal",
        author: "Facilitator Desk",
        createdAt: "Apr 23, 2025 • 4:05 PM",
        readRate: 66,
      },
      {
        id: "a3",
        title: "Live Session Reminder: Tech Tools for Teaching",
        message:
          "Our live class is scheduled for Saturday. Please join early for onboarding and attendance.",
        audience: "Teachers",
        status: "Scheduled",
        priority: "Normal",
        author: "Facilitator Desk",
        createdAt: "Apr 22, 2025 • 1:10 PM",
        scheduledFor: "Apr 26, 2025 • 10:00 AM",
        readRate: 0,
      },
      {
        id: "a4",
        title: "Platform Maintenance Window",
        message:
          "We will perform maintenance to improve performance and security. Some features may be unavailable during the window.",
        audience: "All Users",
        status: "Draft",
        priority: "Urgent",
        author: "Platform Ops",
        createdAt: "Apr 21, 2025 • 9:25 AM",
        readRate: 0,
      },
    ],
    []
  );

  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);

  // Search & filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All");
  const [audienceFilter, setAudienceFilter] = useState<"All" | Audience>("All");
  const [priorityFilter, setPriorityFilter] = useState<"All" | Priority>("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return announcements
      .filter((a) => (q ? (a.title + " " + a.message).toLowerCase().includes(q) : true))
      .filter((a) => (statusFilter === "All" ? true : a.status === statusFilter))
      .filter((a) => (audienceFilter === "All" ? true : a.audience === audienceFilter))
      .filter((a) => (priorityFilter === "All" ? true : a.priority === priorityFilter))
      .sort((x, y) => (x.createdAt < y.createdAt ? 1 : -1));
  }, [announcements, search, statusFilter, audienceFilter, priorityFilter]);

  // Modal (create/edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formAudience, setFormAudience] = useState<Audience>("All Users");
  const [formPriority, setFormPriority] = useState<Priority>("Normal");
  const [formStatus, setFormStatus] = useState<Status>("Published");
  const [formScheduledFor, setFormScheduledFor] = useState("");

  const [toast, setToast] = useState<string | null>(null);

  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    setFormTitle("");
    setFormMessage("");
    setFormAudience("All Users");
    setFormPriority("Normal");
    setFormStatus("Published");
    setFormScheduledFor("");
    setModalOpen(true);
  };

  const openEdit = (a: Announcement) => {
    setMode("edit");
    setEditingId(a.id);
    setFormTitle(a.title);
    setFormMessage(a.message);
    setFormAudience(a.audience);
    setFormPriority(a.priority);
    setFormStatus(a.status);
    setFormScheduledFor(a.scheduledFor ?? "");
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const validateForm = () => {
    if (!formTitle.trim()) return "Title is required.";
    if (formTitle.trim().length < 6) return "Title must be at least 6 characters.";
    if (!formMessage.trim()) return "Message is required.";
    if (formMessage.trim().length < 20) return "Message must be at least 20 characters.";
    if (formStatus === "Scheduled" && !formScheduledFor.trim()) {
      return "Scheduled time is required for Scheduled announcements.";
    }
    return null;
  };

  const saveAnnouncement = () => {
    const err = validateForm();
    if (err) return showToast(err);

    const nowLabel = new Intl.DateTimeFormat("en-NG", {
      timeZone: "Africa/Lagos",
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(new Date());

    const timeLabel = new Intl.DateTimeFormat("en-NG", {
      timeZone: "Africa/Lagos",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date());

    if (mode === "create") {
      const newItem: Announcement = {
        id: uid(),
        title: formTitle.trim(),
        message: formMessage.trim(),
        audience: formAudience,
        priority: formPriority,
        status: formStatus,
        author: "Admin Team",
        createdAt: `${nowLabel} • ${timeLabel}`,
        scheduledFor: formStatus === "Scheduled" ? formScheduledFor.trim() : undefined,
        readRate: 0,
      };
      setAnnouncements((prev) => [newItem, ...prev]);
      closeModal();
      showToast("✅ Announcement created (demo).");
      return;
    }

    // edit
    if (!editingId) return;
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id !== editingId
          ? a
          : {
              ...a,
              title: formTitle.trim(),
              message: formMessage.trim(),
              audience: formAudience,
              priority: formPriority,
              status: formStatus,
              scheduledFor: formStatus === "Scheduled" ? formScheduledFor.trim() : undefined,
            }
      )
    );
    closeModal();
    showToast("✅ Announcement updated (demo).");
  };

  const deleteAnnouncement = (id: string) => {
    // replace confirm with your modal later
    const ok = window.confirm("Delete this announcement?");
    if (!ok) return;
    setAnnouncements((prev) => prev.filter((x) => x.id !== id));
    showToast("🗑️ Announcement deleted (demo).");
  };

  const duplicateAnnouncement = (a: Announcement) => {
    const copy: Announcement = {
      ...a,
      id: uid("copy"),
      title: `${a.title} (Copy)`,
      status: "Draft",
      createdAt: a.createdAt,
      readRate: 0,
      scheduledFor: undefined,
    };
    setAnnouncements((prev) => [copy, ...prev]);
    showToast("📄 Duplicated as Draft (demo).");
  };

  const publishNow = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Published", scheduledFor: undefined } : a))
    );
    showToast("🚀 Published (demo).");
  };

  const bumpReadRate = (id: string) => {
    // purely demo interaction
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, readRate: clamp(a.readRate + 6, 0, 100) } : a
      )
    );
    showToast("📈 Read-rate updated (demo).");
  };

  const statusCounts = useMemo(() => {
    const all = announcements.length;
    const published = announcements.filter((x) => x.status === "Published").length;
    const draft = announcements.filter((x) => x.status === "Draft").length;
    const scheduled = announcements.filter((x) => x.status === "Scheduled").length;
    return { all, published, draft, scheduled };
  }, [announcements]);

  return (
    <div className="ann">
      {/* Sidebar */}
      <aside className="annSide">
        <div className="annBrand">
          <div className="annMsLogo" aria-label="Microsoft Education logo" />
          <div className="annBrandText">
            <div className="annBrandTop">Microsoft Education</div>
            <div className="annBrandName">
              <span className="annBrandSteam">STEAM</span> <span className="annBrandOne">ONE</span>{" "}
              <span className="annBrandPlatform">Platform</span>
            </div>
          </div>
        </div>

        <div className="annSideCard">
          <div className="annSideTitle">Announcements</div>
          <div className="annSideSub">
            Create and manage platform updates for teachers, facilitators, and learners.
          </div>
          <button className="annBtn annBtnPay" onClick={openCreate}>
            ＋ Create Announcement
          </button>
        </div>

        <nav className="annNav" aria-label="Navigation">
          <button className="annNavItem">🏠 Dashboard</button>
          <button className="annNavItem">👥 Users</button>
          <button className="annNavItem">📚 Courses</button>
          <button className="annNavItem active">📣 Announcements</button>
          <button className="annNavItem">💳 Payments</button>
          <button className="annNavItem">📊 Reports</button>
          <button className="annNavItem">🧾 Audit Logs</button>
          <button className="annNavItem">⚙ Settings</button>
        </nav>

        <div className="annSideFooter">
          <div className="annSideFooterRow">
            <span className="annDot" /> <span>Trusted by ISTE • UNESCO • PISA</span>
          </div>
          <div className="annSideFooterCopy">© 2026 STEAM ONE Platform</div>
        </div>
      </aside>

      {/* Main */}
      <section className="annMain">
        {/* Topbar */}
        <header className="annTop">
          <div className="annTopLeft">
            <div className="annTitle">Announcements Center</div>
            <div className="annSub">
              Publish updates, reminders, and learning guidance across STEAM ONE Platform.
            </div>
            <div className="annTime">
              Nigeria Time: <span className="annTimeRed">{lagosNow}</span>
            </div>
          </div>

          <div className="annTopRight">
            <div className="annSearch">
              <span className="annSearchIcon">🔎</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search announcements..."
                aria-label="Search announcements"
              />
            </div>

            <button className="annIconBtn" aria-label="Notifications" title="Notifications">
              🔔 <span className="annBadge">4</span>
            </button>
            <button className="annIconBtn" aria-label="Messages" title="Messages">
              ✉️
            </button>

            <button className="annUserChip" aria-label="User menu">
              <span className="annUserMiniAvatar" aria-hidden="true" />
              <span className="annUserText">
                <span className="annUserName">Admin Team</span>
                <span className="annUserRole">Platform Admin</span>
              </span>
              <span className="annCaret">▾</span>
            </button>
          </div>
        </header>

        {/* Summary */}
        <div className="annStats">
          <div className="annStat">
            <div className="annStatIco">📣</div>
            <div>
              <div className="annStatLabel">All</div>
              <div className="annStatValue">{statusCounts.all}</div>
            </div>
            <div className="annStatHint">Total items</div>
          </div>

          <div className="annStat">
            <div className="annStatIco">✅</div>
            <div>
              <div className="annStatLabel">Published</div>
              <div className="annStatValue">{statusCounts.published}</div>
            </div>
            <div className="annStatHint">Visible to audience</div>
          </div>

          <div className="annStat">
            <div className="annStatIco">📝</div>
            <div>
              <div className="annStatLabel">Draft</div>
              <div className="annStatValue">{statusCounts.draft}</div>
            </div>
            <div className="annStatHint">Not visible yet</div>
          </div>

          <div className="annStat">
            <div className="annStatIco">🕒</div>
            <div>
              <div className="annStatLabel">Scheduled</div>
              <div className="annStatValue">{statusCounts.scheduled}</div>
            </div>
            <div className="annStatHint">Will publish later</div>
          </div>
        </div>

        {/* Filters */}
        <div className="annCard">
          <div className="annCardHead">
            <div>
              <div className="annH3">Filter & Manage</div>
              <div className="annHint">Use filters to focus on a specific audience or status.</div>
            </div>
            <div className="annCardActions">
              <button className="annBtn annBtnGhost" onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setAudienceFilter("All");
                setPriorityFilter("All");
                showToast("Filters reset.");
              }}>
                Reset Filters
              </button>
              <button className="annBtn annBtnPrimary" onClick={openCreate}>
                ＋ New Announcement
              </button>
            </div>
          </div>

          <div className="annFilters">
            <label className="annSelect">
              <span>Status</span>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                <option value="All">All</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </label>

            <label className="annSelect">
              <span>Audience</span>
              <select value={audienceFilter} onChange={(e) => setAudienceFilter(e.target.value as any)}>
                <option value="All">All</option>
                <option value="All Users">All Users</option>
                <option value="Teachers">Teachers</option>
                <option value="Facilitators">Facilitators</option>
                <option value="Admins">Admins</option>
                <option value="STEAM ONE">STEAM ONE</option>
                <option value="STEAM TWO">STEAM TWO</option>
                <option value="STEAM THREE">STEAM THREE</option>
              </select>
            </label>

            <label className="annSelect">
              <span>Priority</span>
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as any)}>
                <option value="All">All</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </label>

            <div className="annInlineInfo">
              Showing <b>{filtered.length}</b> of <b>{announcements.length}</b>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="annList">
          {filtered.map((a) => (
            <article className="annItem" key={a.id}>
              <div className="annItemTop">
                <div className="annItemLeft">
                  <div className="annItemTitleRow">
                    <h4 className="annItemTitle">{a.title}</h4>
                    <span className={`annPriority ${a.priority.toLowerCase()}`}>{a.priority}</span>
                    <span className={`annStatus ${a.status.toLowerCase()}`}>{a.status}</span>
                  </div>

                  <div className="annMeta">
                    <span className="annPill">{a.audience}</span>
                    <span className="annMetaSep">•</span>
                    <span>Author: <b>{a.author}</b></span>
                    <span className="annMetaSep">•</span>
                    <span>Created: <b>{a.createdAt}</b></span>
                    {a.status === "Scheduled" && a.scheduledFor && (
                      <>
                        <span className="annMetaSep">•</span>
                        <span>Scheduled: <b>{a.scheduledFor}</b></span>
                      </>
                    )}
                  </div>
                </div>

                <div className="annItemRight">
                  <div className="annReadBox" title="Read rate (demo)">
                    <div className="annReadLabel">Read</div>
                    <div className="annReadValue">{a.readRate}%</div>
                    <div className="annReadBar">
                      <div className="annReadFill" style={{ width: `${a.readRate}%` }} />
                    </div>
                  </div>

                  <div className="annBtns">
                    <button className="annBtn annBtnGhostSmall" onClick={() => openEdit(a)}>
                      Edit
                    </button>

                    <button className="annBtn annBtnGhostSmall" onClick={() => duplicateAnnouncement(a)}>
                      Duplicate
                    </button>

                    {a.status !== "Published" && (
                      <button className="annBtn annBtnPrimarySmall" onClick={() => publishNow(a.id)}>
                        Publish
                      </button>
                    )}

                    <button className="annBtn annBtnPaySmall" onClick={() => bumpReadRate(a.id)}>
                      Update Read
                    </button>

                    <button className="annBtn annBtnDangerSmall" onClick={() => deleteAnnouncement(a.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <p className="annMsg">{a.message}</p>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="annEmpty">
              No announcements match your search/filters.
            </div>
          )}
        </div>

        <div className="annLoadMoreRow">
          <button className="annBtn annBtnGhost" onClick={() => alert("Load more (demo)")}>
            Load More
          </button>
        </div>

        {/* Footer */}
        <footer className="annFooter">
          <div className="annFooterLeft">
            <span className="annFooterLogo" aria-hidden="true" />
            <span>© 2026 STEAM ONE Platform. All rights reserved.</span>
          </div>
          <div className="annFooterLinks">
            <button className="annLinkBtn" onClick={() => alert("Terms (demo)")}>Terms of Service</button>
            <button className="annLinkBtn" onClick={() => alert("Privacy (demo)")}>Privacy Policy</button>
            <button className="annLinkBtn" onClick={() => alert("Support (demo)")}>Support</button>
          </div>
        </footer>
      </section>

      {/* Modal */}
      {modalOpen && (
        <div className="annModalOverlay" role="dialog" aria-modal="true" aria-label="Announcement modal">
          <div className="annModal">
            <div className="annModalHead">
              <div>
                <div className="annModalTitle">
                  {mode === "create" ? "Create Announcement" : "Edit Announcement"}
                </div>
                <div className="annModalSub">
                  Target the right audience and choose status (Draft/Published/Scheduled).
                </div>
              </div>
              <button className="annModalClose" onClick={closeModal} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="annModalBody">
              <label className="annField">
                <span>Title</span>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Week 2 project guidance"
                />
              </label>

              <label className="annField">
                <span>Message</span>
                <textarea
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Write a clear announcement message..."
                  rows={6}
                />
              </label>

              <div className="annRow3">
                <label className="annField">
                  <span>Audience</span>
                  <select value={formAudience} onChange={(e) => setFormAudience(e.target.value as Audience)}>
                    <option>All Users</option>
                    <option>Teachers</option>
                    <option>Facilitators</option>
                    <option>Admins</option>
                    <option>STEAM ONE</option>
                    <option>STEAM TWO</option>
                    <option>STEAM THREE</option>
                  </select>
                </label>

                <label className="annField">
                  <span>Priority</span>
                  <select value={formPriority} onChange={(e) => setFormPriority(e.target.value as Priority)}>
                    <option>Normal</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </label>

                <label className="annField">
                  <span>Status</span>
                  <select value={formStatus} onChange={(e) => setFormStatus(e.target.value as Status)}>
                    <option>Published</option>
                    <option>Draft</option>
                    <option>Scheduled</option>
                  </select>
                </label>
              </div>

              {formStatus === "Scheduled" && (
                <label className="annField">
                  <span>Scheduled For (text for now)</span>
                  <input
                    value={formScheduledFor}
                    onChange={(e) => setFormScheduledFor(e.target.value)}
                    placeholder="e.g., Apr 26, 2025 • 10:00 AM"
                  />
                  <div className="annMiniHint">
                    Backend will later save real datetime. For now we store as text.
                  </div>
                </label>
              )}

              <div className="annPreview">
                <div className="annPreviewTitle">Preview</div>
                <div className="annPreviewCard">
                  <div className="annPreviewTop">
                    <div className="annPreviewH">{formTitle || "Announcement title..."}</div>
                    <div className="annPreviewChips">
                      <span className="annPill">{formAudience}</span>
                      <span className={`annPriority ${formPriority.toLowerCase()}`}>{formPriority}</span>
                      <span className={`annStatus ${formStatus.toLowerCase()}`}>{formStatus}</span>
                    </div>
                  </div>
                  <div className="annPreviewMsg">{formMessage || "Write your message here..."}</div>
                </div>
              </div>
            </div>

            <div className="annModalFoot">
              <button className="annBtn annBtnGhost" onClick={closeModal}>
                Cancel
              </button>
              <button className="annBtn annBtnPrimary" onClick={saveAnnouncement}>
                {mode === "create" ? "Create" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="annToast">{toast}</div>}
    </div>
  );
}