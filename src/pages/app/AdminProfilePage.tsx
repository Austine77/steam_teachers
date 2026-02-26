import PageHeader from "@/components/PageHeader";

export default function AdminProfilePage() {
  return (
    <div className="grid">
      <PageHeader
        title="Admin Profile"
        subtitle="Update admin details, security settings, and contact routing rules."
      />
      <div className="card">
        <div className="cardBody">
          <p className="p">Backend will manage admin accounts, permissions, and audit logs.</p>
        </div>
      </div>
    </div>
  );
}
