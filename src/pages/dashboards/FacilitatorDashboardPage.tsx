import PageHeader from "@/components/PageHeader";

export default function FacilitatorDashboardPage() {
  return (
    <div className="grid">
      <PageHeader
        title="Facilitator Dashboard"
        subtitle="Manage live sessions, announcements, assignments, and learner support."
      />
      <div className="card">
        <div className="cardBody">
          <p className="p">This screen is ready for backend integration: create sessions, publish announcements, track attendance, and support teacher learners.</p>
        </div>
      </div>
    </div>
  );
}
