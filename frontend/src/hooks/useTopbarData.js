import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function useTopbarData(role) {
  const [activeYear,  setActiveYear]  = useState(null);
  const [notifCount,  setNotifCount]  = useState(0);
  const [notifList,   setNotifList]   = useState([]);

  const load = useCallback(async () => {
    // ── ปีการศึกษา active ─────────────────────────────────
    try {
      const r = await api.get("/academic-years");
      const active = r.data?.find((y) => y.status === "active");
      setActiveYear(active ?? null);
    } catch {}

    // ── จำนวนแจ้งเตือนจาก API จริง ───────────────────────
    try {
      const r = await api.get("/notifications/unread-count");
      setNotifCount(r.data?.count ?? 0);
    } catch {}

    // ── รายการแจ้งเตือน ───────────────────────────────────
    try {
      const r = await api.get("/notifications");
      setNotifList(r.data ?? []);
    } catch {}
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifCount(0);
      setNotifList(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch {}
  }, []);

  const markRead = useCallback(async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifList(prev => prev.map(n => n._id === id ? { ...n, is_read: true } : n));
      setNotifCount(prev => Math.max(0, prev - 1));
    } catch {}
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30_000); // refresh ทุก 30 วินาที
    window.addEventListener("academicYearChanged", load);
    window.addEventListener("notificationRefresh", load);
    return () => {
      clearInterval(interval);
      window.removeEventListener("academicYearChanged", load);
      window.removeEventListener("notificationRefresh", load);
    };
  }, [load]);

  return { activeYear, notifCount, notifList, markAllRead, markRead };
}