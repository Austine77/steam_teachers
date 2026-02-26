import React, { useEffect, useMemo, useState } from "react";
import "./AboutPage.css";

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

type Stat = { icon: string; value: string; label: string };
type ValueCard = { icon: string; title: string; desc: string };
type Leader = { name: string; role: string; desc: string };

export default function AboutPage() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [ngTime, setNgTime] = useState(() => formatNigeriaTime(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => setNgTime(formatNigeriaTime(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  const impactStats: Stat[] = [
    { icon: "🏆", value: "10+", label: "Years of Excellence" },
    { icon: "👥", value: "5,000+", label: "Teachers Trained" },
    { icon: "📘", value: "3", label: "Comprehensive Certification Programs" },
    { icon: "👍", value: "98%+", label: "Satisfaction Rate" }
  ];

  const missionBullets = [
    "Empowering Educators Through Digital Innovation",
    "Aligning With International Standards (ISTE, UNESCO ICT CFT, PISA)",
    "Leveraging AI & Advanced Teaching Tools"
  ];

  const steps = [
    { n: 1, t: "Teachers enroll", s: "In certification program" },
    { n: 2, t: "Secure payment", s: "Confirms access" },
    { n: 3, t: "Welcome email", s: "& login credentials" },
    { n: 4, t: "Complete modules", s: "& assessments" },
    { n: 5, t: "Compilation", s: "and certification" }
  ];

  const values: ValueCard[] = [
    {
      icon: "🏆",
      title: "Excellence",
      desc: "We prioritize high performance and quality learning outcomes."
    },
    {
      icon: "🛡️",
      title: "Integrity",
      desc: "We lead with honesty, transparency and ethical practices."
    },
    {
      icon: "💡",
      title: "Innovation",
      desc: "Exploring modern teaching tools and emerging technologies."
    },
    {
      icon: "🤝",
      title: "Collaboration",
      desc: "Partnering with institutions to improve educational delivery."
    }
  ];

  const leaders: Leader[] = [
    {
      name: "John Smith",
      role: "Founder & Executive Director",
      desc:
        "Leads platform vision, partnerships, and program strategy to expand teacher impact."
    },
    {
      name: "Laura Allen",
      role: "Academic Director",
      desc:
        "Ensures curriculum quality, standards alignment, and certification excellence across programs."
    },
    {
      name: "Mark Thompson",
      role: "Technology & Innovation Lead",
      desc:
        "Builds scalable learning systems, digital integration, and AI-enabled teaching solutions."
    }
  ];

  return (
    <div className="ab-root">
      {/* top brand strip (logo must be present) */}
      <section className="ab-top">
        <div className="ab-topInner">
          <div className="ab-brand" aria-label="Microsoft Education">
            <div className="ab-msMark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div>
              <div className="ab-brandTitle">Microsoft Education</div>
              <div className="ab-brandSub">Research powerhouse for STEAM ONE Platform</div>
            </div>
          </div>

          <div className="ab-topRight">
            <span className="ab-pill" title="Africa/Lagos">
              🕒 {ngTime} (Nigeria)
            </span>
          </div>
        </div>
      </section>

      {/* hero banner */}
      <section className="ab-hero">
        <div className="ab-heroCard">
          <div className="ab-heroGrid">
            <div className="ab-heroText">
              <h1 className="ab-h1">About STEAM ONE Platform</h1>
              <p className="ab-heroP">
                Advancing Teacher Certification, Digital Excellence, and Global Educational
                Innovation.
              </p>
              <p className="ab-heroSmall">
                Compliant with ISTE Standards • UNESCO ICT CFT Framework • PISA Benchmarks •
                Research-supported by Microsoft Education
              </p>
              <div className="ab-heroActions">
                <a className="ab-btn ab-btnGhost" href="/courses">
                  View Courses
                </a>
                <a className="ab-btn ab-btnPrimary" href="/checkout">
                  Enroll Now
                </a>
              </div>
            </div>

            <div className="ab-heroArt" aria-label="Banner illustration placeholder">
              <div className="ab-artBubble ab-b1" />
              <div className="ab-artBubble ab-b2" />
              <div className="ab-artCard">
                About Page Banner Illustration (Placeholder)
                <span>Replace with your About banner image.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* content panel */}
      <section className="ab-panel">
        {/* Our Impact */}
        <div className="ab-head">
          <h2 className="ab-h2">Our Impact</h2>
        </div>

        <div className="ab-impact">
          {impactStats.map((s) => (
            <div key={s.label} className="ab-impactCard">
              <div className="ab-impactIcon">{s.icon}</div>
              <div>
                <div className="ab-impactValue">{s.value}</div>
                <div className="ab-impactLabel">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="ab-head ab-headTight">
          <h2 className="ab-h2">Our Mission</h2>
        </div>

        <div className="ab-mission">
          <div className="ab-missionArt" aria-label="Mission illustration placeholder">
            Mission Illustration (Placeholder)
            <span>Replace with your mission illustration.</span>
          </div>

          <div className="ab-missionBody">
            <p className="ab-text">
              We empower educators with digital literacy, STEAM education competencies, and
              AI-integrated teaching methodologies. Our programs transform traditional classrooms
              into innovative, technology-driven learning environments aligned with global standards.
            </p>

            <ul className="ab-check">
              {missionBullets.map((b) => (
                <li key={b}>
                  <span className="ab-checkMark">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Steps */}
        <div className="ab-head ab-headTight">
          <h2 className="ab-h2">How STEAM ONE Works</h2>
        </div>

        <div className="ab-steps">
          {steps.map((st) => (
            <div key={st.n} className="ab-step">
              <div className="ab-stepNum">{st.n}</div>
              <div className="ab-stepTxt">
                {st.t}
                <small>{st.s}</small>
              </div>
            </div>
          ))}
        </div>

        {/* How it works text block */}
        <div className="ab-how">
          <div className="ab-howArt" aria-label="How it works illustration placeholder">
            How It Works Illustration (Placeholder)
            <span>Replace with your process image.</span>
          </div>

          <div className="ab-howBody">
            <h3 className="ab-h3">How STEAM ONE Works</h3>
            <p className="ab-text">
              Founded in 2015, STEAM ONE Platform was created to modernize teacher development
              through structured, paid certification programs. We combine international frameworks
              with digital transformation strategies to help educators succeed for 21st-century
              learning needs.
            </p>
            <p className="ab-text">
              Microsoft Education supports our research integration, enabling institutions to adopt
              cutting-edge digital solutions backed by global best practices.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="ab-head ab-headTight">
          <h2 className="ab-h2">What Makes Us Different</h2>
        </div>

        <div className="ab-values">
          {values.map((v) => (
            <div key={v.title} className="ab-valueCard">
              <div className="ab-valueIcon">{v.icon}</div>
              <div className="ab-valueTitle">{v.title}</div>
              <div className="ab-valueDesc">{v.desc}</div>
            </div>
          ))}
        </div>

        {/* Leadership */}
        <div className="ab-head ab-headTight">
          <h2 className="ab-h2">Leadership Team</h2>
        </div>

        <div className="ab-leaders">
          {leaders.map((l) => (
            <div key={l.name} className="ab-leaderCard">
              <div className="ab-leaderTop">
                <div className="ab-leaderPhoto" aria-hidden="true">
                  {l.name
                    .split(" ")
                    .slice(0, 2)
                    .map((x) => x[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <a className="ab-linkedin" href="#" aria-label="LinkedIn (placeholder)">
                  in
                </a>
              </div>

              <div className="ab-leaderName">{l.name}</div>
              <div className="ab-leaderRole">{l.role}</div>
              <div className="ab-leaderDesc">{l.desc}</div>
            </div>
          ))}
        </div>

        {/* Bottom stats strip */}
        <div className="ab-bottomStrip">
          <div className="ab-stripItem">
            <div className="ab-stripTitle">STEAM ONE</div>
            <div className="ab-stripSub">Platform</div>
          </div>

          <div className="ab-stripItem">
            <div className="ab-stripTitle">5,000+</div>
            <div className="ab-stripSub">Teachers Certified</div>
          </div>

          <div className="ab-stripItem">
            <div className="ab-stripTitle">200+</div>
            <div className="ab-stripSub">Schools Served</div>
          </div>

          <div className="ab-stripItem">
            <div className="ab-stripTitle">15+</div>
            <div className="ab-stripSub">Commits Imported</div>
          </div>

          <div className="ab-stripItem">
            <div className="ab-stripTitle">98%</div>
            <div className="ab-stripSub">Satisfaction Rate</div>
          </div>

          <div className="ab-stripItem">
            <div className="ab-stripTitle">98%</div>
            <div className="ab-stripSub">Certification Rate</div>
          </div>
        </div>

        {/* Footer */}
        <div className="ab-footer">
          <div className="ab-fine">© {year} STEAM ONE Platform • All rights reserved</div>
          <div className="ab-miniBrand">
            <span className="ab-miniMs" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            Microsoft Education (logo placeholder)
          </div>
        </div>
      </section>
    </div>
  );
}