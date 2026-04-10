/**
 * ActivityItem - Activity feed item component
 *
 * Design: Clean list item with icon and timestamp
 * Usage: Activity feeds, recent events
 *
 * @param {React.ReactNode} icon - Activity icon
 * @param {String} title - Activity title
 * @param {String} description - Activity description
 * @param {String} time - Time display
 * @param {String} className - Additional classes
 */

const ActivityItem = ({ icon, title, description, time, className = '' }) => {
  return (
    <div
      className={`
        flex items-start gap-4 p-4 rounded-xl
        bg-white border border-gray-200
        hover:shadow-sm hover:-translate-y-1
        transition-all duration-200
        ${className}
      `}
    >
      <div className={`
        mt-1 flex-shrink-0
        bg-navy-100
        rounded-lg p-2
      `}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-navy-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      {time && (
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {time}
        </span>
      )}
    </div>
  );
};

export { ActivityItem };
