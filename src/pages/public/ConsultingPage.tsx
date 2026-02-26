import PageHeader from "@/components/PageHeader";

export default function ConsultingPage() {
  return (
    <div className="grid">
      <PageHeader
        title="Consulting Services"
        subtitle="Support for government education agencies and private schools transitioning to digitally-enabled learning."
      />
      <div className="card">
        <div className="cardBody">
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            <div className="card" style={{ boxShadow: "none" }}>
              <div className="cardBody">
                <div style={{ fontWeight: 900 }}>Government & Agencies</div>
                <p className="p" style={{ marginTop: 10 }}>
                  Assist in shaping educational policies and addressing pedagogical issues like improving curriculum and instructional design.
                  Work with boards and agencies to improve educational delivery.
                </p>
              </div>
            </div>
            <div className="card" style={{ boxShadow: "none" }}>
              <div className="cardBody">
                <div style={{ fontWeight: 900 }}>Private School Owners</div>
                <p className="p" style={{ marginTop: 10 }}>
                  Help schools transition into digitally-age learning environments: upgrade teaching practice, tools, and resources to stand out.
                </p>
              </div>
            </div>
          </div>

          <div className="small" style={{ marginTop: 14 }}>
            Backend will add scheduling, invoicing, and service request ticketing.
          </div>
        </div>
      </div>
    </div>
  );
}
