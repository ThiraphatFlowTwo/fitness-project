/**
 * ProfileCard - User profile card component
 *
 * Design: Profile display with avatar, info, and actions
 * Usage: User profiles, team members, student cards
 *
 * @param {String} name - User's name
 * @param {String} role - User's role/title
 * @param {String|React.ReactNode} avatar - Avatar content (letter, image, or component)
 * @param {Array} info - Array of info objects { icon, label, value }
 * @param {Array} stats - Array of stat objects { label, value, color }
 * @param {React.ReactNode} action - Action button or content
 * @param {String} className - Additional classes
 */

const ProfileCard = ({ name, role, avatar, info = [], stats = [], action, className = '' }) => {
  return (
    <div className={`
      bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl
      overflow-hidden border border-steel-200
      ${className}
    `}>
      {/* Card Header */}
      <div className="h-2 w-full bg-gradient-to-r from-navy-700 to-sky-600"></div>

      <div className="p-8">
        {/* Avatar */}
        <div className="flex justify-center mb-5">
          <div className="w-24 h-24 bg-gradient-to-br from-navy-700 to-sky-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
            {avatar}
          </div>
        </div>

        {/* Name & Role */}
        <h2 className="text-2xl font-extrabold text-center text-steel-900 mb-1">{name}</h2>
        <p className="text-center text-steel-500 mb-6">{role}</p>

        {/* Info Section */}
        {info.length > 0 && (
          <div className="space-y-3 mb-6">
            {info.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-navy-50 to-sky-50 rounded-xl">
                <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-steel-500">{item.label}</p>
                  <p className="font-semibold text-steel-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {stats.length > 0 && (
          <div className={`grid grid-cols-${stats.length} gap-3 mb-6`}>
            {stats.map((stat, index) => (
              <div key={index} className={`bg-gradient-to-br ${stat.color || 'from-navy-50 to-navy-100'} rounded-xl p-3 text-center`}>
                <p className="text-2xl font-bold bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-xs text-steel-500">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        {action}
      </div>
    </div>
  );
};

export { ProfileCard };