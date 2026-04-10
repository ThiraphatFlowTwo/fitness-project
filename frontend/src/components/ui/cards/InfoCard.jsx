/**
 * InfoCard - General information card component
 *
 * Design: Clean white background with optional icon, improved styling
 * Usage: Information display, notifications, details
 *
 * @param {React.ReactNode} icon - Optional icon component
 * @param {String} title - Card title
 * @param {String|React.ReactNode} description - Card content/description
 * @param {String} className - Additional classes
 */

const InfoCard = ({ icon, title, description, className = '' }) => {
  return (
    <div className={`
      flex items-start gap-3 p-4 rounded-2xl
      bg-white
      border border-gray-200
      shadow-sm hover:shadow-md hover:-translate-y-1
      transition-all duration-200
      ${className}
    `}>
      {icon && <div className="mt-1 flex-shrink-0">{icon}</div>}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-navy-900 mb-1">{title}</h3>
        {typeof description === 'string' ? (
          <p className="text-sm text-gray-600">{description}</p>
        ) : (
          <div className="text-sm text-gray-600">{description}</div>
        )}
      </div>
    </div>
  );
};

export { InfoCard };
