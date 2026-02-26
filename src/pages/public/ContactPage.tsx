import React, { useEffect, useMemo, useState } from "react";
import "./ContactPage.css";

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

type ContactCard = {
  icon: string;
  title: string;
  primary: string;
  secondary: string;
};

export default function ContactPage() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [ngTime, setNgTime] = useState(() => formatNigeriaTime(new Date()));

  // form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNgTime(formatNigeriaTime(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  const cards: ContactCard[] = [
    {
      icon: "✉️",
      title: "Email Us",
      primary: "info@example.com",
      secondary: "Send us an email anytime"
    },
    {
      icon: "📞",
      title: "Call Us",
      primary: "+123-456-7890",
      secondary: "Mon–Fri 9 am – 5 pm"
    },
    {
      icon: "📍",
      title: "Visit Us",
      primary: "123 Education St., City, Country",
      secondary: "Schedule an appointment"
    }
  ];

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Frontend demo: backend will handle sending email / ticket creation
    setSent(true);
    window.setTimeout(() => setSent(false), 2200);

    setFullName("");
    setEmail("");
    setPhone("");
    setMessage("");
  }

  return (
    <div className="ct-root">
      {/* brand strip */}
      <section className="ct-top">
        <div className="ct-topInner">
          <div className="ct-brand" aria-label="Microsoft Education">
            <div className="ct-msMark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div>
              <div className="ct-brandTitle">Microsoft Education</div>
              <div className="ct-brandSub">STEAM Teacher Certification Platform</div>
            </div>
          </div>

          <div className="ct-topRight">
            <span className="ct-pill" title="Africa/Lagos">
              🕒 {ngTime} (Nigeria)
            </span>
            <a className="ct-btn ct-btnPrimary" href="/checkout">
              Enroll Now
            </a>
          </div>
        </div>
      </section>

      {/* hero */}
      <section className="ct-hero">
        <div className="ct-heroCard">
          <div className="ct-heroGrid">
            <div className="ct-heroText">
              <h1 className="ct-h1">Contact Us</h1>
              <div className="ct-breadcrumb">
                <span>Home</span> <span className="ct-dot">•</span> <b>Contact Us</b>
              </div>
            </div>

            <div className="ct-heroArt" aria-label="Contact banner illustration placeholder">
              <div className="ct-artBubble ct-b1" />
              <div className="ct-artBubble ct-b2" />
              <div className="ct-artCard">
                Contact Banner Illustration (Placeholder)
                <span>Replace with your contact banner image.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* panel */}
      <section className="ct-panel">
        <div className="ct-head">
          <h2 className="ct-h2">Get in Touch with Us</h2>
          <p className="ct-sub">
            Reach out to us for any inquiries or assistance. We’re here to help you.
          </p>
        </div>

        {/* contact cards */}
        <div className="ct-cards">
          {cards.map((c) => (
            <div key={c.title} className="ct-card">
              <div className="ct-cardIcon" aria-hidden="true">
                {c.icon}
              </div>
              <div className="ct-cardBody">
                <div className="ct-cardTitle">{c.title}</div>
                <div className="ct-cardPrimary">{c.primary}</div>
                <div className="ct-cardSecondary">{c.secondary}</div>
              </div>
            </div>
          ))}
        </div>

        {/* message area */}
        <div className="ct-head ct-headTight">
          <h2 className="ct-h2">Send Us a Message</h2>
        </div>

        <div className="ct-messageGrid">
          {/* illustration + map */}
          <div className="ct-leftCol">
            <div className="ct-illusBlock" aria-label="Message illustration placeholder">
              Message Illustration (Placeholder)
              <span>Replace with your “Send message” illustration.</span>
            </div>

            <div className="ct-mapCard">
              <div className="ct-mapHead">
                <div className="ct-mapTitle">Find Us on the Map</div>
                <div className="ct-mapSub">We’d love to meet you in person!</div>
              </div>

              <div className="ct-mapBox" aria-label="Map placeholder">
                <div className="ct-pin" aria-hidden="true">📍</div>
                <div className="ct-mapNote">
                  Map Placeholder
                  <span>Embed Google Map later (backend/config).</span>
                </div>
              </div>
            </div>
          </div>

          {/* form */}
          <div className="ct-formCard">
            <div className="ct-formTitle">Send Us a Message</div>

            <form onSubmit={onSubmit} className="ct-form">
              <label className="ct-field">
                <span>Full Name *</span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </label>

              <label className="ct-field">
                <span>Email Address *</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="ct-field">
                <span>Phone Number *</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234..."
                  required
                />
              </label>

              <label className="ct-field">
                <span>Your Message *</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  required
                />
              </label>

              <button className="ct-btn ct-btnPrimary ct-send" type="submit">
                Send Message
              </button>

              {sent ? (
                <div className="ct-toast">✅ Message sent (demo). Backend will handle emails/tickets.</div>
              ) : null}
            </form>
          </div>
        </div>

        {/* mid text strip */}
        <div className="ct-noteStrip">
          <p>
            At <b>STEAM ONE Platform</b>, we’re committed to <b>advancing teacher education</b> in the
            digital age. We believe in the power of skilled teachers to transform classrooms and
            inspire learners globally.
          </p>
        </div>

        {/* footer (wireframe style) */}
        <div className="ct-footer">
          <div className="ct-footerTop">
            <div className="ct-footBrand">
              <div className="ct-footTitle">
                <span className="ct-footSteam">STEAM</span>
                <span className="ct-footOne">ONE</span> Platform
              </div>
              <div className="ct-footDesc">
                Empowering teacher certification through digital innovation and global standards.
              </div>
            </div>

            <div className="ct-footCols">
              <div className="ct-col">
                <div className="ct-colTitle">Programs</div>
                <a href="/courses">STEAM ONE</a>
                <a href="/courses">STEAM TWO</a>
                <a href="/courses">STEAM THREE</a>
              </div>

              <div className="ct-col">
                <div className="ct-colTitle">Pages</div>
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/faq">FAQ</a>
                <a href="/contact">Contact</a>
              </div>

              <div className="ct-col">
                <div className="ct-colTitle">Contact Us</div>
                <div className="ct-miniLine">✉️ info@example.com</div>
                <div className="ct-miniLine">📞 +123-456-7890</div>
                <div className="ct-miniLine">📍 Lagos, Nigeria</div>
              </div>
            </div>
          </div>

          <div className="ct-trusted">
            <div className="ct-trustedLabel">Trusted by</div>
            <div className="ct-logos">
              <span>ISTE</span>
              <span>UNESCO</span>
              <span>PISA</span>
              <span>Microsoft Education</span>
            </div>
            <div className="ct-trustedSmall">
              Compliant with ISTE Standards • UNESCO ICT CFT Framework • PISA • Practical Education
            </div>
          </div>

          <div className="ct-copy">
            © {year} STEAM ONE Platform • All rights reserved
          </div>
        </div>
      </section>
    </div>
  );
}