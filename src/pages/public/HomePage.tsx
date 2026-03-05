import React, { useEffect, useMemo, useState } from "react";
import "./HomePage.css";

type Program = {
  id: string;
  title: string;
  subtitle: string;
  priceNaira: number;
  bullets: string[];
};

type Teacher = {
  id: string;
  name: string;
  role: string;
  bullets: string[];
};

function formatNGN(n: number) {
  try {
    return new Intl.NumberFormat("en-NG").format(n);
  } catch {
    return String(n);
  }
}

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

  const programs: Program[] = [
    {
      id: "steam-one",
      title: "STEAM ONE",
      subtitle: "Introductory Courses",
      priceNaira: 15000,
      bullets: ["Digital Literacy", "Teaching Foundations"]
    },
    {
      id: "steam-two",
      title: "STEAM TWO",
      subtitle: "Technology in Teaching",
      priceNaira: 20000,
      bullets: ["Technology Integration", "Digital Teaching Tools"]
    },
    {
      id: "steam-three",
      title: "STEAM THREE",
      subtitle: "Advanced / Expert Level",
      priceNaira: 25000,
      bullets: ["Advanced STEAM", "Creating Learning Pathways"]
    }
  ];

  const teachers: Teacher[] = [
    {
      id: "t1",
      name: "Jane Doe",
      role: "AI School Teacher",
      bullets: ["Policy & Curriculum Development", "Elementary School Teacher"]
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

  function scrollToId(id: string) {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Demo actions (backend later)
  function goEnroll(programTitle?: string) {
    // In your real app: route to /login or /signup or /checkout with program pre-selected
    alert(
      `Enroll (Demo)\n\nProgram: ${programTitle ?? "Choose a program"}\n\nNext: Login/Signup → Payment → Dashboard (backend later).`
    );
  }

  function contactTeacher(name: string) {
    alert(
      `Contact Teacher (Demo)\n\nTeacher: ${name}\n\nRequest will be sent to Admin for moderation (backend later).`
    );
  }

  function recruitTeacher() {
    alert(
      "Recruit a Teacher (Demo)\n\nRecruitment request will be sent to Admin queue (backend later)."
    );
  }

  return (
    <div className="hp-root">
      {/* ===== Top Navbar ===== */}
      <header className="hp-nav">
        <div className="hp-navInner">
          <div className="hp-brand" aria-label="Microsoft Education">
            <div className="hp-msMark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="hp-brandText">
              <div className="hp-brandTitle">Microsoft Education</div>
              <div className="hp-brandSub">STEAM Teacher Certification Platform</div>
            </div>
          </div>

          <nav className="hp-links" aria-label="Primary navigation">
            <a href="#" className="isActive">Home</a>
            <a href="#courses" onClick={(e) => { e.preventDefault(); scrollToId("hp-programs"); }}>Courses</a>
            <a href="#marketplace" onClick={(e) => { e.preventDefault(); scrollToId("hp-marketplace"); }}>Marketplace</a>
            <a href="#services" onClick={(e) => { e.preventDefault(); scrollToId("hp-recruit"); }}>Services</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); alert("Route to About page (separate TSX)"); }}>About</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); alert("Route to Contact page (separate TSX)"); }}>Contact</a>
            <a href="#login" onClick={(e) => { e.preventDefault(); alert("Route to Login page (Email + Google)"); }}>Login</a>
          </nav>

          <div className="hp-navRight">
            <span className="hp-timePill" title="Africa/Lagos">
              🕒 {ngTime} (Nigeria)
            </span>
            <button className="hp-btn hp-btnPrimary" onClick={() => scrollToId("hp-programs")}>
              Enroll Now
            </button>
          </div>
        </div>
      </header>

      {/* ===== Section 1: Hero ===== */}
      <section className="hp-hero">
        <div className="hp-heroCard">
          <div className="hp-heroGrid">
            <div>
              <h1 className="hp-h1">
                Skilling Teachers Towards <br />
                STEAM Excellence
              </h1>
              <p className="hp-heroP">
                Introductory, Advanced &amp; Expert digital teaching programs for Pre-Service &amp;
                In-Service teachers worldwide.
              </p>

              <div className="hp-heroActions">
                <button className="hp-btn hp-btnSoft" onClick={() => scrollToId("hp-programs")}>
                  View Pricing
                </button>
                <button className="hp-btn hp-btnPrimary" onClick={() => scrollToId("hp-programs")}>
                  Enroll Now
                </button>
              </div>

              <div className="hp-standards">
                <span className="hp-chip">🟦 Microsoft</span>
                <span className="hp-chip">📌 ISTE</span>
                <span className="hp-chip">🏛️ UNESCO ICT CFT</span>
                <span className="hp-chip">📊 PISA</span>
              </div>
            </div>

            {/* Hero image placeholder */}
            <div className="hp-heroArt" aria-label="Hero image placeholder">
              {/* Put your wireframe hero image in: public/assets/home-hero.png */}
              <img
                className="hp-heroImg"
                src="/assets/home-hero.png"
                alt="STEAM ONE hero illustration"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="hp-heroImgFallback">
                Hero Image Placeholder
                <span>Save your hero banner as /public/assets/home-hero.png</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Section 2: Programs ===== */}
      <section className="hp-panel" id="hp-programs">
        <div className="hp-panelHead">
          <h2 className="hp-h2">Our STEAM Certification Programs</h2>
        </div>

        <div className="hp-programs">
          {programs.map((p) => (
            <article key={p.id} className="hp-programCard">
              <div className="hp-programTop">
                <div>
                  <div className="hp-programTitle">{p.title}</div>
                  <div className="hp-programSub">{p.subtitle}</div>
                </div>
              </div>

              <div className="hp-programBody">
                <ul className="hp-list">
                  {p.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>

                <div className="hp-priceRow">
                  <div className="hp-price">
                    ₦{formatNGN(p.priceNaira)}
                  </div>
                  <div className="hp-access">
                    Standard Access <br /> + Resources
                  </div>
                </div>

                <button className="hp-enrollBtn" onClick={() => goEnroll(p.title)}>
                  Enroll &amp; Pay
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===== Section 3: Enrollment Steps ===== */}
      <section className="hp-strip">
        <h3 className="hp-stripTitle">Simple Enrollment Process</h3>
        <div className="hp-steps">
          <div className="hp-step"><span>1</span> Choose Course</div>
          <div className="hp-step"><span>2</span> Secure Payment</div>
          <div className="hp-step"><span>3</span> Receive Login &amp; Access Instructions</div>
          <div className="hp-step"><span>4</span> Start Learning &amp; Complete Modules</div>
        </div>
      </section>

      {/* ===== Section 4: CTA ===== */}
      <section className="hp-cta">
        <div className="hp-ctaCard">
          <h3 className="hp-ctaTitle">Ready to Start Your Certification?</h3>
          <div className="hp-ctaBtns">
            <button className="hp-btn hp-btnSoft" onClick={() => scrollToId("hp-programs")}>
              View Pricing
            </button>
            <button className="hp-btn hp-btnPrimary" onClick={() => goEnroll()}>
              Enroll Now
            </button>
          </div>
        </div>
      </section>

      {/* ===== Section 5: Marketplace ===== */}
      <section className="hp-panel" id="hp-marketplace">
        <div className="hp-panelHead">
          <h2 className="hp-h2">Certified Teachers Marketplace</h2>
        </div>

        <div className="hp-teachers">
          {teachers.map((t) => {
            const initials = t.name
              .split(" ")
              .slice(0, 2)
              .map((x) => x[0])
              .join("")
              .toUpperCase();

            return (
              <article key={t.id} className="hp-teacherCard">
                <div className="hp-teacherTop">
                  <div className="hp-avatar">{initials}</div>
                  <div>
                    <div className="hp-teacherName">{t.name}</div>
                    <div className="hp-teacherRole">{t.role}</div>
                  </div>
                </div>

                <ul className="hp-bullets">
                  {t.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>

                <button className="hp-btn hp-btnPrimary hp-full" onClick={() => contactTeacher(t.name)}>
                  Contact This Teacher
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* ===== Section 6: Recruit ===== */}
      <section className="hp-panel" id="hp-recruit">
        <div className="hp-panelHead">
          <h2 className="hp-h2">Recruit Certified Teachers</h2>
        </div>

        <div className="hp-recruit">
          <div className="hp-recruitLeft">
            <div className="hp-recruitRow">
              <div className="hp-iconBox">🧾</div>
              <div className="hp-recruitText">Fill out a recruitment form to get connected with recommended solutions.</div>
            </div>
            <div className="hp-recruitRow">
              <div className="hp-iconBox">🎓</div>
              <div className="hp-recruitText">Pedagogical Solutions and matching for your school or organization.</div>
            </div>

            <button className="hp-btn hp-btnPrimary" onClick={recruitTeacher}>
              Recruit A Teacher
            </button>
          </div>

          <div className="hp-recruitArt">
            <div className="hp-recruitArtBox">
              Recruit Illustration Placeholder
              <span>Optional: add /public/assets/recruit.png</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Section 7: Final CTA ===== */}
      <section className="hp-final">
        <div className="hp-finalCard">
          <h3 className="hp-finalTitle">Become a Certified 21st Century Educator</h3>
          <p className="hp-finalSub">Join our community of innovative teachers today.</p>
          <div className="hp-finalBtns">
            <button className="hp-btn hp-btnPrimary" onClick={() => goEnroll()}>
              Enroll in STEAM Program
            </button>
            <button className="hp-btn hp-btnSoft" onClick={() => scrollToId("hp-programs")}>
              View Courses
            </button>
          </div>
        </div>
      </section>

      {/* ===== Section 8: Footer ===== */}
      <footer className="hp-footer">
        <div className="hp-footerInner">
          <div className="hp-footerLeft">
            © {year} STEAM ONE Platform. All rights reserved.
          </div>
          <div className="hp-footerRight">
            <span className="hp-footChip">🟦 Microsoft</span>
            <span className="hp-footChip">📌 ISTE</span>
            <span className="hp-footChip">🏛️ UNESCO</span>
            <span className="hp-footChip">📊 PISA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}