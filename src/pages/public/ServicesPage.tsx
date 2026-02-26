import React, { useEffect, useMemo, useState } from "react";
import "./ServicesPage.css";

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

type Service = {
  title: string;
  subtitle: string;
  desc: string;
};

type HelpItem = {
  title: string;
  desc: string;
  icon: string;
};

export default function ServicesPage() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [ngTime, setNgTime] = useState(() => formatNigeriaTime(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => setNgTime(formatNigeriaTime(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  const services: Service[] = [
    {
      title: "Policy & Curriculum Development",
      subtitle: "Consulting for Government & Education Agencies",
      desc:
        "Support educational stakeholders in shaping policies, improving curriculum design, and strengthening instructional delivery."
    },
    {
      title: "Digital Transformation",
      subtitle: "For Private Schools & Institutions",
      desc:
        "Help schools transition to a digitally-driven learning environment with improved teaching workflows and modern tools."
    },
    {
      title: "STEAM Learning Solutions",
      subtitle: "Workshops, Tools & Practical Implementation",
      desc:
        "Build 21st-century teaching capacity through STEAM programs, teacher training, and learning resources aligned to global standards."
    }
  ];

  const helpItems: HelpItem[] = [
    {
      title: "Expert Recommendations",
      desc: "Tailored strategies and practical solutions for your institution.",
      icon: "🧠"
    },
    {
      title: "Comprehensive Workshops",
      desc: "Access expert-led sessions in digital teaching and STEAM education.",
      icon: "🧰"
    },
    {
      title: "Global Standards Compliance",
      desc: "Aligned with ISTE, UNESCO ICT CFT, and PISA benchmarks.",
      icon: "🌍"
    },
    {
      title: "Assessment Workshops",
      desc: "Improve evaluation methods using modern digital assessment practices.",
      icon: "📝"
    },
    {
      title: "Dedicated Standards",
      desc: "Structured guidance built around international teacher competency frameworks.",
      icon: "📌"
    },
    {
      title: "Custom IT Solutions",
      desc: "Support for infrastructure and digital learning implementation planning.",
      icon: "🧩"
    }
  ];

  return (
    <div className="sv-root">
      {/* top strip */}
      <section className="sv-top">
        <div className="sv-topInner">
          <div className="sv-brand" aria-label="Microsoft Education">
            <div className="sv-msMark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div>
              <div className="sv-brandTitle">Microsoft Education</div>
              <div className="sv-brandSub">Consulting & Transformation</div>
            </div>
          </div>

          <div className="sv-topRight">
            <span className="sv-pill" title="Africa/Lagos">
              🕒 {ngTime} (Nigeria)
            </span>
            <a className="sv-btn sv-btnGhost" href="/login">
              Login
            </a>
            <a className="sv-btn sv-btnPrimary" href="/signup">
              Sign Up
            </a>
          </div>
        </div>
      </section>

      {/* hero */}
      <section className="sv-hero">
        <div className="sv-heroCard">
          <div className="sv-heroGrid">
            <div className="sv-heroText">
              <h1 className="sv-h1">Our Services</h1>
              <div className="sv-breadcrumb">
                <span>Home</span> <span className="sv-dot">•</span> <b>Services</b>
              </div>
            </div>

            <div className="sv-heroArt" aria-label="Services banner illustration placeholder">
              <div className="sv-artBubble sv-b1" />
              <div className="sv-artBubble sv-b2" />
              <div className="sv-artCard">
                Services Banner Illustration (Placeholder)
                <span>Replace with your services banner image.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* intro */}
      <section className="sv-intro">
        <div className="sv-introInner">
          <h2 className="sv-h2">
            Empowering Schools Through 21st Century Teaching &amp; Transformation
          </h2>
          <p className="sv-sub">
            Consulting solutions tailored for schools, educational agencies, and private institutions.
          </p>
        </div>
      </section>

      {/* service cards */}
      <section className="sv-panel">
        <div className="sv-cards">
          {services.map((s) => (
            <article key={s.title} className="sv-card">
              <div className="sv-cardArt" aria-label="Service illustration placeholder">
                Illustration
              </div>

              <div className="sv-cardBody">
                <div className="sv-cardTitle">{s.title}</div>
                <div className="sv-cardSub">{s.subtitle}</div>
                <p className="sv-cardDesc">{s.desc}</p>

                <a className="sv-ctaBtn" href="/contact">
                  Get Started
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* How we help */}
        <div className="sv-howWrap">
          <h3 className="sv-h3">How We Help</h3>

          <div className="sv-helpGrid">
            {helpItems.map((h) => (
              <div key={h.title} className="sv-helpItem">
                <div className="sv-helpIcon" aria-hidden="true">
                  {h.icon}
                </div>
                <div>
                  <div className="sv-helpTitle">{h.title}</div>
                  <div className="sv-helpDesc">{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="sv-bottomCta">
          <h3 className="sv-ctaTitle">Get in Touch with STEAM Education Experts</h3>
          <div className="sv-ctaBtns">
            <a className="sv-btn sv-btnPrimary" href="/contact">
              Contact Us
            </a>
            <a className="sv-btn sv-btnGhostDark" href="/courses">
              View Courses
            </a>
          </div>
        </div>

        {/* footer */}
        <div className="sv-footer">
          <div className="sv-footerTop">
            <div className="sv-footBrand">
              <div className="sv-footTitle">
                <span className="sv-footSteam">STEAM</span>
                <span className="sv-footOne">ONE</span> Platform
              </div>
              <div className="sv-footDesc">
                Consulting and professional development for digital-age learning and teaching.
              </div>
            </div>

            <div className="sv-footCols">
              <div className="sv-col">
                <div className="sv-colTitle">Programs</div>
                <a href="/courses">STEAM ONE</a>
                <a href="/courses">STEAM TWO</a>
                <a href="/courses">STEAM THREE</a>
              </div>

              <div className="sv-col">
                <div className="sv-colTitle">Pages</div>
                <a href="/">Home</a>
                <a href="/courses">Courses</a>
                <a href="/marketplace">Marketplace</a>
                <a href="/services">Services</a>
              </div>

              <div className="sv-col">
                <div className="sv-colTitle">Contact Us</div>
                <div className="sv-miniLine">✉️ info@example.com</div>
                <div className="sv-miniLine">📞 +234 812 345 6789</div>
                <div className="sv-miniLine">📍 Lagos, Nigeria</div>
              </div>
            </div>
          </div>

          <div className="sv-trusted">
            <div className="sv-trustedLabel">Trusted by</div>
            <div className="sv-logos">
              <span>ISTE</span>
              <span>UNESCO</span>
              <span>PISA</span>
              <span>Microsoft Education</span>
            </div>
            <div className="sv-trustedSmall">
              Compliant with ISTE Standards • UNESCO ICT CFT Framework • PISA Benchmarks
            </div>
          </div>

          <div className="sv-copy">© {year} STEAM ONE Platform • All rights reserved</div>
        </div>
      </section>
    </div>
  );
}