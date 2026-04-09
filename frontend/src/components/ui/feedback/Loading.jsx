/**
 * Loading - Loading indicator component
 *
 * Design: Animated spinner with optional text
 * Usage: Loading states, async operations
 *
 * @param {String} size - Spinner size (sm, md, lg)
 * @param {String} text - Optional loading text
 * @param {Boolean} overlay - Show as overlay
 * @param {String} className - Additional classes
 */

const Loading = ({ size = 'md', text, overlay = false, className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`
      flex flex-col items-center justify-center gap-3
      ${overlay ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50' : ''}
      ${className}
    `}>
      <div className={`
        animate-spin rounded-full border-navy-200 border-t-sky-600
        ${sizeClasses[size] || sizeClasses.md}
      `} />
      {text && (
        <p className="text-sm text-steel-600">{text}</p>
      )}
    </div>
  );
};

export { Loading };