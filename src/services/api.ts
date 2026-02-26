/**
 * Frontend-only placeholder API layer.
 * Backend team can replace baseUrl + implementations later.
 */

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.example.com";

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {})
      },
      ...init
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      return { ok: false, error: msg || `Request failed (${res.status})` };
    }

    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; role: string; name: string } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),

  signup: (payload: { name: string; email: string; password: string }) =>
    request<{ ok: true }>("/auth/signup", { method: "POST", body: JSON.stringify(payload) }),

  // Courses
  listCourses: () =>
    request<Array<{ id: string; title: string; level: "STEAM ONE" | "STEAM TWO" | "STEAM THREE"; priceNGN: number }>>(
      "/courses"
    ),

  // Marketplace contact request (admin-mediated)
  requestTeacherContact: (teacherId: string, message: string) =>
    request<{ ok: true }>("/marketplace/contact-request", {
      method: "POST",
      body: JSON.stringify({ teacherId, message })
    }),

  // Recruiter submission
  submitRecruiterForm: (payload: Record<string, unknown>) =>
    request<{ ok: true }>("/recruiter/submit", {
      method: "POST",
      body: JSON.stringify(payload)
    })
};
