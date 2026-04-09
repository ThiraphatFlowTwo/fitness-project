/**
 * StatCard - Statistics display card component
 *
 * Design: White background with navy accent border, glassmorphism effect
 * Usage: Dashboard statistics, metrics display
 *
 * @param {String} title - Card title/label
 * @param {String|Number} value - Statistical value to display
 * @param {React.ReactNode} icon - Icon component
 * @param {String} gradient - Icon background gradient
 * @param {Boolean} showPulse - Show pulsing animation for live status
 * @param {String} className - Additional classes
 */

const StatCard = ({ title, value, icon, gradient = 'from-navy-700 to-navy-900', showPulse = false, className = '' }) => {
  return (
    <div className={`
      group bg-white/90 backdrop-blur-sm rounded-2xl
      shadow-lg hover:shadow-2xl transition-all duration-300
      p-6 border border-steel-200
      transform hover:-translate-y-1
      ${className}
    `}>
      <div className="flex items-center gap-4">
        <div className={`
          bg-gradient-to-br ${gradient} text-white p-4 rounded-xl
          shadow-lg group-hover:scale-110 transition-transform duration-300 relative
        `}>
          {icon}
          {showPulse && (
            <div className="absolute inset-0 rounded-xl bg-white/30 animate-ping"></div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-steel-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export { StatCard };