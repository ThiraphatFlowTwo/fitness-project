/**
 * Checkbox - Checkbox input component
 *
 * Design: Custom checkbox with navy accent, sky blue focus state
 * Usage: Form checkboxes, toggles
 *
 * @param {String} id - Checkbox id
 * @param {String} label - Checkbox label
 * @param {Boolean} checked - Checked state
 * @param {Function} onChange - Change handler
 * @param {Boolean} disabled - Disabled state
 * @param {String} className - Additional classes
 * @param {Object} ...props - Additional checkbox props
 */

import { forwardRef } from 'react';

const Checkbox = forwardRef(({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <label className={`
      flex items-center gap-2 cursor-pointer
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `}>
      <input
        ref={ref}
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-4 h-4 rounded border-steel-300
          text-sky-600 focus:ring-2 focus:ring-sky-500
          ${disabled ? 'cursor-not-allowed' : ''}
        `}
        {...props}
      />
      {label && (
        <span className="text-sm text-steel-900">{label}</span>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };