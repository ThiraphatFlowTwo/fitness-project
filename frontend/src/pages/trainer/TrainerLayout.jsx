import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  ClipboardList, 
  Dumbbell, 
  Edit, 
  TrendingUp, 
  User, 
  LogOut,
  Bell,
  Menu,
  X
} from 'lucide-react';

const TrainerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'หน้าหลัก', icon: Home, path: '/trainer/dashboard' },
    { id: 'trainees', label: 'จัดการผู้รับการฝึก', icon: Users, path: '/trainer/trainees' },
    { id: 'programs', label: 'โปรแกรมการฝึก', icon: ClipboardList, path: '/trainer/programs' },
    { id: 'exercises', label: 'ท่าในการฝึก', icon: Dumbbell, path: '/trainer/exercises' },
    { id: 'results', label: 'บันทึกผลการฝึก', icon: Edit, path: '/trainer/results' },
    { id: 'progress', label: 'พัฒนาการ', icon: TrendingUp, path: '/trainer/progress' },
    { id: 'profile', label: 'โปรไฟล์ส่วนตัว', icon: User, path: '/trainer/profile' }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    console.log('Logout');
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } bg-gradient-to-b from-purple-600 to-purple-800 text-white transition-all duration-300 flex-shrink-0 overflow-hidden`}
      >
        <div className="p-6">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 mb-8">
            <Dumbbell className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">ระบบเทรนเนอร์</h1>
              <p className="text-xs text-purple-200">มหาวิทยาลัยราชภัฏเลย</p>
            </div>
          </div>

          {/* User Profile */}
          <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <User className="text-purple-600 w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">สมชาย ใจดี</p>
                <p className="text-xs text-purple-200">รหัส: 651234567</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-white bg-opacity-20 border-l-4 border-white'
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500 hover:bg-opacity-20 text-red-200 hover:text-white transition-all mt-4"
            >
              <LogOut className="w-5 h-5" />
              <span>ออกจากระบบ</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {/* Toggle Sidebar Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isSidebarOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  ระบบจัดการข้อมูลเทรนเนอร์
                </h2>
                <p className="text-sm text-gray-500">
                  สาขาวิชาวิทยาศาสตร์การกีฬาและการออกกำลังกาย
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden md:block">
                <p className="text-sm text-gray-600">ปีการศึกษา 2568</p>
                <p className="text-xs text-gray-500">ภาคเรียนที่ 1</p>
              </div>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content - Outlet จะแสดง Component ตาม Route */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TrainerLayout;