import React, { useEffect, useMemo, useState } from "react";
import "./PaymentPage.css";

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

type Provider = "Paystack" | "Flutterwave" | "Stripe";
type PlanId = "steam1" | "steam2" | "steam3";

type Plan = {
  id: PlanId;
  name: string;
  subtitle: string;
  priceUSD: number;
  badge: string;
};

const PLANS: Record<PlanId, Plan> = {
  steam1: {
    id: "steam1",
    name: "STEAM ONE",
    subtitle: "Digital Literacy • Teaching Foundations",
    priceUSD: 99,
    badge: "Introductory"
  },
  steam2: {
    id: "steam2",
    name: "STEAM TWO",
    subtitle: "Technology • Robotics • Integration",
    priceUSD: 199,
    badge: "Intermediate"
  },
  steam3: {
    id: "steam3",
    name: "STEAM THREE",
    subtitle: "Advanced STEAM • AI-Integrated Pathways",
    priceUSD: 399,
    badge: "Advanced / Expert"
  }
};

function money(n: number): string {
  const fixed = Math.round(n * 100) / 100;
  return `$${fixed.toFixed(2)}`;
}

export default function PaymentPage() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [ngTime, setNgTime] = useState(() => formatNigeriaTime(new Date()));

  // demo inputs (later: from checkout/order API)
  const [planId, setPlanId] = useState<PlanId>("steam2");
  const plan = PLANS[planId];

  const [email, setEmail] = useState("info@example.com");
  const [fullName, setFullName] = useState("John Doe");

  const [provider, setProvider] = useState<Provider>("Paystack");
  const [isPaying, setIsPaying] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNgTime(formatNigeriaTime(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  async function startPayment() {
    setIsPaying(true);
    setToast(false);

    // Backend later:
    // 1) Create/confirm order
    // 2) Create payment session (Paystack/Flutterwave/Stripe)
    // 3) Redirect to hosted checkout OR open payment popup
    // 4) On success: verify payment + send welcome email + activate course access

    window.setTimeout(() => {
      setIsPaying(false);
      setToast(true);
      window.setTimeout(() => setToast(false), 2200);
    }, 1400);
  }

  return (
    <div className="pm-root">
      {/* top strip */}
      <section className="pm-top">
        <div className="pm-topInner">
          <div className="pm-brand" aria-label="Microsoft Education">
            <div className="pm-msMark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div>
              <div className="pm-brandTitle">Microsoft Education</div>
              <div className="pm-brandSub">Payment • Secure Gateway</div>
            </div>
          </div>

          <div className="pm-topRight">
            <span className="pm-pill" title="Africa/Lagos">
              🕒 {ngTime} (Nigeria)
            </span>
            <a className="pm-btn pm-btnGhost" href="/checkout">
              Back to Checkout
            </a>
            <a className="pm-btn pm-btnPrimary" href="/courses">
              View Courses
            </a>
          </div>
        </div>
      </section>

      {/* hero */}
      <section className="pm-hero">
        <div className="pm-heroCard">
          <div className="pm-heroGrid">
            <div className="pm-heroText">
              <h1 className="pm-h1">Payment</h1>
              <div className="pm-breadcrumb">
                <span>Home</span> <span className="pm-dot">•</span> <span>Checkout</span>{" "}
                <span className="pm-dot">•</span> <b>Payment</b>
              </div>

              <div className="pm-heroNote">
                Complete your payment to unlock course access. After successful payment, a{" "}
                <b>welcome email</b> with your login details will be sent automatically.
              </div>

              <div className="pm-heroActions">
                <button className="pm-btn pm-btnPrimary" onClick={startPayment} disabled={isPaying}>
                  {isPaying ? "Processing..." : `Pay ${money(plan.priceUSD)} Securely`}
                </button>
                <a className="pm-btn pm-btnGhostDark" href="/policy">
                  View Policy
                </a>
              </div>
            </div>

            <div className="pm-heroArt" aria-label="Payment illustration placeholder">
              <div className="pm-artBubble pm-b1" />
              <div className="pm-artBubble pm-b2" />
              <div className="pm-artCard">
                Payment Banner Illustration (Placeholder)
                <span>Replace with a payment banner image.</span>
              </div>
            </div>
          </div>

          {/* demo plan switch */}
          <div className="pm-switchRow">
            <div className="pm-switchLabel">Demo: select plan</div>
            <div className="pm-switch">
              <button
                type="button"
                className={planId === "steam1" ? "pm-sBtn on" : "pm-sBtn"}
                onClick={() => setPlanId("steam1")}
              >
                STEAM ONE
              </button>
              <button
                type="button"
                className={planId === "steam2" ? "pm-sBtn on" : "pm-sBtn"}
                onClick={() => setPlanId("steam2")}
              >
                STEAM TWO
              </button>
              <button
                type="button"
                className={planId === "steam3" ? "pm-sBtn on" : "pm-sBtn"}
                onClick={() => setPlanId("steam3")}
              >
                STEAM THREE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* content */}
      <section className="pm-panel">
        <div className="pm-grid">
          {/* left: payer & provider */}
          <div className="pm-card">
            <div className="pm-cardTitle">Payer Details</div>

            <div className="pm-fields">
              <label className="pm-field">
                <span>Full Name</span>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </label>

              <label className="pm-field">
                <span>Email</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
            </div>

            <div className="pm-divider" />

            <div className="pm-cardTitle">Choose Payment Provider</div>

            <div className="pm-providerGrid">
              <button
                type="button"
                className={provider === "Paystack" ? "pm-provider on" : "pm-provider"}
                onClick={() => setProvider("Paystack")}
              >
                <div className="pm-provTop">
                  <div className="pm-provName">Paystack</div>
                  <div className="pm-provTag">Recommended (Nigeria)</div>
                </div>
                <div className="pm-provDesc">
                  Fast card and bank payments, optimized for Nigeria.
                </div>
              </button>

              <button
                type="button"
                className={provider === "Flutterwave" ? "pm-provider on" : "pm-provider"}
                onClick={() => setProvider("Flutterwave")}
              >
                <div className="pm-provTop">
                  <div className="pm-provName">Flutterwave</div>
                  <div className="pm-provTag">Multi-currency</div>
                </div>
                <div className="pm-provDesc">
                  Supports cards, bank transfer, and multiple payment options.
                </div>
              </button>

              <button
                type="button"
                className={provider === "Stripe" ? "pm-provider on" : "pm-provider"}
                onClick={() => setProvider("Stripe")}
              >
                <div className="pm-provTop">
                  <div className="pm-provName">Stripe</div>
                  <div className="pm-provTag">Global</div>
                </div>
                <div className="pm-provDesc">
                  Global payments and subscriptions for international users.
                </div>
              </button>
            </div>

            <div className="pm-secureLine">
              🔒 Secure checkout • Your payment is processed by <b>{provider}</b>.
            </div>

            <button className="pm-payBtn" type="button" onClick={startPayment} disabled={isPaying}>
              {isPaying ? "Redirecting to Gateway..." : `Pay ${money(plan.priceUSD)} with ${provider}`}
            </button>

            {toast ? (
              <div className="pm-toast">
                ✅ Demo: Payment started. Backend will verify payment and send welcome email.
              </div>
            ) : null}
          </div>

          {/* right: order summary */}
          <aside className="pm-side">
            <div className="pm-summaryCard">
              <div className="pm-sHead">
                <div>
                  <div className="pm-sTitle">Payment Summary</div>
                  <div className="pm-sSub">Order #STEAM-DEMO-001</div>
                </div>
                <div className="pm-lock">🛡️</div>
              </div>

              <div className="pm-plan">
                <div className="pm-planBadge">{plan.name}</div>
                <div>
                  <div className="pm-planName">{plan.name}</div>
                  <div className="pm-planSub">{plan.subtitle}</div>
                  <div className="pm-miniTag">{plan.badge}</div>
                </div>
              </div>

              <div className="pm-rows">
                <div className="pm-row">
                  <span>Amount</span>
                  <b>{money(plan.priceUSD)}</b>
                </div>
                <div className="pm-row">
                  <span>Provider</span>
                  <b>{provider}</b>
                </div>
                <div className="pm-row">
                  <span>Email</span>
                  <b className="pm-mono">{email || "—"}</b>
                </div>
              </div>

              <div className="pm-total">
                <span>Total</span>
                <b>{money(plan.priceUSD)}</b>
              </div>

              <div className="pm-note">
                After payment, course access will be activated and you’ll receive an email with login
                credentials and commencement details.
              </div>
            </div>

            <div className="pm-trustCard">
              <div className="pm-trustTitle">Trusted &amp; Compliant</div>
              <div className="pm-badges">
                <span>ISTE</span>
                <span>UNESCO ICT CFT</span>
                <span>PISA</span>
                <span>Microsoft Education</span>
              </div>
              <div className="pm-trustSmall">
                Your certification pathway follows internationally recognized standards.
              </div>
            </div>
          </aside>
        </div>

        {/* footer */}
        <div className="pm-footer">
          <div className="pm-copy">© {year} STEAM ONE Platform • All rights reserved</div>
        </div>
      </section>
    </div>
  );
}