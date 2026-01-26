import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white shadow-sm px-8 py-4 flex items-center justify-between">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2">
        <img
          src="/logo.png"   // ถ้ามีโลโก้
          alt="Logo"
          className="h-8"
          onError={(e) => (e.target.style.display = "none")}
        />
        <span className="font-bold text-lg text-gray-800">
          Fitness Project
        </span>
      </div>

      {/* Menu */}
      <div className="flex items-center gap-6">
        <Link to="/" className="text-gray-700 hover:text-blue-600">
          HOME
        </Link>

        <Link to="/projects" className="text-gray-700 hover:text-blue-600">
          ALL PROJECT
        </Link>

        {!token ? (
          <Link
            to="/login"
            className="border border-teal-400 text-teal-500 px-4 py-1.5 rounded-lg hover:bg-teal-50"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="border border-red-400 text-red-500 px-4 py-1.5 rounded-lg hover:bg-red-50"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}