import React, { useEffect, useMemo, useState } from "react";
import "./HomePage.css";

type ModalMode = "enroll" | "contact" | "recruit";

type Program = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  bullets: string[];
  tone: "blue" | "cyan" | "orange";
};

type Teacher = {
  id: string;
  name: string;
  role: string;
  bullets: string[];
};

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
    // fallback: UTC+1
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const lagos = new Date(utc + 60 * 60000);
    return lagos.toLocaleString("en-NG");
  }
}

export default function HomePage() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [ngTime, setNgTime] = useState(() => formatNigeriaTime(new Date()));

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("enroll");
  const [target, setTarget] = useState<string>("");
  const [meta, setMeta] = useState<string>("—");
  const [toast, setToast] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const programs: Program[] = [
    {
      id: "steam-one",
      title: "STEAM ONE",
      subtitle: "Introductory Courses",
      price: 599,
      bullets: ["Digital Literacy", "Teaching Foundations"],
      tone: "blue"
    },
    {
      id: "steam-two",
      title: "STEAM TWO",
      subtitle: "Technology in Teaching",
      price: 199,
      bullets: ["Technology Integration", "Digital Teaching Tools"],
      tone: "cyan"
    },
    {
      id: "steam-three",
      title: "STEAM THREE",
      subtitle: "Advanced the Course",
      price: 399,
      bullets: ["Advanced STEAM", "Creating Learning Pathways"],
      tone: "orange"
    }
  ];

  const teachers: Teacher[] = [
    {
      id: "t1",
      name: "Jane Doe",
      role: "AI School Teacher",
      bullets: ["Policy & Curriculum Development", "Elem. School Teacher"]
    },
    {
      id: "t2",
      name: "Michael Smith",
      role: "Middle School Lecturer",
      bullets: ["Technology Integration", "Middle School Educator"]
    },
    {
      id: "t3",
      name: "Laura Kim",
      role: "Tech School Teacher",
      bullets: ["Digital Transformation", "High School Teacher"]
    },
    {
      id: "t4",
      name: "David Johnson",
      role: "Digital Educator",
      bullets: ["Lead Learning & STEAM Education", "Senior Lecturer"]
    }
  ];

  useEffect(() => {
    const id = window.setInterval(() => setNgTime(formatNigeriaTime(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  function openModal(args: {
    mode: ModalMode;
    title: string;
    meta: string;
    messagePlaceholder: string;
    target?: string;
  }) {
    setMode(args.mode);
    setTarget(args.target || "");
    setMeta(args.meta);
    setToast(false);

    setFullName("");
    setEmail("");
    setMessage("");

    setIsOpen(true);

    // set placeholder by putting a helper text into message if empty
    // (we keep placeholder in UI too)
    (window as any).__msgPlaceholder = args.messagePlaceholder;
  }

  function closeModal() {
    setIsOpen(false);
  }

  function enroll(program: Program) {
    openModal({
      mode: "enroll",
      title: "Enroll & Pay (Demo)",
      meta: `${program.title} • $${program.price} • Paid Course`,
      messagePlaceholder: "Tell us your preferred start date or any note (demo).",
      target: program.title
    });
  }

  function contactTeacher(t: Teacher) {
    openModal({
      mode: "contact",
      title: "Contact Teacher (Admin-mediated)",
      meta: `${t.name} • Request goes to Admin Email`,
      messagePlaceholder: "Describe the role, location, salary range, timeline, and contact details.",
      target: t.name
    });
  }

  function recruitTeacher() {
    openModal({
      mode: "recruit",
      title: "Recruit a Teacher (Demo)",
      meta: "Recruitment Form • Sent to Admin Queue",
      messagePlaceholder: "What teacher role do you need? Location? Timeline? Requirements?",
      target: "Recruitment"
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Frontend demo:
    // Backend should:
    // - enroll: create order + payment reference (Paystack/Flutterwave/Stripe)
    // - contact: send email to admin / create ticket
    // - recruit: store form + notify admin
    setToast(true);

    window.setTimeout(() => {
      setIsOpen(false);
      setToast(false);
    }, 1200);
  }

  const msgPlaceholder =
    (window as any).__msgPlaceholder ||
    "Write your message...";

  return (
    <div className="hm-root">
      {/* Top “Microsoft Education” header inside page (wireframe style) */}
      <section className="hm-top">
        <div className="hm-topInner">
          <div className="hm-brand" aria-label="Microsoft Education">
            <div className="hm-msMark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div>
              <div className="hm-brandTitle">Microsoft Education</div>
              <div className="hm-brandSub">STEAM Teacher Certification Platform</div>
            </div>
          </div>

          <div className="hm-topRight">
            <span className="hm-pill" title="Africa/Lagos">🕒 {ngTime} (Nigeria)</span>
            <button className="hm-btn hm-btnPrimary" onClick={() => {
              const el = document.getElementById("hm-courses");
              el?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}>
              Enroll Now
            </button>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="hm-hero">
        <div className="hm-heroCard">
          <div className="hm-heroGrid">
            <div>
              <h1 className="hm-h1">
                Skilling Teachers Towards <br />
                STEAM Excellence
              </h1>

              <p className="hm-heroP">
                Introductory, Advanced &amp; Expert digital teaching programs for pre-service &amp;
                in-service teachers worldwide. Aligned to <b>ISTE Standards</b>,{" "}
                <b>UNESCO ICT CFT</b> framework and international <b>PISA</b> standard.
              </p>

              <div className="hm-heroActions">
                <button
                  className="hm-btn hm-btnGhost"
                  onClick={() => {
                    const el = document.getElementById("hm-courses");
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  View Pricing
                </button>
                <button
                  className="hm-btn hm-btnPrimary"
                  onClick={() => {
                    const el = document.getElementById("hm-courses");
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  Enroll Now
                </button>
              </div>

              <div className="hm-standards">
                <span className="hm-tag">🟦 Microsoft</span>
                <span className="hm-tag">📌 ISTE</span>
                <span className="hm-tag">🏛️ UNESCO ICT CFT</span>
                <span className="hm-tag">📊 PISA</span>
              </div>
            </div>

            {/* illustration placeholder */}
            <div className="hm-illus" aria-label="Hero illustration placeholder">
              <div className="hm-illusBubble hm-b1" />
              <div className="hm-illusBubble hm-b2" />
              <div className="hm-illusCard">
                Microsoft Education Hero Illustration (Placeholder)
                <span>Replace this block with your real hero image/illustration.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses/Programs */}
      <section className="hm-panel" id="hm-courses">
        <div className="hm-panelHead">
          <h2 className="hm-h2">Our STEAM Certification Programs</h2>
          <p className="hm-sub">
            Choose a level, review requirements, then proceed to secure payment to unlock access and
            receive login instructions by email.
          </p>
        </div>

        <div className="hm-programs">
          <div className="hm-cards3">
            {programs.map((p) => (
              <article key={p.id} className="hm-programCard">
                <div className={`hm-programTop hm-top-${p.tone}`}>
                  <div>
                    <div className="hm-programTtl">{p.title}</div>
                    <div className="hm-programSub">{p.subtitle}</div>
                  </div>
                  <div className="hm-pill hm-pillSm">Paid</div>
                </div>

                <div className="hm-programBody">
                  <ul className="hm-list">
                    {p.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>

                  <div className="hm-priceRow">
                    <div className="hm-price">
                      ${p.price} <small>/ course</small>
                    </div>
                    <div className="hm-access">
                      Standard Access <br />
                      + Resources
                    </div>
                  </div>

                  <button className="hm-payBtn" onClick={() => enroll(p)}>
                    Enroll &amp; Pay
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="hm-panelHead hm-panelHeadTight">
          <h2 className="hm-h2">Simple Enrollment Process</h2>
        </div>

        <div className="hm-steps">
          <div className="hm-stepsBar">
            <div className="hm-step">
              <div className="hm-stepNum">1</div>
              <div className="hm-stepTxt">
                Choose Course <small>Pick STEAM ONE–THREE</small>
              </div>
            </div>
            <div className="hm-step">
              <div className="hm-stepNum">2</div>
              <div className="hm-stepTxt">
                Secure Payment <small>Paystack/Flutterwave/Stripe</small>
              </div>
            </div>
            <div className="hm-step">
              <div className="hm-stepNum">3</div>
              <div className="hm-stepTxt">
                Receive Login <small>Email + commencement date</small>
              </div>
            </div>
            <div className="hm-step">
              <div className="hm-stepNum">4</div>
              <div className="hm-stepTxt">
                Start Learning <small>Complete modules &amp; get certified</small>
              </div>
            </div>
          </div>
        </div>

        {/* CTA stripe */}
        <div className="hm-ctaStripe">
          <h3 className="hm-h3">Ready to Start Your Certification?</h3>
          <div className="hm-ctaBtns">
            <button
              className="hm-btn hm-btnGhost"
              onClick={() => {
                const el = document.getElementById("hm-courses");
                el?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              View Pricing
            </button>
            <button
              className="hm-btn hm-btnPrimary"
              onClick={() => {
                const el = document.getElementById("hm-courses");
                el?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Enroll Now
            </button>
          </div>
        </div>

        {/* Marketplace */}
        <div className="hm-panelHead hm-panelHeadTight" id="hm-marketplace">
          <h2 className="hm-h2">Certified Teachers Marketplace</h2>
          <p className="hm-sub">
            After certification, teachers may opt in to our marketplace for job placement.
            “Contact this teacher” sends a request to admin for moderation.
          </p>
        </div>

        <div className="hm-market">
          <div className="hm-people">
            {teachers.map((t) => (
              <div key={t.id} className="hm-person">
                <div className="hm-personTop">
                  <div className="hm-avatar">
                    {t.name
                      .split(" ")
                      .slice(0, 2)
                      .map((x) => x[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <div className="hm-personName">{t.name}</div>
                    <div className="hm-role">{t.role}</div>
                  </div>
                </div>

                <div className="hm-personBody">
                  <ul className="hm-bullet">
                    {t.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>

                  <button className="hm-contactBtn" onClick={() => contactTeacher(t)}>
                    Contact This Teacher
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recruit */}
        <div className="hm-panelHead hm-panelHeadTight">
          <h2 className="hm-h2">Recruit Certified Teachers</h2>
          <p className="hm-sub">
            Fill out a recruitment form to get connected with recommended pedagogical solutions and
            certified educators.
          </p>
        </div>

        <div className="hm-recruit">
          <div>
            <h4 className="hm-h4">Recruit a Teacher</h4>
            <p className="hm-recruitP">
              Submit your recruitment needs (role, location, timeline). Our admin team will review and
              recommend certified teachers for your school or organization.
            </p>

            <div className="hm-mini">
              <div className="hm-iconTag">
                <div className="hm-icon">📝</div>
                Fill recruitment form
              </div>
              <div className="hm-iconTag">
                <div className="hm-icon">🎓</div>
                Pedagogical Solutions
              </div>

              <button className="hm-btn hm-btnPrimary" onClick={recruitTeacher}>
                Recruit A Teacher
              </button>
            </div>
          </div>

          <div className="hm-recruitArt" aria-label="Recruitment illustration placeholder">
            Recruitment Illustration (Placeholder)
            <span>Replace with your recruiter banner image.</span>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="hm-bottomCta">
          <h3 className="hm-h3">Become a Certified 21st Century Educator</h3>
          <p className="hm-bottomP">Join our community of innovative teachers today.</p>
          <div className="hm-ctaBtns">
            <button
              className="hm-btn hm-btnPrimary"
              onClick={() => {
                const el = document.getElementById("hm-courses");
                el?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Enroll in STEAM Program
            </button>
            <button
              className="hm-btn hm-btnGhost"
              onClick={() => {
                const el = document.getElementById("hm-courses");
                el?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              View Courses
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="hm-footer">
          <div className="hm-fine">© {year} STEAM ONE Platform • All rights reserved</div>
          <div className="hm-miniBrand">
            <span className="hm-miniMs" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            Microsoft Education (logo placeholder)
          </div>
        </div>
      </section>

      {/* Modal */}
      {isOpen ? (
        <div className="hm-modalOverlay" role="dialog" aria-modal="true" aria-labelledby="hm-modalTitle">
          <div className="hm-modal">
            <div className="hm-modalHead">
              <strong id="hm-modalTitle">
                {mode === "enroll" ? "Enroll & Pay (Demo)" : mode === "contact" ? "Contact Teacher (Admin-mediated)" : "Recruit a Teacher (Demo)"}
              </strong>
              <button className="hm-closeX" onClick={closeModal} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="hm-modalBody">
              <div className="hm-pill hm-pillInfo">
                <span>{meta}</span>
              </div>

              <div className="hm-gap10" />

              <form onSubmit={onSubmit}>
                <div className="hm-formGrid">
                  <div className="hm-field">
                    <label htmlFor="hm-fullName">Full Name</label>
                    <input
                      id="hm-fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="hm-field">
                    <label htmlFor="hm-email">Email</label>
                    <input
                      id="hm-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div className="hm-field hm-textarea">
                    <label htmlFor="hm-message">Message</label>
                    <textarea
                      id="hm-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={msgPlaceholder}
                      required
                    />
                  </div>
                </div>

                <div className="hm-modalActions">
                  <button type="button" className="hm-btn hm-btnGhost" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="hm-btn hm-btnPrimary">
                    Send (Demo)
                  </button>
                </div>

                {toast ? <div className="hm-toast">✅ Sent successfully (demo). Backend will email admin / create order later.</div> : null}
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}