import PageHeader from "@/components/PageHeader";

export default function EarningsPage() {
  return (
    <div className="grid">
      <PageHeader
        title="Earnings"
        subtitle="For facilitators/partners: earnings and payouts (placeholder)."
      />
      <div className="card">
        <div className="cardBody">
          <p className="p">Backend will calculate earnings, payout schedules, and transaction history.</p>
        </div>
      </div>
    </div>
  );
}
