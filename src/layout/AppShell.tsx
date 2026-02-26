import { NavLink, Outlet, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import NigeriaTime from "@/components/NigeriaTime";

const nav = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses (Paid)" },
  { to: "/marketplace", label: "Teachers Marketplace" },
  { to: "/recruiter", label: "Recruit a Teacher" },
  { to: "/services", label: "Services" },
  { to: "/consulting", label: "Consulting" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contact", label: "Contact" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms" },
  { to: "/verify", label: "Verify Certificate" },

  { to: "/login", label: "Login" },
  { to: "/signup", label: "Sign Up" },

  { to: "/dashboard/teacher", label: "Teacher Dashboard" },
  { to: "/dashboard/facilitator", label: "Facilitator Dashboard" },
  { to: "/dashboard/admin", label: "Admin Dashboard" },
  { to: "/app/attendance", label: "Attendance" },
  { to: "/app/assignments", label: "Assignments" },
  { to: "/app/support", label: "Support Center" }
];

function crumbs(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "Home";
  return parts.map((p) => p.replaceAll("-", " ")).join(" / ");
}

export default function AppShell() {
  const loc = useLocation();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <Logo />
          <div>
            <div className="brandTitle">STEAM Teacher Platform</div>
            <div className="brandSub">ISTE • UNESCO ICT CFT • PISA aligned</div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="badge">🕒 <NigeriaTime /></div>
        </div>

        <nav className="nav" aria-label="Primary navigation">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? "active" : "")}>
              <span>{n.label}</span>
              <span style={{ color: "rgba(255,255,255,0.25)" }}>›</span>
            </NavLink>
          ))}
        </nav>

        <div className="footer">
          <div>Microsoft Education logo shown as placeholder per branding requirement.</div>
          <div>Frontend-only scaffold — connect APIs later.</div>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <div style={{ fontWeight: 900, letterSpacing: 0.2 }}>{crumbs(loc.pathname)}</div>
            <div className="small">Skilling Teachers Towards STEAM Excellence</div>
          </div>
          <div className="rightMeta">
            <span className="badge">Paid Courses • Checkout Flow</span>
            <span className="badge">Marketplace • Admin-mediated contact</span>
          </div>
        </header>
        <div className="page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
