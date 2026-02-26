import PageHeader from "@/components/PageHeader";

export default function NotificationsPage() {
  return (
    <div className="grid">
      <PageHeader
        title="Notifications"
        subtitle="Activity alerts for courses, payments, certificates, and messages."
      />
      <div className="card">
        <div className="cardBody">
          <p className="p">Backend will push notifications (in-app + email). This page shows grouped notifications and preferences.</p>
        </div>
      </div>
    </div>
  );
}
