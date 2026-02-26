import React, { useEffect, useState } from "react";
import "./PolicyPage.css";

export default function PolicyPage() {

  const [ngTime, setNgTime] = useState("");

  useEffect(() => {
    const update = () => {
      const time = new Intl.DateTimeFormat("en-NG", {
        timeZone: "Africa/Lagos",
        dateStyle: "medium",
        timeStyle: "medium"
      }).format(new Date());

      setNgTime(time);
    };

    update();
    const id = setInterval(update,1000);
    return () => clearInterval(id);

  },[]);

  return (
    <div className="policy-container">

      {/* HERO */}
      <section className="policy-hero">
        <h1>Privacy Policy</h1>
        <p>Home • Privacy Policy</p>
        <div className="nigeria-time">Nigeria Time: {ngTime}</div>
      </section>


      {/* CONTENT */}
      <section className="policy-content">

        <h2>Privacy Policy</h2>

        <p>
          We respect your privacy. This policy explains how STEAM ONE Platform
          collects, uses and protects your information when you use our
          education training services aligned with ISTE Standards,
          UNESCO ICT CFT framework and PISA benchmarks.
        </p>


        <div className="policy-grid">

          {/* LEFT */}
          <div>

            <h3>Information We Collect</h3>

            <h4>Personal Information</h4>
            <ul>
              <li>Name, email address, phone number</li>
              <li>Login information</li>
              <li>Billing and payment data</li>
            </ul>

            <h4>Usage Data</h4>
            <ul>
              <li>Device information</li>
              <li>Website interaction analytics</li>
              <li>Course progress data</li>
            </ul>

            <h3>How We Use Your Information</h3>
            <ul>
              <li>Course management and certification processing</li>
              <li>Customer support communication</li>
              <li>Platform improvement and analytics</li>
            </ul>

          </div>


          {/* RIGHT */}
          <div>

            <h3>Data Security</h3>

            <p>
              We implement strong security measures to protect your personal
              data including secure payment processing and encrypted systems.
            </p>

            <h3>Your Rights</h3>

            <ul>
              <li>Access your personal information</li>
              <li>Request data deletion</li>
              <li>Opt out of marketing communication</li>
            </ul>

            <h3>Cookies & Tracking</h3>

            <p>
              Cookies help us improve user experience and analyze website usage.
            </p>

            <h3>Links to Other Websites</h3>

            <p>
              Our platform may contain external links. We are not responsible
              for third-party privacy practices.
            </p>

          </div>

        </div>


        {/* CTA */}
        <div className="policy-cta">
          <h3>Get in Touch with STEAM Education Experts</h3>
          <a href="/contact">Contact Us</a>
        </div>

      </section>

    </div>
  );
}