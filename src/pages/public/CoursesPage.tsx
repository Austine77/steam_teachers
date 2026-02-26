import React, { useEffect, useMemo, useState } from "react";
import "./CoursesPage.css";

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

type Plan = {
  id: PlanId;
  name: string;
  tag: string;
  priceUSD: number;
  highlights: string[];
  accessNote: string;
};

export default function CoursesPage() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [ngTime, setNgTime] = useState(() => formatNigeriaTime(new Date()));

  // checkout modal
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Plan | null>(null);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [paymentProvider, setPaymentProvider] = useState<"Paystack" | "Flutterwave" | "Stripe">(
    "Paystack"
  );
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNgTime(formatNigeriaTime(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  const plans: Plan[] = [
    {
      id: "steam1",
      name: "STEAM ONE",
      tag: "Introductory Course",
      priceUSD: 99,
      highlights: ["Digital Literacy Skills", "Teaching Foundations", "Introduction to STEAM Tools"],
      accessNote:
        "Access a paid certification course including onboarding and assessments."
    },
    {
      id: "steam2",
      name: "STEAM TWO",
      tag: "Technology in Teaching",
      priceUSD: 199,
      highlights: ["Technology & Robotics", "Digital Teaching Tools", "Classroom Integration Projects"],
      accessNote:
        "Access intermediate modules requiring completion of learning checkpoints."
    },
    {
      id: "steam3",
      name: "STEAM THREE",
      tag: "Advanced STEAM Courses",
      priceUSD: 399,
      highlights: ["Advanced STEAM", "Creative Learning Pathways", "AI-Enhanced Lesson Design"],
      accessNote:
        "Access expert modules for professionals with advanced performance criteria."
    }
  ];

  function openCheckout(plan: Plan) {
    setSelected(plan);
    setStudentName("");
    setStudentEmail("");
    setPaymentProvider("Paystack");
    setToast(false);
    setOpen(true);
  }

  function closeCheckout() {
    setOpen(false);
    setSelected(null);
  }

  function proceedPayment(e: React.FormEvent) {
    e.preventDefault();
    // Frontend demo: backend will create payment intent/session and redirect.
    setToast(true);
    window.setTimeout(() => {
      setOpen(false);
      setToast(false);
    }, 1400);
  }

  return (
    <div className="cs-root">
      {/* top strip */}
      <section className="cs-top">
        <div className="cs-topInner">
          <div className="cs-brand" aria-label="Microsoft Education">
            <div className="cs-msMark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div>
              <div className="cs-brandTitle">Microsoft Education</div>
              <div className="cs-brandSub">Paid STEAM Certification Courses</div>
            </div>
          </div>

          <div className="cs-topRight">
            <span className="cs-pill" title="Africa/Lagos">
              🕒 {ngTime} (Nigeria)
            </span>
            <a className="cs-btn cs-btnGhost" href="/login">
              Login
            </a>
            <a className="cs-btn cs-btnPrimary" href="/signup">
              Sign Up
            </a>
          </div>
        </div>
      </section>

      {/* hero */}
      <section className="cs-hero">
        <div className="cs-heroCard">
          <div className="cs-heroGrid">
            <div className="cs-heroText">
              <h1 className="cs-h1">Courses</h1>
              <div className="cs-breadcrumb">
                <span>Home</span> <span className="cs-dot">•</span> <b>Courses</b>
              </div>
            </div>

            <div className="cs-heroArt" aria-label="Courses banner illustration placeholder">
              <div className="cs-artBubble cs-b1" />
              <div className="cs-artBubble cs-b2" />
              <div className="cs-artCard">
                Courses Banner Illustration (Placeholder)
                <span>Replace with your courses banner image.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* intro strip */}
      <section className="cs-intro">
        <div className="cs-introInner">
          <div className="cs-introText">
            <h2 className="cs-h2">Advance Your Teaching Skills with STEAM Certification Courses</h2>
            <p className="cs-sub">
              Introductory, Intermediate &amp; Expert digital teaching programs aligned with
              international education standards.
            </p>

            <div className="cs-introBtns">
              <button className="cs-btn cs-btnPrimary" onClick={() => openCheckout(plans[0])}>
                Enroll Now in STEAM Program
              </button>
              <a className="cs-btn cs-btnGhostDark" href="/marketplace">
                View Marketplace
              </a>
            </div>
          </div>

          <div className="cs-standards">
            <span className="cs-std">ISTE</span>
            <span className="cs-std">UNESCO</span>
            <span className="cs-std">PISA</span>
          </div>
        </div>
      </section>

      {/* plans */}
      <section className="cs-panel">
        <div className="cs-plans">
          {plans.map((p) => (
            <article key={p.id} className={`cs-planCard ${p.id === "steam3" ? "cs-planGold" : ""}`}>
              <div className="cs-planTop">
                <div className="cs-planName">{p.name}</div>
                <div className="cs-planTag">{p.tag}</div>
              </div>

              <ul className="cs-list">
                {p.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>

              <div className="cs-priceRow">
                <div className="cs-price">
                  <span className="cs-priceSym">$</span>
                  {p.priceUSD}
                </div>
                <div className="cs-priceNote">Paid Certification</div>
              </div>

              <button className="cs-enrollBtn" onClick={() => openCheckout(p)}>
                Enroll Now
              </button>

              <div className="cs-accessNote">{p.accessNote}</div>

              <div className="cs-paidBadge">🔒 Paid Access • Verified Certification</div>
            </article>
          ))}
        </div>

        {/* How it works */}
        <div className="cs-how">
          <div className="cs-howTitle">How It Works</div>
          <div className="cs-howSteps">
            <div className="cs-step">
              <div className="cs-stepIcon">1</div>
              <div className="cs-stepText">Choose a Course</div>
            </div>
            <div className="cs-step">
              <div className="cs-stepIcon">2</div>
              <div className="cs-stepText">Secure Payment</div>
            </div>
            <div className="cs-step">
              <div className="cs-stepIcon">3</div>
              <div className="cs-stepText">Receive Login &amp; Welcome Email</div>
            </div>
            <div className="cs-step">
              <div className="cs-stepIcon">4</div>
              <div className="cs-stepText">Complete Your Modules</div>
            </div>
          </div>
        </div>

        {/* features */}
        <div className="cs-features">
          <div className="cs-featureArt" aria-label="Features illustration placeholder">
            Features Illustration (Placeholder)
            <span>Replace with your illustration image.</span>
          </div>

          <div className="cs-featureGrid">
            <div className="cs-feature">
              <div className="cs-featureIcon">🌍</div>
              <div>
                <div className="cs-featureTitle">Globally Recognized Certs</div>
                <div className="cs-featureDesc">
                  STEAM certification aligned with UNESCO ICT CFT and international standards.
                </div>
              </div>
            </div>

            <div className="cs-feature">
              <div className="cs-featureIcon">🧩</div>
              <div>
                <div className="cs-featureTitle">Flexible Modules</div>
                <div className="cs-featureDesc">
                  Learn at your pace with structured lessons, checkpoints, and assessments.
                </div>
              </div>
            </div>

            <div className="cs-feature">
              <div className="cs-featureIcon">💻</div>
              <div>
                <div className="cs-featureTitle">Online Teacher Cohorts</div>
                <div className="cs-featureDesc">
                  Join peer groups and live sessions to support practical classroom integration.
                </div>
              </div>
            </div>

            <div className="cs-feature">
              <div className="cs-featureIcon">📚</div>
              <div>
                <div className="cs-featureTitle">Proven Learning Resources</div>
                <div className="cs-featureDesc">
                  High-quality learning materials, templates, and guided projects.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* testimonials */}
        <div className="cs-testimonials">
          <h3 className="cs-h3">What Educators Say:</h3>
          <p className="cs-testSub">
            STEAM certification helped educators teach with confidence using modern digital tools.
          </p>

          <div className="cs-testGrid">
            <div className="cs-testCard">
              <div className="cs-testTop">
                <div className="cs-testAvatar">DC</div>
                <div>
                  <div className="cs-testName">David Carter</div>
                  <div className="cs-testRole">STEAM Educator</div>
                </div>
              </div>
              <p className="cs-testText">
                “The program transformed how I run lessons. I now plan with digital tools and
                practical assessments that engage learners.”
              </p>
            </div>

            <div className="cs-testCard">
              <div className="cs-testTop">
                <div className="cs-testAvatar">LC</div>
                <div>
                  <div className="cs-testName">Ligita Collins</div>
                  <div className="cs-testRole">Digital Literacy Coach</div>
                </div>
              </div>
              <p className="cs-testText">
                “STEAM ONE made teaching more effective. My learners improved because I changed my
                delivery and classroom structure.”
              </p>
            </div>

            <div className="cs-testCard">
              <div className="cs-testTop">
                <div className="cs-testAvatar">SK</div>
                <div>
                  <div className="cs-testName">Schan Kenoloy</div>
                  <div className="cs-testRole">Integration Specialist</div>
                </div>
              </div>
              <p className="cs-testText">
                “STEAM TWO gives a clear pathway for integrating technology. The curriculum is
                practical and directly applicable.”
              </p>
            </div>
          </div>
        </div>

        {/* bottom CTA */}
        <div className="cs-cta">
          <h3 className="cs-ctaTitle">Become a Certified 21st Century Educator</h3>
          <div className="cs-ctaBtns">
            <button className="cs-btn cs-btnPrimary" onClick={() => openCheckout(plans[0])}>
              Enroll in STEAM Program
            </button>
            <a className="cs-btn cs-btnGhost" href="/courses">
              View Courses
            </a>
          </div>

          <div className="cs-trustedSmall">
            Trusted by: ISTE • UNESCO • PISA • Microsoft Education
          </div>
        </div>

        {/* footer */}
        <div className="cs-footer">
          <div className="cs-copy">© {year} STEAM ONE Platform • All rights reserved</div>
        </div>
      </section>

      {/* checkout modal */}
      {open && selected ? (
        <div className="cs-modalOverlay" role="dialog" aria-modal="true" aria-labelledby="cs-modalTitle">
          <div className="cs-modal">
            <div className="cs-modalHead">
              <strong id="cs-modalTitle">Checkout • {selected.name}</strong>
              <button className="cs-closeX" onClick={closeCheckout} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="cs-modalBody">
              <div className="cs-summary">
                <div className="cs-summaryRow">
                  <span>Plan</span>
                  <b>{selected.name}</b>
                </div>
                <div className="cs-summaryRow">
                  <span>Price</span>
                  <b>${selected.priceUSD}</b>
                </div>
                <div className="cs-summaryRow">
                  <span>Access</span>
                  <b>Paid course + certificate</b>
                </div>
              </div>

              <form onSubmit={proceedPayment} className="cs-payForm">
                <div className="cs-formGrid">
                  <label className="cs-field">
                    <span>Full Name *</span>
                    <input
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </label>

                  <label className="cs-field">
                    <span>Email *</span>
                    <input
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </label>

                  <label className="cs-field cs-wide">
                    <span>Payment Provider</span>
                    <select
                      value={paymentProvider}
                      onChange={(e) => setPaymentProvider(e.target.value as any)}
                    >
                      <option value="Paystack">Paystack</option>
                      <option value="Flutterwave">Flutterwave</option>
                      <option value="Stripe">Stripe</option>
                    </select>
                    <small className="cs-help">
                      Backend will create a payment session and redirect to {paymentProvider}.
                    </small>
                  </label>
                </div>

                <div className="cs-modalActions">
                  <button type="button" className="cs-btn cs-btnGhostDark" onClick={closeCheckout}>
                    Cancel
                  </button>
                  <button type="submit" className="cs-btn cs-btnPrimary">
                    Proceed to Payment
                  </button>
                </div>

                {toast ? (
                  <div className="cs-toast">
                    ✅ Payment flow started (demo). Backend will handle real payment + email login.
                  </div>
                ) : null}
              </form>

              <div className="cs-disclaimer">
                After successful payment, the system will send a <b>welcome email</b> with login
                details and commencement information (handled by backend).
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}