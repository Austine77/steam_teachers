import PageHeader from "@/components/PageHeader";

export default function UsersReportPage() {
  return (
    <div className="grid">
      <PageHeader
        title="Users Report"
        subtitle="Admin reporting view for users, enrollments, and activity (placeholder)."
      />
      <div className="card">
        <div className="cardBody">
          <p className="p">Backend will provide exportable analytics: enrollments, completion rates, payments, and marketplace placements.</p>
        </div>
      </div>
    </div>
  );
}
