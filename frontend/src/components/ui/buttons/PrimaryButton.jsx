/**
 * PrimaryButton - Main action button component
 *
 * Design: Navy gradient background with sky blue hover effect
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
        btn-primary
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
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