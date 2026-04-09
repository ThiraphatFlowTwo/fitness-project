/**
 * Divider - Section divider component
 *
 * Design: Visual separator with optional text
 * Usage: Section breaks, form sections
 *
 * @param {String} text - Optional divider text
 * @param {String} orientation - Divider orientation (horizontal, vertical)
 * @param {String} variant - Divider style (solid, dashed)
 * @param {String} className - Additional classes
 */

const Divider = ({ text, orientation = 'horizontal', variant = 'solid', className = '' }) => {
  const orientationClasses = orientation === 'horizontal'
    ? 'w-full border-t'
    : 'h-full border-l';

  const variantClasses = variant === 'solid'
    ? 'border-steel-200'
    : 'border-dashed border-steel-300';

  if (text) {
    return (
      <div className={`flex items-center gap-3 my-6 ${className}`}>
        <div className={`flex-1 ${orientationClasses} ${variantClasses}`} />
        <span className="text-xs text-steel-400 whitespace-nowrap">{text}</span>
        <div className={`flex-1 ${orientationClasses} ${variantClasses}`} />
      </div>
    );
  }

  return (
    <div className={`${orientationClasses} ${variantClasses} ${className}`} />
  );
};

export default Divider;