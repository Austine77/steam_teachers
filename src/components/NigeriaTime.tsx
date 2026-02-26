import { useEffect, useState } from "react";
import { formatNigeriaTime } from "@/utils/time";

export default function NigeriaTime() {
  const [now, setNow] = useState(() => formatNigeriaTime(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => setNow(formatNigeriaTime(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  return <span title="Africa/Lagos">{now} (Nigeria)</span>;
}
