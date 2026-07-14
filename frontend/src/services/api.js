import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // ปรับพอร์ตให้ตรงกับหลังบ้านของคุณ
});

// 🔑 เพิ่ม Interceptor ตัวนี้เพื่อดึง Token จาก localStorage ส่งไปหลังบ้านทุกครั้งอัตโนมัติ
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // หรือที่ที่คุณเก็บ Token ตอนล็อกอิน
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;