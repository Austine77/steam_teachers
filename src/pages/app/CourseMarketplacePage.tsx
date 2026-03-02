import React, { useEffect, useMemo, useState } from "react";
import "./CourseMarketplacePage.css";
import { setPaidPlan, type PlanKey } from "../utils/paymentStore";
type Track = "STEAM ONE" | "STEAM TWO" | "STEAM THREE";
type Level = "Beginner" | "Intermediate" | "Advanced";
type Badge = "Featured" | "Popular" | "New" | "Recommended";

type Course = {
  id: string;
  title: string;
  subtitle: string;
  track: Track;
  level: Level;
  badge?: Badge;
  price: number; // NGN
  durationWeeks: number;
  lessons: number;
  projects: number;
  rating: number; // 0-5
  learners: number;
  instructor: string;
  summary: string;
  outcomes: string[];
  modules: string[];
  includes: string[];
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

function formatNGN(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function CourseMarketplacePage() {
  // Nigeria time
  const [lagosNow, setLagosNow] = useState(getLagosTimeString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const courses: Course[] = useMemo(
    () => [
      {
        id: "c_s1",
        title: "STEAM ONE Certification",
        subtitle: "Foundations of digital teaching, classroom readiness & professional practice.",
        track: "STEAM ONE",
        level: "Beginner",
        badge: "Featured",
        price: 15000,
        durationWeeks: 6,
        lessons: 28,
        projects: 4,
        rating: 4.7,
        learners: 3200,
        instructor: "STEAM ONE Faculty",
        summary:
          "A structured foundation program for pre-service and in-service teachers to master digital teaching fundamentals with international alignment (ISTE • UNESCO ICT CFT • PISA).",
        outcomes: [
          "Design inclusive lesson plans using modern pedagogy",
          "Use productivity tools for teaching and assessment",
          "Build digital classroom management skills",
          "Complete capstone project and be eligible for certification",
        ],
        modules: [
          "Teaching in the Digital Age",
          "Classroom Tech Essentials",
          "Assessment & Feedback Systems",
          "Inclusive Learning & Accessibility",
          "Capstone Project",
        ],
        includes: ["Live classes", "Recorded lessons", "Projects & templates", "Certificate eligibility", "Community access"],
      },
      {
        id: "c_s2",
        title: "STEAM TWO Certification",
        subtitle: "Technology integration for STEM/STEAM teaching with deeper learning methods.",
        track: "STEAM TWO",
        level: "Intermediate",
        badge: "Popular",
        price: 20000,
        durationWeeks: 8,
        lessons: 34,
        projects: 5,
        rating: 4.8,
        learners: 1900,
        instructor: "Certified Facilitators",
        summary:
          "Learn practical technology integration strategies for various subjects, collaborate on lesson design, and implement evaluation methods suitable for real classrooms.",
        outcomes: [
          "Integrate technology into STEAM lessons with confidence",
          "Create interactive learning activities",
          "Apply effective digital assessment methods",
          "Deliver classroom-ready STEAM projects",
        ],
        modules: [
          "Instructional Design for STEAM",
          "Interactive Tools & Simulations",
          "Learning Analytics Basics",
          "Assessment Automation",
          "Teaching Practicum",
        ],
        includes: ["Live labs", "Toolkits", "Mentorship sessions", "Certificate eligibility", "Marketplace profile upgrade"],
      },
      {
        id: "c_s3",
        title: "STEAM THREE Certification",
        subtitle: "Advanced AI-integrated teaching, creativity, leadership & innovation mastery.",
        track: "STEAM THREE",
        level: "Advanced",
        badge: "Recommended",
        price: 25000,
        durationWeeks: 10,
        lessons: 42,
        projects: 7,
        rating: 4.9,
        learners: 950,
        instructor: "Expert Educator Panel",
        summary:
          "For experienced educators ready to lead with innovation. Build AI-supported lesson workflows, advanced digital content, and become a role model for modern teaching excellence.",
        outcomes: [
          "Design AI-assisted lesson plans responsibly",
          "Build creative student-centered activities",
          "Develop leadership & mentoring capacity",
          "Produce portfolio-ready capstone for recruiting",
        ],
        modules: [
          "AI for Teaching & Productivity",
          "Ethics, Safety & Responsible AI",
          "Advanced Learning Design",
          "School Innovation Planning",
          "Expert Capstone Portfolio",
        ],
        includes: ["AI templates", "Advanced labs", "Portfolio review", "Certificate eligibility", "Recruiter visibility boost"],
      },
      // Extra courses to make marketplace rich
      {
        id: "c_bonus_1",
        title: "Digital Classroom Management",
        subtitle: "Routines, engagement and safe learning environments.",
        track: "STEAM ONE",
        level: "Beginner",
        badge: "New",
        price: 12000,
        durationWeeks: 4,
        lessons: 16,
        projects: 2,
        rating: 4.6,
        learners: 1400,
        instructor: "Teaching Practice Team",
        summary:
          "Improve classroom structure using practical digital tools and human-centered strategies that improve learning outcomes.",
        outcomes: ["Classroom routines", "Student engagement", "Behavior tracking", "Parent communication"],
        modules: ["Foundations", "Engagement", "Support & Safety", "Toolkit practice"],
        includes: ["Templates", "Checklists", "Recorded lessons"],
      },
      {
        id: "c_bonus_2",
        title: "Assessment & Feedback Mastery",
        subtitle: "Build smarter quizzes, rubrics, and learner feedback loops.",
        track: "STEAM TWO",
        level: "Intermediate",
        badge: "Popular",
        price: 18000,
        durationWeeks: 5,
        lessons: 22,
        projects: 3,
        rating: 4.7,
        learners: 1650,
        instructor: "Assessment Studio",
        summary:
          "Create assessments aligned to objectives and track performance using lightweight analytics and digital tools.",
        outcomes: ["Rubrics & grading", "Formative checks", "Student feedback systems", "Learning analytics basics"],
        modules: ["Rubrics", "Digital quizzes", "Feedback loops", "Reporting"],
        includes: ["Live workshop", "Sample rubrics", "Course assets"],
      },
      {
        id: "c_bonus_3",
        title: "AI Lesson Planning Toolkit",
        subtitle: "Practical AI prompts, planning workflows, and safe classroom usage.",
        track: "STEAM THREE",
        level: "Advanced",
        badge: "Featured",
        price: 22000,
        durationWeeks: 6,
        lessons: 26,
        projects: 4,
        rating: 4.8,
        learners: 1100,
        instructor: "AI Education Lab",
        summary:
          "Apply AI responsibly to plan lessons, generate quizzes, differentiate instruction, and save time without compromising quality.",
        outcomes: ["Prompting workflows", "Differentiation", "Ethical AI usage", "Teacher productivity"],
        modules: ["Prompting basics", "Workflow design", "Ethics", "Capstone"],
        includes: ["Prompt packs", "Templates", "Portfolio review"],
      },
    ],
    []
  );

  // Filters
  const [q, setQ] = useState("");
  const [track, setTrack] = useState<"All" | Track>("All");
  const [level, setLevel] = useState<"All" | Level>("All");
  const [price, setPrice] = useState<"All" | "Under 15000" | "15000-20000" | "Above 20000">("All");
  const [sort, setSort] = useState<"Recommended" | "Lowest Price" | "Highest Rating" | "Most Learners">(
    "Recommended"
  );

  // Wishlist (demo)
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  // Details modal
  const [openId, setOpenId] = useState<string | null>(null);
  const selected = useMemo(() => courses.find((c) => c.id === openId) ?? null, [courses, openId]);

  // Checkout modal (demo)
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [payCourse, setPayCourse] = useState<Course | null>(null);
  const [payMethod, setPayMethod] = useState<"Paystack" | "Flutterwave" | "Card">("Paystack");
  const [agree, setAgree] = useState(false);

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 1800);
  };

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = courses
      .filter((c) =>
        query
          ? (c.title + " " + c.subtitle + " " + c.track + " " + c.level + " " + c.instructor)
              .toLowerCase()
              .includes(query)
          : true
      )
      .filter((c) => (track === "All" ? true : c.track === track))
      .filter((c) => (level === "All" ? true : c.level === level))
      .filter((c) => {
        if (price === "All") return true;
        if (price === "Under 15000") return c.price < 15000;
        if (price === "15000-20000") return c.price >= 15000 && c.price <= 20000;
        return c.price > 20000;
      });

    if (sort === "Lowest Price") list = list.slice().sort((a, b) => a.price - b.price);
    if (sort === "Highest Rating") list = list.slice().sort((a, b) => b.rating - a.rating);
    if (sort === "Most Learners") list = list.slice().sort((a, b) => b.learners - a.learners);
    // Recommended: keep original order (already curated)
    return list;
  }, [courses, q, track, level, price, sort]);

  const featured = useMemo(() => courses.filter((c) => c.badge === "Featured").slice(0, 2), [courses]);

  const openDetails = (id: string) => setOpenId(id);
  const closeDetails = () => setOpenId(null);

  const toggleWish = (id: string) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
    showToast("Saved to wishlist (demo).");
  };

  const startCheckout = (course: Course) => {
    setPayCourse(course);
    setPayMethod("Paystack");
    setAgree(false);
    setCheckoutOpen(true);
  };

  const confirmPayment = () => {
  if (!payCourse) return;
  if (!agree) return showToast("Please accept the terms to continue.");

  // Save paid plan to localStorage
  setPaidPlan(payCourse.track as PlanKey, true);

  setCheckoutOpen(false);
  showToast(`✅ Payment initiated for ${payCourse.title} (demo). Plan unlocked on Teacher Dashboard.`);
  // later: navigate("/teacher-dashboard");
};

  const statCards = useMemo(
    () => [
      { ico: "📚", label: "Courses", value: String(courses.length), hint: "Available" },
      { ico: "👩‍🏫", label: "Facilitators", value: "48+", hint: "Verified" },
      { ico: "🎓", label: "Certificates", value: "12k+", hint: "Issued" },
      { ico: "🌍", label: "Learners", value: "20k+", hint: "Community" },
    ],
    [courses.length]
  );

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
          <div className="mpSideTitle">Course Marketplace</div>
          <div className="mpSideSub">
            Browse paid certification programs and professional modules aligned with ISTE • UNESCO ICT CFT • PISA.
          </div>
          <button className="mpBtn mpBtnPay" onClick={() => showToast("Marketplace promotion (demo).")}>
            🔥 Featured Deals
          </button>
        </div>

        <nav className="mpNav" aria-label="Navigation">
          <button className="mpNavItem">🏠 Dashboard</button>
          <button className="mpNavItem active">🛒 Course Marketplace</button>
          <button className="mpNavItem">📚 My Courses</button>
          <button className="mpNavItem">📝 Assignments</button>
          <button className="mpNavItem">🧍 Attendance</button>
          <button className="mpNavItem">🏅 Certificates</button>
          <button className="mpNavItem">📣 Announcements</button>
          <button className="mpNavItem">🧑‍💻 Contact Admin</button>
          <button className="mpNavItem">⚙ Settings</button>
        </nav>

        <div className="mpSideFooter">
          <div className="mpSideFooterRow">
            <span className="mpDot" /> <span>Trusted by ISTE • UNESCO • PISA</span>
          </div>
          <div className="mpSideFooterCopy">© 2026 STEAM ONE Platform</div>
        </div>
      </aside>

      {/* Main */}
      <section className="mpMain">
        {/* Header */}
        <header className="mpTop">
          <div className="mpTopLeft">
            <div className="mpTitle">Course Marketplace</div>
            <div className="mpSub">
              Choose a plan, pay, and start learning. Professional UI ready for backend integration.
            </div>
            <div className="mpTime">
              Nigeria Time: <span className="mpTimeRed">{lagosNow}</span>
            </div>
          </div>

          <div className="mpTopRight">
            <div className="mpSearch">
              <span className="mpSearchIcon">🔎</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search courses, track, instructor..."
                aria-label="Search courses"
              />
            </div>

            <button className="mpIconBtn" aria-label="Wishlist" title="Wishlist">
              ❤️ <span className="mpBadge">{Object.values(wishlist).filter(Boolean).length}</span>
            </button>
            <button className="mpIconBtn" aria-label="Notifications" title="Notifications">
              🔔
            </button>

            <button className="mpUserChip" aria-label="User menu">
              <span className="mpUserMiniAvatar" aria-hidden="true" />
              <span className="mpUserText">
                <span className="mpUserName">Teacher User</span>
                <span className="mpUserRole">Marketplace Access</span>
              </span>
              <span className="mpCaret">▾</span>
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="mpStats">
          {statCards.map((s) => (
            <div className="mpStat" key={s.label}>
              <div className="mpStatIco">{s.ico}</div>
              <div>
                <div className="mpStatLabel">{s.label}</div>
                <div className="mpStatValue">{s.value}</div>
              </div>
              <div className="mpStatHint">{s.hint}</div>
            </div>
          ))}
        </div>

        {/* Featured Banner */}
        <div className="mpHero">
          <div className="mpHeroLeft">
            <div className="mpHeroKicker">Microsoft Education-aligned Professional Programs</div>
            <h2 className="mpHeroTitle">
              Upgrade your teaching career with paid STEAM certifications
            </h2>
            <p className="mpHeroText">
              Enroll in STEAM ONE, TWO, or THREE. Make payment and unlock learning instantly (demo). Certificates are
              issued after completion and verification.
            </p>

            <div className="mpHeroActions">
              <button
                className="mpBtn mpBtnPrimary"
                onClick={() => startCheckout(courses.find((c) => c.id === "c_s1")!)}
              >
                Enroll STEAM ONE ₦15,000
              </button>
              <button className="mpBtn mpBtnGhost" onClick={() => showToast("Explore tracks (demo).")}>
                Explore Tracks
              </button>
            </div>

            <div className="mpHeroChips">
              <span className="mpChip">ISTE Standards</span>
              <span className="mpChip">UNESCO ICT CFT</span>
              <span className="mpChip">PISA Benchmarks</span>
              <span className="mpChip">Verified Marketplace</span>
            </div>
          </div>

          <div className="mpHeroRight">
            <div className="mpHeroCard">
              <div className="mpHeroCardTop">
                <div className="mpHeroCardTitle">Featured Picks</div>
                <div className="mpHeroCardHint">High-impact courses curated for you.</div>
              </div>

              <div className="mpFeaturedList">
                {featured.map((c) => (
                  <div className="mpFeaturedItem" key={c.id}>
                    <div className="mpFeaturedBadge">{c.badge}</div>
                    <div className="mpFeaturedName">{c.title}</div>
                    <div className="mpFeaturedMeta">
                      <span className="mpMini">{c.track}</span>
                      <span className="mpSep">•</span>
                      <span className="mpMini">{c.level}</span>
                      <span className="mpSep">•</span>
                      <span className="mpMini">{formatNGN(c.price)}</span>
                    </div>

                    <div className="mpFeaturedActions">
                      <button className="mpBtn mpBtnGhostSmall" onClick={() => openDetails(c.id)}>
                        View
                      </button>
                      <button className="mpBtn mpBtnPaySmall" onClick={() => startCheckout(c)}>
                        Pay Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mpHeroNote">
                ✅ Paystack / Flutterwave / Card placeholders included. Backend integration later.
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mpCard">
          <div className="mpCardHead">
            <div>
              <div className="mpH3">Browse Courses</div>
              <div className="mpHint">Filter by track, level, and price. Then enroll.</div>
            </div>
            <div className="mpCardActions">
              <button
                className="mpBtn mpBtnGhost"
                onClick={() => {
                  setQ("");
                  setTrack("All");
                  setLevel("All");
                  setPrice("All");
                  setSort("Recommended");
                  showToast("Filters reset.");
                }}
              >
                Reset
              </button>
              <button className="mpBtn mpBtnPrimary" onClick={() => showToast("Compare courses (demo).")}>
                Compare
              </button>
            </div>
          </div>

          <div className="mpFilters">
            <label className="mpSelect">
              <span>Track</span>
              <select value={track} onChange={(e) => setTrack(e.target.value as any)}>
                <option value="All">All</option>
                <option value="STEAM ONE">STEAM ONE</option>
                <option value="STEAM TWO">STEAM TWO</option>
                <option value="STEAM THREE">STEAM THREE</option>
              </select>
            </label>

            <label className="mpSelect">
              <span>Level</span>
              <select value={level} onChange={(e) => setLevel(e.target.value as any)}>
                <option value="All">All</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </label>

            <label className="mpSelect">
              <span>Price</span>
              <select value={price} onChange={(e) => setPrice(e.target.value as any)}>
                <option value="All">All</option>
                <option value="Under 15000">Under ₦15,000</option>
                <option value="15000-20000">₦15,000 - ₦20,000</option>
                <option value="Above 20000">Above ₦20,000</option>
              </select>
            </label>

            <label className="mpSelect">
              <span>Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as any)}>
                <option value="Recommended">Recommended</option>
                <option value="Lowest Price">Lowest Price</option>
                <option value="Highest Rating">Highest Rating</option>
                <option value="Most Learners">Most Learners</option>
              </select>
            </label>

            <div className="mpInlineInfo">
              Showing <b>{filtered.length}</b> of <b>{courses.length}</b>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="mpGrid">
          {filtered.map((c) => (
            <article className="mpCourse" key={c.id}>
              <div className="mpCourseTop">
                <div className="mpCourseBadgeRow">
                  {c.badge && <span className={`mpBadgePill ${c.badge.toLowerCase()}`}>{c.badge}</span>}
                  <button className="mpWish" onClick={() => toggleWish(c.id)} aria-label="Add to wishlist">
                    {wishlist[c.id] ? "❤️" : "🤍"}
                  </button>
                </div>

                <h3 className="mpCourseTitle">{c.title}</h3>
                <p className="mpCourseSub">{c.subtitle}</p>

                <div className="mpMetaRow">
                  <span className={`mpTrack ${c.track.replace(" ", "").toLowerCase()}`}>{c.track}</span>
                  <span className="mpSep">•</span>
                  <span className="mpMini">{c.level}</span>
                  <span className="mpSep">•</span>
                  <span className="mpMini">{c.durationWeeks} weeks</span>
                </div>

                <div className="mpMetaRow">
                  <span className="mpMini">⭐ {c.rating.toFixed(1)}</span>
                  <span className="mpSep">•</span>
                  <span className="mpMini">{c.learners.toLocaleString()} learners</span>
                  <span className="mpSep">•</span>
                  <span className="mpMini">{c.instructor}</span>
                </div>
              </div>

              <div className="mpCourseBottom">
                <div className="mpPriceRow">
                  <div className="mpPrice">{formatNGN(c.price)}</div>
                  <div className="mpPriceHint">One-time payment (demo)</div>
                </div>

                <div className="mpCourseStats">
                  <div className="mpStatMini">
                    <span className="mpStatMiniIco">📘</span> {c.lessons} lessons
                  </div>
                  <div className="mpStatMini">
                    <span className="mpStatMiniIco">🧩</span> {c.projects} projects
                  </div>
                </div>

                <div className="mpCourseActions">
                  <button className="mpBtn mpBtnGhostSmall" onClick={() => openDetails(c.id)}>
                    View Details
                  </button>
                  <button className="mpBtn mpBtnPaySmall" onClick={() => startCheckout(c)}>
                    Enroll / Pay
                  </button>
                </div>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="mpEmpty">No courses match your search/filters.</div>
          )}
        </div>

        {/* Testimonials + Trust */}
        <div className="mpTwo">
          <div className="mpCard">
            <div className="mpCardHead">
              <div>
                <div className="mpH3">Why Teachers Choose STEAM ONE</div>
                <div className="mpHint">Professional learning with measurable outcomes.</div>
              </div>
            </div>

            <div className="mpWhy">
              <div className="mpWhyItem">
                <div className="mpWhyIco">✅</div>
                <div className="mpWhyTitle">Verified Certification</div>
                <div className="mpWhyText">Certificates are issued after completion and admin verification.</div>
              </div>
              <div className="mpWhyItem">
                <div className="mpWhyIco">⚙</div>
                <div className="mpWhyTitle">Practical Templates</div>
                <div className="mpWhyText">Ready-to-use lesson plans, rubrics, and classroom toolkits.</div>
              </div>
              <div className="mpWhyItem">
                <div className="mpWhyIco">🎯</div>
                <div className="mpWhyTitle">Career Growth</div>
                <div className="mpWhyText">Boost recruiter visibility and build portfolio-ready projects.</div>
              </div>
              <div className="mpWhyItem">
                <div className="mpWhyIco">🧠</div>
                <div className="mpWhyTitle">AI-Ready Skills</div>
                <div className="mpWhyText">Learn responsible AI usage for teaching and productivity.</div>
              </div>
            </div>
          </div>

          <div className="mpCard">
            <div className="mpCardHead">
              <div>
                <div className="mpH3">Teacher Feedback</div>
                <div className="mpHint">What teachers say about these programs.</div>
              </div>
            </div>

            <div className="mpQuotes">
              <div className="mpQuote">
                <div className="mpQuoteTop">
                  <span className="mpAvatar" />
                  <div>
                    <div className="mpQName">Oluwaseun A.</div>
                    <div className="mpQRole">Primary School Teacher</div>
                  </div>
                  <div className="mpQR">⭐ 5.0</div>
                </div>
                <div className="mpQText">
                  “The lessons are practical and I used the templates immediately in my class. Very professional.”
                </div>
              </div>

              <div className="mpQuote">
                <div className="mpQuoteTop">
                  <span className="mpAvatar" />
                  <div>
                    <div className="mpQName">Grace N.</div>
                    <div className="mpQRole">STEM Educator</div>
                  </div>
                  <div className="mpQR">⭐ 4.9</div>
                </div>
                <div className="mpQText">
                  “STEAM THREE helped me structure AI usage responsibly. The capstone improved my recruiter chances.”
                </div>
              </div>

              <div className="mpQuote">
                <div className="mpQuoteTop">
                  <span className="mpAvatar" />
                  <div>
                    <div className="mpQName">Ibrahim K.</div>
                    <div className="mpQRole">Secondary School Teacher</div>
                  </div>
                  <div className="mpQR">⭐ 4.8</div>
                </div>
                <div className="mpQText">
                  “The live labs and mentorship sessions were the best. Great platform and design.”
                </div>
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

      {/* Details Modal */}
      {selected && (
        <div className="mpModalOverlay" role="dialog" aria-modal="true" aria-label="Course details">
          <div className="mpModal">
            <div className="mpModalHead">
              <div className="mpModalHeadLeft">
                <div className="mpModalTitle">{selected.title}</div>
                <div className="mpModalSub">{selected.subtitle}</div>
                <div className="mpModalMeta">
                  <span className={`mpTrack ${selected.track.replace(" ", "").toLowerCase()}`}>{selected.track}</span>
                  <span className="mpSep">•</span>
                  <span className="mpMini">{selected.level}</span>
                  <span className="mpSep">•</span>
                  <span className="mpMini">{selected.durationWeeks} weeks</span>
                  <span className="mpSep">•</span>
                  <span className="mpMini">⭐ {selected.rating.toFixed(1)}</span>
                </div>
              </div>
              <button className="mpModalClose" onClick={closeDetails} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="mpModalBody">
              <div className="mpModalGrid">
                <div className="mpBlock">
                  <div className="mpBTitle">Summary</div>
                  <div className="mpBText">{selected.summary}</div>

                  <div className="mpBTitle">What you’ll achieve</div>
                  <ul className="mpList">
                    {selected.outcomes.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </div>

                <div className="mpBlock">
                  <div className="mpBTitle">Modules</div>
                  <div className="mpPills">
                    {selected.modules.map((m) => (
                      <span className="mpPill" key={m}>
                        {m}
                      </span>
                    ))}
                  </div>

                  <div className="mpBTitle" style={{ marginTop: 12 }}>Includes</div>
                  <ul className="mpList">
                    {selected.includes.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>

                <div className="mpBlock mpBlockPay">
                  <div className="mpPayTop">
                    <div>
                      <div className="mpPayPrice">{formatNGN(selected.price)}</div>
                      <div className="mpPayHint">One-time payment (demo)</div>
                    </div>
                    <div className="mpPayBox">
                      <div className="mpPayMini">
                        <b>{selected.lessons}</b> lessons
                      </div>
                      <div className="mpPayMini">
                        <b>{selected.projects}</b> projects
                      </div>
                      <div className="mpPayMini">
                        <b>{selected.learners.toLocaleString()}</b> learners
                      </div>
                    </div>
                  </div>

                  <button className="mpBtn mpBtnPay" onClick={() => startCheckout(selected)}>
                    Enroll / Pay Now
                  </button>
                  <button className="mpBtn mpBtnGhost" onClick={() => toggleWish(selected.id)}>
                    {wishlist[selected.id] ? "❤️ Saved" : "🤍 Add to Wishlist"}
                  </button>

                  <div className="mpSafe">
                    ✅ Secure payment placeholders: Paystack / Flutterwave / Card. Backend will confirm payment later.
                  </div>
                </div>
              </div>
            </div>

            <div className="mpModalFoot">
              <button className="mpBtn mpBtnGhost" onClick={closeDetails}>Close</button>
              <button className="mpBtn mpBtnPrimary" onClick={() => startCheckout(selected)}>
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && payCourse && (
        <div className="mpModalOverlay" role="dialog" aria-modal="true" aria-label="Checkout modal">
          <div className="mpModal">
            <div className="mpModalHead">
              <div className="mpModalHeadLeft">
                <div className="mpModalTitle">Checkout</div>
                <div className="mpModalSub">
                  You are enrolling in <b>{payCourse.title}</b>. Complete payment to unlock learning (demo).
                </div>
              </div>
              <button className="mpModalClose" onClick={() => setCheckoutOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="mpModalBody">
              <div className="mpCheckout">
                <div className="mpCheckoutLeft">
                  <div className="mpBlock">
                    <div className="mpBTitle">Order Summary</div>
                    <div className="mpOrderRow">
                      <span>Course</span>
                      <b>{payCourse.title}</b>
                    </div>
                    <div className="mpOrderRow">
                      <span>Track</span>
                      <b>{payCourse.track}</b>
                    </div>
                    <div className="mpOrderRow">
                      <span>Level</span>
                      <b>{payCourse.level}</b>
                    </div>
                    <div className="mpOrderRow">
                      <span>Amount</span>
                      <b>{formatNGN(payCourse.price)}</b>
                    </div>

                    <div className="mpDivider" />

                    <div className="mpOrderTotal">
                      <span>Total</span>
                      <b>{formatNGN(payCourse.price)}</b>
                    </div>
                  </div>

                  <div className="mpBlock">
                    <div className="mpBTitle">Payment Method</div>
                    <div className="mpPayMethods">
                      {(["Paystack", "Flutterwave", "Card"] as const).map((m) => (
                        <button
                          key={m}
                          className={`mpPayMethod ${payMethod === m ? "active" : ""}`}
                          onClick={() => setPayMethod(m)}
                        >
                          {m}
                        </button>
                      ))}
                    </div>

                    <div className="mpPayHintBox">
                      <b>Note:</b> This is a frontend placeholder. Backend will generate payment link and confirm success.
                    </div>
                  </div>
                </div>

                <div className="mpCheckoutRight">
                  <div className="mpBlock mpBlockPay">
                    <div className="mpBTitle">Billing Details (Demo)</div>
                    <div className="mpFieldRow">
                      <label className="mpField">
                        <span>Full Name</span>
                        <input placeholder="Teacher name" defaultValue="Teacher User" />
                      </label>
                      <label className="mpField">
                        <span>Email</span>
                        <input placeholder="email@example.com" defaultValue="teacher@example.com" />
                      </label>
                    </div>

                    <label className="mpField">
                      <span>Phone</span>
                      <input placeholder="+234..." defaultValue="+234 000 000 0000" />
                    </label>

                    <label className="mpAgree">
                      <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                      <span>
                        I agree to the Terms and understand that payment is required before accessing learning content.
                      </span>
                    </label>

                    <button className="mpBtn mpBtnPay" onClick={confirmPayment}>
                      Pay {formatNGN(payCourse.price)}
                    </button>
                    <button className="mpBtn mpBtnGhost" onClick={() => setCheckoutOpen(false)}>
                      Cancel
                    </button>

                    <div className="mpSafe">
                      🔒 Secure checkout UI. Replace with Paystack/Flutterwave redirect + callback later.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mpModalFoot">
              <button className="mpBtn mpBtnGhost" onClick={() => setCheckoutOpen(false)}>
                Close
              </button>
              <button className="mpBtn mpBtnPrimary" onClick={confirmPayment}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="mpToast">{toast}</div>}
    </div>
  );
}