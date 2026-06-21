import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ✅ ดัก 401 — redirect ออกเฉพาะกรณี token จริงๆ มีปัญหา
api.interceptors.response.use(
  res => res,
  err => {
    const status  = err.response?.status
    const message = err.response?.data?.message || ''

    // เงื่อนไขที่ถือว่า "token ใช้ไม่ได้จริง" เท่านั้น
    const isTokenInvalid =
      status === 401 &&
      (
        !localStorage.getItem('token') ||              // ไม่มี token เลย
        message.includes('token') ||                    // backend แจ้งปัญหา token ตรงๆ
        message.includes('Unauthorized') ||
        message.includes('หมดอายุ')
      )

    if (isTokenInvalid) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // ป้องกัน redirect ซ้ำถ้าอยู่หน้า login อยู่แล้ว
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(err)
  }
)

export default api