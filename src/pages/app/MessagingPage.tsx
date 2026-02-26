import PageHeader from "@/components/PageHeader";

export default function MessagingPage() {
  return (
    <div className="grid">
      <PageHeader
        title="Messaging"
        subtitle="In-app messages between teachers, facilitators, and admin (optional)."
      />
      <div className="card">
        <div className="cardBody">
          <p className="p">Implement chat threads, moderation, and attachments via backend. For now this is a clean placeholder UI.</p>
        </div>
      </div>
    </div>
  );
}
