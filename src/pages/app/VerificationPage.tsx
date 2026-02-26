import PageHeader from "@/components/PageHeader";

export default function VerificationPage() {
  return (
    <div className="grid">
      <PageHeader
        title="Certificate Verification"
        subtitle="Verify certificates by code (placeholder)."
      />
      <div className="card">
        <div className="cardBody">
          <p className="p">Backend will validate certificate codes and show public verification status.</p>
        </div>
      </div>
    </div>
  );
}
