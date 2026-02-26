import React, { useEffect, useMemo, useState } from "react";
import "./CheckoutPage.css";

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

type CoursePlan = {
  id: PlanId;
  name: string;
  subtitle: string;
  priceUSD: number;
  badge: string;
};

const PLANS: Record<PlanId, CoursePlan> = {
  steam1: {
    id: "steam1",
    name: "STEAM ONE",
    subtitle: "Digital Literacy • Teaching Foundations",
    priceUSD: 99,
    badge: "Introductory Course"
  },
  steam2: {
    id: "steam2",
    name: "STEAM TWO",
    subtitle: "Technology • Robotics • Integration",
    priceUSD: 199,
    badge: "Technology in Teaching"
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
  // show like $449.00
  const fixed = Math.round(n * 100) / 100;
  return `$${fixed.toFixed(2)}`;
}

export default function CheckoutPage() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [ngTime, setNgTime] = useState(() => formatNigeriaTime(new Date()));

  // demo: choose plan (later: from route param or backend cart)
  const [planId, setPlanId] = useState<PlanId>("steam2");
  const plan = PLANS[planId];

  // billing form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [cityStateZip, setCityStateZip] = useState("");

  // payment (demo UI)
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");

  // coupon
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>("STEAM10");
  const [discount, setDiscount] = useState<number>(plan.priceUSD * 0.1);

  const [toast, setToast] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNgTime(formatNigeriaTime(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  // update discount when plan changes (keep STEAM10 as example)
  useEffect(() => {
    if (appliedCoupon === "STEAM10") setDiscount(plan.priceUSD * 0.1);
    else setDiscount(0);
  }, [plan.priceUSD, appliedCoupon]);

  const subtotal = plan.priceUSD;
  const total = Math.max(0, subtotal - discount);

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (!code) return;

    // Demo rules
    if (code === "STEAM10") {
      setAppliedCoupon("STEAM10");
      setDiscount(subtotal * 0.1);
      setCoupon("");
      return;
    }
    if (code === "WELCOME50") {
      setAppliedCoupon("WELCOME50");
      setDiscount(50);
      setCoupon("");
      return;
    }

    // invalid -> clear
    setAppliedCoupon(null);
    setDiscount(0);
  }

  function onPay(e: React.FormEvent) {
    e.preventDefault();

    // Frontend demo validation
    if (!fullName || !email) {
      setToast(true);
      window.setTimeout(() => setToast(false), 1800);
      return;
    }

    // Backend later:
    // 1) create order
    // 2) create payment session (Paystack/Flutterwave/Stripe)
    // 3) redirect or show hosted payment
    setToast(true);
    window.setTimeout(() => setToast(false), 1800);
  }

  return (
    <div className="ck-root">
      {/* top strip */}
      <section className="ck-top">
        <div className="ck-topInner">
          <div className="ck-brand" aria-label="Microsoft Education">
            <div className="ck-msMark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div>
              <div className="ck-brandTitle">Microsoft Education</div>
              <div className="ck-brandSub">Secure Checkout</div>
            </div>
          </div>

          <div className="ck-topRight">
            <span className="ck-pill" title="Africa/Lagos">
              🕒 {ngTime} (Nigeria)
            </span>
            <a className="ck-btn ck-btnGhost" href="/login">
              Login
            </a>
            <a className="ck-btn ck-btnPrimary" href="/signup">
              Sign Up
            </a>
          </div>
        </div>
      </section>

      {/* hero */}
      <section className="ck-hero">
        <div className="ck-heroCard">
          <div className="ck-heroGrid">
            <div className="ck-heroText">
              <h1 className="ck-h1">Checkout</h1>
              <div className="ck-breadcrumb">
                <span>Home</span> <span className="ck-dot">•</span> <b>Checkout</b>
              </div>
            </div>

            <div className="ck-heroArt" aria-label="Checkout banner illustration placeholder">
              <div className="ck-artBubble ck-b1" />
              <div className="ck-artBubble ck-b2" />
              <div className="ck-artCard">
                Checkout Banner Illustration (Placeholder)
                <span>Replace with your checkout banner image.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* main panel */}
      <section className="ck-panel">
        {/* Your Course */}
        <div className="ck-sectionTitle">Your Course</div>

        <div className="ck-courseRow">
          <div className="ck-courseLeft">
            <div className="ck-courseBadge">{plan.name}</div>
            <div className="ck-courseInfo">
              <div className="ck-courseName">{plan.name}</div>
              <div className="ck-courseSub">{plan.subtitle}</div>
              <div className="ck-miniTag">{plan.badge}</div>
            </div>
          </div>

          <div className="ck-courseRight">{money(plan.priceUSD)}</div>
        </div>

        {/* plan switch (demo) */}
        <div className="ck-switchRow">
          <div className="ck-switchLabel">Choose plan:</div>
          <div className="ck-switch">
            <button
              className={planId === "steam1" ? "ck-sBtn on" : "ck-sBtn"}
              onClick={() => setPlanId("steam1")}
              type="button"
            >
              STEAM ONE
            </button>
            <button
              className={planId === "steam2" ? "ck-sBtn on" : "ck-sBtn"}
              onClick={() => setPlanId("steam2")}
              type="button"
            >
              STEAM TWO
            </button>
            <button
              className={planId === "steam3" ? "ck-sBtn on" : "ck-sBtn"}
              onClick={() => setPlanId("steam3")}
              type="button"
            >
              STEAM THREE
            </button>
          </div>
        </div>

        <form className="ck-grid" onSubmit={onPay}>
          {/* Billing */}
          <div className="ck-card">
            <div className="ck-cardTitle">Billing Information</div>

            <div className="ck-fields">
              <label className="ck-field">
                <span>Full Name</span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  required
                />
              </label>

              <label className="ck-field">
                <span>Email Address</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                />
              </label>

              <label className="ck-field">
                <span>Billing Address</span>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street Address"
                />
              </label>

              <label className="ck-field">
                <span>City, State/Province &amp; Zip/Postal Code</span>
                <input
                  value={cityStateZip}
                  onChange={(e) => setCityStateZip(e.target.value)}
                  placeholder="City, State, Zip"
                />
              </label>
            </div>

            <div className="ck-orderBox">
              <div className="ck-orderTitle">Order Summary</div>
              <div className="ck-orderText">
                This is a secure checkout. After successful payment, your welcome email and login
                access will be created and sent to you.
              </div>

              <div className="ck-orderHints">
                <div className="ck-hint">
                  <div className="ck-hIcon">✅</div>
                  <div>
                    <div className="ck-hTitle">Applied Recommendations</div>
                    <div className="ck-hDesc">
                      Your learning path will be recommended based on your selected program.
                    </div>
                  </div>
                </div>

                <div className="ck-hint">
                  <div className="ck-hIcon">🎓</div>
                  <div>
                    <div className="ck-hTitle">Certification &amp; Marketplace</div>
                    <div className="ck-hDesc">
                      Complete modules to qualify for certification and verified marketplace listing.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="ck-card">
            <div className="ck-cardTitle">Payment Method</div>

            <div className="ck-payMock">
              <div className="ck-payTop">
                <div className="ck-payBrand">Secure Checkout</div>
                <div className="ck-shield">🛡️</div>
              </div>

              <label className="ck-field">
                <span>Card Name</span>
                <input
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Name on card"
                />
              </label>

              <label className="ck-field">
                <span>Card Number</span>
                <input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                />
              </label>

              <div className="ck-two">
                <label className="ck-field">
                  <span>Expiry</span>
                  <input value={exp} onChange={(e) => setExp(e.target.value)} placeholder="MM/YY" />
                </label>

                <label className="ck-field">
                  <span>CVC</span>
                  <input value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="123" />
                </label>
              </div>

              <div className="ck-couponRow">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code (e.g. STEAM10)"
                />
                <button type="button" className="ck-applyBtn" onClick={applyCoupon}>
                  Apply
                </button>
              </div>

              <div className="ck-summary">
                <div className="ck-sRow">
                  <span>Course Subtotal</span>
                  <b>{money(subtotal)}</b>
                </div>

                <div className="ck-sRow">
                  <span>Applied</span>
                  <b className={discount > 0 ? "ck-good" : ""}>
                    {appliedCoupon ? appliedCoupon : "—"}
                  </b>
                </div>

                <div className="ck-sRow">
                  <span>Discount</span>
                  <b className={discount > 0 ? "ck-good" : ""}>
                    {discount > 0 ? `- ${money(discount)}` : money(0)}
                  </b>
                </div>

                <div className="ck-sTotal">
                  <span>Total</span>
                  <b>{money(total)}</b>
                </div>
              </div>
            </div>

            <button className="ck-payBtn" type="submit">
              Pay {money(total)} Securely
            </button>

            <div className="ck-payNote">
              Payment gateway integration will be connected by backend (Paystack/Flutterwave/Stripe).
            </div>

            {toast ? (
              <div className="ck-toast">
                ✅ Demo checkout submitted. Backend will create order + send welcome email after payment.
              </div>
            ) : null}
          </div>
        </form>

        {/* footer */}
        <div className="ck-footer">
          <div className="ck-copy">© {year} STEAM ONE Platform • All rights reserved</div>
        </div>
      </section>
    </div>
  );
}