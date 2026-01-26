import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import api from '../../services/api'

export default function AdminLayout() {
  const [pendingCount, setPendingCount] = useState(0)

  const fetchPendingCount = async () => {
    try {
      const res = await api.get('/admin/users/pending-count')
      setPendingCount(res.data.count)
    } catch (err) {
      console.error('Load pending count failed')
    }
  }

  useEffect(() => {
    fetchPendingCount()

    // ⭐ refresh badge ทุก 10 วินาที (กันข้อมูลค้าง)
    const interval = setInterval(fetchPendingCount, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="space-y-2">
          <Link to="/admin" className="block hover:bg-gray-700 p-2 rounded">
            Dashboard
          </Link>

          <Link
            to="/admin/users"
            className="flex justify-between items-center hover:bg-gray-700 p-2 rounded"
          >
            <span>จัดการผู้ใช้</span>

            {/* 🔴 BADGE */}
            {pendingCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {pendingCount}
              </span>
            )}
          </Link>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  )
}