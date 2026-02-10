import { NavLink, Outlet } from "react-router-dom";

export default function InstructorLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white">
        <div className="p-4 text-xl font-bold border-b border-indigo-700">
          🎓 Instructor Panel
        </div>

        <nav className="p-4 space-y-2 text-sm">
          <NavLink
            to="/instructor"
            className="block px-3 py-2 rounded hover:bg-indigo-700"
          >
            📊 Dashboard
          </NavLink>

          <NavLink
            to="/instructor/trainees"
            className="block px-3 py-2 rounded hover:bg-indigo-700"
          >
            👥 ผู้รับการฝึก
          </NavLink>

          <NavLink
            to="/instructor/programs"
            className="block px-3 py-2 rounded hover:bg-indigo-700"
          >
            📝 โปรแกรมฝึก
          </NavLink>

          <NavLink
            to="/instructor/profile"
            className="block px-3 py-2 rounded hover:bg-indigo-700"
          >
            ⚙️ โปรไฟล์อาจารย์
          </NavLink>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1">
        {/* Topbar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h2 className="font-semibold text-lg">Instructor System</h2>
          <div className="text-sm text-gray-600">🎓 Instructor</div>
        </header>

        {/* Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}