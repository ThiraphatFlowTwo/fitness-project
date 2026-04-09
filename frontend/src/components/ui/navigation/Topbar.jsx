/**
 * Topbar - Unified top navigation component
 *
 * Design: White background with navy border bottom, sky blue accents
 * Usage: Main navigation bar across application
 *
 * @param {React.ReactNode} logo - Logo component
 * @param {React.ReactNode} center - Center content
 * @param {React.ReactNode} right - Right side content (user menu, actions)
 * @param {Boolean} sticky - Make topbar sticky
 * @param {Function} onMenuClick - Mobile menu click handler
 * @param {String} className - Additional classes
 */

import { Menu } from 'lucide-react';

const Topbar = ({ logo, center, right, sticky = true, onMenuClick, className = '' }) => {
  return (
    <nav className={`
      w-full bg-white/90 backdrop-blur-md shadow-sm
      px-6 py-3 flex items-center justify-between
      border-b border-steel-200
      ${sticky ? 'sticky top-0 z-50' : ''}
      ${className}
    `}>
      {/* Logo */}
      <div className="flex items-center gap-3">
        {logo}
      </div>

      {/* Center Content */}
      {center && (
        <div className="flex-1 flex items-center justify-center">
          {center}
        </div>
      )}

      {/* Right Content */}
      <div className="flex items-center gap-4">
        {right}
        {/* Mobile Menu Button */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-steel-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-steel-600" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Topbar;