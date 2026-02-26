import React, { useEffect, useMemo, useState } from "react";
import "./CourseDetailsPage.css";

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

type PlanId = "steam1" | "steam2" | "steam3";
type Provider = "Paystack" | "Flutterwave" | "Stripe";

type Course = {
  id: PlanId;
  title: string;
  subtitle: string;
  level: "Introductory" | "Intermediate" | "Advanced";
  priceUSD: number;
  duration: string;
  certificate: string;
  standards: string[];
  skills: string[];
  modules: { title: string; lessons: string[] }[];
  outcomes: string[];
};

const COURSE_MAP: Record<PlanId, Course> = {
  steam1: {
    id: "steam1",
    title: "STEAM ONE",
    subtitle: "Introductory Certification Program for Pre-Service & In-Service Teachers",
    level: "Introductory",
    priceUSD: 99,
    duration: "4–6 Weeks (self-paced + optional live sessions)",
    certificate: "STEAM ONE Certified Educator Badge",
    standards: ["ISTE", "UNESCO ICT CFT", "PISA"],
    skills: ["Digital Literacy", "Teaching Foundations", "Intro to STEAM Tools", "Assessment Basics"],
    modules: [
      {
        title: "Module 1: Digital Literacy Foundations",
        lessons: ["Device & productivity basics", "Online safety & privacy", "Digital citizenship"]
      },
      {
        title: "Module 2: Teaching with Technology",
        lessons: ["Lesson planning workflows", "Classroom toolkits", "Engagement strategies"]
      },
      {
        title: "Module 3: Assessment & Evidence",
        lessons: ["Formative checks", "Rubrics & feedback", "Portfolio submission"]
      }
    ],
    outcomes: [
      "Plan tech-supported lessons aligned to global standards",
      "Demonstrate digital citizenship and safe classroom practices",
      "Submit a teacher portfolio for certification review"
    ]
  },
  steam2: {
    id: "steam2",
    title: "STEAM TWO",
    subtitle: "Technology Integration Skillset for Classroom Delivery",
    level: "Intermediate",
    priceUSD: 199,
    duration: "6–8 Weeks (projects + checkpoints)",
    certificate: "STEAM TWO Technology Integration Badge",
    standards: ["ISTE", "UNESCO ICT CFT", "PISA"],
    skills: ["Technology Integration", "Digital Teaching Tools", "Learning Design", "Classroom Projects"],
    modules: [
      {
        title: "Module 1: Instructional Design for Digital Learning",
        lessons: ["Learning objectives", "Differentiation", "Blended lesson structures"]
      },
      {
        title: "Module 2: Digital Tools & Robotics Basics",
        lessons: ["Tool selection framework", "Robotics intro", "Classroom deployment"]
      },
      {
        title: "Module 3: Performance Tasks",
        lessons: ["Project planning", "Assessment mapping", "Teacher showcase submission"]
      }
    ],
    outcomes: [
      "Integrate tools with measurable learning outcomes",
      "Deliver a classroom project using technology responsibly",
      "Complete performance tasks for verified certification"
    ]
  },
  steam3: {
    id: "steam3",
    title: "STEAM THREE",
    subtitle: "Advanced / AI-Integrated Expert Educator Program",
    level: "Advanced",
    priceUSD: 399,
    duration: "8–12 Weeks (advanced projects + leadership)",
    certificate: "STEAM THREE Expert Educator Badge",
    standards: ["ISTE", "UNESCO ICT CFT", "PISA"],
    skills: ["Advanced STEAM", "AI-Assisted Lesson Design", "Innovation & Creativity", "Mentoring"],
    modules: [
      {
        title: "Module 1: Advanced STEAM & Innovation",
        lessons: ["STEAM pedagogy", "Inquiry cycles", "Innovation planning"]
      },
      {
        title: "Module 2: AI for Teaching & Learning",
        lessons: ["AI literacy", "Prompting for lesson design", "Ethics & safeguards"]
      },
      {
        title: "Module 3: Capstone & Mentorship",
        lessons: ["Capstone project", "Evidence portfolio", "Peer mentoring plan"]
      }
    ],
    outcomes: [
      "Design AI-enhanced learning experiences with safeguards",
      "Deliver an innovation capstone with evidence and reflection",
      "Qualify for advanced listing in the verified teacher marketplace"
    ]
  }
};

