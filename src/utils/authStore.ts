// src/utils/authStore.ts
// Single source of truth for auth/session keys across the app.

export type Role = "teacher" | "facilitator" | "admin";

/** Storage keys (v1) */
const KEY_AUTH = "steam_one_auth_v1"; // "1" = teacher/facilitator logged in
const KEY_ROLE = "steam_one_role_v1"; // teacher | facilitator | admin
const KEY_ADMIN = "steam_admin_auth_v1"; // "1" = admin authenticated
const KEY_EMAIL_VERIFIED = "steam_one_email_verified_v1"; // "1" = email verified

/** ---------------------------
 *  Teacher / Facilitator Auth
 *  ---------------------------
 */
export function setSession(role: Exclude<Role, "admin">) {
  localStorage.setItem(KEY_AUTH, "1");
  localStorage.setItem(KEY_ROLE, role);
}

export function clearSession() {
  localStorage.removeItem(KEY_AUTH);
  const r = localStorage.getItem(KEY_ROLE);
  if (r === "teacher" || r === "facilitator") localStorage.removeItem(KEY_ROLE);
}

/** ----------------
 *  Admin Auth
 *  ----------------
 */
export function setAdminSession() {
  localStorage.setItem(KEY_ADMIN, "1");
  localStorage.setItem(KEY_ROLE, "admin");
}

export function clearAdminSession() {
  localStorage.removeItem(KEY_ADMIN);
  const r = localStorage.getItem(KEY_ROLE);
  if (r === "admin") localStorage.removeItem(KEY_ROLE);
}

/** ----------------
 *  Generic helpers
 *  ----------------
 */
export function isAuthed(): boolean {
  return localStorage.getItem(KEY_AUTH) === "1" || localStorage.getItem(KEY_ADMIN) === "1";
}

export function getRole(): Role | null {
  const r = localStorage.getItem(KEY_ROLE);
  if (r === "teacher" || r === "facilitator" || r === "admin") return r;

  // Backward compatibility: if admin auth exists but role is missing
  if (localStorage.getItem(KEY_ADMIN) === "1") return "admin";

  return null;
}

export function isAdminAuthed(): boolean {
  return localStorage.getItem(KEY_ADMIN) === "1";
}

/** --------------------------
 *  Email verification helpers
 *  (demo placeholder for now)
 *  --------------------------
 */
export function setEmailVerified(status: boolean) {
  localStorage.setItem(KEY_EMAIL_VERIFIED, status ? "1" : "0");
}

export function isEmailVerified(): boolean {
  return localStorage.getItem(KEY_EMAIL_VERIFIED) === "1";
}

/** --------------------------
 *  Optional: full logout helper
 *  --------------------------
 */
export function logoutAll() {
  clearSession();
  clearAdminSession();
  localStorage.removeItem(KEY_EMAIL_VERIFIED);
}