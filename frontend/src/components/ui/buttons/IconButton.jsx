/**
 * IconButton - Icon-only button component
 *
 * Design: Clean icon button with subtle hover effects
 * Usage: Icon-based actions (edit, delete, view, etc.)
 *
 * @param {React.ReactNode} icon - Icon component
 * @param {Function} onClick - Click handler
 * @param {String} variant - Color variant (default, danger, success)
 * @param {String} className - Additional classes
 * @param {React.ButtonHTMLAttributes} ...props - Additional button props
 */

import { forwardRef } from 'react';

const IconButton = forwardRef(({ icon, onClick, variant = 'default', className = '', ...props }, ref) => {
  const variantClasses = {
    default: 'hover:bg-steel-100 text-steel-600',
    danger: 'hover:bg-rose-50 text-rose-600',
    success: 'hover:bg-emerald-50 text-emerald-600',
    primary: 'hover:bg-navy-50 text-navy-600',
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`
        p-2 rounded-lg transition-all duration-200
        ${variantClasses[variant] || variantClasses.default}
        ${className}
      `}
      {...props}
    >
      {icon}
    </button>
  );
});

IconButton.displayName = 'IconButton';

export { IconButton };