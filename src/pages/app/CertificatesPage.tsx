import React, { useEffect, useMemo, useState } from "react";
import "./CertificatesPage.css";

type Track = "STEAM ONE" | "STEAM TWO" | "STEAM THREE";
type CertStatus = "Eligible" | "Issued" | "Pending" | "Revoked";

type Certificate = {
  id: string;               // internal id
  certNo: string;           // public certificate number
  verifyCode: string;       // short code for verification
  learnerName: string;
  learnerEmail: string;
  track: Track;
  status: CertStatus;
  issuedOn?: string;        // text for now
  expiresOn?: string;       // optional
  issuer: string;
  score: number;            // demo score / completion
  notes: string;
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

function uid(prefix = "cert") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function makeCertNo(track: Track) {
  const t = track === "STEAM ONE" ? "S1" : track === "STEAM TWO" ? "S2" : "S3";
  const rand = Math.random().toString(10).slice(2, 8);
  return `STEAM-${t}-${new Date().getFullYear()}-${rand}`;
}

function makeVerifyCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function CertificatesPage() {
  // Nigeria time
  const [lagosNow, setLagosNow] = useState(getLagosTimeString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Demo certificates
  const initial: Certificate[] = useMemo(
    () => [
      {
        id: "c1",
        certNo: "STEAM-S1-2025-184920",
        verifyCode: "A7K2QF",
        learnerName: "Chinedu Okafor",
        learnerEmail: "chinedu@example.com",
        track: "STEAM ONE",
        status: "Issued",
        issuedOn: "Apr 20, 2025",
        expiresOn: "Apr 20, 2028",
        issuer: "STEAM ONE Platform",
        score: 86,
        notes: "Completed modules and capstone project.",
      },
      {
        id: "c2",
        certNo: "STEAM-S2-2025-992104",
        verifyCode: "H1P9ZC",
        learnerName: "Amina Yusuf",
        learnerEmail: "amina@example.com",
        track: "STEAM TWO",
        status: "Eligible",
        issuer: "STEAM ONE Platform",
        score: 79,
        notes: "Eligible after final assessment approval.",
      },
      {
        id: "c3",
        certNo: "STEAM-S3-2025-550231",
        verifyCode: "Q4M8TT",
        learnerName: "Fatima Abdullahi",
        learnerEmail: "fatima@example.com",
        track: "STEAM THREE",
        status: "Pending",
        issuer: "STEAM ONE Platform",
        score: 91,
        notes: "Pending admin review of AI ethics essay.",
      },
      {
        id: "c4",
        certNo: "STEAM-S1-2024-006312",
        verifyCode: "R0V3KD",
        learnerName: "Michael Adeyemi",
        learnerEmail: "michael@example.com",
        track: "STEAM ONE",
        status: "Revoked",
        issuedOn: "Dec 02, 2024",
        issuer: "STEAM ONE Platform",
        score: 73,
        notes: "Revoked due to verification mismatch (demo).",
      },
    ],
    []
  );

  const [certs, setCerts] = useState<Certificate[]>(initial);

  // Search/filters
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState<"All" | Track>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | CertStatus>("All");
  const [sortBy, setSortBy] = useState<"Newest" | "Issued First" | "Highest Score">("Newest");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let arr = certs
      .filter((c) =>
        q
          ? (c.learnerName +
              " " +
              c.learnerEmail +
              " " +
              c.certNo +
              " " +
              c.verifyCode +
              " " +
              c.track).toLowerCase().includes(q)
          : true
      )
      .filter((c) => (trackFilter === "All" ? true : c.track === trackFilter))
      .filter((c) => (statusFilter === "All" ? true : c.status === statusFilter));

    if (sortBy === "Newest") {
      // issuedOn is text; demo sorting by id/time created
      arr = arr.slice().sort((a, b) => (a.id < b.id ? 1 : -1));
    } else if (sortBy === "Issued First") {
      arr = arr
        .slice()
        .sort((a, b) => (a.status === "Issued" ? -1 : 1) - (b.status === "Issued" ? -1 : 1));
    } else {
      arr = arr.slice().sort((a, b) => b.score - a.score);
    }
    return arr;
  }, [certs, search, trackFilter, statusFilter, sortBy]);

  // Stats
  const stats = useMemo(() => {
    const total = certs.length;
    const issued = certs.filter((x) => x.status === "Issued").length;
    const eligible = certs.filter((x) => x.status === "Eligible").length;
    const pending = certs.filter((x) => x.status === "Pending").length;
    const revoked = certs.filter((x) => x.status === "Revoked").length;
    const avgScore = Math.round(certs.reduce((s, x) => s + x.score, 0) / Math.max(1, total));
    return { total, issued, eligible, pending, revoked, avgScore };
  }, [certs]);

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  // Modal: issue / edit (demo)
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"issue" | "edit">("issue");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [fName, setFName] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fTrack, setFTrack] = useState<Track>("STEAM ONE");
  const [fStatus, setFStatus] = useState<CertStatus>("Issued");
  const [fScore, setFScore] = useState<number>(85);
  const [fIssuedOn, setFIssuedOn] = useState("");
  const [fExpiresOn, setFExpiresOn] = useState("");
  const [fNotes, setFNotes] = useState("");

  const openIssue = () => {
    setMode("issue");
    setEditingId(null);
    setFName("");
    setFEmail("");
    setFTrack("STEAM ONE");
    setFStatus("Issued");
    setFScore(85);
    setFIssuedOn(new Intl.DateTimeFormat("en-NG", {
      timeZone: "Africa/Lagos",
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(new Date()));
    setFExpiresOn("");
    setFNotes("Issued after successful completion (demo).");
    setModalOpen(true);
  };

  const openEdit = (c: Certificate) => {
    setMode("edit");
    setEditingId(c.id);
    setFName(c.learnerName);
    setFEmail(c.learnerEmail);
    setFTrack(c.track);
    setFStatus(c.status);
    setFScore(c.score);
    setFIssuedOn(c.issuedOn ?? "");
    setFExpiresOn(c.expiresOn ?? "");
    setFNotes(c.notes);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const validate = () => {
    if (!fName.trim()) return "Learner name is required.";
    if (fName.trim().length < 3) return "Learner name must be at least 3 characters.";
    if (!fEmail.trim() || !fEmail.includes("@")) return "Valid email is required.";
    if (!Number.isFinite(fScore) || fScore < 0 || fScore > 100) return "Score must be between 0 and 100.";
    if (fStatus === "Issued" && !fIssuedOn.trim()) return "Issued date is required for Issued status.";
    return null;
  };

  const save = () => {
    const err = validate();
    if (err) return showToast(err);

    if (mode === "issue") {
      const certNo = makeCertNo(fTrack);
      const verifyCode = makeVerifyCode();

      const newCert: Certificate = {
        id: uid(),
        certNo,
        verifyCode,
        learnerName: fName.trim(),
        learnerEmail: fEmail.trim(),
        track: fTrack,
        status: fStatus,
        issuedOn: fStatus === "Issued" ? fIssuedOn.trim() : undefined,
        expiresOn: fExpiresOn.trim() ? fExpiresOn.trim() : undefined,
        issuer: "STEAM ONE Platform",
        score: clamp(Math.round(fScore), 0, 100),
        notes: fNotes.trim(),
      };

      setCerts((prev) => [newCert, ...prev]);
      closeModal();
      showToast("✅ Certificate created (demo).");
      return;
    }

    if (!editingId) return;
    setCerts((prev) =>
      prev.map((c) =>
        c.id !== editingId
          ? c
          : {
              ...c,
              learnerName: fName.trim(),
              learnerEmail: fEmail.trim(),
              track: fTrack,
              status: fStatus,
              score: clamp(Math.round(fScore), 0, 100),
              issuedOn: fStatus === "Issued" ? fIssuedOn.trim() : undefined,
              expiresOn: fExpiresOn.trim() ? fExpiresOn.trim() : undefined,
              notes: fNotes.trim(),
            }
      )
    );

    closeModal();
    showToast("✅ Certificate updated (demo).");
  };

  const revoke = (id: string) => {
    const ok = window.confirm("Revoke this certificate?");
    if (!ok) return;
    setCerts((prev) => prev.map((c) => (c.id === id ? { ...c, status: "Revoked" } : c)));
    showToast("🚫 Certificate revoked (demo).");
  };

  const issueNow = (id: string) => {
    const issuedOn = new Intl.DateTimeFormat("en-NG", {
      timeZone: "Africa/Lagos",
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(new Date());
    setCerts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Issued", issuedOn } : c))
    );
    showToast("🎓 Certificate issued (demo).");
  };

  const remove = (id: string) => {
    const ok = window.confirm("Delete this certificate record?");
    if (!ok) return;
    setCerts((prev) => prev.filter((c) => c.id !== id));
    showToast("🗑️ Deleted (demo).");
  };

  const downloadPdf = (c: Certificate) => {
    // Demo placeholder: text file download (replace with real PDF later)
    const content = `STEAM ONE Platform Certificate (DEMO)\n\nCertificate No: ${c.certNo}\nVerify Code: ${c.verifyCode}\nName: ${c.learnerName}\nEmail: ${c.learnerEmail}\nTrack: ${c.track}\nStatus: ${c.status}\nIssued On: ${c.issuedOn ?? "N/A"}\nExpires On: ${c.expiresOn ?? "N/A"}\nScore: ${c.score}\nIssuer: ${c.issuer}\n\nNotes: ${c.notes}\n`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${c.certNo}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("📄 Downloaded (demo).");
  };

  // Verify panel (demo)
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyResult, setVerifyResult] = useState<Certificate | null>(null);

  const verify = () => {
    const q = verifyInput.trim().toUpperCase();
    if (!q) return showToast("Enter a certificate number or verify code.");
    const found = certs.find(
      (c) => c.certNo.toUpperCase() === q || c.verifyCode.toUpperCase() === q
    );
    setVerifyResult(found ?? null);
    showToast(found ? "✅ Certificate found (demo)." : "❌ No match (demo).");
  };

  return (
    <div className="cer">
      {/* Sidebar */}
      <aside className="cerSide">
        <div className="cerBrand">
          <div className="cerMsLogo" aria-label="Microsoft Education logo" />
          <div className="cerBrandText">
            <div className="cerBrandTop">Microsoft Education</div>
            <div className="cerBrandName">
              <span className="cerBrandSteam">STEAM</span>{" "}
              <span className="cerBrandOne">ONE</span>{" "}
              <span className="cerBrandPlatform">Platform</span>
            </div>
          </div>
        </div>

        <div className="cerSideCard">
          <div className="cerSideTitle">Certificates</div>
          <div className="cerSideSub">
            Issue certificates, verify authenticity, and manage learner credentials across tracks.
          </div>
          <button className="cerBtn cerBtnPay" onClick={openIssue}>
            🎓 Issue Certificate
          </button>
        </div>

        <nav className="cerNav" aria-label="Navigation">
          <button className="cerNavItem">🏠 Dashboard</button>
          <button className="cerNavItem">📚 Courses</button>
          <button className="cerNavItem">📝 Assignments</button>
          <button className="cerNavItem">🧍 Attendance</button>
          <button className="cerNavItem active">🏅 Certificates</button>
          <button className="cerNavItem">📣 Announcements</button>
          <button className="cerNavItem">📊 Reports</button>
          <button className="cerNavItem">⚙ Settings</button>
        </nav>

        <div className="cerSideFooter">
          <div className="cerSideFooterRow">
            <span className="cerDot" /> <span>Trusted by ISTE • UNESCO • PISA</span>
          </div>
          <div className="cerSideFooterCopy">© 2026 STEAM ONE Platform</div>
        </div>
      </aside>

      {/* Main */}
      <section className="cerMain">
        {/* Top */}
        <header className="cerTop">
          <div className="cerTopLeft">
            <div className="cerTitle">Certificates Center</div>
            <div className="cerSub">
              Manage issuance, verification, and learner credential records in professional standard.
            </div>
            <div className="cerTime">
              Nigeria Time: <span className="cerTimeRed">{lagosNow}</span>
            </div>
          </div>

          <div className="cerTopRight">
            <div className="cerSearch">
              <span className="cerSearchIcon">🔎</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, cert no, code..."
                aria-label="Search certificates"
              />
            </div>

            <button className="cerIconBtn" aria-label="Notifications" title="Notifications">
              🔔 <span className="cerBadge">3</span>
            </button>
            <button className="cerIconBtn" aria-label="Messages" title="Messages">
              ✉️
            </button>

            <button className="cerUserChip" aria-label="User menu">
              <span className="cerUserMiniAvatar" aria-hidden="true" />
              <span className="cerUserText">
                <span className="cerUserName">Admin Team</span>
                <span className="cerUserRole">Credentials & Compliance</span>
              </span>
              <span className="cerCaret">▾</span>
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="cerStats">
          <div className="cerStat">
            <div className="cerStatIco">🏅</div>
            <div>
              <div className="cerStatLabel">Total</div>
              <div className="cerStatValue">{stats.total}</div>
            </div>
            <div className="cerStatHint">All records</div>
          </div>

          <div className="cerStat">
            <div className="cerStatIco">🎓</div>
            <div>
              <div className="cerStatLabel">Issued</div>
              <div className="cerStatValue">{stats.issued}</div>
            </div>
            <div className="cerStatHint">Active certificates</div>
          </div>

          <div className="cerStat">
            <div className="cerStatIco">✅</div>
            <div>
              <div className="cerStatLabel">Eligible</div>
              <div className="cerStatValue">{stats.eligible}</div>
            </div>
            <div className="cerStatHint">Ready to issue</div>
          </div>

          <div className="cerStat">
            <div className="cerStatIco">📈</div>
            <div>
              <div className="cerStatLabel">Avg Score</div>
              <div className="cerStatValue">{stats.avgScore}%</div>
            </div>
            <div className="cerStatHint">Across learners</div>
          </div>
        </div>

        {/* Filters + Verify */}
        <div className="cerGrid2">
          <div className="cerCard">
            <div className="cerCardHead">
              <div>
                <div className="cerH3">Filters & Sorting</div>
                <div className="cerHint">Filter by track and status to manage records quickly.</div>
              </div>
              <div className="cerCardActions">
                <button
                  className="cerBtn cerBtnGhost"
                  onClick={() => {
                    setSearch("");
                    setTrackFilter("All");
                    setStatusFilter("All");
                    setSortBy("Newest");
                    showToast("Filters reset.");
                  }}
                >
                  Reset
                </button>
                <button className="cerBtn cerBtnPrimary" onClick={openIssue}>
                  🎓 Issue
                </button>
              </div>
            </div>

            <div className="cerFilters">
              <label className="cerSelect">
                <span>Track</span>
                <select value={trackFilter} onChange={(e) => setTrackFilter(e.target.value as any)}>
                  <option value="All">All</option>
                  <option value="STEAM ONE">STEAM ONE</option>
                  <option value="STEAM TWO">STEAM TWO</option>
                  <option value="STEAM THREE">STEAM THREE</option>
                </select>
              </label>

              <label className="cerSelect">
                <span>Status</span>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                  <option value="All">All</option>
                  <option value="Issued">Issued</option>
                  <option value="Eligible">Eligible</option>
                  <option value="Pending">Pending</option>
                  <option value="Revoked">Revoked</option>
                </select>
              </label>

              <label className="cerSelect">
                <span>Sort</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                  <option value="Newest">Newest</option>
                  <option value="Issued First">Issued First</option>
                  <option value="Highest Score">Highest Score</option>
                </select>
              </label>

              <div className="cerInlineInfo">
                Showing <b>{filtered.length}</b> of <b>{certs.length}</b>
              </div>
            </div>
          </div>

          <div className="cerCard">
            <div className="cerCardHead">
              <div>
                <div className="cerH3">Verify Certificate</div>
                <div className="cerHint">Enter Certificate No or Verify Code (demo).</div>
              </div>
              <div className="cerCardActions">
                <button className="cerBtn cerBtnPrimary" onClick={verify}>Verify</button>
              </div>
            </div>

            <div className="cerVerify">
              <div className="cerVerifyRow">
                <input
                  value={verifyInput}
                  onChange={(e) => setVerifyInput(e.target.value)}
                  placeholder="e.g., STEAM-S1-2025-184920 or A7K2QF"
                />
                <button className="cerBtn cerBtnGhost" onClick={() => { setVerifyInput(""); setVerifyResult(null); }}>
                  Clear
                </button>
              </div>

              <div className="cerVerifyResult">
                {verifyResult ? (
                  <div className="cerVerifyCard">
                    <div className="cerVerifyTop">
                      <div className="cerVerifyTitle">{verifyResult.learnerName}</div>
                      <span className={`cerStatus ${verifyResult.status.toLowerCase()}`}>
                        {verifyResult.status}
                      </span>
                    </div>
                    <div className="cerVerifyMeta">
                      <span className={`cerTrack ${verifyResult.track.replace(" ", "").toLowerCase()}`}>
                        {verifyResult.track}
                      </span>
                      <span className="cerSep">•</span>
                      <span>Cert No: <b>{verifyResult.certNo}</b></span>
                      <span className="cerSep">•</span>
                      <span>Code: <b>{verifyResult.verifyCode}</b></span>
                    </div>
                    <div className="cerVerifyMeta">
                      Issued: <b>{verifyResult.issuedOn ?? "N/A"}</b> • Expires:{" "}
                      <b>{verifyResult.expiresOn ?? "N/A"}</b> • Score: <b>{verifyResult.score}%</b>
                    </div>
                    <div className="cerVerifyNote">{verifyResult.notes}</div>
                  </div>
                ) : (
                  <div className="cerVerifyEmpty">
                    Verification result will appear here.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="cerList">
          {filtered.map((c) => (
            <article className="cerItem" key={c.id}>
              <div className="cerItemTop">
                <div className="cerLeft">
                  <div className="cerTitleRow">
                    <h4 className="cerItemTitle">{c.learnerName}</h4>
                    <span className={`cerStatus ${c.status.toLowerCase()}`}>{c.status}</span>
                    <span className={`cerTrack ${c.track.replace(" ", "").toLowerCase()}`}>{c.track}</span>
                  </div>

                  <div className="cerMeta">
                    <span>Email: <b>{c.learnerEmail}</b></span>
                    <span className="cerSep">•</span>
                    <span>Cert No: <b>{c.certNo}</b></span>
                    <span className="cerSep">•</span>
                    <span>Verify Code: <b>{c.verifyCode}</b></span>
                  </div>

                  <div className="cerMeta">
                    Issued: <b>{c.issuedOn ?? "N/A"}</b>
                    <span className="cerSep">•</span>
                    Expires: <b>{c.expiresOn ?? "N/A"}</b>
                    <span className="cerSep">•</span>
                    Score: <b>{c.score}%</b>
                    <span className="cerSep">•</span>
                    Issuer: <b>{c.issuer}</b>
                  </div>

                  <p className="cerNotes">{c.notes}</p>
                </div>

                <div className="cerRight">
                  <div className="cerScoreBox" title="Completion score">
                    <div className="cerScoreTop">
                      <div className="cerScoreLabel">Score</div>
                      <div className="cerScoreValue">{c.score}%</div>
                    </div>
                    <div className="cerBar">
                      <div className="cerFill" style={{ width: `${clamp(c.score, 0, 100)}%` }} />
                    </div>
                    <div className="cerScoreHint">Completion performance (demo)</div>
                  </div>

                  <div className="cerBtns">
                    <button className="cerBtn cerBtnGhostSmall" onClick={() => openEdit(c)}>
                      Edit
                    </button>

                    {c.status !== "Issued" && (
                      <button className="cerBtn cerBtnPrimarySmall" onClick={() => issueNow(c.id)}>
                        Issue
                      </button>
                    )}

                    {c.status === "Issued" && (
                      <button className="cerBtn cerBtnPaySmall" onClick={() => downloadPdf(c)}>
                        Download
                      </button>
                    )}

                    {c.status !== "Revoked" && (
                      <button className="cerBtn cerBtnDangerSmall" onClick={() => revoke(c.id)}>
                        Revoke
                      </button>
                    )}

                    <button className="cerBtn cerBtnDangerOutlineSmall" onClick={() => remove(c.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="cerEmpty">No certificate records match your search/filters.</div>
          )}
        </div>

        {/* Footer */}
        <footer className="cerFooter">
          <div className="cerFooterLeft">
            <span className="cerFooterLogo" aria-hidden="true" />
            <span>© 2026 STEAM ONE Platform. All rights reserved.</span>
          </div>
          <div className="cerFooterLinks">
            <button className="cerLinkBtn" onClick={() => alert("Terms (demo)")}>Terms</button>
            <button className="cerLinkBtn" onClick={() => alert("Privacy (demo)")}>Privacy</button>
            <button className="cerLinkBtn" onClick={() => alert("Support (demo)")}>Support</button>
          </div>
        </footer>
      </section>

      {/* Modal */}
      {modalOpen && (
        <div className="cerModalOverlay" role="dialog" aria-modal="true" aria-label="Issue certificate modal">
          <div className="cerModal">
            <div className="cerModalHead">
              <div>
                <div className="cerModalTitle">{mode === "issue" ? "Issue Certificate" : "Edit Certificate"}</div>
                <div className="cerModalSub">
                  Generate a certificate number & verification code (demo). Backend will store real certificate PDFs later.
                </div>
              </div>
              <button className="cerModalClose" onClick={closeModal} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="cerModalBody">
              <div className="cerRow2">
                <label className="cerField">
                  <span>Learner Name</span>
                  <input value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Full name" />
                </label>
                <label className="cerField">
                  <span>Email</span>
                  <input value={fEmail} onChange={(e) => setFEmail(e.target.value)} placeholder="email@example.com" />
                </label>
              </div>

              <div className="cerRow4">
                <label className="cerField">
                  <span>Track</span>
                  <select value={fTrack} onChange={(e) => setFTrack(e.target.value as Track)}>
                    <option>STEAM ONE</option>
                    <option>STEAM TWO</option>
                    <option>STEAM THREE</option>
                  </select>
                </label>

                <label className="cerField">
                  <span>Status</span>
                  <select value={fStatus} onChange={(e) => setFStatus(e.target.value as CertStatus)}>
                    <option>Issued</option>
                    <option>Eligible</option>
                    <option>Pending</option>
                    <option>Revoked</option>
                  </select>
                </label>

                <label className="cerField">
                  <span>Score (0 - 100)</span>
                  <input
                    type="number"
                    value={fScore}
                    onChange={(e) => setFScore(Number(e.target.value))}
                    min={0}
                    max={100}
                  />
                </label>

                <label className="cerField">
                  <span>Expires On (optional)</span>
                  <input value={fExpiresOn} onChange={(e) => setFExpiresOn(e.target.value)} placeholder="Apr 20, 2028" />
                </label>
              </div>

              <div className="cerRow2">
                <label className="cerField">
                  <span>Issued On (required if Issued)</span>
                  <input value={fIssuedOn} onChange={(e) => setFIssuedOn(e.target.value)} placeholder="Apr 20, 2025" />
                  <div className="cerMiniHint">Use text for now. Backend will store real date.</div>
                </label>

                <div className="cerPreview">
                  <div className="cerPreviewTitle">Preview ID</div>
                  <div className="cerPreviewCard">
                    <div className="cerPreviewRow">
                      <span>Certificate No:</span>
                      <b>{makeCertNo(fTrack)}</b>
                    </div>
                    <div className="cerPreviewRow">
                      <span>Verify Code:</span>
                      <b>{makeVerifyCode()}</b>
                    </div>
                    <div className="cerMiniHint">Final values saved when you click Create/Save.</div>
                  </div>
                </div>
              </div>

              <label className="cerField">
                <span>Notes</span>
                <textarea value={fNotes} onChange={(e) => setFNotes(e.target.value)} rows={4} />
              </label>
            </div>

            <div className="cerModalFoot">
              <button className="cerBtn cerBtnGhost" onClick={closeModal}>Cancel</button>
              <button className="cerBtn cerBtnPrimary" onClick={save}>
                {mode === "issue" ? "Create Certificate" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="cerToast">{toast}</div>}
    </div>
  );
}