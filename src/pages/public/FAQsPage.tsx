import PageHeader from "@/components/PageHeader";

const faqs = [
  { q: "Is this a paid course?", a: "Yes. Each STEAM level is paid. You must complete checkout before gaining full access." },
  { q: "Do you send an email after sign-up?", a: "Yes. Backend will send welcome/login details and commencement date." },
  { q: "Do certified teachers appear in the marketplace?", a: "After successful completion and certification, teachers can opt in to be listed." },
  { q: "How do schools contact teachers?", a: "The marketplace 'contact this teacher' request goes to admin email for moderation and follow-up." }
];

export default function FAQsPage() {
  return (
    <div className="grid">
      <PageHeader title="FAQs" subtitle="Common questions about courses, certification, marketplace, and recruitment." />
      <div className="card">
        <div className="cardBody">
          <div className="grid" style={{ gap: 10 }}>
            {faqs.map((f) => (
              <div key={f.q} className="card" style={{ boxShadow: "none" }}>
                <div className="cardBody">
                  <div style={{ fontWeight: 900 }}>{f.q}</div>
                  <p className="p" style={{ marginTop: 8 }}>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
