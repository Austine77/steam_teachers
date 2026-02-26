import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import StatKpis from "@/components/StatKpis";

export default function TeacherDashboardPage() {
  return (
    <div className="grid">
      <PageHeader
        title="Teacher Dashboard"
        subtitle="Access paid courses, live classes, announcements, certificates, and marketplace opt-in."
        actions={
          <>
            <Link className="btn" to="/app/live-class">Live Class</Link>
            <Link className="btn btnPrimary" to="/app/course-marketplace">Course Marketplace</Link>
          </>
        }
      />
      <div className="card">
        <div className="cardBody">
          <StatKpis
            items={[
              { label: "Enrolled Courses", value: "1 (demo)", hint: "Unlock after payment verification" },
              { label: "Progress", value: "0%", hint: "Backend tracks modules completion" },
              { label: "Certificates", value: "0", hint: "Issued after successful completion" },
              { label: "Marketplace", value: "Not listed", hint: "Opt-in after certification" }
            ]}
          />

          <div className="grid" style={{ marginTop: 14, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            <Link to="/app/announcements" className="card" style={{ boxShadow: "none" }}>
              <div className="cardBody">
                <div style={{ fontWeight: 900 }}>Announcements</div>
                <p className="p" style={{ marginTop: 8 }}>Commencement dates, updates, and facilitator notices.</p>
              </div>
            </Link>
            <Link to="/app/certificates" className="card" style={{ boxShadow: "none" }}>
              <div className="cardBody">
                <div style={{ fontWeight: 900 }}>Certificates</div>
                <p className="p" style={{ marginTop: 8 }}>View and download your certificates and badges.</p>
              </div>
            </Link>
            <Link to="/app/profile" className="card" style={{ boxShadow: "none" }}>
              <div className="cardBody">
                <div style={{ fontWeight: 900 }}>My Profile</div>
                <p className="p" style={{ marginTop: 8 }}>Update your details and marketplace visibility.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
