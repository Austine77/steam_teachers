import React, { useEffect, useMemo, useState } from "react";
import "./TeacherDashboardPage.css";
import {
  getPaidPlans,
  setPaidPlan,
  clearPaidPlans,
  getProgress,
  setProgress as saveProgress,
  clearProgress,
  type PlanKey,
} from "../utils/paymentStore";

type PayMethod = "Paystack" | "Flutterwave" | "Card";

type Plan = {
  key: PlanKey;
  price: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  durationWeeks: number;
  lessons: number;
  projects: number;
  highlights: string[];
};

type Activity = {
  id: string;
  type: "Payment" | "Learning" | "Certificate" | "System";
  title: string;
  sub: string;
  time: string;
  status: "Success" | "Pending" | "Info";
};

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

function formatNGN(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function TeacherDashboardPage() {
  // Nigeria time
  const [lagosNow, setLagosNow] = useState(getLagosTimeString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Plans
  const plans: Plan[] = useMemo(
    () => [
      {
        key: "STEAM ONE",
        price: 15000,
        level: "Beginner",
        durationWeeks: 6,
        lessons: 28,
        projects: 4,
        highlights: [
          "Digital teaching foundations",
          "Lesson planning templates",
          "Assessment & feedback basics",
          "Certificate eligibility",
        ],
      },
      {
        key: "STEAM TWO",
        price: 20000,
        level: "Intermediate",
        durationWeeks: 8,
        lessons: 34,
        projects: 5,
        highlights: [
          "Tech integration mastery",
          "Interactive tools & labs",
          "Learning analytics basics",
          "Marketplace profile boost",
        ],
      },
      {
        key: "STEAM THREE",
        price: 25000,
        level: "Advanced",
        durationWeeks: 10,
        lessons: 42,
        projects: 7,
        highlights: [
          "AI-integrated teaching workflows",
          "Ethics & responsible AI",
          "Leadership & innovation plan",
          "Recruiter visibility boost",
        ],
      },
    ],
    []
  );

  // localStorage connected state
  const [paidPlans, setPaidPlansState] = useState<Record<PlanKey, boolean>>(getPaidPlans());
  const [progress, setProgressState] = useState<Record<PlanKey, number>>(getProgress());

  // Keep in sync on focus and storage updates
  useEffect(() => {
    const sync = () => {
      setPaidPlansState(getPaidPlans());
      setProgressState(getProgress());
    };
    sync();

    const onStorage = (e: StorageEvent) => {
      if (e.key === "steam_one_paid_plans_v1" || e.key === "steam_one_progress_v1") sync();
    };
    const onFocus = () => sync();

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // Active plan tab
  const [activePlan, setActivePlan] = useState<PlanKey>("STEAM ONE");

  // Search & quick filter
  const [q, setQ] = useState("");
  const [showPaidOnly, setShowPaidOnly] = useState(false);

  // Checkout modal (demo)
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null);
  const [payMethod, setPayMethod] = useState<PayMethod>("Paystack");
  const [agree, setAgree] = useState(false);

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 1800);
  };

  const paidCount = Object.values(paidPlans).filter(Boolean).length;

  const activePlanObj = useMemo(
    () => plans.find((p) => p.key === activePlan) ?? plans[0],
    [plans, activePlan]
  );

  const filteredPlans = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = plans.filter((p) => {
      if (!query) return true;
      const text = `${p.key} ${p.level} ${p.durationWeeks} ${p.lessons} ${p.projects}`.toLowerCase();
      return text.includes(query);
    });
    if (showPaidOnly) list = list.filter((p) => !!paidPlans[p.key]);
    return list;
  }, [plans, q, showPaidOnly, paidPlans]);

  const startCheckout = (p: Plan) => {
    setCheckoutPlan(p);
    setPayMethod("Paystack");
    setAgree(false);
    setCheckoutOpen(true);
  };

  const confirmPayment = () => {
    if (!checkoutPlan) return;
    if (!agree) return showToast("Please accept terms to continue.");

    // Save to localStorage
    setPaidPlan(checkoutPlan.key, true);

    // Sync state
    setPaidPlansState(getPaidPlans());

    setActivePlan(checkoutPlan.key);
    setCheckoutOpen(false);
    showToast(`✅ Payment successful for ${checkoutPlan.key} (demo). Plan unlocked!`);
  };

  const startLearning = (key: PlanKey) => {
    if (!paidPlans[key]) return showToast("Please make payment to unlock this plan.");
    setActivePlan(key);
    showToast("📘 Opening learning modules (demo).");
  };

  const completeLessonDemo = () => {
    if (!paidPlans[activePlan]) return showToast("Unlock your plan first.");
    setProgressState((prev) => {
      const nextVal = clamp((prev[activePlan] || 0) + 8, 0, 100);
      saveProgress(activePlan, nextVal); // persist
      return { ...prev, [activePlan]: nextVal };
    });
    showToast("✅ Lesson completed (demo). Progress saved.");
  };

  const resetDemo = () => {
    clearPaidPlans();
    clearProgress();
    setPaidPlansState(getPaidPlans());
    setProgressState(getProgress());
    showToast("Reset payments/progress (demo).");
  };

  const activities: Activity[] = useMemo(() => {
    const now = new Date();
    const t1 = now.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });
    return [
      {
        id: "a1",
        type: "System",
        title: "Welcome back",
        sub: "Your dashboard is synced with your payment status.",
        time: t1,
        status: "Info",
      },
      {
        id: "a2",
        type: "Learning",
        title: "Next action",
        sub: paidPlans[activePlan] ? "Continue Module 1 • Lesson 2" : "Choose a plan and make payment to unlock learning.",
        time: t1,
        status: "Info",
      },
      {
        id: "a3",
        type: "Certificate",
        title: "Certificate rules",
        sub: "Certificate becomes eligible at 100% completion + verification.",
        time: t1,
        status: "Info",
      },
    ];
  }, [paidPlans, activePlan]);

  const certificateStatus = progress[activePlan] >= 100 ? "Eligible" : "Pending";

  return (
    <div className="td">
      {/* Sidebar */}
      <aside className="tdSide">
        <div className="tdBrand">
          <div className="tdMsLogo" aria-label="Microsoft Education logo" />
          <div className="tdBrandText">
            <div className="tdBrandTop">Microsoft Education</div>
            <div className="tdBrandName">
              <span className="tdBrandSteam">STEAM</span>{" "}
              <span className="tdBrandOne">ONE</span>{" "}
              <span className="tdBrandPlatform">Platform</span>
            </div>
          </div>
        </div>

        <div className="tdSideCard">
          <div className="tdSideTitle">Teacher Dashboard</div>
          <div className="tdSideSub">
            Choose a plan, pay, and start learning. Certificates are issued after completion & verification.
          </div>
          <button className="tdBtn tdBtnPay" onClick={() => showToast("Support contacted (demo).")}>
            🧑‍💻 Contact Support
          </button>
        </div>

        <nav className="tdNav" aria-label="Navigation">
          <button className="tdNavItem active">🏠 Teacher Dashboard</button>
          <button className="tdNavItem">🛒 Course Marketplace</button>
          <button className="tdNavItem">📚 My Courses</button>
          <button className="tdNavItem">📝 Assignments</button>
          <button className="tdNavItem">🧍 Attendance</button>
          <button className="tdNavItem">🏅 Certificates</button>
          <button className="tdNavItem">📣 Announcements</button>
          <button className="tdNavItem">🧑‍💻 Contact Admin</button>
          <button className="tdNavItem">⚙ Settings</button>
        </nav>

        <div className="tdSideFooter">
          <div className="tdSideFooterRow">
            <span className="tdDot" /> <span>Aligned with ISTE • UNESCO ICT CFT • PISA</span>
          </div>
          <div className="tdSideFooterCopy">© 2026 STEAM ONE Platform</div>
        </div>
      </aside>

      {/* Main */}
      <section className="tdMain">
        {/* Header */}
        <header className="tdTop">
          <div className="tdTopLeft">
            <div className="tdTitle">Welcome, Teacher 👩‍🏫</div>
            <div className="tdSub">Your plans (STEAM 1–3) are below. Payment unlocks learning content.</div>
            <div className="tdTime">
              Nigeria Time: <span className="tdTimeRed">{lagosNow}</span>
            </div>

            <div className="tdQuickRow">
              <div className="tdPillInfo">
                <span className="tdPillDot" />
                <span>
                  Paid Plans: <b>{paidCount}</b>/3
                </span>
              </div>
              <div className="tdPillInfo">
                <span className="tdPillDot blue" />
                <span>
                  Active: <b>{activePlan}</b>
                </span>
              </div>
              <div className="tdPillInfo">
                <span className="tdPillDot gold" />
                <span>
                  Certificate: <b>{certificateStatus}</b>
                </span>
              </div>
            </div>
          </div>

          <div className="tdTopRight">
            <div className="tdSearch">
              <span className="tdSearchIcon">🔎</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search plans..."
                aria-label="Search plans"
              />
            </div>

            <label className="tdToggle">
              <input
                type="checkbox"
                checked={showPaidOnly}
                onChange={(e) => setShowPaidOnly(e.target.checked)}
              />
              <span>Paid only</span>
            </label>

            <button className="tdIconBtn" title="Notifications" aria-label="Notifications">
              🔔 <span className="tdBadge">2</span>
            </button>

            <button className="tdUserChip" aria-label="User menu">
              <span className="tdUserMiniAvatar" aria-hidden="true" />
              <span className="tdUserText">
                <span className="tdUserName">Teacher User</span>
                <span className="tdUserRole">Teacher Account</span>
              </span>
              <span className="tdCaret">▾</span>
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="tdStats">
          <div className="tdStat">
            <div className="tdStatIco">💳</div>
            <div>
              <div className="tdStatLabel">Plans Paid</div>
              <div className="tdStatValue">{paidCount}</div>
            </div>
            <div className="tdStatHint">Unlocked</div>
          </div>

          <div className="tdStat">
            <div className="tdStatIco">📘</div>
            <div>
              <div className="tdStatLabel">Active Plan</div>
              <div className="tdStatValue">{activePlan}</div>
            </div>
            <div className="tdStatHint">Current</div>
          </div>

          <div className="tdStat">
            <div className="tdStatIco">🎯</div>
            <div>
              <div className="tdStatLabel">Progress</div>
              <div className="tdStatValue">{progress[activePlan]}%</div>
            </div>
            <div className="tdStatHint">Saved</div>
          </div>

          <div className="tdStat">
            <div className="tdStatIco">🏅</div>
            <div>
              <div className="tdStatLabel">Certificate</div>
              <div className="tdStatValue">{certificateStatus}</div>
            </div>
            <div className="tdStatHint">Status</div>
          </div>
        </div>

        {/* Content grid */}
        <div className="tdGrid">
          {/* Plans */}
          <div className="tdCard">
            <div className="tdCardHead">
              <div>
                <div className="tdH3">Choose Your Plan</div>
                <div className="tdHint">
                  Pay once to unlock learning. This dashboard auto-syncs with Marketplace payments.
                </div>
              </div>
              <div className="tdCardActions">
                <button className="tdBtn tdBtnGhost" onClick={resetDemo}>
                  Reset Demo
                </button>
                <button className="tdBtn tdBtnPrimary" onClick={completeLessonDemo}>
                  ✅ Complete Lesson (Demo)
                </button>
              </div>
            </div>

            <div className="tdPlanGrid">
              {filteredPlans.map((p) => {
                const paid = paidPlans[p.key];
                const isActive = activePlan === p.key;

                return (
                  <article className={`tdPlan ${isActive ? "active" : ""}`} key={p.key}>
                    <div className="tdPlanTop">
                      <div className="tdPlanRow">
                        <span className={`tdPill ${p.key.replace(" ", "").toLowerCase()}`}>{p.key}</span>
                        <span className={`tdLock ${paid ? "paid" : ""}`}>{paid ? "✅ Paid" : "🔒 Locked"}</span>
                      </div>

                      <div className="tdPlanTitle">{p.key} Certification</div>

                      <div className="tdPlanMeta">
                        <span className="tdMini">{p.level}</span>
                        <span className="tdSep">•</span>
                        <span className="tdMini">{p.durationWeeks} weeks</span>
                        <span className="tdSep">•</span>
                        <span className="tdMini">{p.lessons} lessons</span>
                        <span className="tdSep">•</span>
                        <span className="tdMini">{p.projects} projects</span>
                      </div>

                      <div className="tdPriceRow">
                        <div className="tdPrice">{formatNGN(p.price)}</div>
                        <div className="tdPriceHint">One-time payment</div>
                      </div>

                      <ul className="tdBullets">
                        {p.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="tdPlanBottom">
                      <div className="tdPlanBtns">
                        <button className="tdBtn tdBtnGhostSmall" onClick={() => setActivePlan(p.key)}>
                          Set Active
                        </button>

                        {!paid ? (
                          <button className="tdBtn tdBtnPaySmall" onClick={() => startCheckout(p)}>
                            Pay Now
                          </button>
                        ) : (
                          <button className="tdBtn tdBtnPrimarySmall" onClick={() => startLearning(p.key)}>
                            Start Learning
                          </button>
                        )}
                      </div>

                      <div className="tdProg">
                        <div className="tdProgTop">
                          <span>Progress</span>
                          <b>{progress[p.key]}%</b>
                        </div>
                        <div className="tdProgBar" aria-label={`Progress ${progress[p.key]}%`}>
                          <div className="tdProgFill" style={{ width: `${clamp(progress[p.key], 0, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

              {filteredPlans.length === 0 && (
                <div className="tdEmpty">No plans match your search/filter.</div>
              )}
            </div>
          </div>

          {/* Right side panels */}
          <div className="tdStack">
            {/* Active plan box */}
            <div className="tdCard">
              <div className="tdCardHead">
                <div>
                  <div className="tdH3">Active Learning Panel</div>
                  <div className="tdHint">Shows your current plan status and next actions.</div>
                </div>
              </div>

              <div className="tdActive">
                <div className="tdActiveTop">
                  <div className="tdActiveTitle">{activePlanObj.key}</div>
                  <div className="tdActiveMeta">
                    <span className={`tdPill ${activePlanObj.key.replace(" ", "").toLowerCase()}`}>
                      {activePlanObj.level}
                    </span>
                    <span className="tdSep">•</span>
                    <span className="tdMini">{activePlanObj.durationWeeks} weeks</span>
                    <span className="tdSep">•</span>
                    <span className="tdMini">{activePlanObj.lessons} lessons</span>
                  </div>
                </div>

                <div className="tdActiveBody">
                  {!paidPlans[activePlanObj.key] ? (
                    <div className="tdLockedBox">
                      <div className="tdLockedTitle">🔒 This plan is locked</div>
                      <div className="tdLockedText">
                        Please make payment first to access learning modules. Payment unlocks content instantly.
                      </div>
                      <button className="tdBtn tdBtnPay" onClick={() => startCheckout(activePlanObj)}>
                        Pay {formatNGN(activePlanObj.price)}
                      </button>
                      <button
                        className="tdBtn tdBtnGhost"
                        onClick={() => showToast("Redirect to Marketplace (demo).")}
                      >
                        View in Marketplace
                      </button>
                    </div>
                  ) : (
                    <div className="tdUnlockedBox">
                      <div className="tdUnlockedTitle">✅ Plan Unlocked</div>
                      <div className="tdUnlockedText">
                        Access lessons, live classes, assignments, and receive certificate after completion.
                      </div>

                      <div className="tdInfoGrid">
                        <div className="tdInfoCard">
                          <div className="tdInfoLabel">Progress</div>
                          <div className="tdInfoValue">{progress[activePlanObj.key]}%</div>
                        </div>
                        <div className="tdInfoCard">
                          <div className="tdInfoLabel">Certificate</div>
                          <div className="tdInfoValue">
                            {progress[activePlanObj.key] >= 100 ? "Eligible" : "In progress"}
                          </div>
                        </div>
                        <div className="tdInfoCard">
                          <div className="tdInfoLabel">Next</div>
                          <div className="tdInfoValue">Module 1 • Lesson 2</div>
                        </div>
                      </div>

                      <div className="tdProgBar big" aria-label={`Active progress ${progress[activePlanObj.key]}%`}>
                        <div
                          className="tdProgFill"
                          style={{ width: `${clamp(progress[activePlanObj.key], 0, 100)}%` }}
                        />
                      </div>

                      <div className="tdActions">
                        <button className="tdBtn tdBtnPrimary" onClick={() => showToast("Opening lessons (demo).")}>
                          📘 Open Lessons
                        </button>
                        <button className="tdBtn tdBtnGhost" onClick={() => showToast("Opening assignments (demo).")}>
                          📝 Assignments
                        </button>
                        <button className="tdBtn tdBtnGhost" onClick={() => showToast("Opening attendance (demo).")}>
                          🧍 Attendance
                        </button>
                      </div>

                      <div className="tdNote">
                        Backend will later control access, payment verification and real content delivery.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent activity */}
            <div className="tdCard">
              <div className="tdCardHead">
                <div>
                  <div className="tdH3">Recent Activity</div>
                  <div className="tdHint">Demo activity feed (can connect to backend later).</div>
                </div>
              </div>

              <div className="tdFeed">
                {activities.map((a) => (
                  <div className="tdFeedItem" key={a.id}>
                    <div className={`tdFeedIco ${a.type.toLowerCase()}`}>
                      {a.type === "Payment" ? "💳" : a.type === "Learning" ? "📘" : a.type === "Certificate" ? "🏅" : "ℹ️"}
                    </div>
                    <div className="tdFeedText">
                      <div className="tdFeedTitle">{a.title}</div>
                      <div className="tdFeedSub">{a.sub}</div>
                    </div>
                    <div className="tdFeedRight">
                      <div className={`tdFeedTag ${a.status.toLowerCase()}`}>{a.status}</div>
                      <div className="tdFeedTime">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="tdFeedActions">
                <button className="tdBtn tdBtnGhost" onClick={() => showToast("Open notifications (demo).")}>
                  View Notifications
                </button>
                <button className="tdBtn tdBtnGhost" onClick={() => showToast("Open messages (demo).")}>
                  Open Messages
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="tdFooter">
          <div className="tdFooterLeft">
            <span className="tdFooterLogo" aria-hidden="true" />
            <span>© 2026 STEAM ONE Platform. All rights reserved.</span>
          </div>
          <div className="tdFooterLinks">
            <button className="tdLinkBtn" onClick={() => alert("Terms (demo)")}>Terms</button>
            <button className="tdLinkBtn" onClick={() => alert("Privacy (demo)")}>Privacy</button>
            <button className="tdLinkBtn" onClick={() => alert("Support (demo)")}>Support</button>
          </div>
        </footer>
      </section>

      {/* Checkout Modal */}
      {checkoutOpen && checkoutPlan && (
        <div className="tdModalOverlay" role="dialog" aria-modal="true" aria-label="Checkout modal">
          <div className="tdModal">
            <div className="tdModalHead">
              <div className="tdModalHeadLeft">
                <div className="tdModalTitle">Checkout</div>
                <div className="tdModalSub">
                  You are paying for <b>{checkoutPlan.key}</b>. Payment unlocks learning content.
                </div>
              </div>
              <button className="tdModalClose" onClick={() => setCheckoutOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="tdModalBody">
              <div className="tdCheckout">
                <div className="tdBlock">
                  <div className="tdBTitle">Order Summary</div>
                  <div className="tdRow"><span>Plan</span><b>{checkoutPlan.key}</b></div>
                  <div className="tdRow"><span>Level</span><b>{checkoutPlan.level}</b></div>
                  <div className="tdRow"><span>Duration</span><b>{checkoutPlan.durationWeeks} weeks</b></div>
                  <div className="tdRow"><span>Amount</span><b>{formatNGN(checkoutPlan.price)}</b></div>
                  <div className="tdDivider" />
                  <div className="tdTotal"><span>Total</span><b>{formatNGN(checkoutPlan.price)}</b></div>
                </div>

                <div className="tdBlock">
                  <div className="tdBTitle">Payment Method</div>
                  <div className="tdMethods">
                    {(["Paystack", "Flutterwave", "Card"] as PayMethod[]).map((m) => (
                      <button
                        key={m}
                        className={`tdMethod ${payMethod === m ? "active" : ""}`}
                        onClick={() => setPayMethod(m)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  <div className="tdHintBox">
                    <b>Note:</b> This is frontend demo. Backend will generate payment link and confirm payment later.
                  </div>

                  <label className="tdAgree">
                    <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                    <span>I agree to Terms and understand payment is required before learning access.</span>
                  </label>

                  <button className="tdBtn tdBtnPay" onClick={confirmPayment}>
                    Pay {formatNGN(checkoutPlan.price)}
                  </button>
                  <button className="tdBtn tdBtnGhost" onClick={() => setCheckoutOpen(false)}>
                    Cancel
                  </button>

                  {/* Quick demo buttons (optional) */}
                  <div className="tdMiniDemoRow">
                    <button
                      className="tdMiniDemo"
                      onClick={() => {
                        setPaidPlan(checkoutPlan.key, true);
                        setPaidPlansState(getPaidPlans());
                        showToast("Marked as Paid (demo).");
                      }}
                    >
                      Mark Paid
                    </button>
                    <button
                      className="tdMiniDemo danger"
                      onClick={() => {
                        setPaidPlan(checkoutPlan.key, false);
                        setPaidPlansState(getPaidPlans());
                        showToast("Marked as Locked (demo).");
                      }}
                    >
                      Mark Locked
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="tdModalFoot">
              <button className="tdBtn tdBtnGhost" onClick={() => setCheckoutOpen(false)}>
                Close
              </button>
              <button className="tdBtn tdBtnPrimary" onClick={confirmPayment}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="tdToast">{toast}</div>}
    </div>
  );
}