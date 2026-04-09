/**
 * FeatureCard - Feature highlight card component
 *
 * Design: Interactive card with hover effects and icon
 * Usage: Feature highlights, quick actions, service cards
 *
 * @param {React.ReactNode} icon - Icon component
 * @param {String} title - Card title
 * @param {String} description - Card description
 * @param {String} color - Color theme (navy, sky, emerald)
 * @param {String} className - Additional classes
 * @param {Function} onClick - Click handler (optional)
 */

const FeatureCard = ({ icon, title, description, color = 'navy', className = '', onClick }) => {
  const colorClasses = {
    navy: 'from-navy-100 to-navy-200 text-navy-600 group-hover:from-navy-500 group-hover:to-navy-600 group-hover:text-white',
    sky: 'from-sky-100 to-sky-200 text-sky-600 group-hover:from-sky-500 group-hover:to-sky-600 group-hover:text-white',
    emerald: 'from-emerald-100 to-emerald-200 text-emerald-600 group-hover:from-emerald-500 group-hover:to-emerald-600 group-hover:text-white',
  };

  const borderColorClasses = {
    navy: 'hover:border-navy-300',
    sky: 'hover:border-sky-300',
    emerald: 'hover:border-emerald-300',
  };

  return (
    <div
      onClick={onClick}
      className={`
        group bg-white rounded-2xl p-6 shadow-lg
        hover:shadow-2xl transition-all duration-300
        border-2 border-steel-200
        ${borderColorClasses[color] || borderColorClasses.navy}
        ${onClick ? 'cursor-pointer' : ''}
        hover:-translate-y-2
        ${className}
      `}
    >
      <div className={`
        text-4xl mb-4 w-16 h-16 mx-auto bg-gradient-to-br ${colorClasses[color] || colorClasses.navy}
        rounded-xl flex items-center justify-center
        shadow-lg group-hover:scale-110 transition-transform
      `}>
        {icon}
      </div>
      <h3 className="font-bold text-steel-900 mb-2 text-center">{title}</h3>
      <p className="text-sm text-steel-600 text-center">{description}</p>
    </div>
  );
};

export { FeatureCard };