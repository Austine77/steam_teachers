export type Priority = "Low" | "Medium" | "High";
export type Status = "Open" | "In Progress" | "Closed";

export type Message = {
  sender: "user" | "admin";
  text: string;
  timeISO: string;
};

export type Ticket = {
  id: string;
  subject: string;
  category: string;
  priority: Priority;
  attachmentName?: string;

  status: Status;
  createdAtISO: string;
  updatedAtISO: string;

  userEmail: string;
  userRole?: "teacher" | "facilitator";

  messages: Message[];

  // Admin "new" badge
  adminUnread: boolean;   // new ticket or new user message
};

const KEY = "steam_support_tickets_v1";
const COUNTER_KEY = "steam_ticket_counter_v1";

export function generateTicketId() {
  const year = new Date().getFullYear();
  const next = Number(localStorage.getItem(COUNTER_KEY) || "0") + 1;
  localStorage.setItem(COUNTER_KEY, String(next));
  return `STEAM-${year}-${String(next).padStart(4, "0")}`;
}

export function getTickets(): Ticket[] {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function setTickets(tickets: Ticket[]) {
  localStorage.setItem(KEY, JSON.stringify(tickets));
}

export function saveTicket(ticket: Ticket) {
  const t = getTickets();
  t.unshift(ticket);
  setTickets(t);
}

export function updateTicket(updated: Ticket) {
  const t = getTickets().map((x) => (x.id === updated.id ? updated : x));
  setTickets(t);
}

export function markAdminRead(ticketId: string) {
  const t = getTickets().map((x) => (x.id === ticketId ? { ...x, adminUnread: false } : x));
  setTickets(t);
}

export function countAdminUnread(): number {
  return getTickets().filter((t) => t.adminUnread).length;
}

export function ticketToCsvRow(t: Ticket) {
  const safe = (s: string) => `"${String(s ?? "").replace(/"/g, '""')}"`;
  return [
    safe(t.id),
    safe(t.subject),
    safe(t.category),
    safe(t.priority),
    safe(t.status),
    safe(t.userEmail),
    safe(t.userRole || ""),
    safe(t.attachmentName || ""),
    safe(t.createdAtISO),
    safe(t.updatedAtISO),
    safe(String(t.messages.length)),
  ].join(",");
}

export function exportTicketsCsv(filename = "steam-support-tickets.csv") {
  const tickets = getTickets();
  const header = [
    "Ticket ID",
    "Subject",
    "Category",
    "Priority",
    "Status",
    "User Email",
    "User Role",
    "Attachment",
    "Created At",
    "Updated At",
    "Message Count",
  ].join(",");

  const rows = tickets.map(ticketToCsvRow);
  const csv = [header, ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}