/**
 * QuickAction - Quick action card component
 *
 * Design: Clean action card with gradient on hover
 * Usage: Quick actions, navigation cards
 *
 * @param {React.ReactNode} icon - Action icon
 * @param {String} title - Action title
 * @param {String} description - Action description
 * @param {String} link - Navigation link
 * @param {Function} onClick - Optional click handler
 * @param {String} color - Color scheme (navy, sky, emerald)
 * @param {String} className - Additional classes
 */

import { Link } from 'react-router-dom';

const QuickAction = ({ icon, title, description, link, onClick, color = 'navy', className = '' }) => {
  const colorClasses = {
    navy: "from-navy-900 to-navy-700",
    sky: "from-sky-500 to-sky-600",
    emerald: "from-emerald-500 to-emerald-600",
  };

  const iconBgClasses = {
    navy: "bg-navy-100 text-navy-700",
    sky: "bg-sky-100 text-sky-600",
    emerald: "bg-emerald-100 text-emerald-600",
  };

  const content = (
    <div
      onClick={onClick}
      className={`
        group relative bg-white rounded-xl
        p-5 border-2 border-gray-200 hover:border-navy-900
        transition-all duration-200
        transform hover:-translate-y-1 hover:shadow-md
        overflow-hidden cursor-pointer
        ${className}
      `}
    >
      {/* Background gradient effect on hover */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0
          group-hover:opacity-5 transition-opacity duration-200
        `}
      ></div>

      <div className="relative z-10">
        <div
          className={`
            inline-flex p-2 rounded-lg
            ${iconBgClasses[color]}
            mb-3 group-hover:scale-110 transition-transform duration-200
          `}
        >
          {icon}
        </div>
        <h3 className="font-bold text-navy-900 text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );

  if (link) {
    return <Link to={link}>{content}</Link>;
  }

  return content;
};

export { QuickAction };
