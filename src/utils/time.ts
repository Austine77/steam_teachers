export function formatNigeriaTime(date = new Date()): string {
  // Africa/Lagos is UTC+1 year-round (no DST).
  // Use Intl where supported (most browsers). Fallback to UTC+1 manual formatting.
  try {
    const fmt = new Intl.DateTimeFormat("en-NG", {
      timeZone: "Africa/Lagos",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
    return fmt.format(date);
  } catch {
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const lagos = new Date(utc + 60 * 60000);
    return lagos.toLocaleString("en-NG");
  }
}
