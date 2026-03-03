import React, { useEffect, useMemo, useState } from "react";
import "./TermsPage.css";

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

const LS_TERMS_ACCEPTED = "steam_terms_accepted_v1";

type TocItem = { id: string; label: string };

export default function TermsPage() {
  // Nigeria time
  const [lagosNow, setLagosNow] = useState(getLagosTimeString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const toc: TocItem[] = useMemo(
    () => [
      { id: "overview", label: "Overview" },
      { id: "eligibility", label: "Eligibility & Accounts" },
      { id: "payments", label: "Payments & Refunds" },
      { id: "courses", label: "Courses, Certificates & Access" },
      { id: "marketplace", label: "Marketplace & Recruiting" },
      { id: "acceptable-use", label: "Acceptable Use" },
      { id: "privacy", label: "Privacy & Communications" },
      { id: "ip", label: "Intellectual Property" },
      { id: "disclaimer", label: "Disclaimers" },
      { id: "liability", label: "Limitation of Liability" },
      { id: "termination", label: "Termination" },
      { id: "changes", label: "Changes to Terms" },
      { id: "contact", label: "Contact" },
    ],
    []
  );

  const [accepted, setAccepted] = useState(localStorage.getItem(LS_TERMS_ACCEPTED) === "1");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 1800);
  };

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function acceptTerms() {
    localStorage.setItem(LS_TERMS_ACCEPTED, "1");
    setAccepted(true);
    showToast("✅ Terms accepted (demo).");
  }

  function resetDemo() {
    localStorage.removeItem(LS_TERMS_ACCEPTED);
    setAccepted(false);
    showToast("Reset acceptance (demo).");
  }

  return (
    <div className="tp">
      {/* Sidebar */}
      <aside className="tpSide">
        <div className="tpBrand">
          <div className="tpMsLogo" aria-label="Microsoft Education logo" />
          <div className="tpBrandText">
            <div className="tpBrandTop">Microsoft Education</div>
            <div className="tpBrandName">
              <span className="tpSteam">STEAM</span> <span className="tpOne">ONE</span>{" "}
              <span className="tpPlat">Platform</span>
            </div>
          </div>
        </div>

        <div className="tpSideCard">
          <div className="tpSideTitle">Terms & Conditions</div>
          <div className="tpSideSub">
            Please read carefully. These terms govern platform access, payments, and usage.
          </div>

          <div className="tpTime">
            Nigeria Time: <span className="tpTimeRed">{lagosNow}</span>
          </div>

          <div className="tpBadgeRow">
            <span className={`tpPill ${accepted ? "ok" : ""}`}>
              {accepted ? "✅ Accepted" : "⚠ Not Accepted"}
            </span>
            <span className="tpPill neutral">Last updated: Mar 2026</span>
          </div>

          <div className="tpSideBtns">
            <button className="tpBtn tpBtnPrimary" onClick={() => scrollTo("accept")}>
              Review & Accept
            </button>
            <button className="tpBtn tpBtnGhost" onClick={() => window.location.href = "/privacy"}>
              Privacy Policy
            </button>
            <button className="tpBtn tpBtnGhost" onClick={resetDemo}>
              Reset Demo
            </button>
          </div>

          <div className="tpNote">
            Backend-ready: replace demo acceptance with server-side consent logging and audit trail.
          </div>
        </div>

        <nav className="tpNav" aria-label="Table of contents">
          <div className="tpNavTitle">Contents</div>
          {toc.map((t) => (
            <button key={t.id} className="tpNavItem" onClick={() => scrollTo(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="tpSideFooter">
          <div className="tpFootRow"><span className="tpDot" /> ISTE • UNESCO ICT CFT • PISA</div>
          <div className="tpFootCopy">© 2026 STEAM ONE Platform</div>
        </div>
      </aside>

      {/* Main */}
      <main className="tpMain">
        <header className="tpTop">
          <div>
            <div className="tpTitle">Terms & Conditions</div>
            <div className="tpSub">
              This is a professional template for your STEAM ONE Platform. Update details to match your legal needs.
            </div>
          </div>

          <div className="tpTopRight">
            <div className="tpCallout">
              <div className="tpCalloutTitle">Important</div>
              <div className="tpCalloutText">
                Certificates require completion, verification, and compliance with platform rules.
              </div>
            </div>
            <div className="tpCallout">
              <div className="tpCalloutTitle">Payments</div>
              <div className="tpCalloutText">
                No STEAM plan is unlocked without payment confirmation (backend will validate later).
              </div>
            </div>
          </div>
        </header>

        <section className="tpCard" id="overview">
          <div className="tpH3">1. Overview</div>
          <p className="tpP">
            These Terms & Conditions (“Terms”) govern your access to and use of the STEAM ONE Platform (“Platform”),
            including courses, marketplace features, recruiting tools, consulting services, and support channels.
            By accessing or using the Platform, you agree to these Terms.
          </p>
          <p className="tpP">
            The Platform supports teacher certification programs (STEAM ONE, STEAM TWO, STEAM THREE) aligned with
            international education standards such as ISTE, UNESCO ICT CFT, and PISA benchmarks.
          </p>

          <div className="tpInfoGrid">
            <div className="tpInfo">
              <div className="tpInfoIco">🧑‍🏫</div>
              <div>
                <div className="tpInfoTitle">Teacher Programs</div>
                <div className="tpInfoText">Paid certification plans with learning modules and completion tracking.</div>
              </div>
            </div>
            <div className="tpInfo">
              <div className="tpInfoIco">🛒</div>
              <div>
                <div className="tpInfoTitle">Marketplace</div>
                <div className="tpInfoText">Verified teachers and facilitators with contact/request workflow.</div>
              </div>
            </div>
            <div className="tpInfo">
              <div className="tpInfoIco">🛟</div>
              <div>
                <div className="tpInfoTitle">Support</div>
                <div className="tpInfoText">Ticketing, chat simulation, file uploads and admin management tools.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="tpCard" id="eligibility">
          <div className="tpH3">2. Eligibility & Accounts</div>
          <ul className="tpList">
            <li>You must provide accurate information when creating an account.</li>
            <li>You are responsible for keeping your login details secure.</li>
            <li>Admin access is restricted and protected by separate authentication controls.</li>
            <li>We may suspend accounts for policy violations or suspicious activity.</li>
          </ul>
        </section>

        <section className="tpCard" id="payments">
          <div className="tpH3">3. Payments & Refunds</div>
          <p className="tpP">
            Course plans and paid modules require payment before access is unlocked. Payments may be processed via
            approved gateways (e.g., Paystack, Flutterwave, card processors) once backend integration is enabled.
          </p>
          <ul className="tpList">
            <li>Payment is required before accessing paid course content.</li>
            <li>Refund policy (if applicable) must be defined by the platform owner.</li>
            <li>Chargebacks, fraud, or misuse may lead to suspension.</li>
          </ul>
          <div className="tpMiniNote">
            Demo note: This frontend currently simulates payment unlocking via localStorage. Backend will validate
            real transactions and enforce access.
          </div>
        </section>

        <section className="tpCard" id="courses">
          <div className="tpH3">4. Courses, Certificates & Access</div>
          <ul className="tpList">
            <li>Course content is licensed for personal learning use only unless otherwise stated.</li>
            <li>Certificates may require identity verification, completion, and admin approval.</li>
            <li>We may update course content to improve quality and compliance.</li>
            <li>Sharing paid content publicly or reselling access is prohibited.</li>
          </ul>
        </section>

        <section className="tpCard" id="marketplace">
          <div className="tpH3">5. Marketplace & Recruiting</div>
          <ul className="tpList">
            <li>Marketplace profiles may be verified or unverified based on platform rules.</li>
            <li>Recruiting requests should follow respectful and lawful communication practices.</li>
            <li>The Platform may mediate contact requests for safety and compliance.</li>
          </ul>
        </section>

        <section className="tpCard" id="acceptable-use">
          <div className="tpH3">6. Acceptable Use</div>
          <ul className="tpList">
            <li>No harassment, hate speech, threats, or abusive behavior.</li>
            <li>No attempt to hack, exploit, or disrupt the Platform.</li>
            <li>No uploading harmful files, malware, or illegal content.</li>
            <li>No impersonation or false identity for certification purposes.</li>
          </ul>
        </section>

        <section className="tpCard" id="privacy">
          <div className="tpH3">7. Privacy & Communications</div>
          <p className="tpP">
            The Platform may send emails or notifications for verification, course updates, support tickets, and account
            security. You can review more in the Privacy Policy.
          </p>
          <button className="tpBtnInline" onClick={() => (window.location.href = "/privacy")}>
            View Privacy Policy →
          </button>
        </section>

        <section className="tpCard" id="ip">
          <div className="tpH3">8. Intellectual Property</div>
          <ul className="tpList">
            <li>Platform UI, branding and course materials are protected by intellectual property laws.</li>
            <li>You may not copy, distribute, or resell content without written permission.</li>
            <li>Microsoft Education references are for alignment/branding context only where permitted.</li>
          </ul>
        </section>

        <section className="tpCard" id="disclaimer">
          <div className="tpH3">9. Disclaimers</div>
          <p className="tpP">
            The Platform is provided “as is”. We do not guarantee uninterrupted service, perfect accuracy, or that
            certification guarantees employment outcomes. Learning results depend on individual effort and context.
          </p>
        </section>

        <section className="tpCard" id="liability">
          <div className="tpH3">10. Limitation of Liability</div>
          <p className="tpP">
            To the maximum extent permitted by law, the Platform owners are not liable for indirect damages, lost profits,
            or incidental losses arising from your use of the Platform.
          </p>
        </section>

        <section className="tpCard" id="termination">
          <div className="tpH3">11. Termination</div>
          <p className="tpP">
            We may suspend or terminate access if you violate these Terms, misuse the Platform, or create risk to other
            users. You may stop using the Platform at any time.
          </p>
        </section>

        <section className="tpCard" id="changes">
          <div className="tpH3">12. Changes to Terms</div>
          <p className="tpP">
            We may update these Terms from time to time. When we do, we will update the “Last updated” date and may notify
            users within the Platform.
          </p>
        </section>

        <section className="tpCard" id="contact">
          <div className="tpH3">13. Contact</div>
          <p className="tpP">
            For support or legal inquiries, use the Support Center or Contact Admin page inside the Platform.
          </p>
          <div className="tpContactRow">
            <button className="tpBtnInline" onClick={() => (window.location.href = "/support")}>
              Open Support Center →
            </button>
            <button className="tpBtnInline" onClick={() => (window.location.href = "/contact-admin")}>
              Contact Admin →
            </button>
          </div>
        </section>

        {/* Accept */}
        <section className="tpCard" id="accept">
          <div className="tpH3">Review & Accept</div>
          <div className="tpAcceptBox">
            <label className="tpCheck">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => {
                  if (e.target.checked) acceptTerms();
                  else resetDemo();
                }}
              />
              <span>
                I have read and agree to the Terms & Conditions of STEAM ONE Platform.
              </span>
            </label>

            <div className="tpAcceptActions">
              <button className="tpBtn tpBtnPrimary" onClick={acceptTerms} disabled={accepted}>
                {accepted ? "✅ Accepted" : "Accept Terms"}
              </button>
              <button className="tpBtn tpBtnGhost" onClick={() => window.history.back()}>
                Go Back
              </button>
            </div>

            <div className="tpMiniNote">
              Backend later: store consent record with timestamp, user ID, IP/device info (optional) and terms version.
            </div>
          </div>
        </section>

        <footer className="tpFooter">
          <div>© 2026 STEAM ONE Platform • Terms</div>
          <div className="muted">Microsoft Education • ISTE • UNESCO ICT CFT • PISA</div>
        </footer>
      </main>

      {toast && <div className="tpToast">{toast}</div>}
    </div>
  );
}