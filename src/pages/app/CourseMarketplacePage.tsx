import PageHeader from "@/components/PageHeader";

export default function CourseMarketplacePage() {
  return (
    <div className="grid">
      <PageHeader
        title="Course Marketplace"
        subtitle="Browse available courses/modules and your enrollments (placeholder)."
      />
      <div className="card">
        <div className="cardBody">
          <p className="p">Backend will expose catalog, enrollments, access rules (paid), module progression, and resources.</p>
        </div>
      </div>
    </div>
  );
}
