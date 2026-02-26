import PageHeader from "@/components/PageHeader";

export default function ContactAdminPage() {
  return (
    <div className="grid">
      <PageHeader
        title="Contact Admin"
        subtitle="Support channel for teachers and recruiters (placeholder)."
      />
      <div className="card">
        <div className="cardBody">
          <p className="p">Backend will connect to helpdesk/email and maintain ticket history.</p>
        </div>
      </div>
    </div>
  );
}
