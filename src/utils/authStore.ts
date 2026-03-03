export type Role = "teacher" | "facilitator" | "admin";

const KEY_ROLE = "steam_one_role_v1";
const KEY_AUTH = "steam_one_auth_v1"; // "1" = logged in

export function setSession(role: Role) {
  localStorage.setItem(KEY_AUTH, "1");
  localStorage.setItem(KEY_ROLE, role);
}

export function clearSession() {
  localStorage.removeItem(KEY_AUTH);
  localStorage.removeItem(KEY_ROLE);
}

export function isLoggedIn(): boolean {
  return localStorage.getItem(KEY_AUTH) === "1";
}

export function getRole(): Role | null {
  const r = localStorage.getItem(KEY_ROLE);
  if (r === "teacher" || r === "facilitator" || r === "admin") return r;
  return null;
}

// utils/authStore.ts

export type Role = "teacher" | "facilitator";

const KEY_ROLE = "steam_one_role_v1";
const KEY_AUTH = "steam_one_auth_v1";
const KEY_EMAIL_VERIFIED = "steam_one_email_verified_v1";

export function setSession(role: Role) {
  localStorage.setItem(KEY_AUTH, "1");
  localStorage.setItem(KEY_ROLE, role);
}

export function clearSession() {
  localStorage.removeItem(KEY_AUTH);
  localStorage.removeItem(KEY_ROLE);
}

export function getRole(): Role | null {
  const r = localStorage.getItem(KEY_ROLE);
  if (r === "teacher" || r === "facilitator") return r;
  return null;
}

export function setEmailVerified(status: boolean) {
  localStorage.setItem(KEY_EMAIL_VERIFIED, status ? "1" : "0");
}

export function isEmailVerified(): boolean {
  return localStorage.getItem(KEY_EMAIL_VERIFIED) === "1";
}

export type Role = "teacher" | "facilitator" | "admin";

const KEY_AUTH = "steam_one_auth_v1";
const KEY_ROLE = "steam_one_role_v1";
const KEY_ADMIN = "steam_admin_auth_v1";

export function setSession(role: Exclude<Role, "admin">) {
  localStorage.setItem(KEY_AUTH, "1");
  localStorage.setItem(KEY_ROLE, role);
}

export function clearSession() {
  localStorage.removeItem(KEY_AUTH);
  localStorage.removeItem(KEY_ROLE);
}

export function setAdminSession() {
  localStorage.setItem(KEY_ADMIN, "1");
  localStorage.setItem(KEY_ROLE, "admin");
}

export function clearAdminSession() {
  localStorage.removeItem(KEY_ADMIN);
  const r = localStorage.getItem(KEY_ROLE);
  if (r === "admin") localStorage.removeItem(KEY_ROLE);
}

export function isAuthed(): boolean {
  return localStorage.getItem(KEY_AUTH) === "1" || localStorage.getItem(KEY_ADMIN) === "1";
}

export function getRole(): Role | null {
  const r = localStorage.getItem(KEY_ROLE);
  if (r === "teacher" || r === "facilitator" || r === "admin") return r;
  // Backward-compat: if admin auth exists but role missing
  if (localStorage.getItem(KEY_ADMIN) === "1") return "admin";
  return null;
}

export function isAdminAuthed(): boolean {
  return localStorage.getItem(KEY_ADMIN) === "1";
}