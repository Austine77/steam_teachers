import React, { useEffect, useMemo, useState } from "react";
import "./EarningsPage.css";

type Role = "Teacher" | "Facilitator";
type TxStatus = "Paid" | "Pending" | "Failed";
type TxType = "Course Sale" | "Referral" | "Bonus" | "Withdrawal";

type Tx = {
  id: string;
  dateISO: string; // ISO date
  description: string;
  type: TxType;
  status: TxStatus;
  amount: number; // positive for earnings, negative for withdrawals
};

type PayoutMethod = "Paystack" | "Flutterwave" | "Bank Transfer";

const STORE_KEY = "steam_one_earnings_v1";

function formatNGN(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

function toDateLabel(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

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

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function uid(prefix = "TX") {
  return `${prefix}-${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
}

function seedTransactions(): Tx[] {
  const now = new Date();
  const day = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString();
  return [
    { id: uid(), dateISO: day(1), description: "STEAM TWO enrollment payout", type: "Course Sale", status: "Paid", amount: 6500 },
    { id: uid(), dateISO: day(3), description: "Referral: new teacher signup", type: "Referral", status: "Paid", amount: 1500 },
    { id: uid(), dateISO: day(6), description: "Performance bonus (weekly)", type: "Bonus", status: "Pending", amount: 3000 },
    { id: uid(), dateISO: day(8), description: "STEAM ONE enrollment payout", type: "Course Sale", status: "Paid", amount: 4200 },
    { id: uid(), dateISO: day(11), description: "Withdrawal to bank (demo)", type: "Withdrawal", status: "Paid", amount: -5000 },
    { id: uid(), dateISO: day(14), description: "STEAM THREE enrollment payout", type: "Course Sale", status: "Paid", amount: 8200 },
    { id: uid(), dateISO: day(18), description: "Referral payout", type: "Referral", status: "Pending", amount: 1200 },
    { id: uid(), dateISO: day(21), description: "STEAM TWO enrollment payout", type: "Course Sale", status: "Paid", amount: 6500 },
  ];
}

function loadStore(): { tx: Tx[]; role: Role } {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { tx: seedTransactions(), role: "Facilitator" };
    const parsed = JSON.parse(raw);
    const tx: Tx[] = Array.isArray(parsed?.tx) ? parsed.tx : seedTransactions();
    const role: Role = parsed?.role === "Teacher" ? "Teacher" : "Facilitator";
    return { tx, role };
  } catch {
    return { tx: seedTransactions(), role: "Facilitator" };
  }
}

function saveStore(tx: Tx[], role: Role) {
  localStorage.setItem(STORE_KEY, JSON.stringify({ tx, role }));
}

function downloadCSV(filename: string, rows: Record<string, string | number>[]) {
  const keys = Object.keys(rows[0] || {});
  const escape = (v: any) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  const csv = [keys.join(","), ...rows.map((r) => keys.map((k) => escape(r[k])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function EarningsPage() {
  // Nigeria time
  const [lagosNow, setLagosNow] = useState(getLagosTimeString());
  useEffect(() => {
    const t = setInterval(() => setLagosNow(getLagosTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Store state
  const initial = useMemo(() => loadStore(), []);
  const [role, setRole] = useState<Role>(initial.role);
  const [tx, setTx] = useState<Tx[]>(initial.tx);

  useEffect(() => {
    saveStore(tx, role);
  }, [tx, role]);

  // Controls
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<TxType | "All">("All");
  const [statusFilter, setStatusFilter] = useState<TxStatus | "All">("All");

  // Withdraw modal
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [withdrawMethod, setWithdrawMethod] = useState<PayoutMethod>("Paystack");
  const [agree, setAgree] = useState(false);

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2000);
  };

  // Aggregates
  const totals = useMemo(() => {
    const paidIn = tx.filter((t) => t.amount > 0 && t.status === "Paid").reduce((a, b) => a + b.amount, 0);
    const pendingIn = tx.filter((t) => t.amount > 0 && t.status === "Pending").reduce((a, b) => a + b.amount, 0);
    const withdrawn = Math.abs(tx.filter((t) => t.amount < 0).reduce((a, b) => a + b.amount, 0)); // negative amounts
    const available = Math.max(0, paidIn - withdrawn);
    const failed = tx.filter((t) => t.status === "Failed").reduce((a, b) => a + b.amount, 0);
    return { paidIn, pendingIn, withdrawn, available, failed };
  }, [tx]);

  // Chart: last 6 months buckets (simple)
  const monthly = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = new Intl.DateTimeFormat("en-NG", { month: "short" }).format(d);
      return { y: d.getFullYear(), m: d.getMonth(), label, earned: 0 };
    });

    for (const t of tx) {
      if (t.amount <= 0) continue;
      const d = new Date(t.dateISO);
      const idx = months.findIndex((mm) => mm.y === d.getFullYear() && mm.m === d.getMonth());
      if (idx >= 0) months[idx].earned += t.status === "Paid" ? t.amount : 0;
    }
    const max = Math.max(1, ...months.map((m) => m.earned));
    return { months, max };
  }, [tx]);

  // Filtered table rows
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return tx
      .slice()
      .sort((a, b) => +new Date(b.dateISO) - +new Date(a.dateISO))
      .filter((t) => {
        if (typeFilter !== "All" && t.type !== typeFilter) return false;
        if (statusFilter !== "All" && t.status !== statusFilter) return false;
        if (!query) return true;
        const text = `${t.id} ${t.description} ${t.type} ${t.status}`.toLowerCase();
        return text.includes(query);
      });
  }, [tx, q, typeFilter, statusFilter]);

  // Demo actions
  const addDemoEarning = () => {
    const amount = role === "Facilitator" ? 6200 : 3200;
    const entry: Tx = {
      id: uid(),
      dateISO: new Date().toISOString(),
      description: role === "Facilitator" ? "Course enrollment payout (demo)" : "Teaching session payout (demo)",
      type: "Course Sale",
      status: "Paid",
      amount,
    };
    setTx((prev) => [entry, ...prev]);
    showToast("✅ Added demo earning.");
  };

  const resetDemo = () => {
    setTx(seedTransactions());
    setRole("Facilitator");
    setQ("");
    setTypeFilter("All");
    setStatusFilter("All");
    setWithdrawOpen(false);
    setWithdrawAmount(0);
    setAgree(false);
    showToast("Reset demo earnings.");
  };

  const openWithdraw = () => {
    setWithdrawAmount(0);
    setWithdrawMethod("Paystack");
    setAgree(false);
    setWithdrawOpen(true);
  };

  const confirmWithdraw = () => {
    const amt = Math.floor(Number(withdrawAmount || 0));
    if (!agree) return showToast("Please accept the withdrawal terms.");
    if (!amt || amt < 1000) return showToast("Minimum withdrawal is ₦1,000.");
    if (amt > totals.available) return showToast("Insufficient available balance.");

    const entry: Tx = {
      id: uid("WD"),
      dateISO: new Date().toISOString(),
      description: `Withdrawal to ${withdrawMethod} (demo)`,
      type: "Withdrawal",
      status: "Paid",
      amount: -amt,
    };
    setTx((prev) => [entry, ...prev]);
    setWithdrawOpen(false);
    showToast("✅ Withdrawal created (demo).");
  };

  const exportCSV = () => {
    if (!filtered.length) return showToast("No transactions to export.");
    downloadCSV("steam-one-earnings.csv", filtered.map((t) => ({
      id: t.id,
      date: toDateLabel(t.dateISO),
      description: t.description,
      type: t.type,
      status: t.status,
      amount: t.amount,
    })));
    showToast("📄 Exported CSV.");
  };

  return (
    <div className="ep">
      {/* Sidebar */}
      <aside className="epSide">
        <div className="epBrand">
          <div className="epMsLogo" aria-label="Microsoft Education logo" />
          <div className="epBrandText">
            <div className="epBrandTop">Microsoft Education</div>
            <div className="epBrandName">
              <span className="epBrandSteam">STEAM</span>{" "}
              <span className="epBrandOne">ONE</span>{" "}
              <span className="epBrandPlatform">Platform</span>
            </div>
          </div>
        </div>

        <div className="epSideCard">
          <div className="epSideTitle">Earnings</div>
          <div className="epSideSub">
            Track payouts, withdrawals, and performance. Backend will later confirm transactions.
          </div>
          <button className="epBtn epBtnPay" onClick={openWithdraw}>
            💸 Withdraw
          </button>
        </div>

        <nav className="epNav" aria-label="Navigation">
          <button className="epNavItem">🏠 Dashboard</button>
          <button className="epNavItem">🛒 Course Marketplace</button>
          <button className="epNavItem">📚 My Courses</button>
          <button className="epNavItem">📣 Announcements</button>
          <button className="epNavItem active">💰 Earnings</button>
          <button className="epNavItem">⚙ Settings</button>
        </nav>

        <div className="epSideFooter">
          <div className="epSideFooterRow">
            <span className="epDot" /> <span>Aligned with ISTE • UNESCO ICT CFT • PISA</span>
          </div>
          <div className="epSideFooterCopy">© 2026 STEAM ONE Platform</div>
        </div>
      </aside>

      {/* Main */}
      <section className="epMain">
        {/* Header */}
        <header className="epTop">
          <div>
            <div className="epTitle">Earnings & Payouts</div>
            <div className="epSub">
              View your income history, pending payments, and withdrawals.
            </div>
            <div className="epTime">
              Nigeria Time: <span className="epTimeRed">{lagosNow}</span>
            </div>

            <div className="epRoleRow">
              <span className="epRoleLabel">View as</span>
              <div className="epRoleTabs" role="tablist" aria-label="Role tabs">
                <button
                  className={`epRoleTab ${role === "Teacher" ? "active" : ""}`}
                  onClick={() => setRole("Teacher")}
                >
                  Teacher
                </button>
                <button
                  className={`epRoleTab ${role === "Facilitator" ? "active" : ""}`}
                  onClick={() => setRole("Facilitator")}
                >
                  Facilitator
                </button>
              </div>
            </div>
          </div>

          <div className="epTopRight">
            <button className="epIconBtn" onClick={addDemoEarning} title="Add demo earning">
              ➕ Demo earning
            </button>
            <button className="epIconBtn ghost" onClick={exportCSV}>
              📄 Export CSV
            </button>
            <button className="epIconBtn ghost" onClick={resetDemo}>
              ♻ Reset demo
            </button>

            <div className="epUserChip">
              <span className="epUserAvatar" aria-hidden="true" />
              <span className="epUserText">
                <span className="epUserName">{role} User</span>
                <span className="epUserRole">{role} Account</span>
              </span>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="epStats">
          <div className="epStat">
            <div className="epStatIco">💰</div>
            <div>
              <div className="epStatLabel">Total Earned</div>
              <div className="epStatValue">{formatNGN(totals.paidIn + totals.withdrawn)}</div>
            </div>
            <div className="epStatHint">All time</div>
          </div>

          <div className="epStat">
            <div className="epStatIco">✅</div>
            <div>
              <div className="epStatLabel">Available Balance</div>
              <div className="epStatValue">{formatNGN(totals.available)}</div>
            </div>
            <div className="epStatHint">Withdrawable</div>
          </div>

          <div className="epStat">
            <div className="epStatIco">⏳</div>
            <div>
              <div className="epStatLabel">Pending</div>
              <div className="epStatValue">{formatNGN(totals.pendingIn)}</div>
            </div>
            <div className="epStatHint">Processing</div>
          </div>

          <div className="epStat">
            <div className="epStatIco">🏦</div>
            <div>
              <div className="epStatLabel">Withdrawn</div>
              <div className="epStatValue">{formatNGN(totals.withdrawn)}</div>
            </div>
            <div className="epStatHint">Paid out</div>
          </div>
        </div>

        <div className="epGrid">
          {/* Chart */}
          <div className="epCard">
            <div className="epCardHead">
              <div>
                <div className="epH3">Last 6 Months Earnings</div>
                <div className="epHint">Paid earnings only (demo visual).</div>
              </div>
              <button className="epBtn epBtnPrimary" onClick={openWithdraw}>
                Withdraw
              </button>
            </div>

            <div className="epChart">
              {monthly.months.map((m) => {
                const h = (m.earned / monthly.max) * 100;
                return (
                  <div className="epBar" key={`${m.y}-${m.m}`}>
                    <div className="epBarTop">{formatNGN(m.earned)}</div>
                    <div className="epBarRail">
                      <div className="epBarFill" style={{ height: `${clamp(h, 2, 100)}%` }} />
                    </div>
                    <div className="epBarLbl">{m.label}</div>
                  </div>
                );
              })}
            </div>

            <div className="epNote">
              Tip: When backend is ready, replace chart with real API values and verified settlement statuses.
            </div>
          </div>

          {/* Payout methods */}
          <div className="epCard">
            <div className="epCardHead">
              <div>
                <div className="epH3">Payout Methods</div>
                <div className="epHint">Select your preferred payout channel (demo placeholders).</div>
              </div>
            </div>

            <div className="epMethods">
              <div className="epMethodCard">
                <div className="epMethodTop">
                  <div className="epMethodTitle">Paystack</div>
                  <div className="epPill">Recommended</div>
                </div>
                <div className="epMethodSub">Fast withdrawals to bank accounts in Nigeria.</div>
                <button className="epBtn epBtnGhost" onClick={() => showToast("Paystack connected (demo).")}>
                  Connect
                </button>
              </div>

              <div className="epMethodCard">
                <div className="epMethodTop">
                  <div className="epMethodTitle">Flutterwave</div>
                  <div className="epPill soft">Popular</div>
                </div>
                <div className="epMethodSub">Alternative payout option for transfers and cards.</div>
                <button className="epBtn epBtnGhost" onClick={() => showToast("Flutterwave connected (demo).")}>
                  Connect
                </button>
              </div>

              <div className="epMethodCard">
                <div className="epMethodTop">
                  <div className="epMethodTitle">Bank Transfer</div>
                  <div className="epPill soft2">Manual</div>
                </div>
                <div className="epMethodSub">Direct bank payout setup (requires verification).</div>
                <button className="epBtn epBtnGhost" onClick={() => showToast("Bank details saved (demo).")}>
                  Add Bank
                </button>
              </div>
            </div>

            <div className="epMini">
              <div className="epMiniRow"><span>Minimum withdrawal</span><b>₦1,000</b></div>
              <div className="epMiniRow"><span>Processing time</span><b>Instant–24hrs</b></div>
              <div className="epMiniRow"><span>Verification</span><b>KYC required (backend)</b></div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="epCard">
          <div className="epCardHead">
            <div>
              <div className="epH3">Transactions</div>
              <div className="epHint">Search, filter, and export your earnings history.</div>
            </div>

            <div className="epControls">
              <div className="epSearch">
                <span className="epSearchIcon">🔎</span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by ID / description..."
                  aria-label="Search transactions"
                />
              </div>

              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} aria-label="Type filter">
                <option value="All">All Types</option>
                <option value="Course Sale">Course Sale</option>
                <option value="Referral">Referral</option>
                <option value="Bonus">Bonus</option>
                <option value="Withdrawal">Withdrawal</option>
              </select>

              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} aria-label="Status filter">
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>

              <button className="epBtn epBtnPay" onClick={openWithdraw}>Withdraw</button>
            </div>
          </div>

          <div className="epTableWrap">
            <table className="epTable">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th className="right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td className="mono">{toDateLabel(t.dateISO)}</td>
                    <td>
                      <div className="epDesc">
                        <div className="epDescTop">{t.description}</div>
                        <div className="epDescSub mono">{t.id}</div>
                      </div>
                    </td>
                    <td><span className={`epChip ${t.type.replaceAll(" ", "").toLowerCase()}`}>{t.type}</span></td>
                    <td><span className={`epStatus ${t.status.toLowerCase()}`}>{t.status}</span></td>
                    <td className={`right mono ${t.amount < 0 ? "neg" : "pos"}`}>{formatNGN(t.amount)}</td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={5} className="epEmpty">No transactions match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="epFoot">
            <div className="epFootLeft">
              Showing <b>{filtered.length}</b> transactions
            </div>
            <div className="epFootRight">
              <button className="epBtn epBtnGhost" onClick={exportCSV}>Export CSV</button>
              <button className="epBtn epBtnGhost" onClick={() => showToast("Opening payouts report (demo).")}>
                View Report
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="epFooter">
          <div className="epFooterLeft">
            <span className="epFooterLogo" aria-hidden="true" />
            <span>© 2026 STEAM ONE Platform. All rights reserved.</span>
          </div>
          <div className="epFooterLinks">
            <button className="epLinkBtn" onClick={() => alert("Terms (demo)")}>Terms</button>
            <button className="epLinkBtn" onClick={() => alert("Privacy (demo)")}>Privacy</button>
            <button className="epLinkBtn" onClick={() => alert("Support (demo)")}>Support</button>
          </div>
        </footer>
      </section>

      {/* Withdraw modal */}
      {withdrawOpen && (
        <div className="epModalOverlay" role="dialog" aria-modal="true" aria-label="Withdraw modal">
          <div className="epModal">
            <div className="epModalHead">
              <div>
                <div className="epModalTitle">Withdraw Funds</div>
                <div className="epModalSub">
                  Available: <b>{formatNGN(totals.available)}</b> • Minimum: <b>₦1,000</b>
                </div>
              </div>
              <button className="epModalClose" onClick={() => setWithdrawOpen(false)} aria-label="Close">✕</button>
            </div>

            <div className="epModalBody">
              <div className="epWithdrawGrid">
                <div className="epBlock">
                  <div className="epBTitle">Withdrawal Details</div>

                  <label className="epLbl">
                    Amount (₦)
                    <input
                      type="number"
                      value={withdrawAmount || ""}
                      onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                      placeholder="e.g. 5000"
                      min={0}
                    />
                  </label>

                  <label className="epLbl">
                    Method
                    <select value={withdrawMethod} onChange={(e) => setWithdrawMethod(e.target.value as PayoutMethod)}>
                      <option value="Paystack">Paystack</option>
                      <option value="Flutterwave">Flutterwave</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </label>

                  <div className="epHintBox">
                    <b>Note:</b> Frontend demo only. Backend will validate bank details and confirm payout settlement.
                  </div>

                  <label className="epAgree">
                    <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                    <span>I confirm this withdrawal request and accept processing rules.</span>
                  </label>

                  <button className="epBtn epBtnPay" onClick={confirmWithdraw}>
                    Withdraw
                  </button>
                  <button className="epBtn epBtnGhost" onClick={() => setWithdrawOpen(false)}>
                    Cancel
                  </button>
                </div>

                <div className="epBlock">
                  <div className="epBTitle">Summary</div>
                  <div className="epRow"><span>Available</span><b>{formatNGN(totals.available)}</b></div>
                  <div className="epRow"><span>Requested</span><b>{formatNGN(Math.floor(withdrawAmount || 0))}</b></div>
                  <div className="epRow"><span>Method</span><b>{withdrawMethod}</b></div>
                  <div className="epDivider" />
                  <div className="epTotal">
                    <span>Remaining (est.)</span>
                    <b>{formatNGN(Math.max(0, totals.available - Math.floor(withdrawAmount || 0)))}</b>
                  </div>

                  <div className="epMiniWarn">
                    Withdrawals may require KYC verification and can be reversed if fraud is detected (backend rules).
                  </div>

                  <button
                    className="epBtn epBtnPrimary"
                    onClick={() => {
                      setWithdrawAmount(Math.min(5000, totals.available));
                      showToast("Filled quick amount (₦5,000 or max).");
                    }}
                  >
                    Quick Fill ₦5,000
                  </button>
                </div>
              </div>
            </div>

            <div className="epModalFoot">
              <button className="epBtn epBtnGhost" onClick={() => setWithdrawOpen(false)}>Close</button>
              <button className="epBtn epBtnPrimary" onClick={confirmWithdraw}>Continue</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="epToast">{toast}</div>}
    </div>
  );
}