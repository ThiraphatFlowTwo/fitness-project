/**
 * SecondaryButton - Secondary action button component
 *
 * Design: White background with navy border
 * Usage: Secondary actions, cancel, back navigation
 *
 * @param {React.ReactNode} children - Button label/content
 * @param {Function} onClick - Click handler
 * @param {Boolean} disabled - Disabled state
 * @param {String} className - Additional classes
 * @param {React.ButtonHTMLAttributes} ...props - Additional button props
 */

import { forwardRef } from 'react';

const SecondaryButton = forwardRef(({ children, onClick, disabled, className = '', ...props }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={`
        btn-secondary
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
});

SecondaryButton.displayName = 'SecondaryButton';

export { SecondaryButton };