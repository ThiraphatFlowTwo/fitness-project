/**
 * InfoCard - General information card component
 *
 * Design: Clean white background with optional icon, glassmorphism effect
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
      flex items-start gap-3 p-4 rounded-xl
      bg-gradient-to-br from-white to-steel-50/50
      border border-steel-200
      hover:shadow-md transition-shadow duration-300
      ${className}
    `}>
      {icon && <div className="mt-1">{icon}</div>}
      <div>
        <h3 className="font-semibold text-steel-900 mb-1">{title}</h3>
        {typeof description === 'string' ? (
          <p className="text-sm text-steel-600">{description}</p>
        ) : (
          <div className="text-sm text-steel-600">{description}</div>
        )}
      </div>
    </div>
  );
};

export { InfoCard };