/**
 * StatusItem - Status display item component
 *
 * Design: Clean list item with icon and status text
 * Usage: System status, health indicators, status lists
 *
 * @param {React.ReactNode} icon - Status icon
 * @param {String} label - Label text
 * @param {String} status - Status value
 * @param {String} statusColor - Status text color (navy, green, yellow, red)
 * @param {Boolean} showBorder - Show bottom border
 * @param {String} className - Additional classes
 */

const StatusItem = ({ icon, label, status, statusColor = 'navy', showBorder = true, className = '' }) => {
  const statusColorClasses = {
    navy: 'text-navy-900',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
  };

  return (
    <li
      className={`
        flex items-center justify-between py-2
        ${showBorder ? 'border-b border-gray-200 last:border-0' : ''}
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        <span className="text-gray-700">{icon}</span>
        <span className="text-xs text-navy-900 font-medium">{label}</span>
      </div>
      <span className={`font-semibold text-xs ${statusColorClasses[statusColor]}`}>
        {status}
      </span>
    </li>
  );
};

export { StatusItem };
