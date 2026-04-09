/**
 * Sidebar - Unified sidebar navigation component
 *
 * Design: Deep navy gradient background with sky blue accents
 * Usage: Admin and Instructor dashboard navigation
 *
 * @param {Array} menuItems - Array of menu items { path, label, icon }
 * @param {Function} onNavigate - Navigation handler
 * @param {React.ReactNode} header - Sidebar header content
 * @param {React.ReactNode} footer - Sidebar footer content
 * @param {String} activePath - Currently active path
 * @param {Boolean} isOpen - Sidebar open state (mobile)
 * @param {Function} onClose - Close handler (mobile)
 * @param {String} className - Additional classes
 */

import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Sidebar = ({
  menuItems = [],
  onNavigate,
  header,
  footer,
  activePath,
  isOpen = true,
  onClose,
  className = ''
}) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === activePath) return true;
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-40
      w-72 bg-gradient-to-b from-navy-900 via-navy-800 to-steel-900
      text-white shadow-2xl
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      flex flex-col
      ${className}
    `}>
      {/* Header */}
      {header && (
        <div className="p-6 border-b border-white/10">
          {header}
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => {
              if (onNavigate) onNavigate(item.path);
              if (onClose) onClose();
            }}
            className={`
              group flex items-center gap-3 px-4 py-3 rounded-xl
              transition-all duration-200 relative overflow-hidden
              ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30"
                  : "text-steel-300 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            {/* Active indicator */}
            {isActive(item.path) && (
              <div className="absolute inset-0 bg-white/10 animate-pulse rounded-xl" />
            )}

            {/* Icon */}
            <span className={`
              relative z-10 transition-transform duration-200
              ${isActive(item.path) ? "scale-110" : "group-hover:scale-110"}
            `}>
              {item.icon}
            </span>

            {/* Label */}
            <span className="relative z-10 flex-1 font-medium">
              {item.label}
            </span>

            {/* Arrow indicator */}
            <ChevronRight className={`
              relative z-10 w-4 h-4 transition-all duration-200
              ${
                isActive(item.path)
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
              }
            `} />
          </Link>
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="p-4 border-t border-white/10">
          {footer}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;