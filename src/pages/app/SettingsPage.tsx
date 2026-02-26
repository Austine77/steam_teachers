import PageHeader from "@/components/PageHeader";

export default function SettingsPage() {
  return (
    <div className="grid">
      <PageHeader
        title="Settings"
        subtitle="Account, security, notification preferences, and profile controls."
      />
      <div className="card">
        <div className="cardBody">
          <p className="p">Backend will save user preferences. Add password reset, MFA, email settings, and notification toggles.</p>
        </div>
      </div>
    </div>
  );
}
