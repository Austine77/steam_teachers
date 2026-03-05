// src/utils/userStore.ts
// Frontend-only local account store (for demo/prototyping without backend).
// When backend is ready, replace these functions with API calls.

export type UserRole = "teacher" | "facilitator";

export type LocalUser = {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  // NOTE: plain password storage is NOT secure. This is only for local prototype.
  password: string;
  createdAt: number;
};

const KEY_USERS = "steam_one_users_v1";

function readUsers(): LocalUser[] {
  try {
    const raw = localStorage.getItem(KEY_USERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as LocalUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: LocalUser[]) {
  localStorage.setItem(KEY_USERS, JSON.stringify(users));
}

export function listUsers(): LocalUser[] {
  return readUsers();
}

export function findUserByEmail(email: string): LocalUser | undefined {
  const e = email.trim().toLowerCase();
  return readUsers().find(u => u.email.toLowerCase() === e);
}

export function createUser(input: Omit<LocalUser, "id" | "createdAt">): { ok: true; user: LocalUser } | { ok: false; error: string } {
  const email = input.email.trim().toLowerCase();
  if (!email) return { ok: false, error: "Email is required." };
  const exists = findUserByEmail(email);
  if (exists) return { ok: false, error: "This email is already registered. Please login." };

  const user: LocalUser = {
    ...input,
    email,
    id: `u_${Math.random().toString(16).slice(2)}_${Date.now()}`,
    createdAt: Date.now(),
  };

  const users = readUsers();
  users.unshift(user);
  writeUsers(users);
  return { ok: true, user };
}

export function authenticate(email: string, password: string): { ok: true; user: LocalUser } | { ok: false; error: string } {
  const u = findUserByEmail(email);
  if (!u) return { ok: false, error: "Account not found. Please sign up." };
  if (u.password !== password) return { ok: false, error: "Incorrect password." };
  return { ok: true, user: u };
}
