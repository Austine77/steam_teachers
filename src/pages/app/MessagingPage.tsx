import React, { useEffect, useMemo, useRef, useState } from "react";
import "./MessagingPage.css";

type Role = "Teacher" | "Facilitator" | "Admin";
type Tag = "Support" | "Learning" | "Payments" | "Recruitment";
type Presence = "Online" | "Away" | "Offline";

type Contact = {
  id: string;
  name: string;
  role: Role;
  presence: Presence;
};

type Msg = {
  id: string;
  convoId: string;
  from: "me" | "them" | "system";
  text: string;
  timeISO: string;
  attachment?: { name: string; size: string };
  read?: boolean;
};

type Convo = {
  id: string;
  contactId: string;
  title: string;
  tag: Tag;
  pinned: boolean;
  muted: boolean;
  lastTimeISO: string;
  unread: number;
};

const STORE = {
  convos: "steam_one_msg_convos_v1",
  msgs: "steam_one_msg_msgs_v1",
  selected: "steam_one_msg_selected_v1",
  role: "steam_one_msg_role_v1",
};

function uid(prefix = "ID") {
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

function fmtTime(iso: string) {
  return new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

function fmtDateShort(iso: string) {
  return new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    month: "short",
    day: "2-digit",
  }).format(new Date(iso));
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

function seedData() {
  const contacts: Contact[] = [
    { id: "C1", name: "Support Team", role: "Admin", presence: "Online" },
    { id: "C2", name: "Facilitator Grace", role: "Facilitator", presence: "Online" },
    { id: "C3", name: "Admin Desk", role: "Admin", presence: "Away" },
    { id: "C4", name: "Facilitator Daniel", role: "Facilitator", presence: "Offline" },
  ];

  const now = new Date();
  const subMin = (m: number) => new Date(now.getTime() - m * 60000).toISOString();

  const convos: Convo[] = [
    {
      id: "V1",
      contactId: "C2",
      title: "Live class questions",
      tag: "Learning",
      pinned: true,
      muted: false,
      lastTimeISO: subMin(18),
      unread: 1,
    },
    {
      id: "V2",
      contactId: "C1",
      title: "Payment verification",
      tag: "Payments",
      pinned: false,
      muted: false,
      lastTimeISO: subMin(55),
      unread: 0,
    },
    {
      id: "V3",
      contactId: "C3",
      title: "Certificate approval",
      tag: "Support",
      pinned: false,
      muted: true,
      lastTimeISO: subMin(240),
      unread: 2,
    },
    {
      id: "V4",
      contactId: "C4",
      title: "Recruiter onboarding",
      tag: "Recruitment",
      pinned: false,
      muted: false,
      lastTimeISO: subMin(980),
      unread: 0,
    },
  ];

  const msgs: Msg[] = [
    {
      id: uid("M"),
      convoId: "V1",
      from: "them",
      text: "Hello! Send your questions about today’s live class and I’ll help.",
      timeISO: subMin(22),
      read: false,
    },
    {
      id: uid("M"),
      convoId: "V1",
      from: "me",
      text: "Please, how do I submit the class assignment after the session?",
      timeISO: subMin(20),
      read: true,
    },
    {
      id: uid("M"),
      convoId: "V1",
      from: "them",
      text: "You’ll see it under Assignments → ‘Live Class Task’. Upload PDF/Doc and click Submit.",
      timeISO: subMin(18),
      read: false,
    },

    {
      id: uid("M"),
      convoId: "V2",
      from: "me",
      text: "Hi support, I made payment, how long before access is unlocked?",
      timeISO: subMin(62),
      read: true,
    },
    {
      id: uid("M"),
      convoId: "V2",
      from: "them",
      text: "Access is instant on successful payment. If not, share your transaction reference.",
      timeISO: subMin(55),
      read: true,
    },

    {
      id: uid("M"),
      convoId: "V3",
      from: "them",
      text: "Your certificate is pending verification. Ensure your profile details are complete.",
      timeISO: subMin(250),
      read: false,
    },
    {
      id: uid("M"),
      convoId: "V3",
      from: "them",
      text: "Also confirm your attendance for required live classes.",
      timeISO: subMin(240),
      read: false,
    },
  ];

  return { contacts, convos, msgs };
}

const CONTACTS = seedData().contacts;

function getContact(contactId: string) {
  return CONTACTS.find((c) => c.id === contactId) || CONTACTS[0];
}

export default function MessagingPage() {
  // Nigeria time
  const [lagosNow, setLagosNow] = useState(getLagosNowString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosNowString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Role (demo)
  const [role, setRole] = useState<Role>(() => {
    const r = localStorage.getItem(STORE.role);
    return r === "Admin" ? "Admin" : r === "Facilitator" ? "Facilitator" : "Teacher";
  });
  useEffect(() => localStorage.setItem(STORE.role, role), [role]);

  const seed = useMemo(() => seedData(), []);
  const [convos, setConvos] = useState<Convo[]>(() => loadJSON(STORE.convos, seed.convos));
  const [msgs, setMsgs] = useState<Msg[]>(() => loadJSON(STORE.msgs, seed.msgs));
  const [selectedId, setSelectedId] = useState<string>(() => localStorage.getItem(STORE.selected) || convos[0]?.id || "V1");

  useEffect(() => saveJSON(STORE.convos, convos), [convos]);
  useEffect(() => saveJSON(STORE.msgs, msgs), [msgs]);
  useEffect(() => localStorage.setItem(STORE.selected, selectedId), [selectedId]);

  const [q, setQ] = useState("");
  const [tag, setTag] = useState<Tag | "All">("All");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Compose
  const [text, setText] = useState("");
  const [attachName, setAttachName] = useState<string | null>(null);

  // New message modal
  const [newOpen, setNewOpen] = useState(false);
  const [newTo, setNewTo] = useState<string>(CONTACTS[0].id);
  const [newTag, setNewTag] = useState<Tag>("Support");
  const [newTitle, setNewTitle] = useState("");

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 1800);
  };

  const selected = useMemo(() => convos.find((c) => c.id === selectedId) || convos[0], [convos, selectedId]);
  const contact = useMemo(() => getContact(selected?.contactId), [selected]);

  const convoMsgs = useMemo(() => msgs.filter((m) => m.convoId === selected?.id).sort((a, b) => +new Date(a.timeISO) - +new Date(b.timeISO)), [msgs, selected]);

  // Auto scroll
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedId, convoMsgs.length]);

  const filteredConvos = useMemo(() => {
    const query = q.trim().toLowerCase();
    return convos
      .slice()
      .sort((a, b) => {
        // pinned first, then latest
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return +new Date(b.lastTimeISO) - +new Date(a.lastTimeISO);
      })
      .filter((c) => {
        if (tag !== "All" && c.tag !== tag) return false;
        if (showUnreadOnly && c.unread <= 0) return false;
        if (!query) return true;
        const ct = getContact(c.contactId);
        const text = `${c.title} ${c.tag} ${ct.name} ${ct.role}`.toLowerCase();
        return text.includes(query);
      });
  }, [convos, q, tag, showUnreadOnly]);

  const markRead = (convoId: string) => {
    setConvos((prev) =>
      prev.map((c) => (c.id === convoId ? { ...c, unread: 0 } : c))
    );
    setMsgs((prev) =>
      prev.map((m) => (m.convoId === convoId ? { ...m, read: true } : m))
    );
  };

  const togglePin = (convoId: string) => {
    setConvos((prev) => prev.map((c) => (c.id === convoId ? { ...c, pinned: !c.pinned } : c)));
  };

  const toggleMute = (convoId: string) => {
    setConvos((prev) => prev.map((c) => (c.id === convoId ? { ...c, muted: !c.muted } : c)));
  };

  const sendMessage = () => {
    const message = text.trim();
    if (!message && !attachName) return;

    const nowISO = new Date().toISOString();
    const m: Msg = {
      id: uid("M"),
      convoId: selected.id,
      from: "me",
      text: message || (attachName ? "Sent an attachment." : ""),
      timeISO: nowISO,
      read: true,
      attachment: attachName ? { name: attachName, size: "—" } : undefined,
    };

    setMsgs((prev) => [...prev, m]);
    setConvos((prev) =>
      prev.map((c) => (c.id === selected.id ? { ...c, lastTimeISO: nowISO } : c))
    );

    // demo auto reply (optional)
    setTimeout(() => {
      const auto: Msg = {
        id: uid("M"),
        convoId: selected.id,
        from: "them",
        text: "Received ✅. We’ll respond shortly (demo).",
        timeISO: new Date().toISOString(),
        read: false,
      };
      setMsgs((prev) => [...prev, auto]);
      setConvos((prev) =>
        prev.map((c) =>
          c.id === selected.id ? { ...c, lastTimeISO: auto.timeISO, unread: c.muted ? c.unread : c.unread + 1 } : c
        )
      );
    }, 850);

    setText("");
    setAttachName(null);
  };

  const attachDemo = () => {
    setAttachName("assignment-proof.pdf");
    showToast("Attachment added (demo).");
  };

  const resetDemo = () => {
    const s = seedData();
    setConvos(s.convos);
    setMsgs(s.msgs);
    setSelectedId(s.convos[0].id);
    setQ("");
    setTag("All");
    setShowUnreadOnly(false);
    setText("");
    setAttachName(null);
    showToast("Reset demo messages.");
  };

  const openNew = () => {
    setNewTo(CONTACTS[0].id);
    setNewTag("Support");
    setNewTitle("");
    setNewOpen(true);
  };

  const createNewConvo = () => {
    const title = (newTitle || "New conversation").trim();
    const id = uid("V");
    const nowISO = new Date().toISOString();
    const convo: Convo = {
      id,
      contactId: newTo,
      title,
      tag: newTag,
      pinned: false,
      muted: false,
      lastTimeISO: nowISO,
      unread: 0,
    };

    setConvos((prev) => [convo, ...prev]);
    setMsgs((prev) => [
      ...prev,
      {
        id: uid("SYS"),
        convoId: id,
        from: "system",
        text: "Conversation started (demo).",
        timeISO: nowISO,
        read: true,
      },
    ]);
    setSelectedId(id);
    setNewOpen(false);
    showToast("✅ New conversation created.");
  };

  return (
    <div className="mp">
      {/* Sidebar */}
      <aside className="mpSide">
        <div className="mpBrand">
          <div className="mpMsLogo" aria-label="Microsoft Education logo" />
          <div className="mpBrandText">
            <div className="mpBrandTop">Microsoft Education</div>
            <div className="mpBrandName">
              <span className="mpBrandSteam">STEAM</span>{" "}
              <span className="mpBrandOne">ONE</span>{" "}
              <span className="mpBrandPlatform">Platform</span>
            </div>
          </div>
        </div>

        <div className="mpSideCard">
          <div className="mpSideTitle">Messaging</div>
          <div className="mpSideSub">
            Contact Admin, Facilitators, or Support. Messages save locally for demo.
          </div>
          <button className="mpBtn mpBtnPrimary" onClick={openNew}>
            ✉ New Message
          </button>
        </div>

        <nav className="mpNav" aria-label="Navigation">
          <button className="mpNavItem">🏠 Dashboard</button>
          <button className="mpNavItem active">💬 Messaging</button>
          <button className="mpNavItem">📣 Announcements</button>
          <button className="mpNavItem">🎥 Live Classes</button>
          <button className="mpNavItem">🧑‍💻 Contact Admin</button>
          <button className="mpNavItem">⚙ Settings</button>
        </nav>

        <div className="mpSideFooter">
          <div className="mpSideFooterRow">
            <span className="mpDot" /> <span>Aligned with ISTE • UNESCO ICT CFT • PISA</span>
          </div>
          <div className="mpSideFooterCopy">© 2026 STEAM ONE Platform</div>
        </div>
      </aside>

      {/* Main */}
      <section className="mpMain">
        {/* Header */}
        <header className="mpTop">
          <div>
            <div className="mpTitle">Messaging Center</div>
            <div className="mpSub">Send messages, share files, and get support quickly.</div>
            <div className="mpTime">
              Nigeria Time: <span className="mpTimeRed">{getLagosNowString() ? lagosNow : lagosNow}</span>
            </div>

            <div className="mpRoleRow">
              <span className="mpRoleLabel">Role</span>
              <div className="mpRoleTabs">
                {(["Teacher", "Facilitator", "Admin"] as Role[]).map((r) => (
                  <button
                    key={r}
                    className={`mpRoleTab ${role === r ? "active" : ""}`}
                    onClick={() => setRole(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <label className="mpToggle">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                />
                <span>Unread only</span>
              </label>

              <button className="mpBtn mpBtnGhost" onClick={resetDemo}>
                Reset Demo
              </button>
            </div>
          </div>

          <div className="mpTopRight">
            <div className="mpSearch">
              <span className="mpSearchIcon">🔎</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search conversations..." />
            </div>

            <select value={tag} onChange={(e) => setTag(e.target.value as any)} aria-label="Tag filter">
              <option value="All">All Tags</option>
              <option value="Support">Support</option>
              <option value="Learning">Learning</option>
              <option value="Payments">Payments</option>
              <option value="Recruitment">Recruitment</option>
            </select>

            <button className="mpIconBtn" onClick={() => showToast("Notifications (demo).")}>🔔</button>

            <button className="mpUserChip">
              <span className="mpUserAvatar" aria-hidden="true" />
              <span className="mpUserText">
                <span className="mpUserName">{role} User</span>
                <span className="mpUserRole">{role} Account</span>
              </span>
            </button>
          </div>
        </header>

        <div className="mpGrid">
          {/* Conversation list */}
          <div className="mpCard mpListCard">
            <div className="mpCardHead">
              <div>
                <div className="mpH3">Inbox</div>
                <div className="mpHint">Pinned chats stay on top.</div>
              </div>
              <button className="mpBtn mpBtnPay" onClick={openNew}>
                New
              </button>
            </div>

            <div className="mpList">
              {filteredConvos.map((c) => {
                const ct = getContact(c.contactId);
                const active = c.id === selectedId;
                return (
                  <button
                    key={c.id}
                    className={`mpItem ${active ? "active" : ""}`}
                    onClick={() => {
                      setSelectedId(c.id);
                      markRead(c.id);
                    }}
                  >
                    <div className="mpItemTop">
                      <span className={`mpPresence ${ct.presence.toLowerCase()}`} />
                      <div className="mpItemName">{ct.name}</div>
                      {c.pinned && <span className="mpPin">📌</span>}
                      {c.muted && <span className="mpMute">🔕</span>}
                      <div className="mpItemTime">{fmtDateShort(c.lastTimeISO)}</div>
                    </div>

                    <div className="mpItemMid">
                      <div className="mpItemTitle">{c.title}</div>
                      <span className={`mpTag ${c.tag.toLowerCase()}`}>{c.tag}</span>
                    </div>

                    <div className="mpItemFoot">
                      <span className="mpRoleMini">{ct.role}</span>
                      {c.unread > 0 && <span className="mpUnread">{c.unread}</span>}
                    </div>
                  </button>
                );
              })}

              {!filteredConvos.length && <div className="mpEmpty">No conversations found.</div>}
            </div>
          </div>

          {/* Thread */}
          <div className="mpCard mpThreadCard">
            <div className="mpCardHead">
              <div className="mpThreadHead">
                <div className="mpAvatarBig" aria-hidden="true" />
                <div className="mpThreadInfo">
                  <div className="mpThreadName">
                    {contact?.name} <span className={`mpPresenceDot ${contact?.presence.toLowerCase()}`} />
                  </div>
                  <div className="mpThreadSub">
                    {contact?.role} • {contact?.presence} • <span className="mono">{selected?.id}</span>
                  </div>
                </div>
              </div>

              <div className="mpThreadActions">
                <button className="mpBtn mpBtnGhost" onClick={() => togglePin(selected.id)}>
                  {selected?.pinned ? "Unpin" : "Pin"}
                </button>
                <button className="mpBtn mpBtnGhost" onClick={() => toggleMute(selected.id)}>
                  {selected?.muted ? "Unmute" : "Mute"}
                </button>
                <button className="mpBtn mpBtnGhost" onClick={() => showToast("Report opened (demo).")}>
                  Report
                </button>
              </div>
            </div>

            <div className="mpThreadBody">
              {convoMsgs.map((m) => {
                const mine = m.from === "me";
                const sys = m.from === "system";
                return (
                  <div key={m.id} className={`mpMsg ${mine ? "mine" : ""} ${sys ? "sys" : ""}`}>
                    <div className="mpMsgTop">
                      <span className="mpMsgName">
                        {sys ? "System" : mine ? "You" : contact?.name}
                      </span>
                      <span className="mpMsgTime">{fmtTime(m.timeISO)}</span>
                    </div>

                    <div className="mpMsgText">{m.text}</div>

                    {m.attachment && (
                      <div className="mpAttach">
                        <span className="mpAttachIcon">📎</span>
                        <span className="mpAttachName">{m.attachment.name}</span>
                        <button className="mpAttachBtn" onClick={() => showToast("Downloading (demo).")}>
                          Download
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>

            <div className="mpComposer">
              {attachName && (
                <div className="mpAttachChip">
                  <span>📎 {attachName}</span>
                  <button className="mpChipX" onClick={() => setAttachName(null)} aria-label="Remove attachment">
                    ✕
                  </button>
                </div>
              )}

              <div className="mpComposerRow">
                <button className="mpIconBtn ghost" onClick={attachDemo} title="Attach file (demo)">
                  📎
                </button>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your message..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                />
                <button className="mpBtn mpBtnPrimary" onClick={sendMessage}>
                  Send
                </button>
              </div>

              <div className="mpComposerHint">
                Demo: Messages are saved in localStorage. Backend will later deliver real-time messaging.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mpFooter">
          <div className="mpFooterLeft">
            <span className="mpFooterLogo" aria-hidden="true" />
            <span>© 2026 STEAM ONE Platform. All rights reserved.</span>
          </div>
          <div className="mpFooterLinks">
            <button className="mpLinkBtn" onClick={() => alert("Terms (demo)")}>Terms</button>
            <button className="mpLinkBtn" onClick={() => alert("Privacy (demo)")}>Privacy</button>
            <button className="mpLinkBtn" onClick={() => alert("Support (demo)")}>Support</button>
          </div>
        </footer>
      </section>

      {/* New message modal */}
      {newOpen && (
        <div className="mpModalOverlay" role="dialog" aria-modal="true" aria-label="New message modal">
          <div className="mpModal">
            <div className="mpModalHead">
              <div>
                <div className="mpModalTitle">New Message</div>
                <div className="mpModalSub">Start a new conversation (demo).</div>
              </div>
              <button className="mpModalClose" onClick={() => setNewOpen(false)} aria-label="Close">✕</button>
            </div>

            <div className="mpModalBody">
              <div className="mpNewGrid">
                <div className="mpBlock">
                  <div className="mpBTitle">Recipient</div>
                  <label className="mpLbl">
                    To
                    <select value={newTo} onChange={(e) => setNewTo(e.target.value)}>
                      {CONTACTS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.role})
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="mpLbl">
                    Tag
                    <select value={newTag} onChange={(e) => setNewTag(e.target.value as Tag)}>
                      <option value="Support">Support</option>
                      <option value="Learning">Learning</option>
                      <option value="Payments">Payments</option>
                      <option value="Recruitment">Recruitment</option>
                    </select>
                  </label>

                  <label className="mpLbl">
                    Conversation title
                    <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Course access issue" />
                  </label>

                  <button className="mpBtn mpBtnPrimary" onClick={createNewConvo}>
                    Create
                  </button>
                  <button className="mpBtn mpBtnGhost" onClick={() => setNewOpen(false)}>
                    Cancel
                  </button>
                </div>

                <div className="mpBlock">
                  <div className="mpBTitle">Tips</div>
                  <div className="mpTip">
                    <b>Be clear:</b> include plan name (STEAM ONE/TWO/THREE), date, and issue details.
                  </div>
                  <div className="mpTip">
                    <b>Payments:</b> add transaction reference when reporting payment issues.
                  </div>
                  <div className="mpTip">
                    <b>Learning:</b> mention course module and lesson number.
                  </div>
                  <div className="mpWarn">
                    Backend will later enable real-time delivery, file uploads, and moderation tools.
                  </div>
                </div>
              </div>
            </div>

            <div className="mpModalFoot">
              <button className="mpBtn mpBtnGhost" onClick={() => setNewOpen(false)}>Close</button>
              <button className="mpBtn mpBtnPrimary" onClick={createNewConvo}>Continue</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="mpToast">{toast}</div>}
    </div>
  );
}