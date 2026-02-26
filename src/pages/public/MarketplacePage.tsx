import React, { useEffect, useMemo, useState } from "react";
import "./MarketplacePage.css";

function formatNigeriaTime(date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-NG", {
      timeZone: "Africa/Lagos",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    }).format(date);
  } catch {
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const lagos = new Date(utc + 60 * 60000);
    return lagos.toLocaleString("en-NG");
  }
}

type Subject = "Digital Literacy" | "STEAM" | "AI & Technology";
type LocationCert =
  | "ISTE Certified"
  | "UNESCO ICT CFT Certified"
  | "PISA Certified"
  | "STEAM ONE Certified";

type Teacher = {
  id: string;
  name: string;
  subject: Subject;
  locationCert: LocationCert;
  years: number;
  tagline: string;
  rating: number; // 0..5
};

type ModalMode = "contact";

export default function MarketplacePage() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [ngTime, setNgTime] = useState(() => formatNigeriaTime(new Date()));

  // search & filters
  const [query, setQuery] = useState("");
  const [subjectFilters, setSubjectFilters] = useState<Record<Subject, boolean>>({
    "Digital Literacy": false,
    STEAM: false,
    "AI & Technology": false
  });
  const [certFilters, setCertFilters] = useState<Record<LocationCert, boolean>>({
    "ISTE Certified": false,
    "UNESCO ICT CFT Certified": false,
    "PISA Certified": false,
    "STEAM ONE Certified": false
  });
  const [yearsFilter, setYearsFilter] = useState<"any" | "0-3" | "4-7" | "8-12" | "12+">("any");

  // modal state
  const [isOpen, setIsOpen] = useState(false);
  const [modalMeta, setModalMeta] = useState("—");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNgTime(formatNigeriaTime(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  const teachers: Teacher[] = [
    {
      id: "t1",
      name: "Jane Doe",
      subject: "Digital Literacy",
      locationCert: "STEAM ONE Certified",
      years: 10,
      tagline: "Data Literacy & Curriculum Development",
      rating: 5
    },
    {
      id: "t2",
      name: "Michael Smith",
      subject: "STEAM",
      locationCert: "ISTE Certified",
      years: 7,
      tagline: "STEAM & Technology Integration Innovation",
      rating: 5
    },
    {
      id: "t3",
      name: "Laura Kim",
      subject: "AI & Technology",
      locationCert: "UNESCO ICT CFT Certified",
      years: 6,
      tagline: "AI Teaching & Robotics",
      rating: 4
    },
    {
      id: "t4",
      name: "David Johnson",
      subject: "STEAM",
      locationCert: "PISA Certified",
      years: 6,
      tagline: "STEAM & Classroom Excellence",
      rating: 5
    },
    {
      id: "t5",
      name: "Sarah Lee",
      subject: "STEAM",
      locationCert: "STEAM ONE Certified",
      years: 9,
      tagline: "Creativity & Inquiry-Based Learning",
      rating: 4
    },
    {
      id: "t6",
      name: "John Miller",
      subject: "AI & Technology",
      locationCert: "ISTE Certified",
      years: 9,
      tagline: "STEAM & Digital Classroom Innovation",
      rating: 5
    }
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const subjectActive = Object.values(subjectFilters).some(Boolean);
    const certActive = Object.values(certFilters).some(Boolean);

    function yearsOk(y: number) {
      if (yearsFilter === "any") return true;
      if (yearsFilter === "0-3") return y >= 0 && y <= 3;
      if (yearsFilter === "4-7") return y >= 4 && y <= 7;
      if (yearsFilter === "8-12") return y >= 8 && y <= 12;
      return y >= 12;
    }

    return teachers.filter((t) => {
      const matchesQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q);

      const matchesSubject = !subjectActive || subjectFilters[t.subject];
      const matchesCert = !certActive || certFilters[t.locationCert];
      const matchesYears = yearsOk(t.years);

      return matchesQuery && matchesSubject && matchesCert && matchesYears;
    });
  }, [teachers, query, subjectFilters, certFilters, yearsFilter]);

  function toggleSubject(s: Subject) {
    setSubjectFilters((prev) => ({ ...prev, [s]: !prev[s] }));
  }
  function toggleCert(c: LocationCert) {
    setCertFilters((prev) => ({ ...prev, [c]: !prev[c] }));
  }

  function clearFilters() {
    setSubjectFilters({ "Digital Literacy": false, STEAM: false, "AI & Technology": false });
    setCertFilters({
      "ISTE Certified": false,
      "UNESCO ICT CFT Certified": false,
      "PISA Certified": false,
      "STEAM ONE Certified": false
    });
    setYearsFilter("any");
  }

  function openContact(teacherName: string) {
    setModalMeta(`${teacherName} • Request goes to Admin Email (demo)`);
    setFullName("");
    setEmail("");
    setMessage("");
    setToast(false);
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Backend later: send request to admin + store request.
    setToast(true);
    window.setTimeout(() => {
      setIsOpen(false);
      setToast(false);
    }, 1300);
  }

  return (
    <div className="mk-root">
      {/* top strip */}
      <section className="mk-top">
        <div className="mk-topInner">
          <div className="mk-brand" aria-label="Microsoft Education">
            <div className="mk-msMark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div>
              <div className="mk-brandTitle">Microsoft Education</div>
              <div className="mk-brandSub">Verified Paid Certification Marketplace</div>
            </div>
          </div>

          <div className="mk-topRight">
            <span className="mk-pill" title="Africa/Lagos">
              🕒 {ngTime} (Nigeria)
            </span>
            <a className="mk-btn mk-btnGhost" href="/login">
              Login
            </a>
            <a className="mk-btn mk-btnPrimary" href="/checkout">
              Enroll Now
            </a>
          </div>
        </div>
      </section>

      {/* hero */}
      <section className="mk-hero">
        <div className="mk-heroCard">
          <div className="mk-heroGrid">
            <div className="mk-heroText">
              <h1 className="mk-h1">Certified Teachers Marketplace</h1>

              <div className="mk-heroBadges">
                <div className="mk-badge">
                  <span className="mk-badgeDot" aria-hidden="true" />
                  Microsoft Education
                </div>
                <div className="mk-badge mk-badgeGold">🏅 Paid Certification Verified</div>
              </div>

              <div className="mk-search">
                <span className="mk-searchIcon" aria-hidden="true">🔎</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search teachers..."
                  aria-label="Search teachers"
                />
              </div>
            </div>

            <div className="mk-heroArt" aria-label="Marketplace banner illustration placeholder">
              <div className="mk-artBubble mk-b1" />
              <div className="mk-artBubble mk-b2" />
              <div className="mk-artCard">
                Marketplace Banner Illustration (Placeholder)
                <span>Replace with your marketplace banner image.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* panel */}
      <section className="mk-panel">
        <div className="mk-grid">
          {/* left filters */}
          <aside className="mk-filters">
            <div className="mk-filterTitle">Filter By:</div>

            <div className="mk-filterGroup">
              <div className="mk-filterHead">Subjects</div>
              {(["Digital Literacy", "STEAM", "AI & Technology"] as Subject[]).map((s) => (
                <label key={s} className="mk-check">
                  <input
                    type="checkbox"
                    checked={subjectFilters[s]}
                    onChange={() => toggleSubject(s)}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>

            <div className="mk-filterGroup">
              <div className="mk-filterHead">Location</div>
              {(
                [
                  "ISTE Certified",
                  "UNESCO ICT CFT Certified",
                  "PISA Certified",
                  "STEAM ONE Certified"
                ] as LocationCert[]
              ).map((c) => (
                <label key={c} className="mk-check">
                  <input type="checkbox" checked={certFilters[c]} onChange={() => toggleCert(c)} />
                  <span>{c}</span>
                </label>
              ))}
            </div>

            <div className="mk-filterGroup">
              <div className="mk-filterHead">Years of Experience</div>
              <label className="mk-radio">
                <input
                  type="radio"
                  name="years"
                  checked={yearsFilter === "any"}
                  onChange={() => setYearsFilter("any")}
                />
                <span>Any</span>
              </label>
              <label className="mk-radio">
                <input
                  type="radio"
                  name="years"
                  checked={yearsFilter === "0-3"}
                  onChange={() => setYearsFilter("0-3")}
                />
                <span>0–3 Years</span>
              </label>
              <label className="mk-radio">
                <input
                  type="radio"
                  name="years"
                  checked={yearsFilter === "4-7"}
                  onChange={() => setYearsFilter("4-7")}
                />
                <span>4–7 Years</span>
              </label>
              <label className="mk-radio">
                <input
                  type="radio"
                  name="years"
                  checked={yearsFilter === "8-12"}
                  onChange={() => setYearsFilter("8-12")}
                />
                <span>8–12 Years</span>
              </label>
              <label className="mk-radio">
                <input
                  type="radio"
                  name="years"
                  checked={yearsFilter === "12+"}
                  onChange={() => setYearsFilter("12+")}
                />
                <span>12+ Years</span>
              </label>
            </div>

            <button className="mk-clearBtn" onClick={clearFilters}>
              Clear Filters
            </button>
          </aside>

          {/* main list */}
          <div className="mk-main">
            <div className="mk-mainHead">
              <h2 className="mk-h2">Certified Teachers Marketplace</h2>
              <p className="mk-sub">
                Hire verified &amp; paid certified digital educators.
              </p>
            </div>

            <div className="mk-cards">
              {filtered.map((t) => (
                <article key={t.id} className="mk-teacherCard">
                  <div className="mk-cardTop">
                    <div className="mk-avatar" aria-hidden="true">
                      {t.name
                        .split(" ")
                        .slice(0, 2)
                        .map((x) => x[0])
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div className="mk-cardNameWrap">
                      <div className="mk-nameRow">
                        <div className="mk-name">{t.name}</div>
                        <div className="mk-miniBadge">STEAM Certified</div>
                      </div>

                      <div className="mk-ratingRow" aria-label={`Rating ${t.rating} out of 5`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < t.rating ? "mk-star on" : "mk-star"}>
                            ★
                          </span>
                        ))}
                        <span className="mk-years">{t.years} years</span>
                      </div>
                    </div>
                  </div>

                  <ul className="mk-points">
                    <li>{t.tagline}</li>
                    <li>{t.years} years experience</li>
                  </ul>

                  <button className="mk-contactBtn" onClick={() => openContact(t.name)}>
                    Contact This Teacher
                  </button>

                  <div className="mk-verified">
                    <span className="mk-shield" aria-hidden="true">🛡️</span>
                    Paid Certification <b>VERIFIED</b>
                    <span className="mk-verifySub">by completion + payment</span>
                  </div>
                </article>
              ))}

              {filtered.length === 0 ? (
                <div className="mk-empty">
                  No teachers match your search/filters. Try clearing filters.
                </div>
              ) : null}
            </div>

            <div className="mk-noteBanner">
              🛡️ All teachers listed here are verified through <b>PAID STEAM programs</b>.
            </div>

            <div className="mk-cta">
              <h3 className="mk-h3">Ready to Start Your Certification?</h3>
              <div className="mk-ctaBtns">
                <a className="mk-btn mk-btnGhost" href="/courses">View Pricing</a>
                <a className="mk-btn mk-btnPrimary" href="/checkout">Enroll Now</a>
              </div>
            </div>

            {/* footer (wireframe style) */}
            <div className="mk-footer">
              <div className="mk-footerTop">
                <div className="mk-footBrand">
                  <div className="mk-footTitle">
                    <span className="mk-footSteam">STEAM</span>
                    <span className="mk-footOne">ONE</span> Platform
                  </div>
                  <div className="mk-footDesc">
                    Search and recruit verified educators certified through paid STEAM programs.
                  </div>
                </div>

                <div className="mk-footCols">
                  <div className="mk-col">
                    <div className="mk-colTitle">Programs</div>
                    <a href="/courses">STEAM ONE</a>
                    <a href="/courses">STEAM TWO</a>
                    <a href="/courses">STEAM THREE</a>
                  </div>

                  <div className="mk-col">
                    <div className="mk-colTitle">Pages</div>
                    <a href="/">Home</a>
                    <a href="/courses">Courses</a>
                    <a href="/marketplace">Marketplace</a>
                    <a href="/contact">Contact</a>
                  </div>

                  <div className="mk-col">
                    <div className="mk-colTitle">Contact Us</div>
                    <div className="mk-miniLine">✉️ info@example.com</div>
                    <div className="mk-miniLine">📞 +123-456-7890</div>
                    <div className="mk-miniLine">📍 Lagos, Nigeria</div>
                  </div>
                </div>
              </div>

              <div className="mk-trusted">
                <div className="mk-trustedSmall">
                  Compliant with ISTE Standards • UNESCO ICT CFT Framework • PISA Benchmarks • Microsoft Education
                </div>
                <div className="mk-copy">© {year} STEAM ONE Platform • All rights reserved</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact modal */}
      {isOpen ? (
        <div className="mk-modalOverlay" role="dialog" aria-modal="true" aria-labelledby="mk-modalTitle">
          <div className="mk-modal">
            <div className="mk-modalHead">
              <strong id="mk-modalTitle">Contact This Teacher (Demo)</strong>
              <button className="mk-closeX" onClick={closeModal} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="mk-modalBody">
              <div className="mk-pill mk-pillInfo">{modalMeta}</div>

              <div className="mk-gap10" />

              <form onSubmit={onSubmit}>
                <div className="mk-formGrid">
                  <label className="mk-field">
                    <span>Full Name *</span>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </label>

                  <label className="mk-field">
                    <span>Email *</span>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </label>

                  <label className="mk-field mk-textarea">
                    <span>Message *</span>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe the role, location, salary range, timeline, and contact details."
                      required
                    />
                  </label>
                </div>

                <div className="mk-modalActions">
                  <button type="button" className="mk-btn mk-btnGhost" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="mk-btn mk-btnPrimary">
                    Send Request
                  </button>
                </div>

                {toast ? (
                  <div className="mk-toast">✅ Request sent (demo). Backend will email admin and queue the request.</div>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}