import React, { useEffect, useState } from "react";
import "./SupportCenterPage.css";
import {
  generateTicketId,
  saveTicket,
  getTickets,
  type Priority,
  type Ticket,
} from "../utils/ticketStore";
import { getRole } from "../utils/authStore";

export default function SupportCenterPage() {
  const userEmail = localStorage.getItem("steam_user_email") || "user@example.com";
  const role = getRole() === "facilitator" ? "facilitator" : "teacher";

  const [tickets, setTicketsState] = useState<Ticket[]>(getTickets());

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Technical");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    const t = setInterval(() => setTicketsState(getTickets()), 1000);
    return () => clearInterval(t);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();

    const nowISO = new Date().toISOString();
    const id = generateTicketId();

    const ticket: Ticket = {
      id,
      subject,
      category,
      priority,
      attachmentName: fileName || undefined,
      status: "Open",
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
      userEmail,
      userRole: role,
      adminUnread: true,
      messages: [{ sender: "user", text: message, timeISO: nowISO }],
    };

    saveTicket(ticket);

    // Email simulation
    alert("📧 Ticket submitted! Email sent to support (simulation).");
    console.log("Email simulation:", { to: "support@steamoneplatform.com", subject: `New ticket ${id}`, body: message });

    setTicketsState(getTickets());
    setSubject("");
    setMessage("");
    setFileName("");
  }

  const myTickets = tickets.filter(t => t.userEmail === userEmail);

  return (
    <div className="support-root">
      <div className="support-header">
        <h1>Support Center</h1>
        <p>Submit a ticket and track your history.</p>
      </div>

      <div className="support-grid">
        <div className="support-card">
          <h2>Submit a Ticket</h2>
          <form onSubmit={submit} className="support-form">
            <label>Subject</label>
            <input value={subject} onChange={(e)=>setSubject(e.target.value)} required />

            <label>Category</label>
            <select value={category} onChange={(e)=>setCategory(e.target.value)}>
              <option>Technical</option>
              <option>Billing</option>
              <option>Certificate</option>
              <option>General Inquiry</option>
            </select>

            <label>Priority</label>
            <select value={priority} onChange={(e)=>setPriority(e.target.value as Priority)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <label>Message</label>
            <textarea rows={5} value={message} onChange={(e)=>setMessage(e.target.value)} required />

            <label>Attachment</label>
            <input
              type="file"
              onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
            />
            {fileName && <div className="support-file">📎 {fileName}</div>}

            <button type="submit">Submit Ticket</button>
          </form>
        </div>

        <div className="support-card">
          <h2>Your Ticket History</h2>

          {myTickets.length === 0 && <div className="support-empty">No tickets yet.</div>}

          <div className="support-history">
            {myTickets.map(t => (
              <div className="support-ticket" key={t.id}>
                <div className="row">
                  <b>{t.id}</b>
                  <span className={`pill ${t.priority.toLowerCase()}`}>{t.priority}</span>
                </div>
                <div className="sub">{t.subject}</div>
                <div className="meta">
                  Status: <b>{t.status}</b> • Created: {new Date(t.createdAtISO).toLocaleString("en-NG")}
                </div>
                {t.attachmentName && <div className="support-file">📎 {t.attachmentName}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="support-footer">
        <p>Microsoft Education | ISTE | UNESCO ICT CFT | PISA</p>
        <p>© 2026 STEAM ONE Platform</p>
      </footer>
    </div>
  );
}