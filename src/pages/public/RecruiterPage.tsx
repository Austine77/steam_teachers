import React, { useEffect, useMemo, useState } from "react";
import "./RecruiterPage.css";

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

export default function RecruiterPage() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [ngTime, setNgTime] = useState(() => formatNigeriaTime(new Date()));

  // form state (demo)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [school, setSchool] = useState("");
  const [location, setLocation] = useState("");
  const [requirements, setRequirements] = useState("");
  const [subjectNeeded, setSubjectNeeded] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNgTime(formatNigeriaTime(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Backend later: store request + notify admin + workflow
    setSent(true);
    window.setTimeout(() => setSent(false), 2200);

    setFullName("");
    setEmail("");
    setPhone("");
    setSchool("");
    setLocation("");
    setRequirements("");
    setSubjectNeeded("");
  }

  return (
    <div className="rc-root">
      {/* top strip */}
      <section className="rc-top">
        <div className="rc-topInner">
          <div className="rc-brand" aria-label="Microsoft Education">
            <div className="rc-msMark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div>
              <div className="rc-brandTitle">Microsoft Education</div>
              <div className="rc-brandSub">Recruitment & Consulting</div>
            </div>
          </div>

          <div className="rc-topRight">
            <span className="rc-pill" title="Africa/Lagos">
              🕒 {ngTime} (Nigeria)
            </span>
            <a className="rc-btn rc-btnGhost" href="/login">
              Login
            </a>
            <a className="rc-btn rc-btnPrimary" href="/signup">
              Sign Up
            </a>
          </div>
        </div>
      </section>

      {/* hero */}
      <section className="rc-hero">
        <div className="rc-heroCard">
          <div className="rc-heroGrid">
            <div className="rc-heroText">
              <h1 className="rc-h1">Recruit a Teacher</h1>
              <div className="rc-breadcrumb">
                <span>Home</span> <span className="rc-dot">•</span> <b>Recruit a Teacher</b>
              </div>
              <div className="rc-heroBadges">
                <div className="rc-badge">
                  <span className="rc-badgeDot" aria-hidden="true" />
                  Microsoft Education
                </div>
              </div>
            </div>

            <div className="rc-heroArt" aria-label="Recruiter banner illustration placeholder">
              <div className="rc-artBubble rc-b1" />
              <div className="rc-artBubble rc-b2" />
              <div className="rc-artCard">
                Recruiter Banner Illustration (Placeholder)
                <span>Replace with your recruiter banner image.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* looking strip */}
      <section className="rc-looking">
        <div className="rc-lookingInner">
          <div>
            <h2 className="rc-h2">Looking for a Certified Education Professional?</h2>
            <p className="rc-sub">
              Find a professional online-sourced and vetted teacher with your school’s address,
              expertise, programming, and assessment needs.
            </p>
          </div>

          <div className="rc-standards">
            <span className="rc-std">ISTE</span>
            <span className="rc-std">UNESCO</span>
            <span className="rc-std">PISA</span>
          </div>
        </div>
      </section>

      {/* main panel */}
      <section className="rc-panel">
        <div className="rc-grid">
          {/* left column */}
          <div className="rc-left">
            <div className="rc-card">
              <div className="rc-cardHead">
                <h3 className="rc-h3">Our Recruitment Services Include:</h3>
                <div className="rc-miniArt" aria-label="Recruitment illustration placeholder">
                  Illustration
                </div>
              </div>

              <ul className="rc-check">
                <li>
                  <span className="rc-checkMark">✓</span>
                  <div>
                    <b>Placement Assistance</b>
                    <span>Connect with qualified educators to meet your specific needs.</span>
                  </div>
                </li>
                <li>
                  <span className="rc-checkMark">✓</span>
                  <div>
                    <b>Expert Recommendations</b>
                    <span>Receive personalized recommendations from our education experts.</span>
                  </div>
                </li>
                <li>
                  <span className="rc-checkMark">✓</span>
                  <div>
                    <b>Certified Educators</b>
                    <span>
                      Access a pool of teachers trained in ISTE, UNESCO ICT CFT, and PISA standards.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rc-card">
              <div className="rc-cardHead">
                <h3 className="rc-h3">Our Consulting Services Include:</h3>
                <div className="rc-miniArt rc-miniArt2" aria-label="Consulting illustration placeholder">
                  Illustration
                </div>
              </div>

              <ul className="rc-bullets">
                <li>Policy &amp; Curriculum Development</li>
                <li>Expert Recommendations</li>
                <li>Institutional Support &amp; Delivery Improvement</li>
              </ul>
            </div>

            <div className="rc-card rc-cardSoft">
              <h3 className="rc-h3">Our Consulting Services Include:</h3>
              <ul className="rc-dots">
                <li>Policy &amp; Curriculum Development</li>
                <li>Digital Transformation Guidance</li>
                <li>STEAM Learning Solutions</li>
              </ul>
            </div>
          </div>

          {/* right form */}
          <div className="rc-right">
            <div className="rc-formCard">
              <div className="rc-formTitle">Recruit a Teacher</div>
              <div className="rc-formIntro">
                Fill this form to find best educational professionals who meet your school’s address,
                expertise, programming, and assessment needs.
              </div>

              <form className="rc-form" onSubmit={onSubmit}>
                <label className="rc-field">
                  <span>Full Name *</span>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </label>

                <label className="rc-field">
                  <span>Email *</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="info@example.com"
                    required
                  />
                </label>

                <label className="rc-field">
                  <span>Phone Number *</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234..."
                    required
                  />
                </label>

                <label className="rc-field">
                  <span>School Name *</span>
                  <input
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Your school name"
                    required
                  />
                </label>

                <label className="rc-field">
                  <span>Location</span>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Ibadan, Oyo, Nigeria"
                  />
                </label>

                <label className="rc-field">
                  <span>Teacher Requirements *</span>
                  <textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Write specific qualifications needed for this role..."
                    required
                  />
                </label>

                <label className="rc-field">
                  <span>Subject Needed</span>
                  <input
                    value={subjectNeeded}
                    onChange={(e) => setSubjectNeeded(e.target.value)}
                    placeholder="e.g., STEAM, Digital Literacy"
                  />
                </label>

                <button className="rc-btn rc-btnPrimary rc-submit" type="submit">
                  Submit Request
                </button>

                <div className="rc-formNote">
                  Your request will be sent to our admin team to coordinate the placement process.
                </div>

                {sent ? (
                  <div className="rc-toast">✅ Request submitted (demo). Backend will notify admin.</div>
                ) : null}
              </form>
            </div>
          </div>
        </div>

        {/* note strip */}
        <div className="rc-noteStrip">
          <p>
            At <b>STEAM ONE Platform</b>, we’re committed to <b>advancing teacher education</b> in the
            digital age. We believe in the power of skilled teachers to transform classrooms and
            inspire.
          </p>
        </div>

        {/* footer */}
        <div className="rc-footer">
          <div className="rc-footerTop">
            <div className="rc-footBrand">
              <div className="rc-footTitle">
                <span className="rc-footSteam">STEAM</span>
                <span className="rc-footOne">ONE</span> Platform
              </div>
              <div className="rc-footDesc">
                Trusted recruitment and consulting for schools, agencies, and education leaders.
              </div>
            </div>

            <div className="rc-footCols">
              <div className="rc-col">
                <div className="rc-colTitle">Programs</div>
                <a href="/courses">STEAM ONE</a>
                <a href="/courses">STEAM TWO</a>
                <a href="/courses">STEAM THREE</a>
              </div>

              <div className="rc-col">
                <div className="rc-colTitle">Pages</div>
                <a href="/">Home</a>
                <a href="/courses">Courses</a>
                <a href="/marketplace">Marketplace</a>
                <a href="/contact">Contact</a>
              </div>

              <div className="rc-col">
                <div className="rc-colTitle">Contact Us</div>
                <div className="rc-miniLine">✉️ info@example.com</div>
                <div className="rc-miniLine">📞 +234 812 345 6789</div>
                <div className="rc-miniLine">📍 Lagos, Nigeria</div>
              </div>
            </div>
          </div>

          <div className="rc-trusted">
            <div className="rc-trustedLabel">Trusted by</div>
            <div className="rc-logos">
              <span>ISTE</span>
              <span>UNESCO</span>
              <span>PISA</span>
              <span>Microsoft Education</span>
            </div>
            <div className="rc-trustedSmall">
              Compliant with ISTE Standards • UNESCO ICT CFT Framework • PISA Benchmarks
            </div>
          </div>

          <div className="rc-copy">© {year} STEAM ONE Platform • All rights reserved</div>
        </div>
      </section>
    </div>
  );
}