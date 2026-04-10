/**
 * SectionCard - Consistent card component for page sections
 *
 * Design: Clean white card with hover effects and border
 * Usage: Content sections, quick actions, activity feeds
 *
 * @param {React.ReactNode} icon - Optional icon in header
 * @param {String} title - Card title
 * @param {String} subtitle - Optional subtitle/description
 * @param {React.ReactNode} children - Card content
 * @param {Function} onClick - Optional click handler
 * @param {String} borderColor - Optional border color accent (navy, sky, green, red, yellow)
 * @param {String} className - Additional classes
 */

const SectionCard = ({ icon, title, subtitle, children, onClick, borderColor = 'navy', className = '' }) => {
  const borderColorClasses = {
    navy: 'border-l-navy-900',
    sky: 'border-l-sky-500',
    green: 'border-l-green-600',
    red: 'border-l-red-500',
    yellow: 'border-l-yellow-500',
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl
        shadow-sm hover:shadow-md
        p-6 border border-gray-200
        border-l-4 ${borderColorClasses[borderColor]}
        hover:-translate-y-1
        transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {(icon || title || subtitle) && (
        <div className="flex items-center gap-2 mb-6">
          {icon && (
            <div className="h-8 w-8 bg-gradient-to-br from-navy-900 to-navy-700 rounded-lg flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
          )}
          {title && (
            <h2 className="text-2xl font-bold text-navy-900">
              {title}
            </h2>
          )}
          {subtitle && (
            <span className="text-sm text-gray-600 ml-2">
              {subtitle}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export { SectionCard };
