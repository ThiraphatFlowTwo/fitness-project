/**
 * Badge - Status badge component
 *
 * Design: Small badge with color-coded styling
 * Usage: Status indicators, tags, labels
 *
 * @param {React.ReactNode} children - Badge content
 * @param {String} variant - Badge color variant (default, success, warning, error, info, navy, sky)
 * @param {String} size - Badge size (sm, md, lg)
 * @param {Boolean} outline - Use outline style instead of filled
 * @param {String} className - Additional classes
 */

const Badge = ({ children, variant = 'default', size = 'md', outline = false, className = '' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const variantClasses = {
    default: outline ? 'border-steel-400 text-steel-700 bg-white' : 'bg-steel-500 text-white',
    success: outline ? 'border-emerald-400 text-emerald-700 bg-white' : 'bg-emerald-500 text-white',
    warning: outline ? 'border-amber-400 text-amber-700 bg-white' : 'bg-amber-500 text-white',
    error: outline ? 'border-rose-400 text-rose-700 bg-white' : 'bg-rose-500 text-white',
    info: outline ? 'border-sky-400 text-sky-700 bg-white' : 'bg-sky-500 text-white',
    navy: outline ? 'border-navy-400 text-navy-700 bg-white' : 'bg-navy-700 text-white',
    sky: outline ? 'border-sky-400 text-sky-700 bg-white' : 'bg-sky-500 text-white',
  };

  return (
    <span className={`
      inline-flex items-center rounded-full font-medium
      ${sizeClasses[size] || sizeClasses.md}
      ${variantClasses[variant] || variantClasses.default}
      ${outline ? 'border-2' : ''}
      ${className}
    `}>
      {children}
    </span>
  );
};

export { Badge };