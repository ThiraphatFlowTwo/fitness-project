import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function useTopbarData(role) {
  const [activeYear, setActiveYear] = useState(null);
  const [notifCount, setNotifCount] = useState(0);

  const load = useCallback(async () => {
    try {
      const yearRes = await api.get("/academic-years");
      const active = yearRes.data?.find((y) => y.status === "active");
      setActiveYear(active ?? null);
    } catch {}

    try {
      if (role === "admin") {
        const res = await api.get("/admin/users");
        const count = res.data?.filter((u) => u.status === "pending").length ?? 0;
        setNotifCount(count);
      } else if (role === "instructor") {
        const res = await api.get("/programs/pending");
        setNotifCount(res.data?.length ?? 0);
      } else if (role === "trainer") {
        const res = await api.get("/programs");
        const seen = JSON.parse(localStorage.getItem("seenPrograms") || "[]");
        const unseen = res.data?.filter(
          (p) => (p.status === "approved" || p.status === "rejected") && !seen.includes(p._id)
        );
        setNotifCount(unseen?.length ?? 0);
      }
    } catch {}
  }, [role]);

  useEffect(() => {
    load();

    // refresh ทุก 60 วินาที
    const interval = setInterval(load, 60_000);

    // ✅ รับ event เมื่อมีการเปลี่ยนแปลงปีการศึกษา
    window.addEventListener("academicYearChanged", load);

    return () => {
      clearInterval(interval);
      window.removeEventListener("academicYearChanged", load);
    };
  }, [load]);

  return { activeYear, notifCount };
}