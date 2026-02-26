import PageHeader from "@/components/PageHeader";

export default function AnnouncementsPage() {
  return (
    <div className="grid">
      <PageHeader
        title="Announcements"
        subtitle="Course updates, commencement dates, and important notices."
      />
      <div className="card">
        <div className="cardBody">
          <p className="p">Backend will provide announcements feed, filters, and read/unread status.</p>
        </div>
      </div>
    </div>
  );
}
