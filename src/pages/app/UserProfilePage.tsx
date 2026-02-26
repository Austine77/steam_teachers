import PageHeader from "@/components/PageHeader";

export default function UserProfilePage() {
  return (
    <div className="grid">
      <PageHeader
        title="User Profile"
        subtitle="Manage personal details, portfolio, and marketplace opt-in settings."
      />
      <div className="card">
        <div className="cardBody">
          <p className="p">Backend will store profile data, badges, and verification. Add upload areas for documents and evidence of experience.</p>
        </div>
      </div>
    </div>
  );
}
