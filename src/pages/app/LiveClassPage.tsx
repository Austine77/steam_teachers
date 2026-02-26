import PageHeader from "@/components/PageHeader";

export default function LiveClassPage() {
  return (
    <div className="grid">
      <PageHeader
        title="Live Class"
        subtitle="Join scheduled sessions (video integration placeholder)."
      />
      <div className="card">
        <div className="cardBody">
          <p className="p">Integrate your video provider (Zoom, Teams, WebRTC) via backend-supplied session links. Show schedule, attendance, and resources here.</p>
        </div>
      </div>
    </div>
  );
}
