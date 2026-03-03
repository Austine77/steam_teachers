export type PlanKey = "STEAM ONE" | "STEAM TWO" | "STEAM THREE";

const KEY = "steam_one_paid_plans_v1";
const PROGRESS_KEY = "steam_one_progress_v1";

export function getPaidPlans(): Record<PlanKey, boolean> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return { "STEAM ONE": false, "STEAM TWO": false, "STEAM THREE": false };
    }
    const parsed = JSON.parse(raw);
    return {
      "STEAM ONE": !!parsed["STEAM ONE"],
      "STEAM TWO": !!parsed["STEAM TWO"],
      "STEAM THREE": !!parsed["STEAM THREE"],
    };
  } catch {
    return { "STEAM ONE": false, "STEAM TWO": false, "STEAM THREE": false };
  }
}

export function setPaidPlan(plan: PlanKey, paid: boolean) {
  const current = getPaidPlans();
  const next = { ...current, [plan]: paid };
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearPaidPlans() {
  localStorage.removeItem(KEY);
}

export function getProgress(): Record<PlanKey, number> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { "STEAM ONE": 0, "STEAM TWO": 0, "STEAM THREE": 0 };
    const p = JSON.parse(raw);
    return {
      "STEAM ONE": Number(p["STEAM ONE"] || 0),
      "STEAM TWO": Number(p["STEAM TWO"] || 0),
      "STEAM THREE": Number(p["STEAM THREE"] || 0),
    };
  } catch {
    return { "STEAM ONE": 0, "STEAM TWO": 0, "STEAM THREE": 0 };
  }
}

export function setProgress(plan: PlanKey, value: number) {
  const current = getProgress();
  const next = { ...current, [plan]: Math.max(0, Math.min(100, value)) };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
}

export function clearProgress() {
  localStorage.removeItem(PROGRESS_KEY);
}

// utils/paymentStore.ts

export type PlanKey = "STEAM ONE" | "STEAM TWO" | "STEAM THREE";

const KEY = "steam_one_paid_plans";

export function setPaidPlan(plan: PlanKey, status: boolean) {
  const existing = JSON.parse(localStorage.getItem(KEY) || "{}");
  existing[plan] = status;
  localStorage.setItem(KEY, JSON.stringify(existing));
}

export function getPaidPlans() {
  return JSON.parse(localStorage.getItem(KEY) || "{}");
}