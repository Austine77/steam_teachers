import NigeriaTime from "@/components/NigeriaTime";

export default function Footer() {
  return (
    <footer className="siteFooter">
      <div className="siteFooterInner">
        <div className="footCol">
          <div className="footBrand">
            <div className="footTitle">STEAM ONE Platform</div>
            <div className="footSub">Microsoft Education–aligned Teacher Certification & Marketplace</div>
          </div>
          <div className="footMeta">
            <span className="footBadge">🕒 Nigeria Time: <NigeriaTime /></span>
          </div>
        </div>

        <div className="footCol">
          <div className="footHead">Quick Links</div>
          <div className="footLinks">
            <a href="/courses">Courses</a>
            <a href="/marketplace">Marketplace</a>
            <a href="/services">Services</a>
            <a href="/contact">Contact</a>
          </div>
        </div>

        <div className="footCol">
          <div className="footHead">Support</div>
          <div className="footText">
            For help, use the Support Center or Contact page.
          </div>
          <div className="footLinks">
            <a href="/support">Support Center</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </div>

      <div className="siteFooterBottom">
        <span>© {new Date().getFullYear()} STEAM ONE Platform. All rights reserved.</span>
        <span className="dot">•</span>
        <a href="/admin/login">Admin</a>
      </div>
    </footer>
  );
}
