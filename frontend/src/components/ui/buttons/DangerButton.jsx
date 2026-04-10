/**
 * DangerButton - Danger action button component
 *
 * Design: Red background with hover effects for destructive actions
 * Usage: Delete, cancel, logout, and other destructive actions
 *
 * @param {React.ReactNode} children - Button label/content
 * @param {Function} onClick - Click handler
 * @param {Boolean} disabled - Disabled state
 * @param {String} className - Additional classes
 * @param {React.ButtonHTMLAttributes} ...props - Additional button props
 */

import { forwardRef } from 'react';

const DangerButton = forwardRef(({ children, onClick, disabled, className = '', ...props }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-red-500 text-white
        font-semibold
        px-6 py-3 rounded-xl
        shadow-md hover:shadow-lg hover:bg-red-600
        hover:scale-105
        transition-all duration-200
        font-['Kanit']
        ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
});

DangerButton.displayName = 'DangerButton';

export { DangerButton };
