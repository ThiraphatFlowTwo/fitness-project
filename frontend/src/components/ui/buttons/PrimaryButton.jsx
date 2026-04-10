/**
 * PrimaryButton - Main action button component
 *
 * Design: Deep Navy gradient background with hover effects
 * Usage: Primary actions, form submissions, main CTAs
 *
 * @param {React.ReactNode} children - Button label/content
 * @param {Function} onClick - Click handler
 * @param {Boolean} disabled - Disabled state
 * @param {String} className - Additional classes
 * @param {React.ButtonHTMLAttributes} ...props - Additional button props
 */

import { forwardRef } from 'react';

const PrimaryButton = forwardRef(({ children, onClick, disabled, className = '', ...props }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-gradient-to-r from-navy-900 to-navy-800
        text-white font-semibold
        px-6 py-3 rounded-xl
        shadow-md hover:shadow-navy-lg
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

PrimaryButton.displayName = 'PrimaryButton';

export { PrimaryButton };