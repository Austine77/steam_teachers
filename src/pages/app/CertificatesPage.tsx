import PageHeader from "@/components/PageHeader";

export default function CertificatesPage() {
  return (
    <div className="grid">
      <PageHeader
        title="Certificates"
        subtitle="View issued certificates and badges after completion."
      />
      <div className="card">
        <div className="cardBody">
          <p className="p">Backend will generate certificate PDFs and verification codes. This page lists certificates and provides download/verify actions.</p>
        </div>
      </div>
    </div>
  );
}