export default function CourseDetailsPage() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [ngTime, setNgTime] = useState(() => formatNigeriaTime(new Date()));

  // simple local demo selector (later: read from route param)
  const [courseId, setCourseId] = useState<PlanId>("steam1");
  const course = COURSE_MAP[courseId];

  // enroll modal
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState<Provider>("Paystack");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNgTime(formatNigeriaTime(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  function openEnroll() {
    setName("");
    setEmail("");
    setProvider("Paystack");
    setToast(false);
    setOpen(true);
  }
  function closeEnroll() {
    setOpen(false);
  }
  function proceedPayment(e: React.FormEvent) {
    e.preventDefault();
    // Backend later: create payment session + redirect + email login
    setToast(true);
    window.setTimeout(() => {
      setOpen(false);
      setToast(false);
    }, 1400);
  }

  return (
    <div className="cd-root">
      {/* top strip */}
      <section className="cd-top">
        <div className="cd-topInner">
          <div className="cd-brand" aria-label="Microsoft Education">
            <div className="cd-msMark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div>
              <div className="cd-brandTitle">Microsoft Education</div>
              <div className="cd-brandSub">Course Details • Paid Certification</div>
            </div>
          </div>

          <div className="cd-topRight">
            <span className="cd-pill" title="Africa/Lagos">
              🕒 {ngTime} (Nigeria)
            </span>
            <a className="cd-btn cd-btnGhost" href="/login">
              Login
            </a>
            <a className="cd-btn cd-btnPrimary" href="/checkout">
              Enroll Now
            </a>
          </div>
        </div>
      </section>

      {/* hero */}
      <section className="cd-hero">
        <div className="cd-heroCard">
          <div className="cd-heroGrid">
            <div className="cd-heroText">
              <h1 className="cd-h1">{course.title}</h1>
              <div className="cd-subHero">{course.subtitle}</div>

              <div className="cd-heroMeta">
                <span className="cd-chip">🎓 {course.level}</span>
                <span className="cd-chip">⏱️ {course.duration}</span>
                <span className="cd-chip">🏅 {course.certificate}</span>
              </div>

              <div className="cd-heroStandards">
                {course.standards.map((s) => (
                  <span key={s} className="cd-std">{s}</span>
                ))}
              </div>

              <div className="cd-heroActions">
                <button className="cd-btn cd-btnPrimary" onClick={openEnroll}>
                  Enroll &amp; Pay
                </button>
                <a className="cd-btn cd-btnGhostDark" href="/courses">
                  Back to Courses
                </a>
              </div>
            </div>

            <div className="cd-heroArt" aria-label="Course detail banner placeholder">
              <div className="cd-artBubble cd-b1" />
              <div className="cd-artBubble cd-b2" />
              <div className="cd-artCard">
                Course Banner Illustration (Placeholder)
                <span>Replace with a course banner image.</span>
              </div>
            </div>
          </div>

          {/* small selector row (demo only) */}
          <div className="cd-switchRow">
            <div className="cd-switchLabel">Preview other plans:</div>
            <div className="cd-switch">
              <button
                className={courseId === "steam1" ? "cd-sBtn on" : "cd-sBtn"}
                onClick={() => setCourseId("steam1")}
              >
                STEAM ONE
              </button>
              <button
                className={courseId === "steam2" ? "cd-sBtn on" : "cd-sBtn"}
                onClick={() => setCourseId("steam2")}
              >
                STEAM TWO
              </button>
              <button
                className={courseId === "steam3" ? "cd-sBtn on" : "cd-sBtn"}
                onClick={() => setCourseId("steam3")}
              >
                STEAM THREE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* main panel */}
      <section className="cd-panel">
        <div className="cd-grid">
          {/* left */}
          <div className="cd-left">
            <div className="cd-card">
              <div className="cd-cardTitle">Skills You’ll Gain</div>
              <div className="cd-skillGrid">
                {course.skills.map((s) => (
                  <div key={s} className="cd-skillPill">
                    ✓ {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="cd-card">
              <div className="cd-cardTitle">Curriculum &amp; Modules</div>
              <div className="cd-modules">
                {course.modules.map((m) => (
                  <div key={m.title} className="cd-module">
                    <div className="cd-moduleHead">
                      <div className="cd-moduleTitle">{m.title}</div>
                      <div className="cd-miniTag">Included</div>
                    </div>
                    <ul className="cd-list">
                      {m.lessons.map((l) => (
                        <li key={l}>{l}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="cd-card">
              <div className="cd-cardTitle">Learning Outcomes</div>
              <ul className="cd-outcomes">
                {course.outcomes.map((o) => (
                  <li key={o}>
                    <span className="cd-dotOk" aria-hidden="true">✓</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            <div className="cd-card">
              <div className="cd-cardTitle">FAQs</div>
              <div className="cd-faq">
                <details open>
                  <summary>Is this course paid?</summary>
                  <p>
                    Yes. Access to modules and certification requires successful payment.
                    After payment, the backend will send a welcome email with login credentials.
                  </p>
                </details>
                <details>
                  <summary>Do I get a certificate?</summary>
                  <p>
                    Yes. After completing all modules and passing assessments, you receive your
                    certification badge and may request verified marketplace listing.
                  </p>
                </details>
                <details>
                  <summary>How does marketplace verification work?</summary>
                  <p>
                    Teachers listed in the marketplace are verified through paid certification
                    completion and admin review. Recruiters contact teachers via admin request flow.
                  </p>
                </details>
              </div>
            </div>
          </div>

          {/* right */}
          <aside className="cd-right">
            <div className="cd-priceCard">
              <div className="cd-priceTop">
                <div>
                  <div className="cd-priceTitle">Paid Course Access</div>
                  <div className="cd-priceSub">Secure checkout • Admin verified</div>
                </div>
                <div className="cd-lock">🔒</div>
              </div>

              <div className="cd-priceRow">
                <div className="cd-price">
                  <span className="cd-priceSym">$</span>
                  {course.priceUSD}
                </div>
                <div className="cd-priceBadge">One-time payment</div>
              </div>

              <div className="cd-whatYouGet">
                <div className="cd-wTitle">What you get</div>
                <ul>
                  <li>Full module access</li>
                  <li>Assessments &amp; portfolio review</li>
                  <li>Certificate / badge on completion</li>
                  <li>Eligibility for verified marketplace listing</li>
                </ul>
              </div>

              <button className="cd-btn cd-btnPrimary cd-enrollWide" onClick={openEnroll}>
                Enroll &amp; Pay Now
              </button>

              <div className="cd-note">
                Payment providers supported: Paystack, Flutterwave, Stripe (backend will connect).
              </div>
            </div>

            <div className="cd-instructorCard">
              <div className="cd-cardTitle">Instructor &amp; Support</div>
              <div className="cd-instructor">
                <div className="cd-avatar" aria-hidden="true">ME</div>
                <div>
                  <div className="cd-insName">Microsoft Education Partner Facilitators</div>
                  <div className="cd-insRole">Certified STEAM &amp; Digital Teaching Coaches</div>
                </div>
              </div>
              <div className="cd-insText">
                Get guided resources, optional live sessions, and structured feedback on your
                portfolio submission.
              </div>

              <a className="cd-btn cd-btnGhostDark cd-helpBtn" href="/contact">
                Contact Support
              </a>
            </div>

            <div className="cd-testCard">
              <div className="cd-cardTitle">What Educators Say</div>
              <div className="cd-quote">
                <div className="cd-stars" aria-hidden="true">★★★★★</div>
                “Practical, standards-aligned, and easy to apply in my classroom. The portfolio
                helped me prove my impact.”
                <div className="cd-quoteBy">— Certified Teacher</div>
              </div>
            </div>
          </aside>
        </div>

        {/* bottom CTA */}
        <div className="cd-cta">
          <h3 className="cd-ctaTitle">Ready to Become a Certified 21st Century Educator?</h3>
          <div className="cd-ctaBtns">
            <button className="cd-btn cd-btnPrimary" onClick={openEnroll}>
              Enroll &amp; Pay
            </button>
            <a className="cd-btn cd-btnGhost" href="/marketplace">
              View Marketplace
            </a>
          </div>
          <div className="cd-trustedSmall">
            Compliant with ISTE Standards • UNESCO ICT CFT Framework • PISA • Microsoft Education
          </div>
        </div>

        {/* footer */}
        <div className="cd-footer">
          <div className="cd-copy">© {year} STEAM ONE Platform • All rights reserved</div>
        </div>
      </section>

      {/* enroll modal */}
      {open ? (
        <div className="cd-modalOverlay" role="dialog" aria-modal="true" aria-labelledby="cd-modalTitle">
          <div className="cd-modal">
            <div className="cd-modalHead">
              <strong id="cd-modalTitle">Checkout • {course.title}</strong>
              <button className="cd-closeX" onClick={closeEnroll} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="cd-modalBody">
              <div className="cd-summary">
                <div className="cd-summaryRow">
                  <span>Plan</span>
                  <b>{course.title}</b>
                </div>
                <div className="cd-summaryRow">
                  <span>Price</span>
                  <b>${course.priceUSD}</b>
                </div>
                <div className="cd-summaryRow">
                  <span>Access</span>
                  <b>Paid modules + certificate</b>
                </div>
              </div>

              <form onSubmit={proceedPayment} className="cd-payForm">
                <div className="cd-formGrid">
                  <label className="cd-field">
                    <span>Full Name *</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} required />
                  </label>

                  <label className="cd-field">
                    <span>Email *</span>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </label>

                  <label className="cd-field cd-wide">
                    <span>Payment Provider</span>
                    <select value={provider} onChange={(e) => setProvider(e.target.value as Provider)}>
                      <option value="Paystack">Paystack</option>
                      <option value="Flutterwave">Flutterwave</option>
                      <option value="Stripe">Stripe</option>
                    </select>
                    <small className="cd-help">
                      Backend will create a payment session and redirect to {provider}.
                    </small>
                  </label>
                </div>

                <div className="cd-modalActions">
                  <button type="button" className="cd-btn cd-btnGhostDark" onClick={closeEnroll}>
                    Cancel
                  </button>
                  <button type="submit" className="cd-btn cd-btnPrimary">
                    Proceed to Payment
                  </button>
                </div>

                {toast ? (
                  <div className="cd-toast">
                    ✅ Payment started (demo). Backend will handle payment + welcome email + login.
                  </div>
                ) : null}
              </form>

              <div className="cd-disclaimer">
                After successful payment, the backend will send your <b>welcome email</b> with login
                details and course commencement information.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}