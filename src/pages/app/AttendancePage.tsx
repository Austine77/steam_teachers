import PageHeader from "@/components/PageHeader";

export default function AttendancePage() {
  return (
    <div className="grid">
      <PageHeader
        title="Attendance"
        subtitle="Track attendance for live classes (placeholder)."
      />
      <div className="card">
        <div className="cardBody">
          <p className="p">Backend will track attendance, session logs, and engagement metrics.</p>
        </div>
      </div>
    </div>
  );
}
