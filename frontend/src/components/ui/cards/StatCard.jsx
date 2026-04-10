/**
 * StatCard - Statistics display card component
 *
 * Design: White background with Deep Navy accent, improved typography hierarchy
 * Usage: Dashboard statistics, metrics display
 *
 * @param {String} title - Card title/label
 * @param {String|Number} value - Statistical value to display
 * @param {React.ReactNode} icon - Icon component
 * @param {String} gradient - Icon background gradient
 * @param {Boolean} showPulse - Show pulsing animation for live status
 * @param {String} description - Optional description text
 * @param {String} className - Additional classes
 */

const StatCard = ({ title, value, icon, gradient = 'from-navy-900 to-navy-800', showPulse = false, description = '', className = '' }) => {
  return (
    <div className={`
      group bg-white rounded-2xl
      shadow-sm hover:shadow-md transition-all duration-200
      p-6 border border-gray-200
      transform hover:-translate-y-1
      ${className}
    `}>
      <div className="flex items-center gap-4">
        <div className={`
          bg-gradient-to-br ${gradient} text-white p-4 rounded-xl
          shadow-md group-hover:scale-110 transition-transform duration-200 relative flex-shrink-0
        `}>
          {icon}
          {showPulse && (
            <div className="absolute inset-0 rounded-xl bg-white/30 animate-ping"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 text-sm font-semibold mb-1">{title}</p>
          <p className="text-3xl font-bold text-navy-900">
            {value}
          </p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export { StatCard };
